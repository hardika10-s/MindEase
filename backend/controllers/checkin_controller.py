import datetime
from config import mongo
from utils.responses import success_response, error_response
from bson import ObjectId

class CheckInController:
    @staticmethod
    def add_checkin(user_id, data):
        mood = data.get('mood')
        if not mood:
            return error_response("Mood is required")

        # Standardize for frontend expectations (camelCase)
        checkin_data = {
            "user_id": ObjectId(user_id),
            "mood": mood,
            "description": data.get('description') or data.get('note') or '',
            "sleepHours": data.get('sleepHours') or data.get('sleep_hours') or 0,
            "sleepQuality": data.get('sleepQuality') or data.get('sleep_quality') or 'Okay',
            "energyLevel": data.get('energyLevel') or data.get('energy_level') or 'Medium',
            "factors": data.get('factors', []),
            "created_at": datetime.datetime.utcnow()
        }

        # Robust date parsing
        raw_date = data.get('date')
        if raw_date:
            if 'T' in raw_date:
                checkin_data['date'] = raw_date.split('T')[0]
            else:
                checkin_data['date'] = raw_date
        else:
            checkin_data['date'] = datetime.datetime.utcnow().strftime('%Y-%m-%d')

        # Prevent duplicate check-ins for the same day
        existing = mongo.db.checkins.find_one({
            "user_id": ObjectId(user_id),
            "date": checkin_data['date']
        })
        
        if existing:
            mongo.db.checkins.update_one({"_id": existing['_id']}, {"$set": checkin_data})
            return success_response({"id": str(existing['_id'])}, "Check-in updated")
        
        result = mongo.db.checkins.insert_one(checkin_data)
        return success_response({"id": str(result.inserted_id)}, "Check-in added", 201)

    @staticmethod
    def get_checkins(user_id):
        checkins = list(mongo.db.checkins.find({"user_id": ObjectId(user_id)}).sort("date", -1))
        for c in checkins:
            c['id'] = str(c['_id'])
            c['_id'] = str(c['_id'])
            c['user_id'] = str(c['user_id'])
            # Ensure camelCase for frontend consistency
            if 'sleep_hours' in c: c['sleepHours'] = c.pop('sleep_hours')
            if 'sleep_quality' in c: c['sleepQuality'] = c.pop('sleep_quality')
            if 'energy_level' in c: c['energyLevel'] = c.pop('energy_level')
        return success_response(checkins)

    @staticmethod
    def get_checkin_by_date(user_id, date):
        checkin = mongo.db.checkins.find_one({
            "user_id": ObjectId(user_id),
            "date": date
        })
        if not checkin:
            return success_response(None, "No check-in found for this date")
        
        checkin['id'] = str(checkin['_id'])
        checkin['_id'] = str(checkin['_id'])
        checkin['user_id'] = str(checkin['user_id'])
        return success_response(checkin)
