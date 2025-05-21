from sqlalchemy import *
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
Base = declarative_base()
class Admin(Base):
    **tablename** = 'admins'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)  # store hashed passwords
class Image(Base):
    **tablename** = 'images'
    id = Column(Integer, primary_key=True)
    url = Column(String(255), nullable=False)
    caption = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
class Intro(Base):
    **tablename** = 'intro'
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
class Event(Base):
    **tablename** = 'events'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    cover_image_url = Column(String(255))
    registrations = relationship('Registration', back_populates='event')
    form_fields = relationship('EventFormField', back_populates='event', cascade='all, delete-orphan')
class EventFormField(Base):
    **tablename** = 'event_form_fields'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    label = Column(String(100), nullable=False)
    field_type = Column(String(20), nullable=False)  # text, image, email, etc.
    is_required = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    event = relationship('Event', back_populates='form_fields')
class Registration(Base):
    **tablename** = 'registrations'
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('events.id'))
    email = Column(String(120), nullable=False)
    screenshot_url = Column(String(255))  # for verification
    status = Column(String(20), default='pending')  # pending, verified, rejected
    timestamp = Column(DateTime, default=datetime.utcnow)
    event = relationship('Event', back_populates='registrations')
    responses = relationship('RegistrationFieldResponse', back_populates='registration', cascade='all, delete-orphan')
class RegistrationFieldResponse(Base):
    **tablename** = 'registration_field_responses'
    id = Column(Integer, primary_key=True)
    registration_id = Column(Integer, ForeignKey('registrations.id'))
    field_id = Column(Integer, ForeignKey('event_form_fields.id'))
    value = Column(Text)  # store user input or image URL
    registration = relationship('Registration', back_populates='responses')
    field = relationship('EventFormField')
class TeamMember(Base):
    **tablename** = 'team_members'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)  # e.g. President, Developer
    image_url = Column(String(255))
    description = Column(Text)
class ContactInfo(Base):
    **tablename** = 'contact_info'
    id = Column(Integer, primary_key=True)
    instagram = Column(String(100))
    facebook = Column(String(100))
    twitter = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))

