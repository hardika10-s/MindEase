from groq import Groq
import datetime
import os
import json
from config import mongo, Config
from utils.responses import success_response, error_response
from bson import ObjectId

class ChatController:
    @staticmethod
    def get_response(user_id, data):
        try:
            history = data.get('history', [])
            latest_mood = data.get('latestMood', 'unknown')
            user_name = data.get('userName', 'User')

            if not history or not isinstance(history, list):
                return error_response("Valid chat history is required")

            client = Groq(api_key=Config.GROQ_API_KEY)
            
            system_instruction = f"You are MindEase, a supportive mental health companion for {user_name}. User's latest mood: {latest_mood}. Respond empathetically to the conversational history. Keep responses concise and comforting."
            
            messages = [{"role": "system", "content": system_instruction}]
            
            for msg in history:
                role = "user" if msg.get("role") == "user" else "assistant"
                messages.append({"role": role, "content": msg.get("text", "")})

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.7,
                max_tokens=512
            )
            
            bot_text = completion.choices[0].message.content
            
            chat_log = {
                "user_id": ObjectId(user_id) if user_id else None,
                "message": history[-1].get('text', '') if history else '',
                "response": bot_text,
                "created_at": datetime.datetime.utcnow()
            }
            mongo.db.chats.insert_one(chat_log)
            
            return success_response({"response": bot_text, "text": bot_text})
        except Exception as e:
            return error_response(f"AI Service Error: {str(e)}", 500)

    @staticmethod
    def get_recommendations(user_id, data):
        try:
            mood = data.get('mood', 'unknown')
            factors = data.get('factors', [])
            category = data.get('category', 'all')
            count = data.get('count', 3)

            client = Groq(api_key=Config.GROQ_API_KEY)
            
            factors_str = ", ".join(factors) if factors else "unknown factors"
            category_prompt = f"specifically of type '{category}'" if category != 'all' else "across various types (video, article, movie, song)"
            
            prompt = f"""The user is feeling {mood} due to {factors_str}. 
            Suggest exactly {count} high-quality resources {category_prompt} to improve their well-being.
            For each resource, provide:
            - 'title': Catchy and relevant name.
            - 'reason': Why it helps (max 15 words).
            - 'type': Exactly one of: 'video', 'article', 'movie', 'Music'.
            - 'url': A direct search link (YouTube for videos/Music, Google for articles/movies).
            - 'thumbnail': A relevant image URL (Unsplash or YouTube).
            - 'category': A sub-genre like 'Meditation', 'Inspiration', 'Focus', etc.
            - 'tags': Array of 2-3 short strings.

            Return a valid JSON array of these {count} objects. ONLY the array, no extra text."""

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a world-class mental health curator. Provide diverse, uplifting, and highly relevant content recommendations in valid JSON format. Always return a raw JSON array."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6
            )
            
            res_content = completion.choices[0].message.content
            res_content = res_content.replace('```json', '').replace('```', '').strip()
            data = json.loads(res_content)
            
            # Extract list or handle dictionary wrapper
            recommendations = data if isinstance(data, list) else data.get('recommendations', [data] if isinstance(data, dict) else [])
            if not recommendations and isinstance(data, dict):
                for val in data.values():
                    if isinstance(val, list):
                        recommendations = val
                        break

            # Ensure types are correct for frontend
            for r in recommendations:
                if 'id' not in r:
                    r['id'] = str(ObjectId())
                # Normalize types for frontend mapping
                rtype = str(r.get('type', '')).lower()
                if rtype in ['music', 'song', 'audio']: r['type'] = 'song'
                elif rtype in ['article', 'blog', 'reading', 'book']: r['type'] = 'article'
                elif rtype in ['video', 'clip', 'youtube']: r['type'] = 'video'
                elif rtype in ['movie', 'film', 'cinema']: r['type'] = 'movie'
            
            return success_response(recommendations)


        except Exception as e:
            return error_response(f"AI Service Error: {str(e)}", 500)
