import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegistrationForm from '../components/RegistrationForm';
import { fetchPublicEventDetails } from '../utils/api';

const EventDetails = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const data = await fetchPublicEventDetails(eventId);
        console.log('Event details:', data); // Debug log
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    getEventDetails();
  }, [eventId]);

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/events/${eventId}/check-registration?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.exists) {
        setRegistrationStatus(data.status);
      } else {
        setShowRegistrationForm(true);
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const isRegistrationOpen = () => {
    return event && Boolean(event.is_active);
  };

  const isEventDatePassed = () => {
    if (!event) return false;
    
    const today = new Date();
    const eventDate = new Date(event.date);
    
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate < today;
  };

  const getStatusBadge = () => {
    switch (registrationStatus) {
      case 'verified':
        return (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
            <p>Your registration has been verified. ✓</p>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
            <p>Your registration is pending verification.</p>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            <p>Your registration was not approved. Please contact us for more information.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRegistrationSubmit = (registrationData) => {
    setRegistrationStatus('pending');
    setShowRegistrationForm(false);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-orange-50 to-amber-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-gradient-to-b from-orange-50 to-amber-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl text-gray-700 mb-6">Event not found</h2>
          <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#7C2D12' }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-700 text-yellow-200 px-6 py-2 rounded-full hover:bg-orange-800 transition-all"
            >
              Back to Events
            </motion.button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const registrationOpen = isRegistrationOpen();
  const eventDatePassed = isEventDatePassed();

  return (
    <div className="bg-gradient-to-b from-orange-50 to-amber-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/events">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#7C2D12' }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 mb-6 flex items-center bg-orange-700 text-yellow-200 px-4 py-2 rounded-md hover:bg-orange-800 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Events
          </motion.button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.cover_image_url && (
            <div className="h-64 md:h-80 relative">
              <img 
                src={event.cover_image_url} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4 font-serif">{event.name}</h1>
              <div className="flex items-center mb-6">
                <div className="flex items-center text-orange-600 mr-6">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    registrationOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {registrationOpen ? 'Registration Open' : 'Registration Closed'}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    eventDatePassed ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {eventDatePassed ? 'Past Event' : 'Upcoming Event'}
                  </div>
                </div>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>

            {registrationOpen ? (
              <div className="mt-10 p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-orange-800 mb-4 font-serif">Registration</h2>
                
                {registrationStatus ? (
                  getStatusBadge()
                ) : showRegistrationForm ? (
                  <RegistrationForm 
                    event={event} 
                    onSubmit={handleRegistrationSubmit} 
                  />
                ) : (
                  <form onSubmit={handleEmailCheck} className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 mb-2">Enter your email to check registration status or register:</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Your email address"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                    >
                      Continue
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Registration Closed</h2>
                <p className="text-gray-700 mb-6">
                  Registration for this event is currently closed.
                  {eventDatePassed && " This event has already concluded."}
                </p>
                
                {eventDatePassed && event.images && event.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {event.images.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden h-40">
                          <img 
                            src={image.url} 
                            alt={image.caption || `Event image ${index + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {eventDatePassed && event.total_participants && (
                  <div className="mt-6 text-center">
                    <p className="text-lg font-medium">
                      Total Participants: <span className="text-orange-600 font-bold">{event.total_participants}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventDetails;