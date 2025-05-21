import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = ({ contactInfo }) => {
  const {
    instagram = "https://instagram.com/hindi_samiti",
    facebook = "https://facebook.com/hindi_samiti",
    twitter = "https://twitter.com/hindi_samiti",
    email = "hindi.samiti@college.edu",
    phone = "+91 9876543210"
  } = contactInfo || {};

  return (
    <footer className="bg-gradient-to-br from-orange-900 to-red-900 text-white py-8" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">हिंदी समिति</h3>
            <p className="text-center md:text-left mb-4">
              Promoting and celebrating Indian culture and Hindi language through art, literature, and events.
            </p>
            <div className="flex space-x-4 text-2xl">
              <motion.a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#E1306C' }}
                className="hover:text-yellow-300 transition-colors"
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href={facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#4267B2' }}
                className="hover:text-yellow-300 transition-colors"
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#1DA1F2' }}
                className="hover:text-yellow-300 transition-colors"
              >
                <FaTwitter />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">संपर्क करें</h3>
            <div className="flex items-center mb-3">
              <FaEnvelope className="mr-2" />
              <a href={`mailto:${email}`} className="hover:text-yellow-300 transition-colors">{email}</a>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2" />
              <a href={`tel:${phone}`} className="hover:text-yellow-300 transition-colors">{phone}</a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end"
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">अनुसरण करें</h3>
            <p className="text-center md:text-right mb-4">
              Subscribe to our newsletter for updates on upcoming events and activities.
            </p>
            <div className="w-full flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="p-2 rounded-l-md flex-grow text-gray-800 focus:outline-none"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-orange-900 font-medium px-4 py-2 rounded-r-md hover:bg-yellow-400 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 pt-6 border-t border-orange-800 text-center">
          <p>© {new Date().getFullYear()} हिंदी समिति. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;