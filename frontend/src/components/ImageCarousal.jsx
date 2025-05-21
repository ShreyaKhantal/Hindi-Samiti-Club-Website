import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default images in case none are provided
  const defaultImages = [
    {
      url: 'https://via.placeholder.com/1200x600/FF5733/FFFFFF?text=Hindi+Samiti+Event+1',
      caption: 'Celebrating Indian Cultural Heritage'
    },
    {
      url: 'https://via.placeholder.com/1200x600/C70039/FFFFFF?text=Hindi+Samiti+Event+2',
      caption: 'Poetry Competition 2024'
    },
    {
      url: 'https://via.placeholder.com/1200x600/900C3F/FFFFFF?text=Hindi+Samiti+Event+3',
      caption: 'Annual Cultural Festival'
    }
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, displayImages.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    // Restart auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
    // Restart auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main image */}
      {displayImages.map((image, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentIndex === index ? 1 : 0,
            scale: currentIndex === index ? 1 : 1.1
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${image.url})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </motion.div>
      ))}

      {/* Caption */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 text-center p-6 bg-gradient-to-t from-black to-transparent"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-3xl font-bold text-yellow-300 mb-2">
          {displayImages[currentIndex].caption}
        </h3>
      </motion.div>

      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-orange-800 transition-colors"
        onClick={prevSlide}
      >
        <FaChevronLeft />
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-orange-800 transition-colors"
        onClick={nextSlide}
      >
        <FaChevronRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center space-x-2">
        {displayImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-yellow-300' : 'bg-gray-400 bg-opacity-50'
            }`}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;