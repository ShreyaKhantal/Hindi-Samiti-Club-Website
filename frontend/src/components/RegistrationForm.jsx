import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import api from '../utils/api';

const RegistrationForm = ({ event, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event && event.form_fields) {
      setFormFields(event.form_fields);
      
      // Initialize form data with empty values
      const initialData = {};
      event.form_fields.forEach(field => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    }
  }, [event]);

  const checkExistingRegistration = async () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }
    
    setErrors({});
    setCheckingEmail(true);
    
    try {
      const response = await api.get(`/registrations/check/${event.id}?email=${email}`);
      if (response.data.exists) {
        setRegistrationStatus(response.data.status);
      } else {
        setRegistrationStatus('new');
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      setRegistrationStatus('new'); // Assume new if error occurs
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
    
    // Clear field-specific error
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
      
      // Clear screenshot error
      if (errors.screenshot) {
        const newErrors = { ...errors };
        delete newErrors.screenshot;
        setErrors(newErrors);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all required fields
    formFields.forEach(field => {
      if (field.is_required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    
    // Validate screenshot
    if (!screenshot) {
      newErrors.screenshot = 'Payment screenshot is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // First upload the screenshot to get its URL
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', screenshot);
      
      const uploadResponse = await api.post('/upload', formDataWithFile);
      const screenshotUrl = uploadResponse.data.url;
      
      // Then submit the registration with the screenshot URL
      const registrationData = {
        event_id: event.id,
        email,
        screenshot_url: screenshotUrl,
        responses: Object.keys(formData).map(fieldId => ({
          field_id: parseInt(fieldId),
          value: formData[fieldId]
        }))
      };
      
      await api.post('/registrations', registrationData);
      
      // Update status after successful registration
      setRegistrationStatus('pending');
      
      if (onSubmit) {
        onSubmit(registrationData);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      setErrors({ submit: 'Failed to submit registration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusMessage = () => {
    switch (registrationStatus) {
      case 'pending':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
          >
            Your registration is pending verification. We'll notify you once it's approved.
          </motion.div>
        );
      case 'verified':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          >
            Your registration has been verified. You're all set for the event!
          </motion.div>
        );
      case 'rejected':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          >
            Your registration was rejected. Please contact us for more information.
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-orange-50 rounded-lg shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">
        {registrationStatus && registrationStatus !== 'new' 
          ? 'Registration Status' 
          : `Register for ${event?.name}`}
      </h2>
      
      {renderStatusMessage()}
      
      {(!registrationStatus || registrationStatus === 'new') && (
        <form onSubmit={handleSubmit}>
          {/* Email verification step */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <div className="flex-grow">
                <label htmlFor="email" className="block text-orange-800 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-orange-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  disabled={checkingEmail || registrationStatus === 'checking'}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="self-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={checkExistingRegistration}
                  disabled={checkingEmail}
                  className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                >
                  {checkingEmail ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : 'Check'}
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Form fields - show only if email check returned 'new' */}
          {registrationStatus === 'new' && (
            <>
              {formFields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={`field-${field.id}`} className="block text-orange-800 font-medium mb-1">
                    {field.label} {field.is_required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.field_type === 'text' && (
                    <input
                      type="text"
                      id={`field-${field.id}`}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`w-full border ${errors[field.id] ? 'border-red-500' : 'border-orange-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  
                  {field.field_type === 'email' && (
                    <input
                      type="email"
                      id={`field-${field.id}`}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={`w-full border ${errors[field.id] ? 'border-red-500' : 'border-orange-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                  
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                  )}
                </div>
              ))}
              
              {/* Payment screenshot upload */}
              <div className="mb-6">
                <label className="block text-orange-800 font-medium mb-1">
                  Payment Screenshot <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 border-dashed ${errors.screenshot ? 'border-red-500' : 'border-orange-300'} rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100 transition-colors`}
                  onClick={() => document.getElementById('screenshot-upload').click()}
                >
                  <input
                    type="file"
                    id="screenshot-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleScreenshotChange}
                  />
                  
                  {screenshotPreview ? (
                    <div className="relative">
                      <img 
                        src={screenshotPreview} 
                        alt="Payment Screenshot" 
                        className="max-h-48 mx-auto rounded"
                      />
                      <div className="mt-2 text-green-600 flex items-center justify-center">
                        <FaCheck className="mr-1" /> Screenshot uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FaCloudUploadAlt className="text-4xl text-orange-500 mx-auto mb-2" />
                      <p className="text-orange-800">Click or drag to upload payment screenshot</p>
                      <p className="text-orange-500 text-sm mt-1">
                        JPG, PNG or GIF • Max 5MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.screenshot && (
                  <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>
                )}
              </div>
              
              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors font-bold disabled:bg-orange-400 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : 'Submit Registration'}
              </motion.button>
              
              {errors.submit && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.submit}</p>
              )}
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;