import ast
import base64
import csv
from datetime import datetime
import io
from flask import current_app
from flask import Blueprint, request, jsonify, send_file
from sqlalchemy import extract, func
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


# JWT Secret Key (Change this for production!)
jwt = JWTManager()
SECRET_KEY = "ShreyaKhantal:)"

route = Blueprint('main', __name__)



# Add this route to your existing routes.py file
from models import Admin

@route.route('/api/auth/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400
        
        # Find admin by username
        admin = Admin.query.filter_by(username=username).first()
        
        if not admin:
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Check password
        if not check_password_hash(admin.password_hash, password):
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Create JWT token
        access_token = create_access_token(
            identity=admin.id,
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'admin': {
                'id': admin.id,
                'username': admin.username
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")  # For debugging
        return jsonify({
            'success': False,
            'message': 'Login failed. Please try again.'
        }), 500

@route.route('/api/admin/verify', methods=['GET'])
@jwt_required()
def verify_admin():
    """Verify admin token"""
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({
                'success': False,
                'message': 'Admin not found'
            }), 404
        
        return jsonify({
            'success': True,
            'admin': {
                'id': admin.id,
                'username': admin.username
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Token verification failed'
        }), 401


from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
import jwt
import os
import pandas as pd
from datetime import datetime, timedelta
from io import BytesIO
import uuid

# Import your models
from models import db, Admin, Image, Intro, Event, EventFormField, Registration, RegistrationFieldResponse, TeamMember

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hindi_samiti.db'  # Or your database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db.init_app(app)
CORS(app)

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# JWT Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_admin = Admin.query.get(data['admin_id'])
            
            if not current_admin:
                return jsonify({'message': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_admin, *args, **kwargs)
    
    return decorated

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and check_password_hash(admin.password_hash, password):
            # Generate JWT token
            token = jwt.encode({
                'admin_id': admin.id,
                'username': admin.username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'token': token,
                'message': 'Login successful'
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/verify-token', methods=['GET'])
@token_required
def verify_token(current_admin):
    return jsonify({'valid': True, 'admin': current_admin.username}), 200

# ==================== HOME CONTENT ROUTES ====================

@app.route('/api/admin/intro', methods=['GET'])
@token_required
def get_intro(current_admin):
    try:
        intro = Intro.query.first()
        if intro:
            return jsonify({'text': intro.text}), 200
        else:
            return jsonify({'text': ''}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/intro', methods=['PUT'])
@token_required
def update_intro(current_admin):
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        intro = Intro.query.first()
        if intro:
            intro.text = text
        else:
            intro = Intro(text=text)
            db.session.add(intro)
        
        db.session.commit()
        return jsonify({'message': 'Introduction updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/images', methods=['GET'])
@token_required
def get_images(current_admin):
    try:
        images = Image.query.order_by(Image.created_at.desc()).all()
        images_data = []
        
        for img in images:
            images_data.append({
                'id': img.id,
                'url': img.url,
                'caption': img.caption,
                'created_at': img.created_at.isoformat()
            })
        
        return jsonify(images_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/images', methods=['POST'])
@token_required
def upload_image(current_admin):
    try:
        if 'image' not in request.files:
            return jsonify({'message': 'No image file provided'}), 400
        
        file = request.files['image']
        caption = request.form.get('caption', '')
        
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Generate unique filename
            filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Create image record
            image_url = f'/uploads/{filename}'  # Adjust based on your static file serving setup
            new_image = Image(url=image_url, caption=caption)
            db.session.add(new_image)
            db.session.commit()
            
            return jsonify({
                'id': new_image.id,
                'url': new_image.url,
                'caption': new_image.caption,
                'created_at': new_image.created_at.isoformat()
            }), 201
        else:
            return jsonify({'message': 'Invalid file type'}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/images/<int:image_id>', methods=['DELETE'])
@token_required
def delete_image(current_admin, image_id):
    try:
        image = Image.query.get_or_404(image_id)
        
        # Delete physical file
        if image.url.startswith('/uploads/'):
            filename = image.url.replace('/uploads/', '')
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({'message': 'Image deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ==================== EVENTS ROUTES ====================

@app.route('/api/admin/events', methods=['GET'])
@token_required
def get_events(current_admin):
    try:
        events = Event.query.order_by(Event.date.desc()).all()
        events_data = []
        
        for event in events:
            form_fields = []
            for field in event.form_fields:
                form_fields.append({
                    'id': field.id,
                    'label': field.label,
                    'field_type': field.field_type,
                    'is_required': field.is_required,
                    'order': field.order
                })
            
            events_data.append({
                'id': event.id,
                'name': event.name,
                'date': event.date.isoformat(),
                'description': event.description,
                'is_active': event.is_active,
                'cover_image_url': event.cover_image_url,
                'form_fields': sorted(form_fields, key=lambda x: x['order'])
            })
        
        return jsonify(events_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/events', methods=['POST'])
@token_required
def create_event(current_admin):
    try:
        data = request.get_json()
        
        # Create event
        event = Event(
            name=data['name'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data.get('description', ''),
            is_active=data.get('is_active', True),
            cover_image_url=data.get('cover_image_url', '')
        )
        
        db.session.add(event)
        db.session.flush()  # Get the event ID
        
        # Create form fields
        for field_data in data.get('formFields', []):
            form_field = EventFormField(
                event_id=event.id,
                label=field_data['label'],
                field_type=field_data['field_type'],
                is_required=field_data.get('is_required', True),
                order=field_data.get('order', 0)
            )
            db.session.add(form_field)
        
        db.session.commit()
        return jsonify({'message': 'Event created successfully', 'id': event.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/events/<int:event_id>', methods=['PUT'])
@token_required
def update_event(current_admin, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()
        
        # Update event details
        event.name = data['name']
        event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        event.description = data.get('description', '')
        event.is_active = data.get('is_active', True)
        event.cover_image_url = data.get('cover_image_url', '')
        
        # Delete existing form fields
        EventFormField.query.filter_by(event_id=event_id).delete()
        
        # Create new form fields
        for field_data in data.get('formFields', []):
            form_field = EventFormField(
                event_id=event.id,
                label=field_data['label'],
                field_type=field_data['field_type'],
                is_required=field_data.get('is_required', True),
                order=field_data.get('order', 0)
            )
            db.session.add(form_field)
        
        db.session.commit()
        return jsonify({'message': 'Event updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_admin, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ==================== REGISTRATIONS ROUTES ====================

@app.route('/api/admin/registrations/<int:event_id>', methods=['GET'])
@token_required
def get_registrations(current_admin, event_id):
    try:
        registrations = Registration.query.filter_by(event_id=event_id).order_by(Registration.timestamp.desc()).all()
        registrations_data = []
        
        for reg in registrations:
            # Get all field responses for this registration
            responses = {}
            for response in reg.responses:
                responses[response.field.label] = response.value
            
            registrations_data.append({
                'id': reg.id,
                'email': reg.email,
                'screenshot_url': reg.screenshot_url,
                'status': reg.status,
                'timestamp': reg.timestamp.isoformat(),
                'responses': responses
            })
        
        return jsonify(registrations_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/registrations/<int:registration_id>/status', methods=['PUT'])
@token_required
def update_registration_status(current_admin, registration_id):
    try:
        registration = Registration.query.get_or_404(registration_id)
        data = request.get_json()
        
        status = data.get('status')
        if status not in ['pending', 'verified', 'rejected']:
            return jsonify({'message': 'Invalid status'}), 400
        
        registration.status = status
        db.session.commit()
        
        return jsonify({'message': 'Registration status updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/registrations/<int:event_id>/download', methods=['GET'])
@token_required
def download_registrations_excel(current_admin, event_id):
    try:
        event = Event.query.get_or_404(event_id)
        registrations = Registration.query.filter_by(event_id=event_id).all()
        
        if not registrations:
            return jsonify({'message': 'No registrations found'}), 404
        
        # Prepare data for Excel
        data = []
        
        # Get all form fields for this event
        form_fields = EventFormField.query.filter_by(event_id=event_id).order_by(EventFormField.order).all()
        
        for reg in registrations:
            row = {
                'Registration ID': reg.id,
                'Email': reg.email,
                'Status': reg.status,
                'Timestamp': reg.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'Screenshot URL': reg.screenshot_url or ''
            }
            
            # Add form field responses
            for field in form_fields:
                response = RegistrationFieldResponse.query.filter_by(
                    registration_id=reg.id, 
                    field_id=field.id
                ).first()
                row[field.label] = response.value if response else ''
            
            data.append(row)
        
        # Create Excel file
        df = pd.DataFrame(data)
        
        # Create BytesIO object to store Excel file in memory
        excel_buffer = BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Registrations')
        
        excel_buffer.seek(0)
        
        filename = f"{event.name}_registrations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return send_file(
            excel_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# ==================== TEAM ROUTES ====================

@app.route('/api/admin/team', methods=['GET'])
@token_required
def get_team_members(current_admin):
    try:
        team_members = TeamMember.query.all()
        team_data = []
        
        for member in team_members:
            team_data.append({
                'id': member.id,
                'name': member.name,
                'role': member.role,
                'image_url': member.image_url,
                'description': member.description
            })
        
        return jsonify(team_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/team', methods=['POST'])
@token_required
def create_team_member(current_admin):
    try:
        data = request.get_json()
        
        team_member = TeamMember(
            name=data['name'],
            role=data['role'],
            image_url=data.get('image_url', ''),
            description=data.get('description', '')
        )
        
        db.session.add(team_member)
        db.session.commit()
        
        return jsonify({
            'message': 'Team member added successfully',
            'id': team_member.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/team/<int:member_id>', methods=['PUT'])
@token_required
def update_team_member(current_admin, member_id):
    try:
        member = TeamMember.query.get_or_404(member_id)
        data = request.get_json()
        
        member.name = data['name']
        member.role = data['role']
        member.image_url = data.get('image_url', '')
        member.description = data.get('description', '')
        
        db.session.commit()
        return jsonify({'message': 'Team member updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@app.route('/api/admin/team/<int:member_id>', methods=['DELETE'])
@token_required
def delete_team_member(current_admin, member_id):
    try:
        member = TeamMember.query.get_or_404(member_id)
        db.session.delete(member)
        db.session.commit()
        
        return jsonify({'message': 'Team member removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ==================== UTILITY ROUTES ====================

# Serve uploaded files (for development - use nginx/apache in production)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

# ==================== INITIALIZATION ====================

def create_default_admin():
    """Create a default admin user if none exists"""
    with app.app_context():
        if not Admin.query.first():
            default_admin = Admin(
                username='admin',
                password_hash=generate_password_hash('admin123')  # Change this password!
            )
            db.session.add(default_admin)
            db.session.commit()
            print("Default admin created - Username: admin, Password: admin123")
            print("Please change the default password immediately!")

@app.before_first_request
def create_tables():
    db.create_all()
    create_default_admin()

# # ==================== ERROR HANDLERS ====================

# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'message': 'Resource not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     return jsonify({'message': 'Internal server error'}), 500

# @app.errorhandler(413)
# def too_large(error):
#     return jsonify({'message': 'File too large'}), 413
