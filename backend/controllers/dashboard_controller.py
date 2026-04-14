import datetime
from config import mongo
from utils.responses import success_response, error_response
from utils.helpers import to_oid, parse_date, format_checkin

class DashboardController:
    @staticmethod
    def get_stats(user_id):
        try:
            user_oid = to_oid(user_id)
            
            # Mood Score Mapping
            mood_score_map = {
                'Happy': 5, 'Calm': 4, 'Stressed': 2, 'Anxious': 1,
                'Lonely': 1, 'Overwhelmed': 2, 'Sad': 0
            }

            checkins = []
            if user_oid:
                checkins = list(mongo.db.checkins.find({"user_id": user_oid}).sort("date", -1))
            
            chart_data = []
            mood_counts = {}
            avg_sleep = 0
            dominant_mood = "Calm"
            streak = 0
            
            if checkins:
                # Chart Data (Mood over time - last 30 entries)
                for ci in reversed(checkins[:30]):
                    date_val = parse_date(ci.get('date'))
                    date_str = date_val.strftime("%a") if date_val else str(ci.get('date'))
                    chart_data.append({
                        "date": date_str,
                        "score": mood_score_map.get(ci.get('mood'), 3),
                        "hours": ci.get('sleepHours') or ci.get('sleep_hours') or 0
                    })
                
                # Mood Counts
                for ci in checkins:
                    mood = ci.get('mood')
                    if mood:
                        mood_counts[mood] = mood_counts.get(mood, 0) + 1
                
                # Avg Sleep (last 7)
                recent_7 = checkins[:7]
                total_sleep = sum(ci.get('sleepHours') or ci.get('sleep_hours') or 0 for ci in recent_7)
                avg_sleep = round(total_sleep / len(recent_7), 1) if recent_7 else 0
                
                if mood_counts:
                    dominant_mood = max(mood_counts, key=mood_counts.get)
                
                # Improved Streak Calculation
                today = datetime.datetime.utcnow().date()
                checkin_dates = sorted(list(set(parse_date(ci.get('date')) for ci in checkins if parse_date(ci.get('date')))), reverse=True)
                
                if checkin_dates:
                    current_date = today
                    # If no checkin today, check if there was one yesterday to continue a streak
                    if checkin_dates[0] < today - datetime.timedelta(days=1):
                        streak = 0
                    else:
                        if checkin_dates[0] == today:
                            idx = 0
                        else:
                            idx = 0 # Start from the most recent one if it was yesterday
                            current_date = checkin_dates[0]
                        
                        temp_streak = 0
                        for d in checkin_dates:
                            if d == current_date:
                                temp_streak += 1
                                current_date -= datetime.timedelta(days=1)
                            elif d > current_date:
                                continue
                            else:
                                break
                        streak = temp_streak

            # Format response
            formatted_checkins = [format_checkin(c) for c in checkins[:5]]
            bar_data = [{"name": m, "count": c} for m, c in mood_counts.items()]

            return success_response({
                "recent_checkins": formatted_checkins,
                "chartData": chart_data,
                "barData": bar_data,
                "avg_sleep": avg_sleep,
                "dominant_mood": dominant_mood,
                "streak": streak,
                "total_checkins": len(checkins)
            })
        except Exception as e:
            return error_response(f"Backend Error: {str(e)}", 500)
