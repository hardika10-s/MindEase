import os
import certifi
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/mindease')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('API_KEY')
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')

mongo = PyMongo()

def init_db(app):
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo.init_app(app, tls=True, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True, serverSelectionTimeoutMS=5000)
