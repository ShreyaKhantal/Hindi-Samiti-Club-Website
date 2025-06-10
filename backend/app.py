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
app.config["JWT_SECRET_KEY"] = "ShreyaKhantal:)"  # Change this in production

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

# Register Blueprint
app.register_blueprint(route)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
        # # Create default admin if not exists
        # admin_exists = Admin.query.filter_by(username="Admin").first()
        # if not admin_exists:
        #     admin_password = generate_password_hash('admin')
        #     admin = Admin(username='Admin', password_hash=admin_password)
        #     db.session.add(admin)
        #     db.session.commit()
        #     print("Default admin created - Username: Admin, Password: admin")
            
    app.run(debug=True)