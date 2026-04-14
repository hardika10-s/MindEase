import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
LOG_FILE = "groq_diagnostic.log"

def test_groq():
    with open(LOG_FILE, "w") as f:
        f.write(f"Testing Groq API with key starting with: {GROQ_API_KEY[:5]}...\n")
        try:
            client = Groq(api_key=GROQ_API_KEY)
            
            prompt = "Suggest 3 mental health tips. Return ONLY a JSON array of objects with 'title' and 'reason'."
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={ "type": "json_object" }
            )
            
            res_content = completion.choices[0].message.content
            f.write(f"Response: {res_content}\n")
            
            data = json.loads(res_content)
            f.write(f"Parsed JSON: {json.dumps(data, indent=2)}\n")
            print("Groq Test SUCCESSFUL. Check groq_diagnostic.log for details.")
            
        except Exception as e:
            f.write(f"ERROR: {str(e)}\n")
            print(f"Groq Test FAILED: {e}")

if __name__ == "__main__":
    test_groq()
