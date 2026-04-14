import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
LOG_FILE = "db_diagnostic.log"

with open(LOG_FILE, "w") as f:
    f.write(f"Connecting to: {MONGO_URI.split('@')[-1]}\n")
    try:
        client = MongoClient(MONGO_URI)
        db_name = MONGO_URI.split('/')[-1].split('?')[0] or "mindease"
        db = client[db_name]
        count = db.resources.count_documents({})
        f.write(f"Database: {db_name}\n")
        f.write(f"Resources count: {count}\n")
        
        if count > 0:
            sample = db.resources.find_one()
            f.write(f"Sample resource: {sample.get('title')} | Tags: {sample.get('moodTags')}\n")
        else:
            f.write("COLLECTION IS EMPTY!\n")
            
    except Exception as e:
        f.write(f"ERROR: {str(e)}\n")

print(f"Diagnostic written to {LOG_FILE}")
