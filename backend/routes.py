from flask import Blueprint, request
from controllers.auth_controller import AuthController
from controllers.checkin_controller import CheckInController
from controllers.resource_controller import ResourceController
from controllers.dashboard_controller import DashboardController
from controllers.chat_controller import ChatController
from controllers.mood_calendar_controller import MoodCalendarController
from middleware.auth import token_required

# Define all Blueprints in this single file
auth_bp = Blueprint('auth', __name__)
checkin_bp = Blueprint('checkins', __name__)
resource_bp = Blueprint('resources', __name__)
dashboard_bp = Blueprint('dashboard', __name__)
chat_bp = Blueprint('chat', __name__)
mood_calendar_bp = Blueprint('mood_calendar', __name__)

# --- Auth Routes ---
@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register(request.json)

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login(request.json)

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    return AuthController.get_me(request.user_id)

# --- Check-in Routes ---
@checkin_bp.route('', methods=['POST'])
@token_required
def add_checkin():
    return CheckInController.add_checkin(request.user_id, request.json)

@checkin_bp.route('', methods=['GET'])
@token_required
def get_checkins():
    return CheckInController.get_checkins(request.user_id)

@checkin_bp.route('/<date>', methods=['GET'])
@token_required
def get_checkin_by_date(date):
    return CheckInController.get_checkin_by_date(request.user_id, date)

# --- Resource Routes ---
@resource_bp.route('', methods=['GET'])
@token_required
def get_resources():
    return ResourceController.get_resources(request.args)

@resource_bp.route('/favorites', methods=['POST'])
@token_required
def add_favorite():
    return ResourceController.add_favorite(request.user_id, request.json)

@resource_bp.route('/favorites/<resource_id>', methods=['DELETE'])
@token_required
def remove_favorite(resource_id):
    return ResourceController.remove_favorite(request.user_id, resource_id)

@resource_bp.route('/favorites', methods=['GET'])
@token_required
def get_favorites():
    return ResourceController.get_favorites(request.user_id)

# --- Dashboard Routes ---
@dashboard_bp.route('', methods=['GET'])
@token_required
def get_stats():
    return DashboardController.get_stats(request.user_id)

# --- Chat Routes ---
@chat_bp.route('', methods=['POST'])
@token_required
def chat():
    return ChatController.get_response(request.user_id, request.json)

@chat_bp.route('/recommendations', methods=['POST'])
@token_required
def get_recommendations():
    return ChatController.get_recommendations(request.user_id, request.json)

# --- Mood Calendar Routes ---
@mood_calendar_bp.route('', methods=['GET'])
@token_required
def get_calendar_data():
    return MoodCalendarController.get_calendar_data(request.user_id)
