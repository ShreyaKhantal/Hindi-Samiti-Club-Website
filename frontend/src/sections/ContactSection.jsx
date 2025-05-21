import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

// Inline styles object
const styles = {
  contactSection: {
    padding: '80px 0',
    backgroundColor: '#fff9ef',
    position: 'relative',
  },
  culturalBorderTop: {
    height: '15px',
    backgroundImage: 'url(/src/assets/border-pattern.png)',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'repeat-x',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  culturalBorderBottom: {
    height: '15px',
    backgroundImage: 'url(/src/assets/border-pattern.png)',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'repeat-x',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'rotate(180deg)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.8rem',
    marginBottom: '50px',
    color: '#8b2f00',
    fontFamily: '"Poppins", sans-serif',
    position: 'relative',
    paddingBottom: '15px',
  },
  titleDecoration: {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: 'linear-gradient(to right, #d9531e, #f49d37)',
  },
  contactContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    marginBottom: '60px',
  },
  contactFormContainer: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f8e3cb',
  },
  contactInfoContainer: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f8e3cb',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '25px',
    color: '#d9531e',
    fontFamily: '"Poppins", sans-serif',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#8b2f00',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #f0d4b4',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #f0d4b4',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
    resize: 'vertical',
  },
  submitButton: {
    backgroundColor: '#d9531e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 25px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: '500',
    display: 'block',
    margin: '0 auto',
  },
  submitButtonHover: {
    backgroundColor: '#b83d10',
  },
  formStatus: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  success: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    color: '#2e7d32',
  },
  error: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    color: '#c62828',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(217, 83, 30, 0.2)',
    borderRadius: '50%',
    borderTopColor: '#d9531e',
    animation: 'spin 1s linear infinite',
    margin: '40px auto',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#d9531e',
    padding: '20px',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  socialMedia: {
    textAlign: 'center',
  },
  heading4: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    color: '#8b2f00',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  socialIcon: {
    fontSize: '28px',
    color: '#d9531e',
    transition: 'color 0.3s, transform 0.3s',
  },
  socialIconHover: {
    color: '#f49d37',
    transform: 'translateY(-5px)',
  },
  directContact: {
    marginTop: '20px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  contactIcon: {
    fontSize: '20px',
    color: '#d9531e',
    marginRight: '15px',
  },
  contactLink: {
    color: '#8b2f00',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  contactLinkHover: {
    color: '#d9531e',
    textDecoration: 'underline',
  },
  locationInfo: {
    textAlign: 'center',
    padding: '30px 0',
  },
  culturalDecorationBottom: {
    height: '30px',
    backgroundImage: 'url(/src/assets/cultural-pattern.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
    margin: '30px auto 0',
    opacity: '0.6',
  },
  '@media (max-width: 768px)': {
    contactContent: {
      flexDirection: 'column',
    },
    contactFormContainer: {
      width: '100%',
    },
    contactInfoContainer: {
      width: '100%',
    },
    sectionTitle: {
      fontSize: '2.2rem',
    },
  },
};

// Add keyframes styles to document
const addKeyframesToDocument = () => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      input:focus, textarea:focus {
        border-color: #d9531e;
        box-shadow: 0 0 0 2px rgba(217, 83, 30, 0.2);
      }
      
      .submit-button:hover {
        background-color: #b83d10;
      }
      
      .social-icon:hover {
        color: #f49d37;
        transform: translateY(-5px);
      }
      
      .contact-link:hover {
        color: #d9531e;
        text-decoration: underline;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
};

const ContactSection = () => {
  const [contactInfo, setContactInfo] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    // Add keyframes styles for animations
    addKeyframesToDocument();
    
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/contact-info');
        setContactInfo(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact information:', err);
        setError('Failed to load contact information. Please try again later.');
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormStatus('sending');
      // Note: This would be an actual API endpoint in production
      await axios.post('/api/contact-message', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setFormStatus('error');
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }
  };

  const renderSocialIcon = (platform, url) => {
    if (!url) return null;

    let Icon;
    switch (platform) {
      case 'instagram':
        Icon = FaInstagram;
        break;
      case 'facebook':
        Icon = FaFacebook;
        break;
      case 'twitter':
        Icon = FaTwitter;
        break;
      case 'email':
        Icon = FaEnvelope;
        break;
      case 'phone':
        Icon = FaPhone;
        break;
      default:
        return null;
    }

    let href = url;
    if (platform === 'email' && !url.startsWith('mailto:')) {
      href = `mailto:${url}`;
    } else if (platform === 'phone' && !url.startsWith('tel:')) {
      href = `tel:${url}`;
    } else if (!url.startsWith('http://') && !url.startsWith('https://') && platform !== 'email' && platform !== 'phone') {
      href = `https://${url}`;
    }

    return (
      <a 
        href={href} 
        target={platform !== 'email' && platform !== 'phone' ? '_blank' : ''} 
        rel="noopener noreferrer"
        className="social-icon"
        aria-label={platform}
        style={styles.socialIcon}
      >
        <Icon />
      </a>
    );
  };

  return (
    <section id="contact" style={styles.contactSection}>
      <div style={styles.culturalBorderTop}></div>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>
          Get In Touch
          <div style={styles.titleDecoration}></div>
        </h2>
        
        <div style={styles.contactContent}>
          <div style={styles.contactFormContainer}>
            <h3 style={styles.heading}>Send Us A Message</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="message" style={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={formStatus === 'sending'}
                style={{
                  ...styles.submitButton,
                  ...(hoveredButton ? styles.submitButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              
              {formStatus === 'success' && (
                <div style={{...styles.formStatus, ...styles.success}}>
                  Message sent successfully!
                </div>
              )}
              
              {formStatus === 'error' && (
                <div style={{...styles.formStatus, ...styles.error}}>
                  Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
          
          <div style={styles.contactInfoContainer}>
            <h3 style={styles.heading}>Connect With Us</h3>
            {loading ? (
              <div style={styles.loadingSpinner}></div>
            ) : error ? (
              <div style={styles.errorMessage}>{error}</div>
            ) : (
              <div style={styles.contactDetails}>
                <div style={styles.socialMedia}>
                  {(contactInfo.instagram || contactInfo.facebook || contactInfo.twitter) && (
                    <div>
                      <h4 style={styles.heading4}>Follow Us</h4>
                      <div style={styles.socialIcons}>
                        {renderSocialIcon('instagram', contactInfo.instagram)}
                        {renderSocialIcon('facebook', contactInfo.facebook)}
                        {renderSocialIcon('twitter', contactInfo.twitter)}
                      </div>
                    </div>
                  )}
                </div>
                
                {(contactInfo.email || contactInfo.phone) && (
                  <div style={styles.directContact}>
                    <h4 style={styles.heading4}>Contact Us</h4>
                    {contactInfo.email && (
                      <div style={styles.contactItem}>
                        <FaEnvelope style={styles.contactIcon} />
                        <a 
                          href={`mailto:${contactInfo.email}`} 
                          className="contact-link"
                          style={styles.contactLink}
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    )}
                    
                    {contactInfo.phone && (
                      <div style={styles.contactItem}>
                        <FaPhone style={styles.contactIcon} />
                        <a 
                          href={`tel:${contactInfo.phone}`}
                          className="contact-link"
                          style={styles.contactLink}
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.locationInfo}>
          <h3 style={styles.heading}>Find Us</h3>
          <p>Hindi Samiti, Cultural Club</p>
          <p>Your College Name</p>
          <div style={styles.culturalDecorationBottom}></div>
        </div>
      </div>
      <div style={styles.culturalBorderBottom}></div>
    </section>
  );
};

export default ContactSection;