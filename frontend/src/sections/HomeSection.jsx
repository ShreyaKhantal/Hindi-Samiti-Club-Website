import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousal.jsx';
import { fetchPublicImages, fetchPublicIntro } from '../utils/api.js';

const HomeSection = () => {
  const [images, setImages] = useState([]);
  const [introText, setIntroText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default intro text if none is provided
  const defaultIntro = "हिन्दी समिति is the premier Hindi language and cultural club dedicated to promoting and celebrating the rich heritage of Indian culture through literature, art, and cultural events. Join us in our mission to foster appreciation for Hindi language and Indian traditions.";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch both intro and images concurrently
        const [introResponse, imagesResponse] = await Promise.all([
          fetchPublicIntro().catch(err => {
            return { text: '' };
          }),
          fetchPublicImages().catch(err => {
            return [];
          })
        ]);
        
        // Set intro text
        if (introResponse && introResponse.text) {
          setIntroText(introResponse.text);
        } else {
          setIntroText(defaultIntro);
        }
        
        // Transform images data for ImageCarousel component
        if (imagesResponse && Array.isArray(imagesResponse) && imagesResponse.length > 0) {
          const transformedImages = imagesResponse.map(img => {
            // Get the API base URL from your api.js configuration
            // Assuming your Flask backend is running on port 5000
            const API_BASE_URL = 'http://localhost:5000'; // Adjust this to match your Flask server
            
            // Convert relative URL to full backend URL
            let fullUrl;
            if (img.url.startsWith('http')) {
              fullUrl = img.url;
            } else {
              // Remove leading slash if present and add API base URL
              const cleanUrl = img.url.startsWith('/') ? img.url.substring(1) : img.url;
              fullUrl = `${API_BASE_URL}/${cleanUrl}`;
            }
            
            return {
              url: fullUrl,
              caption: img.caption
            };
          });
          
          setImages(transformedImages);
        } else {
          setImages([]);
        }
        
      } catch (err) {
        setError('Failed to load homepage content');
        // Use defaults on error
        setIntroText(defaultIntro);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-900 to-red-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </section>
    );
  }

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
            हिन्दी समिति
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