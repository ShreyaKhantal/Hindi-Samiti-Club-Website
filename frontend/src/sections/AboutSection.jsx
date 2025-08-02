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
           "निज भाषा उन्नति अहै, सब उन्नति को मूल।
बिन निज भाषा-ज्ञान के, मिटत न हिय को सूल।।"
— भारतेंदु हरिश्चंद्र

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
                src="frontend\src\assets\logo.png"
                alt="Hindi Samiti"
                className="relative z-10 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-5 -right-5 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center text-orange-900 font-bold text-xl z-20">
                Est.<br/>2017
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
                हिन्दी समिति  2017 में हिन्दी के प्रति निष्ठा और समर्पण रखने वाले विद्यार्थियों के एक उत्साही समूह द्वारा स्थापित की गई। तब से यह समिति परिसर की सबसे सक्रिय सांस्कृतिक संस्था के रूप में विकसित हुई है। हमारी संस्था की नींव हिन्दी साहित्य, कला और सांस्कृतिक विरासत के संरक्षण व प्रसार पर आधारित है, जिसका उद्देश्य विद्यार्थियों में हिन्दी भाषा और भारतीय परम्पराओं के प्रति गौरव एवं आत्मीयता को सुदृढ़ करना है।
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">Mission & Vision</h3>
              <p className="text-lg text-gray-700">
                हमारा उद्देश्य रचनात्मक गतिविधियों, सांस्कृतिक प्रस्तुतियों एवं साहित्यिक आयोजनों के माध्यम से हिन्दी भाषा और भारतीय परम्पराओं के प्रति अनुराग को प्रोत्साहित करना है, जिसके परिणामस्वरूप एक ऐसा सजीव समुदाय निर्मित हो जो भारतीय विरासत की समृद्धता का उल्लासपूर्वक उत्सव मनाए और उसकी गरिमा को यथासंभव संरक्षित एवं संवर्धित करता रहे।
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-orange-800 mb-3">What We Do</h3>
              <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>भारतीय परम्पराओं के अनुरूप सांस्कृतिक पर्वों एवं उत्सवों का सुचारु आयोजन।</li>
                <li>हिन्दी साहित्य, लेखन-कौशल एवं भाषिक अभिव्यक्ति पर आधारित कार्यशालाओं का संचालन।</li>
                <li>सांस्कृतिक प्रस्तुतियों एवं नाट्य मंचनों के माध्यम से विद्यार्थियों की रचनात्मक प्रतिभा को मंच प्रदान करना।</li>
                <li>विद्यार्थियों को भारतीय सांस्कृतिक विरासत से जुड़ने हेतु एक गरिमामय एवं प्रेरक मंच उपलब्ध कराना।</li>
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