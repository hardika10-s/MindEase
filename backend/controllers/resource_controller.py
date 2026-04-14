from config import mongo
from utils.responses import success_response, error_response
from bson import ObjectId
import datetime

class ResourceController:
    @staticmethod
    def get_resources(query_params, user_preferred_language='English'):
        category = query_params.get('category')
        mood = query_params.get('mood')
        
        query = {}
        if category and category != 'all':
            query['type'] = category
            
        # MongoDB query based on mood tags or language
        # If mood is provided, we filter by moodTags list
        if mood:
            query['moodTags'] = {"$in": [mood, mood.capitalize(), mood.lower()]}

        resources = list(mongo.db.resources.find(query))
        
        # No fallback to Mock Data

        for r in resources:
            r['id'] = str(r['_id'])
            if '_id' in r:
                r['_id'] = str(r['_id'])
        
        return success_response(resources)

    @staticmethod
    def add_favorite(user_id, data):
        resource_id = data.get('resource_id')
        resource_data = data.get('resource_data') # Full data for dynamic resources

        if not resource_id and not resource_data:
            return error_response("Resource ID or data is required")

        # If it's a dynamic resource, save it to the resources collection first
        if resource_data:
            # Check if already exists by URL or Title to avoid duplicates in resources table
            existing_res = mongo.db.resources.find_one({
                "$or": [
                    {"url": resource_data.get('url')},
                    {"title": resource_data.get('title')}
                ]
            })
            if existing_res:
                resource_id = str(existing_res['_id'])
            else:
                # Insert the new AI resource into the main collection
                new_resource = {
                    "title": resource_data.get('title'),
                    "description": resource_data.get('reason') or resource_data.get('description'),
                    "type": resource_data.get('type'),
                    "url": resource_data.get('url'),
                    "thumbnail": resource_data.get('thumbnail'),
                    "category": resource_data.get('category'),
                    "tags": resource_data.get('tags', []),
                    "moodTags": [resource_data.get('mood', 'General')],
                    "created_at": datetime.datetime.utcnow(),
                    "is_ai_generated": True
                }
                result = mongo.db.resources.insert_one(new_resource)
                resource_id = str(result.inserted_id)

        if not resource_id:
            return error_response("Failed to process resource")

        # Now add to favorites
        favorite = {
            "user_id": ObjectId(user_id),
            "resource_id": ObjectId(resource_id),
            "created_at": datetime.datetime.utcnow()
        }

        if mongo.db.favorites.find_one({"user_id": ObjectId(user_id), "resource_id": ObjectId(resource_id)}):
            return error_response("Already in favorites")

        mongo.db.favorites.insert_one(favorite)
        return success_response({"resource_id": resource_id}, "Added to favorites", 201)

    @staticmethod
    def remove_favorite(user_id, resource_id):
        result = mongo.db.favorites.delete_one({
            "user_id": ObjectId(user_id),
            "resource_id": ObjectId(resource_id)
        })
        
        if result.deleted_count == 0:
            return error_response("Favorite not found", 404)
        
        return success_response(None, "Removed from favorites")

    @staticmethod
    def get_favorites(user_id):
        user_oid = ObjectId(user_id) if user_id and user_id != 'null' else None
        
        favorites = []
        if user_oid:
            pipeline = [
                {"$match": {"user_id": user_oid}},
                {
                    "$lookup": {
                        "from": "resources",
                        "localField": "resource_id",
                        "foreignField": "_id",
                        "as": "resource_details"
                    }
                },
                {"$unwind": "$resource_details"}
            ]
            favorites = list(mongo.db.favorites.aggregate(pipeline))
        
        # Format the output to be a list of resources
        results = []
        for f in favorites:
            res = f['resource_details']
            res['id'] = str(res['_id'])
            res['_id'] = str(res['_id'])
            results.append(res)
            
        # No dummy fallback
            
        return success_response(results)
