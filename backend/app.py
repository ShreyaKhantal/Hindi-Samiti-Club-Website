from datetime import datetime, time
import json
from werkzeug.security import generate_password_hash
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_caching import Cache
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import redis
import os
from routes import route
from models import db, Admin

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Configuration
app.config["SECRET_KEY"] = "ShreyaKhantal:)"  

# Upload Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Redis Cache Configuration
app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

# Celery Configuration
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

# ==============================
# Initialize Extensions
# ==============================

# Initialize Database and Migrations
db.init_app(app)
migrate = Migrate(app, db)

# Initialize JWT - THIS IS CRUCIAL
jwt = JWTManager(app)

def create_default_admin():
    """Create a default admin user if none exists"""
    if not Admin.query.first():
        default_admin = Admin(
            username='admin',
            password_hash=generate_password_hash('admin123')  # Change this password!
        )
        db.session.add(default_admin)
        db.session.commit()
        print("Default admin created - Username: admin, Password: admin123")
        print("Please change the default password immediately!")

def initialize_app():
    """Initialize the application with database and default data"""
    db.create_all()
    create_default_admin()

# Register Blueprint
app.register_blueprint(route)

if __name__ == "__main__":
    with app.app_context():
        initialize_app()
            
    app.run(debug=True)