import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Add the server directory to sys.path to import config if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/kayadu")
client = MongoClient(MONGO_URI)
db = client.get_database()

resources_data = [
    # --- CALM / PEACEFUL ---
    {
        "title": "15 Minute Guided Meditation",
        "type": "video",
        "category": "Mindfulness",
        "url": "https://www.youtube.com/watch?v=inpok4MKVLM",
        "thumbnail": "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
        "description": "A gentle guided meditation to help you find inner peace.",
        "moodTags": ["Calm", "Peaceful", "Stressed"],
        "tags": ["meditation", "peace", "breathing"]
    },
    {
        "title": "Weightless - Marconi Union",
        "type": "song",
        "category": "Relaxation",
        "url": "https://www.youtube.com/watch?v=UfcAVejsigU",
        "thumbnail": "https://img.youtube.com/vi/UfcAVejsigU/hqdefault.jpg",
        "description": "The world's most relaxing song, scientifically proven to reduce anxiety.",
        "moodTags": ["Calm", "Peaceful", "Anxious", "Stressed"],
        "tags": ["music", "relax", "ambient"]
    },
    
    # --- SAD / LOW ---
    {
        "title": "The Science of Happiness",
        "type": "article",
        "category": "Growth",
        "url": "https://greatergood.berkeley.edu/topic/happiness/definition",
        "thumbnail": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=500",
        "description": "Understanding what truly makes us happy based on scientific research.",
        "moodTags": ["Sad", "Low", "Neutral"],
        "tags": ["happiness", "psychology", "learning"]
    },
    {
        "title": "The Secret Life of Walter Mitty",
        "type": "movie",
        "category": "Inspiration",
        "url": "https://www.imdb.com/title/tt0359950/",
        "thumbnail": "https://m.media-amazon.com/images/M/MV5BMjA5OTY2MTkxNV5BMl5BanBnXkFtZTgwNjAyMzY3MDE@._V1_.jpg",
        "description": "A visually stunning movie about finding courage and living life.",
        "moodTags": ["Sad", "Bored", "Low", "Insecure"],
        "tags": ["movie", "adventure", "inspiration"]
    },
    
    # --- ANXIOUS / STRESSED ---
    {
        "title": "4-7-8 Breathing Technique",
        "type": "video",
        "category": "Exercise",
        "url": "https://www.youtube.com/watch?v=p8fjYPC-k2k",
        "thumbnail": "https://img.youtube.com/vi/p8fjYPC-k2k/hqdefault.jpg",
        "description": "A simple breathing exercise to calm the nervous system instantly.",
        "moodTags": ["Anxious", "Stressed", "Overwhelmed"],
        "tags": ["breathing", "anxiety", "quick-fix"]
    },
    {
        "title": "Ambient Study Music",
        "type": "song",
        "category": "Focus",
        "url": "https://www.youtube.com/watch?v=5qap5aO4i9A",
        "thumbnail": "https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg",
        "description": "Lo-fi beats and ambient sounds to help you focus and de-stress.",
        "moodTags": ["Anxious", "Stressed", "Frustrated"],
        "tags": ["lofi", "focus", "background"]
    },
    
    # --- ENERGETIC / HAPPY ---
    {
        "title": "Morning Vinyasa Flow",
        "type": "video",
        "category": "Exercise",
        "url": "https://www.youtube.com/watch?v=VaoV1PrYft4",
        "thumbnail": "https://img.youtube.com/vi/VaoV1PrYft4/hqdefault.jpg",
        "description": "Energize your body with this 20-minute yoga flow.",
        "moodTags": ["Energetic", "Happy", "Productive"],
        "tags": ["yoga", "energy", "morning"]
    },
    {
        "title": "The Power of Positive Thinking",
        "type": "article",
        "category": "Growth",
        "url": "https://www.verywellmind.com/what-is-positive-thinking-2794772",
        "thumbnail": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500",
        "description": "How to harness the power of your thoughts to improve your life.",
        "moodTags": ["Happy", "Neutral", "Productive"],
        "tags": ["mindset", "positivity", "mental-health"]
    }
]

def seed_resources():
    print("Connecting to MongoDB...")
    try:
        # Clear existing resources to avoid duplicates during dev
        db.resources.delete_many({})
        print("Cleared existing resources.")
        
        result = db.resources.insert_many(resources_data)
        print(f"Successfully inserted {len(result.inserted_ids)} resources.")
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_resources()
