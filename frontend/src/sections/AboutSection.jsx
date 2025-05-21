import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-orange-50 to-yellow-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-orange-900 inline-block border-b-4 border-yellow-500 pb-2 mb-4">
            हमारे बारे में <span className="text-orange-700">(About Us)</span>
          </h2>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto">
            Learn about our journey, mission and cultural heritage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 transform rotate-3 rounded-lg"></div>
              <img
                src="https://via.placeholder.com/600x400/FF9800/FFFFFF?text=Hindi+Samiti"
                alt="Hindi Samiti"
                className="relative z-10 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-5 -right-5 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center text-orange-900 font-bold text-xl z-20">
                Est.<br/>2010
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">Our Foundation</h3>
              <p className="text-lg text-gray-700">
                Founded in 2010 by a passionate group of Hindi enthusiasts, Hindi Samiti has grown into the most active cultural club on campus. Our foundation rests on promoting Hindi literature, arts, and cultural heritage among students.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">Mission & Vision</h3>
              <p className="text-lg text-gray-700">
                We aim to foster appreciation for Hindi language and Indian cultural traditions through creative activities, performances, and literary events. Our vision is to create a vibrant community that celebrates the richness of Indian heritage.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">What We Do</h3>
              <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>Organize cultural festivals celebrating Indian traditions</li>
                <li>Host Hindi poetry and storytelling competitions</li>
                <li>Arrange workshops on Hindi literature and writing</li>
                <li>Conduct cultural performances and theatrical productions</li>
                <li>Provide a platform for students to explore Indian heritage</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
          {[
            { number: "50+", label: "Events Organized" },
            { number: "1000+", label: "Students Engaged" },
            { number: "20+", label: "Awards Won" },
            { number: "12", label: "Years of Excellence" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <h4 className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</h4>
              <p className="text-lg text-orange-900">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;