import datetime
from bson import ObjectId

def parse_date(date_val):
    """
    Consistently parses various date formats into a datetime.date object.
    """
    if not date_val:
        return None
    
    if isinstance(date_val, (datetime.datetime, datetime.date)):
        return date_val.date() if isinstance(date_val, datetime.datetime) else date_val
    
    if isinstance(date_val, str):
        try:
            # Handle ISO format with Z or offset
            return datetime.datetime.fromisoformat(date_val.replace('Z', '+00:00')).date()
        except ValueError:
            try:
                # Handle YYYY-MM-DD
                return datetime.datetime.strptime(date_val, '%Y-%m-%d').date()
            except ValueError:
                return None
    return None

def to_oid(user_id):
    """
    Converts a string user_id to a BSON ObjectId safely.
    """
    if not user_id or user_id == 'null':
        return None
    try:
        return ObjectId(user_id)
    except:
        return None

def format_checkin(c):
    """
    Consistently formats a check-in document for the frontend.
    """
    return {
        "id": str(c.get('_id')),
        "mood": c.get('mood'),
        "description": c.get('description') or c.get('note') or '',
        "date": c.get('date').isoformat() if isinstance(c.get('date'), (datetime.datetime, datetime.date)) else str(c.get('date')),
        "factors": c.get('factors', []),
        "sleepHours": c.get('sleepHours') or c.get('sleep_hours') or 0,
        "sleepQuality": c.get('sleepQuality') or c.get('sleep_quality') or 'Okay',
        "energyLevel": c.get('energyLevel') or c.get('energy_level') or 'Medium'
    }
