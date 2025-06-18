import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // For sticky navbar effect
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // For active section highlighting
      const sections = ['home', 'about', 'events', 'team', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', link: '#home', section: 'home' },
    { name: 'About', link: '#about', section: 'about' },
    { name: 'Events', link: '#events', section: 'events' },
    { name: 'Team', link: '#team', section: 'team' },
    { name: 'Contact', link: '#contact', section: 'contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-orange-900 bg-opacity-90 shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <img src={logo} alt="Hindi Samiti Logo" className="h-12 mr-3" />
          <h1 className="text-xl font-bold text-yellow-300 hidden md:block">हिंदी समिति</h1>
        </motion.div>

        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <motion.a
              key={item.section}
              href={item.link}
              className={`text-lg font-medium transition-all duration-300 hover:text-yellow-300 ${
                activeSection === item.section 
                  ? 'text-yellow-300 border-b-2 border-yellow-300' 
                  : 'text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </motion.a>
          ))}
          <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#7C2D12' }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-700 text-yellow-200 px-4 py-1 rounded-md hover:bg-orange-800 transition-all"
            >
              All Events
            </motion.button>
          </Link>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-white text-2xl"
            onClick={() => document.getElementById('mobileMenu').classList.toggle('hidden')}
          >
            ☰
          </motion.button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div id="mobileMenu" className="hidden md:hidden bg-orange-900 bg-opacity-95 w-full absolute top-full left-0 py-2 shadow-lg">
        {navItems.map((item) => (
          <a
            key={item.section}
            href={item.link}
            className={`block py-2 px-4 text-lg ${
              activeSection === item.section ? 'text-yellow-300' : 'text-white'
            }`}
            onClick={() => document.getElementById('mobileMenu').classList.add('hidden')}
          >
            {item.name}
          </a>
        ))}
        <Link 
          to="/events"
          className="block py-2 px-4 text-lg text-white"
          onClick={() => document.getElementById('mobileMenu').classList.add('hidden')}
        >
          All Events
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;