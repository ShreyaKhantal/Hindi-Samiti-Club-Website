import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { fetchPublicEvents } from '../utils/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'past'
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchPublicEvents();
        console.log('Events data:', data); // Debug log
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Helper function to check if event is currently active
  const isEventCurrentlyActive = (event) => {
    if (!event.is_active) return false;
    
    const today = new Date();
    const eventDate = new Date(event.date);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    
    if (filter === 'active') {
      return isEventCurrentlyActive(event);
    } else if (filter === 'past') {
      return !isEventCurrentlyActive(event);
    }
    
    return true;
  });

  return (
    <div className="bg-gradient-to-b from-orange-50 to-amber-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-6 font-serif">Our Events</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore all cultural events organized by Hindi Samiti that celebrate our rich heritage and traditions.
          </p>
        </div>

        <div className="mb-8 flex justify-center space-x-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === 'all' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-100'
            }`}
          >
            All Events
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === 'active' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-100'
            }`}
          >
            Active Events
          </button>
          <button 
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === 'past' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-100'
            }`}
          >
            Past Events
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => handleEventClick(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No events found in this category.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;