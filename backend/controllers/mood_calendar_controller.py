import datetime
from config import mongo
from utils.responses import success_response, error_response
from utils.helpers import to_oid, format_checkin

class MoodCalendarController:
    @staticmethod
    def get_calendar_data(user_id):
        try:
            user_oid = to_oid(user_id)
            
            checkins = []
            if user_oid:
                checkins = list(mongo.db.checkins.find({"user_id": user_oid}).sort("date", 1))
            
            # Formatted list for the frontend
            formatted_checkins = [format_checkin(c) for c in checkins]

            return success_response(formatted_checkins)
        except Exception as e:
            return error_response(f"Backend Error: {str(e)}", 500)
