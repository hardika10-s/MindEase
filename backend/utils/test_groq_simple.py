import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

try:
    client = Groq(api_key=GROQ_API_KEY)
    models = client.models.list()
    print("SUCCESS: Connected to Groq API.")
    print("Available models:", [m.id for m in models.data][:5])
except Exception as e:
    print(f"FAILURE: {e}")
