import React from 'react';
import { motion } from 'framer-motion';

const TeamMemberCard = ({ member }) => {
  const {
    name,
    role,
    image_url,
    description
  } = member;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex flex-col items-center"
    >
      <div className="relative mb-4 group">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
          <img 
            src={image_url || 'https://via.placeholder.com/300/FF9800/FFFFFF?text=Member'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute -bottom-2 left-0 right-0 mx-auto w-36 bg-orange-600 text-center text-white py-1 rounded-full shadow-md">
          <p className="text-sm font-medium">{role}</p>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-orange-900 mb-1">{name}</h3>
        {description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileHover={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="text-gray-700 text-sm max-w-xs mx-auto mt-2">{description}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;