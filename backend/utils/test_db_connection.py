import os
import pymongo
import certifi
from dotenv import load_dotenv

def test_connection():
    load_dotenv()
    uri = os.environ.get("MONGO_URI")
    print(f"Testing connection to: {uri.split('@')[-1] if uri else 'None'}")
    
    try:
        # Test with the parameters from config.py
        client = pymongo.MongoClient(
            uri, 
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        client.admin.command('ping')
        print("✅ Success: Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Ensure your IP address is whitelisted in MongoDB Atlas.")
        print("2. Try adding '&tls=true&tlsAllowInvalidCertificates=true' to your MONGO_URI in .env")
        print("3. Ensure 'dnspython' is installed (pip install dnspython)")

if __name__ == "__main__":
    test_connection()
