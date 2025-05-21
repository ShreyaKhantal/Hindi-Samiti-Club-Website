import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const {
    id,
    name,
    date,
    description,
    cover_image_url,
    is_active
  } = event;

  // Format the date
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');
  
  // Create a shorter description for the card
  const shortDescription = description && description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={cover_image_url || 'https://via.placeholder.com/400x200/FF9800/FFFFFF?text=Event'}
          alt={name}
          className="w-full h-full object-cover"
        />
        {!is_active && (
          <div className="absolute top-0 right-0 bg-gray-800 text-white px-3 py-1 m-2 rounded-md text-sm">
            Completed
          </div>
        )}
        {is_active && (
          <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 m-2 rounded-md text-sm">
            Active
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-orange-900">{name}</h3>
          <span className="text-sm text-orange-700 font-medium">{formattedDate}</span>
        </div>
        
        <p className="text-gray-700 mb-4">{shortDescription}</p>
        
        <Link to={`/events/${id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            {is_active ? 'Register Now' : 'View Details'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;