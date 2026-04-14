import jwt
from functools import wraps
from flask import request, current_app
from utils.responses import error_response
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return error_response("Token is missing!", 401)

        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            request.user_id = data['user_id']
        except Exception as e:
            return error_response("Token is invalid!", 401)

        return f(*args, **kwargs)

    return decorated
