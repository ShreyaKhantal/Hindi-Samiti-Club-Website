import React, { useEffect } from 'react';

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
    justifyContent: 'center',
    marginBottom: '60px',
  },
  contactInfoContainer: {
    maxWidth: '500px',
    width: '100%',
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
    justifyContent: 'center',
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
    contactInfoContainer: {
      width: '100%',
      margin: '0 20px',
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
  useEffect(() => {
    // Add keyframes styles for animations
    addKeyframesToDocument();
  }, []);

  return (
    <section id="contact" style={styles.contactSection}>
      <div style={styles.culturalBorderTop}></div>
      <div style={styles.container}>

        
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