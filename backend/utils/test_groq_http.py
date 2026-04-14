import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "max_tokens": 10
}

try:
    response = requests.post(URL, headers=headers, json=data, timeout=10)
    print(f"STATUS CODE: {response.status_code}")
    if response.status_code == 200:
        print("SUCCESS: Connected to Groq API via requests.")
        print(response.json()['choices'][0]['message']['content'])
    else:
        print(f"FAILURE: {response.text}")
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
