// import React from 'react';
// import { motion } from 'framer-motion';
// import logo from '../assets/logo.png';

// const AboutSection = () => {
//   return (
//     <section id="about" className="py-24 bg-gradient-to-b from-orange-50 to-yellow-100">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl font-bold text-orange-900 inline-block border-b-4 border-yellow-500 pb-2 mb-4">
//             हमारे बारे में <span className="text-orange-700">(About Us)</span>
//           </h2>
//           <p className="text-xl text-orange-800 max-w-2xl mx-auto">
//            "निज भाषा उन्नति अहै, सब उन्नति को मूल।
// बिन निज भाषा-ज्ञान के, मिटत न हिय को सूल।।"
// — भारतेंदु हरिश्चंद्र

//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-orange-500 transform rotate-3 rounded-lg"></div>
//               <img
//                 src={logo}
//                 alt="Hindi Samiti"
//                 className="w-20 h-20 object-contain relative z-10 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
//               />
//               <div className="absolute -bottom-5 -right-5 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center text-orange-900 font-bold text-xl z-20">
//                 Est.<br/>2017
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.7, delay: 0.4 }}
//             className="space-y-6"
//           >
//             <div>
//               <h3 className="text-2xl font-bold text-orange-800 mb-3">Our Foundation</h3>
//               <p className="text-lg text-gray-700">
//                 हिन्दी समिति  2017 में हिन्दी के प्रति निष्ठा और समर्पण रखने वाले विद्यार्थियों के एक उत्साही समूह द्वारा स्थापित की गई। तब से यह समिति परिसर की सबसे सक्रिय सांस्कृतिक संस्था के रूप में विकसित हुई है। हमारी संस्था की नींव हिन्दी साहित्य, कला और सांस्कृतिक विरासत के संरक्षण व प्रसार पर आधारित है, जिसका उद्देश्य विद्यार्थियों में हिन्दी भाषा और भारतीय परम्पराओं के प्रति गौरव एवं आत्मीयता को सुदृढ़ करना है।
//               </p>
//             </div>

//             <div>
//               <h3 className="text-2xl font-bold text-orange-800 mb-3">Mission & Vision</h3>
//               <p className="text-lg text-gray-700">
//                 हमारा उद्देश्य रचनात्मक गतिविधियों, सांस्कृतिक प्रस्तुतियों एवं साहित्यिक आयोजनों के माध्यम से हिन्दी भाषा और भारतीय परम्पराओं के प्रति अनुराग को प्रोत्साहित करना है, जिसके परिणामस्वरूप एक ऐसा सजीव समुदाय निर्मित हो जो भारतीय विरासत की समृद्धता का उल्लासपूर्वक उत्सव मनाए और उसकी गरिमा को यथासंभव संरक्षित एवं संवर्धित करता रहे।
//               </p>
//             </div>

//             <div>
//               <h3 className="text-2xl font-bold text-orange-800 mb-3">What We Do</h3>
//               <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
//                 <li>भारतीय परम्पराओं के अनुरूप सांस्कृतिक पर्वों एवं उत्सवों का सुचारु आयोजन।</li>
//                 <li>हिन्दी साहित्य, लेखन-कौशल एवं भाषिक अभिव्यक्ति पर आधारित कार्यशालाओं का संचालन।</li>
//                 <li>सांस्कृतिक प्रस्तुतियों एवं नाट्य मंचनों के माध्यम से विद्यार्थियों की रचनात्मक प्रतिभा को मंच प्रदान करना।</li>
//                 <li>विद्यार्थियों को भारतीय सांस्कृतिक विरासत से जुड़ने हेतु एक गरिमामय एवं प्रेरक मंच उपलब्ध कराना।</li>
//               </ul>
//             </div>
//           </motion.div>
//         </div>

//         {/* Stats section */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
//           {[
//             { number: "50+", label: "Events Organized" },
//             { number: "1000+", label: "Students Engaged" },
//             { number: "20+", label: "Awards Won" },
//             { number: "12", label: "Years of Excellence" },
//           ].map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 * index }}
//               className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all"
//             >
//               <h4 className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</h4>
//               <p className="text-lg text-orange-900">{stat.label}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;
import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const AboutSection = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-orange-50 to-yellow-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-900 inline-block border-b-4 border-yellow-500 pb-2 mb-4">
            हमारे बारे में <span className="text-orange-700">(About Us)</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-orange-800 max-w-2xl mx-auto px-4">
           "निज भाषा उन्नति अहै, सब उन्नति को मूल।<br className="hidden sm:block"/>
बिन निज भाषा-ज्ञान के, मिटत न हिय को सूल।।"<br/>
<span className="text-sm sm:text-base">— भारतेंदु हरिश्चंद्र</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-start order-1 lg:order-1"
          >
            <div className="relative group w-full max-w-sm mx-auto lg:mx-0">
              {/* Animated background rings */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse delay-200 scale-105"></div>
              
              {/* Main logo container */}
              <div className="relative bg-gradient-to-br from-orange-100 to-yellow-50 p-6 sm:p-8 md:p-10 rounded-full shadow-2xl border-4 border-orange-300 group-hover:border-orange-400 transition-all duration-300 hover:scale-105 aspect-square flex items-center justify-center">
                
                {/* Logo image container */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center shadow-inner overflow-hidden">

                  {/* Logo image */}
                  <img
                    src={logo}
                    alt="Hindi Samiti Logo"
                    className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain relative z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Decorative glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                
                {/* Floating establishment year badge */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-orange-900 font-bold text-xs sm:text-sm shadow-lg animate-bounce">
                  <div className="text-center leading-tight">
                    <div className="text-xs sm:text-sm">Est.</div>
                    <div className="text-xs sm:text-sm">2017</div>
                  </div>
                </div>
                
                {/* Decorative floating dots */}
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-red-400 to-orange-500 rounded-full shadow-md animate-pulse"></div>
                <div className="absolute top-1/4 -right-2 sm:-right-4 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-md animate-pulse delay-300"></div>
                <div className="absolute bottom-1/3 -left-2 sm:-left-4 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-md animate-pulse delay-500"></div>
              </div>
              
              {/* Organization name below logo */}
              <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-center w-full">
                <div className="text-orange-700 font-bold text-base sm:text-lg mb-1">हिन्दी समिति</div>
                <div className="text-orange-600 text-xs sm:text-sm font-medium">Since 2017</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-2 mt-12 lg:mt-0"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 flex items-center">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-3 flex-shrink-0"></span>
                Our Foundation
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                हिन्दी समिति 2017 में हिन्दी के प्रति निष्ठा और समर्पण रखने वाले विद्यार्थियों के एक उत्साही समूह द्वारा स्थापित की गई। तब से यह समिति परिसर की सबसे सक्रिय सांस्कृतिक संस्था के रूप में विकसित हुई है। हमारी संस्था की नींव हिन्दी साहित्य, कला और सांस्कृतिक विरासत के संरक्षण व प्रसार पर आधारित है।
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 flex items-center">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                Mission & Vision
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                हमारा उद्देश्य रचनात्मक गतिविधियों, सांस्कृतिक प्रस्तुतियों एवं साहित्यिक आयोजनों के माध्यम से हिन्दी भाषा और भारतीय परम्पराओं के प्रति अनुराग को प्रोत्साहित करना है, जिसके परिणामस्वरूप एक ऐसा सजीव समुदाय निर्मित हो जो भारतीय विरासत की समृद्धता का उल्लासपूर्वक उत्सव मनाए।
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 flex items-center">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-red-500 to-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                What We Do
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "भारतीय परम्पराओं के अनुरूप सांस्कृतिक पर्वों एवं उत्सवों का सुचारु आयोजन।",
                  "हिन्दी साहित्य, लेखन-कौशल एवं भाषिक अभिव्यक्ति पर आधारित कार्यशालाओं का संचालन।",
                  "सांस्कृतिक प्रस्तुतियों एवं नाट्य मंचनों के माध्यम से विद्यार्थियों की रचनात्मक प्रतिभा को मंच प्रदान करना।",
                  "विद्यार्थियों को भारतीय सांस्कृतिक विरासत से जुड़ने हेतु एक गरिमामय एवं प्रेरक मंच उपलब्ध कराना।"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 sm:mt-3 mr-3 sm:mr-4"></span>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Stats section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20 lg:mt-24">
          {[
            { number: "50+", label: "Events Organized", color: "from-orange-500 to-red-500" },
            { number: "1000+", label: "Students Engaged", color: "from-yellow-500 to-orange-500" },
            { number: "20+", label: "Awards Won", color: "from-red-500 to-orange-600" },
            { number: "12", label: "Years of Excellence", color: "from-orange-600 to-yellow-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-200 hover:border-orange-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 rounded-xl sm:rounded-2xl transition-opacity duration-300`}></div>
              <div className={`w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r ${stat.color} rounded-full mx-auto mb-2 sm:mb-3 group-hover:animate-pulse`}></div>
              <h4 className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </h4>
              <p className="text-xs sm:text-sm lg:text-lg text-orange-900 font-medium leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;