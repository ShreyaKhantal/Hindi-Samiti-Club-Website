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
        events = Event.query.filter_by(is_active=True).order_by(Event.date.desc()).all()
        events_data = []
        
        for event in events:
            event_data = {
                'id': event.id,
                'name': event.name,
                'date': event.date.isoformat(),
                'description': event.description,
                'cover_image_url': event.cover_image_url
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
        event = Event.query.filter_by(id=event_id, is_active=True).first()
        
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
            'form_fields': sorted(form_fields, key=lambda x: x['order'])
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

@route.route('/api/admin/registrations/<int:event_id>/download', methods=['GET'])
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