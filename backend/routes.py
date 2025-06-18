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
from flask_cors import CORS
from werkzeug.utils import secure_filename
from functools import wraps
import jwt as pyjwt
import os
from io import BytesIO
import uuid
import mimetypes

# Import your models
from models import db, Admin, Image, Intro, Event, EventFormField, Registration, RegistrationFieldResponse, TeamMember

# JWT Secret Key (Change this for production!)
jwt = JWTManager()
SECRET_KEY = "ShreyaKhantal:)"

route = Blueprint('main', __name__)

# Allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        print("🔥 Raw token header:", token)

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]

            print("🧪 Decoding token...")
            data = pyjwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            print("✅ Token decoded:", data)

            admin_id = data.get("sub")  # we encoded admin_id as a string in 'sub'

            if not admin_id:
                return jsonify({'message': 'Token payload missing `sub` (admin_id)'}), 401

            current_admin = Admin.query.get(int(admin_id))  # convert to int
            if not current_admin:
                return jsonify({'message': 'Invalid token: admin not found'}), 401

        except pyjwt.ExpiredSignatureError:
            print("❌ Token expired")
            return jsonify({'message': 'Token has expired'}), 401
        except pyjwt.InvalidTokenError as e:
            print("❌ Invalid token:", str(e))
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401

        return f(current_admin, *args, **kwargs)

    return decorated

# ==================== PUBLIC ROUTES (No Authentication Required) ====================

@route.route('/api/intro', methods=['GET'])
def get_public_intro():
    """Public endpoint to get introduction text for homepage"""
    try:
        intro = Intro.query.first()
        if intro:
            return jsonify({'text': intro.text}), 200
        else:
            return jsonify({'text': ''}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@route.route('/api/images', methods=['GET'])
def get_public_images():
    """Public endpoint to get all images for homepage gallery"""
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

@route.route('/api/team-members', methods=['GET'])
def get_public_team_members():
    """Public endpoint to get team members for about/team page"""
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

@route.route('/api/events', methods=['GET'])
def get_public_events():
    """Public endpoint to get active events for events page"""
    try:
        include_form_fields = request.args.get('include_form_fields', 'false').lower() == 'true'
        
        # Only return active events for public access
        events = Event.query.order_by(Event.date.desc()).all()
        events_data = []
        
        for event in events:
            event_data = {
                'id': event.id,
                'name': event.name,
                'date': event.date.isoformat(),
                'description': event.description,
                'cover_image_url': event.cover_image_url,
                'is_active': event.is_active
            }
            
            # Include form fields if requested
            if include_form_fields:
                form_fields = []
                for field in event.form_fields:
                    form_fields.append({
                        'id': field.id,
                        'label': field.label,
                        'field_type': field.field_type,
                        'is_required': field.is_required,
                        'order': field.order
                    })
                event_data['form_fields'] = sorted(form_fields, key=lambda x: x['order'])
            
            events_data.append(event_data)
        
        return jsonify(events_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@route.route('/api/events/<int:event_id>', methods=['GET'])
def get_public_event_details(event_id):
    """Public endpoint to get specific event details with form fields"""
    try:
        event = Event.query.filter_by(id=event_id).first()
        
        if not event:
            return jsonify({'message': 'Event not found or not active'}), 404
        
        form_fields = []
        for field in event.form_fields:
            form_fields.append({
                'id': field.id,
                'label': field.label,
                'field_type': field.field_type,
                'is_required': field.is_required,
                'order': field.order
            })
        
        event_data = {
            'id': event.id,
            'name': event.name,
            'date': event.date.isoformat(),
            'description': event.description,
            'cover_image_url': event.cover_image_url,
            'form_fields': sorted(form_fields, key=lambda x: x['order']),
            'is_active': event.is_active
        }
        
        return jsonify(event_data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# ==================== AUTHENTICATION ROUTES ====================

@route.route('/api/auth/login', methods=['POST'])
def admin_login():
    """Admin login endpoint - MAIN LOGIN ROUTE"""
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
        
        # Create JWT token using pyjwt (consistent with token_required decorator)
        payload = {
            'sub': str(admin.id),  # Keep as string for consistency
            'username': admin.username,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        
        token = pyjwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': token,
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

@route.route('/api/admin/verify-token', methods=['GET'])
@token_required
def verify_token(current_admin):
    """Verify admin token"""
    return jsonify({
        'valid': True, 
        'admin': {
            'id': current_admin.id,
            'username': current_admin.username
        }
    }), 200

# ==================== ADMIN HOME CONTENT ROUTES ====================

@route.route('/api/admin/intro', methods=['GET'])
@token_required
def get_intro(current_admin):
    intro = Intro.query.first()
    return jsonify({'text': intro.text if intro else ''}), 200

@route.route('/api/admin/intro', methods=['PUT'])
@token_required
def update_intro(current_admin):
    data = request.get_json()
    text = data.get('text', '')
    intro = Intro.query.first()
    if intro:
        intro.text = text
    else:
        intro = Intro(text=text)
        db.session.add(intro)
    db.session.commit()
    return jsonify({'message': 'Intro updated successfully'}), 200

@route.route('/api/admin/images', methods=['GET'])
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

@route.route('/api/admin/images', methods=['POST'])
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
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)
            
            # Create image record
            image_url = f'/uploads/{filename}'
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

@route.route('/api/admin/images/<int:image_id>', methods=['DELETE'])
@token_required
def delete_image(current_admin, image_id):
    try:
        image = Image.query.get_or_404(image_id)
        
        # Delete physical file
        if image.url.startswith('/uploads/'):
            filename = image.url.replace('/uploads/', '')
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            filepath = os.path.join(upload_folder, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({'message': 'Image deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# ==================== ADMIN EVENTS ROUTES ====================

@route.route('/api/admin/events', methods=['GET'])
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

@route.route('/api/admin/events', methods=['POST'])
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

@route.route('/api/admin/events/<int:event_id>', methods=['PUT'])
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

@route.route('/api/admin/events/<int:event_id>', methods=['DELETE'])
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

# ==================== ADMIN REGISTRATIONS ROUTES ====================

@route.route('/api/admin/registrations/<int:event_id>', methods=['GET'])
@token_required
def get_registrations(current_admin, event_id):
    try:
        registrations = Registration.query.filter_by(event_id=event_id).order_by(Registration.timestamp.desc()).all()
        registrations_data = []
        for reg in registrations:
            responses = {}
            for response in reg.responses:
                if response.field and hasattr(response.field, 'label'):
                    responses[response.field.label] = response.value
                else:
                    print(f"Warning: Invalid response for registration {reg.id}")
            registrations_data.append({
                'id': reg.id,
                'email': reg.email or '',
                'screenshot_url': reg.screenshot_url or '',
                'status': reg.status or 'pending',
                'timestamp': reg.timestamp.isoformat() if reg.timestamp else None,
                'responses': responses
            })
        return jsonify(registrations_data), 200
    except Exception as e:
        print(f"Error in get_registrations: {str(e)}")
        return jsonify({'message': str(e)}), 500
    
@route.route('/api/admin/registrations/<int:registration_id>/status', methods=['PUT'])
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


# ==================== ADMIN TEAM ROUTES ====================

@route.route('/api/admin/team', methods=['GET'])
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

@route.route('/api/admin/team', methods=['POST'])
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

@route.route('/api/admin/team/<int:member_id>', methods=['PUT'])
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

@route.route('/api/admin/team/<int:member_id>', methods=['DELETE'])
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
@route.route('/uploads/<filename>')
def uploaded_file(filename):
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    return send_file(os.path.join(upload_folder, filename))


@route.route('/api/events/<int:event_id>/check-registration', methods=['GET'])
def check_registration_status(event_id):
    """
    Check if an email is already registered for an event and return registration status
    """
    try:
        email = request.args.get('email')
        
        if not email:
            return jsonify({'error': 'Email parameter is required'}), 400
        
        # Check if the event exists
        event = db.session.query(Event).filter_by(id=event_id).first()
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if email is already registered for this event
        registration = db.session.query(Registration).filter_by(
            event_id=event_id,
            email=email.lower().strip()
        ).first()
        
        if registration:
            return jsonify({
                'exists': True,
                'status': registration.status,
                'registration_id': registration.id,
                'timestamp': registration.timestamp.isoformat()
            }), 200
        else:
            return jsonify({
                'exists': False
            }), 200
            
    except Exception as e:
        print(f"Error checking registration status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@route.route('/api/events/<int:event_id>/register', methods=['POST'])
def register_for_event(event_id):
    """
    Register a user for an event
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        email = data.get('email', '').lower().strip()
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Check if the event exists and is active
        event = db.session.query(Event).filter_by(id=event_id).first()
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        if not event.is_active:
            return jsonify({'error': 'Registration is closed for this event'}), 400
        
        # Check if email is already registered
        existing_registration = db.session.query(Registration).filter_by(
            event_id=event_id,
            email=email
        ).first()
        
        if existing_registration:
            return jsonify({
                'error': 'Email already registered',
                'status': existing_registration.status
            }), 400
        
        # Create new registration
        registration = Registration(
            event_id=event_id,
            email=email,
            status='pending'
        )
        
        db.session.add(registration)
        db.session.flush()  # To get the registration ID
        
        # Handle form field responses
        form_responses = data.get('responses', [])
        for response_data in form_responses:
            field_id = response_data.get('field_id')
            value = response_data.get('value')
            
            if field_id and value:
                field_response = RegistrationFieldResponse(
                    registration_id=registration.id,
                    field_id=field_id,
                    value=value
                )
                db.session.add(field_response)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'registration_id': registration.id,
            'status': registration.status,
            'message': 'Registration submitted successfully. Please wait for verification.'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error registering for event: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

import re

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads/screenshots'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@route.route('/api/registrations/check/<int:event_id>', methods=['GET'])
def check_existing_registration(event_id):
    """
    Check if an email is already registered for a specific event
    """
    try:
        email = request.args.get('email')
        
        if not email:
            return jsonify({'error': 'Email parameter is required'}), 400
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Normalize email
        email = email.lower().strip()
        
        # Check if the event exists
        event = db.session.query(Event).filter_by(id=event_id).first()
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check for existing registration
        registration = db.session.query(Registration).filter_by(
            event_id=event_id,
            email=email
        ).first()
        
        if registration:
            return jsonify({
                'exists': True,
                'status': registration.status,
                'registration_id': registration.id,
                'timestamp': registration.timestamp.isoformat(),
                'event_name': event.name
            }), 200
        else:
            return jsonify({
                'exists': False,
                'event_name': event.name
            }), 200
            
    except Exception as e:
        print(f"Error checking registration: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@route.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Handle file upload for payment screenshots
    """
    try:
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        
        file = request.files['file']
        
        # If user does not select file, browser also submits an empty part without filename
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File size exceeds 5MB limit'}), 400
        
        if file and allowed_file(file.filename):
            # Create upload directory if it doesn't exist
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Generate unique filename
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
            filename = secure_filename(unique_filename)
            
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Return the file URL (adjust based on your static file serving setup)
            file_url = f"/uploads/screenshots/{filename}"
            
            return jsonify({
                'success': True,
                'url': file_url,
                'filename': filename
            }), 200
        else:
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF files are allowed'}), 400
            
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return jsonify({'error': 'File upload failed'}), 500


@route.route('/api/registrations', methods=['POST'])
def create_registration():
    """
    Create a new registration for an event
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        # Extract and validate required fields
        event_id = data.get('event_id')
        email = data.get('email', '').lower().strip()
        screenshot_url = data.get('screenshot_url')
        responses = data.get('responses', [])
        
        # Validation
        if not event_id:
            return jsonify({'error': 'Event ID is required'}), 400
        
        if not email or not validate_email(email):
            return jsonify({'error': 'Valid email is required'}), 400
        
        if not screenshot_url:
            return jsonify({'error': 'Payment screenshot is required'}), 400
        
        # Check if event exists and is active
        event = db.session.query(Event).filter_by(id=event_id).first()
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        if not event.is_active:
            return jsonify({'error': 'Registration is closed for this event'}), 400
        
        # Check if email is already registered
        existing_registration = db.session.query(Registration).filter_by(
            event_id=event_id,
            email=email
        ).first()
        
        if existing_registration:
            return jsonify({
                'error': 'Email already registered for this event',
                'existing_status': existing_registration.status
            }), 400
        
        # Validate form field responses
        required_fields = db.session.query(EventFormField).filter_by(
            event_id=event_id,
            is_required=True
        ).all()
        
        response_field_ids = {r.get('field_id') for r in responses if r.get('field_id')}
        required_field_ids = {field.id for field in required_fields}
        
        missing_fields = required_field_ids - response_field_ids
        if missing_fields:
            missing_field_labels = [
                field.label for field in required_fields 
                if field.id in missing_fields
            ]
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_field_labels)}'
            }), 400
        
        # Create the registration
        registration = Registration(
            event_id=event_id,
            email=email,
            screenshot_url=screenshot_url,
            status='pending',
            timestamp=datetime.utcnow()
        )
        
        db.session.add(registration)
        db.session.flush()  # Get the registration ID
        
        # Add form field responses
        for response_data in responses:
            field_id = response_data.get('field_id')
            value = response_data.get('value', '').strip()
            
            if field_id and value:
                # Verify the field exists and belongs to this event
                field = db.session.query(EventFormField).filter_by(
                    id=field_id,
                    event_id=event_id
                ).first()
                
                if field:
                    field_response = RegistrationFieldResponse(
                        registration_id=registration.id,
                        field_id=field_id,
                        value=value
                    )
                    db.session.add(field_response)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'registration_id': registration.id,
            'status': registration.status,
            'message': 'Registration submitted successfully. Please wait for verification.',
            'event_name': event.name,
            'timestamp': registration.timestamp.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating registration: {str(e)}")
        return jsonify({'error': 'Failed to create registration'}), 500


@route.route('/api/registrations/<int:registration_id>', methods=['GET'])
def get_registration_details(registration_id):
    """
    Get details of a specific registration (optional - for admin use)
    """
    try:
        registration = db.session.query(Registration).filter_by(id=registration_id).first()
        
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404
        
        # Get form field responses
        responses = db.session.query(RegistrationFieldResponse)\
            .join(EventFormField)\
            .filter(RegistrationFieldResponse.registration_id == registration_id)\
            .all()
        
        response_data = []
        for response in responses:
            response_data.append({
                'field_label': response.field.label,
                'field_type': response.field.field_type,
                'value': response.value
            })
        
        registration_data = {
            'id': registration.id,
            'event_id': registration.event_id,
            'event_name': registration.event.name,
            'email': registration.email,
            'status': registration.status,
            'screenshot_url': registration.screenshot_url,
            'timestamp': registration.timestamp.isoformat(),
            'responses': response_data
        }
        
        return jsonify(registration_data), 200
        
    except Exception as e:
        print(f"Error fetching registration details: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    
# Fixed Backend Route
@route.route('/api/admin/registrations/<int:registration_id>/screenshot', methods=['GET'])
@token_required
def view_screenshot(current_admin, registration_id):
    try:
        # Query the registration by ID
        registration = Registration.query.filter_by(id=registration_id).first()
        if not registration:
            return jsonify({'message': 'Registration not found'}), 404
            
        if not registration.screenshot_url:
            return jsonify({'message': 'No screenshot available for this registration'}), 404
            
        # FIXED: Better file path construction
        # Get the uploads directory (should be consistent with where files are saved)
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'screenshots')
        
        # Handle different URL formats that might be stored in database
        if registration.screenshot_url.startswith('/uploads/'):
            # URL format: /uploads/screenshots/filename.jpg
            filename = os.path.basename(registration.screenshot_url)
        elif registration.screenshot_url.startswith('uploads/'):
            # Path format: uploads/screenshots/filename.jpg
            filename = os.path.basename(registration.screenshot_url)
        else:
            # Just filename: filename.jpg
            filename = registration.screenshot_url
            
        file_path = os.path.join(uploads_dir, filename)
        
        print(f"Registration ID: {registration_id}")  # Debug
        print(f"Screenshot URL in DB: {registration.screenshot_url}")  # Debug
        print(f"Constructed file path: {file_path}")  # Debug
        print(f"File exists: {os.path.exists(file_path)}")  # Debug
        
        if not os.path.exists(file_path):
            # FIXED: Also check if file exists with different extensions
            possible_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            base_filename = os.path.splitext(filename)[0]
            
            found_file = None
            for ext in possible_extensions:
                test_path = os.path.join(uploads_dir, base_filename + ext)
                if os.path.exists(test_path):
                    found_file = test_path
                    break
                    
            if not found_file:
                print(f"File not found at: {file_path}")  # Debug
                print(f"Directory contents: {os.listdir(uploads_dir) if os.path.exists(uploads_dir) else 'Directory does not exist'}")  # Debug
                return jsonify({'message': 'Screenshot file not found on server'}), 404
            
            file_path = found_file
            
        # Determine MIME type dynamically
        mimetype, _ = mimetypes.guess_type(file_path)
        if not mimetype:
            mimetype = 'image/png'  # Fallback
            
        # FIXED: Add proper headers for browser display
        response = send_file(
            file_path,
            mimetype=mimetype,
            as_attachment=False
        )
        
        # Add headers to ensure proper display in browser
        response.headers['Content-Disposition'] = 'inline'
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        
        return response
        
    except Exception as e:
        print(f"Error in view_screenshot: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full traceback for debugging
        return jsonify({'message': f'Failed to retrieve screenshot: {str(e)}'}), 500



@route.route('/admin/registrations/<int:event_id>/download', methods=['GET'])
@token_required
def download_registrations_excel(event_id):
    """
    Download all registrations for an event as Excel file
    """
    try:
        # Check if event exists
        event = Event.query.get_or_404(event_id)
        
        # Get all registrations for the event
        registrations = Registration.query.filter_by(event_id=event_id).all()
        
        if not registrations:
            return jsonify({'error': 'No registrations found for this event'}), 404
        
        # Get all form fields for the event
        form_fields = EventFormField.query.filter_by(event_id=event_id).order_by(EventFormField.order).all()
        
        # Prepare data for Excel
        excel_data = []
        
        for registration in registrations:
            row_data = {
                'ID': registration.id,
                'Email': registration.email,
                'Status': registration.status,
                'Registration Date': registration.timestamp.strftime('%Y-%m-%d %H:%M:%S') if registration.timestamp else '',
                'Screenshot URL': registration.screenshot_url or ''
            }
            
            # Add form field responses
            response_dict = {resp.field_id: resp.value for resp in registration.responses if resp.field}
            
            for field in form_fields:
                row_data[field.label] = response_dict.get(field.id, '')
            
            excel_data.append(row_data)
        
        # Create DataFrame
        df = pd.DataFrame(excel_data)
        
        # Create Excel file in memory
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Write main data
            df.to_excel(writer, sheet_name='Registrations', index=False)
            
            # Get the workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Registrations']
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = min(max_length + 2, 50)  # Cap at 50 characters
                worksheet.column_dimensions[column_letter].width = adjusted_width
            
            # Add summary sheet
            summary_data = {
                'Metric': [
                    'Event Name',
                    'Total Registrations',
                    'Pending Registrations',
                    'Verified Registrations',
                    'Rejected Registrations',
                    'Export Date'
                ],
                'Value': [
                    event.name,
                    len(registrations),
                    len([r for r in registrations if r.status == 'pending']),
                    len([r for r in registrations if r.status == 'verified']),
                    len([r for r in registrations if r.status == 'rejected']),
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                ]
            }
            
            summary_df = pd.DataFrame(summary_data)
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            
            # Auto-adjust summary sheet columns
            summary_worksheet = writer.sheets['Summary']
            for column in summary_worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = max_length + 2
                summary_worksheet.column_dimensions[column_letter].width = adjusted_width
        
        output.seek(0)
        
        # Generate filename
        safe_event_name = "".join(c for c in event.name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{safe_event_name}_registrations_{timestamp}.xlsx"
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        print(f"Error downloading registrations: {str(e)}")
        return jsonify({'error': 'Failed to generate Excel file'}), 500