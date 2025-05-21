import React from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousal.jsx';

const HomeSection = ({ images, introText }) => {
  // Default intro text if none is provided
  const defaultIntro = "हिंदी समिति is the premier Hindi language and cultural club dedicated to promoting and celebrating the rich heritage of Indian culture through literature, art, and cultural events. Join us in our mission to foster appreciation for Hindi language and Indian traditions.";
  
  const displayIntro = introText || defaultIntro;

  return (
    <section id="home" className="relative min-h-screen">
      {/* Background carousel */}
      <ImageCarousel images={images} />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-300 mb-4 font-hindi">
            हिंदी समिति
          </h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '150px' }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-yellow-300 mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-2xl mb-12 leading-relaxed"
          >
            {displayIntro}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <a 
              href="#events" 
              className="bg-yellow-500 text-orange-900 px-8 py-3 rounded-md text-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Explore Events
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "loop" 
        }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center items-start p-1">
          <motion.div 
            className="w-1 h-3 bg-white rounded-full"
            animate={{ 
              y: [0, 8, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HomeSection;