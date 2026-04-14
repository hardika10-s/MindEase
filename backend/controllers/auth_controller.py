import bcrypt
import jwt
import datetime
from flask import current_app
from config import mongo
from utils.responses import success_response, error_response
from bson import ObjectId

class AuthController:
    @staticmethod
    def register(data):
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password or not name:
            return error_response("Missing required fields")

        # Check if user exists
        try:
            if mongo.db.users.find_one({"email": email}):
                return error_response("User already exists")
        except Exception as e:
            return error_response(f"Database connection error: {str(e)}", 503)

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.datetime.utcnow()
        }

        try:
            result = mongo.db.users.insert_one(user_data)
        except Exception as e:
            return error_response(f"Could not create user: {str(e)}", 503)
        
        # Generate JWT for automatic login after signup
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

        return success_response({
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email
            }
        }, "User registered successfully", 201)

    @staticmethod
    def login(data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return error_response("Missing email or password")

        try:
            user = mongo.db.users.find_one({"email": email})
            if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
                return error_response("Invalid credentials", 401)
        except Exception as e:
            return error_response(f"Database connection error: {str(e)}", 503)

        # Generate JWT
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

        return success_response({
            "token": token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email']
            }
        }, "Login successful")

    @staticmethod
    def get_me(user_id):
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
        if not user:
            return error_response("User not found", 404)
        
        user['_id'] = str(user['_id'])
        return success_response(user)
