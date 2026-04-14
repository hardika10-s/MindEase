import os
from flask import Flask
from flask_cors import CORS
from config import Config, init_db
from utils.responses import error_response

# Import Blueprints from consolidated routes file
from routes import auth_bp, checkin_bp, resource_bp, dashboard_bp, chat_bp, mood_calendar_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize Database
    init_db(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(checkin_bp, url_prefix='/api/checkins')
    app.register_blueprint(resource_bp, url_prefix='/api/resources')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(mood_calendar_bp, url_prefix='/api/mood-calendar')

    # Centralized Error Handler
    @app.errorhandler(404)
    def not_found(e):
        return error_response("Endpoint not found", 404)

    @app.errorhandler(500)
    def server_error(e):
        return error_response("Internal server error", 500)

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
