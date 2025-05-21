import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import EventCard from '../components/EventCard';
import api from '../utils/api';

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events?limit=3');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Sample events for fallback if API fails
  const sampleEvents = [
    {
      id: 1,
      name: 'Kavya Sandhya 2025',
      date: '2025-06-15',
      description: 'An evening of Hindi poetry featuring renowned poets and student performances.',
      is_active: true,
      cover_image_url: 'https://via.placeholder.com/400x200/FF9800/FFFFFF?text=Kavya+Sandhya'
    },
    {
      id: 2,
      name: 'Hindi Diwas Celebration',
      date: '2025-09-14',
      description: 'Join us for a day-long celebration of Hindi language with competitions and cultural performances.',
      is_active: true,
      cover_image_url: 'https://via.placeholder.com/400x200/FF5722/FFFFFF?text=Hindi+Diwas'
    },
    {
      id: 3,
      name: 'Natya Utsav',
      date: '2025-07-25',
      description: 'A theatrical festival showcasing Hindi dramas and plays performed by students.',
      is_active: true,
      cover_image_url: 'https://via.placeholder.com/400x200/E91E63/FFFFFF?text=Natya+Utsav'
    }
  ];

  // Use sample events as fallback if API failed
  const displayEvents = events.length > 0 ? events : (error ? sampleEvents : []);

  return (
    <section id="events" className="py-24 bg-gradient-to-b from-yellow-100 to-orange-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-orange-900 inline-block border-b-4 border-yellow-500 pb-2 mb-4">
            आयोजन <span className="text-orange-700">(Events)</span>
          </h2>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto">
            Explore our exciting cultural events and activities
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin rounded-full border-8 border-orange-200 border-t-8 border-t-orange-600"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <span className="text-orange-600 text-sm font-medium">Loading</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="text-center text-orange-800 mb-6">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {displayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
                >
                  View All Events <FaArrowRight />
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;