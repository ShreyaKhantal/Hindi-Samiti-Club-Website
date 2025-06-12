import React, { useState, useEffect } from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import axios from 'axios';

const styles = {
  teamSection: {
    padding: '80px 0',
    background: 'linear-gradient(to bottom, #fff6e6, #fff)',
    position: 'relative',
    overflow: 'hidden',
  },
  sectionDecoration: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    backgroundImage: 'url(/src/assets/border-pattern.png)',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'repeat-x',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.8rem',
    marginBottom: '20px',
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
  culturalDecoration: {
    height: '40px',
    backgroundImage: 'url(/src/assets/cultural-pattern.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
    margin: '10px auto 40px',
    opacity: 0.6,
  },
  teamCategory: {
    marginBottom: '60px',
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: '1.8rem',
    marginBottom: '30px',
    color: '#d9531e',
    fontFamily: '"Poppins", sans-serif',
    position: 'relative',
  },
  teamMembersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px',
    justifyContent: 'center',
  },
  presidentContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  presidentCard: {
    maxWidth: '350px',
    transform: 'scale(1.05)',
  },
  teamMemberContainer: {
    transition: 'transform 0.3s ease',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'reveal 0.8s ease forwards',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(217, 83, 30, 0.2)',
    borderRadius: '50%',
    borderTopColor: '#d9531e',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#d9531e',
    fontSize: '1.2rem',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '@media (max-width: 768px)': {
    teamMembersGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
    },
    sectionTitle: {
      fontSize: '2.2rem',
    },
    categoryTitle: {
      fontSize: '1.5rem',
    },
  },
  '@media (max-width: 480px)': {
    teamMembersGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
    },
    teamSection: {
      padding: '50px 0',
    },
    sectionTitle: {
      fontSize: '2rem',
    },
  },
};

// Add keyframes styles to document
const addKeyframesToDocument = () => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .team-member-container:hover {
        transform: translateY(-10px);
      }
      
      .team-member-container:nth-child(1) { animation-delay: 0.1s; }
      .team-member-container:nth-child(2) { animation-delay: 0.2s; }
      .team-member-container:nth-child(3) { animation-delay: 0.3s; }
      .team-member-container:nth-child(4) { animation-delay: 0.4s; }
      .team-member-container:nth-child(5) { animation-delay: 0.5s; }
      .team-member-container:nth-child(6) { animation-delay: 0.6s; }
      .team-member-container:nth-child(7) { animation-delay: 0.7s; }
      .team-member-container:nth-child(8) { animation-delay: 0.8s; }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
};

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Add keyframes styles for animations
    addKeyframesToDocument();
    
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/team-members');
        setTeamMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load team members. Please try again later.');
        setLoading(false);
        console.error('Error fetching team members:', err);
      }
    };

    fetchTeamMembers();
  }, []);

  // Group team members by role
  const getFacultyCoordinators = () => {
    return teamMembers.filter(member => 
      member.role.toLowerCase().includes('faculty') || 
      member.role.toLowerCase().includes('coordinator')
    );
  };

  const getPresident = () => {
    return teamMembers.filter(member => 
      member.role.toLowerCase().includes('president')
    );
  };

  const getCoreTeam = () => {
    return teamMembers.filter(member => 
      member.role.toLowerCase().includes('core') || 
      (
        !member.role.toLowerCase().includes('faculty') && 
        !member.role.toLowerCase().includes('coordinator') && 
        !member.role.toLowerCase().includes('president') && 
        !member.role.toLowerCase().includes('developer')
      )
    );
  };

  const getDevelopers = () => {
    return teamMembers.filter(member => 
      member.role.toLowerCase().includes('developer')
    );
  };

  if (loading) {
    return (
      <section id="team" style={styles.teamSection}>
        <div style={styles.sectionDecoration}></div>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>
            Our Team
            <div style={styles.titleDecoration}></div>
          </h2>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="team" style={styles.teamSection}>
        <div style={styles.sectionDecoration}></div>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>
            Our Team
            <div style={styles.titleDecoration}></div>
          </h2>
          <div style={styles.errorMessage}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" style={styles.teamSection}>
      <div style={styles.sectionDecoration}></div>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>
          Our Team
          <div style={styles.titleDecoration}></div>
        </h2>
        <div style={styles.culturalDecoration}></div>
        
        {/* Faculty Coordinators */}
        {getFacultyCoordinators().length > 0 && (
          <div style={styles.teamCategory}>
            <h3 style={styles.categoryTitle}>Faculty Coordinators</h3>
            <div style={styles.teamMembersGrid}>
              {getFacultyCoordinators().map((member, index) => (
                <div key={member.id} className="team-member-container" style={{
                  ...styles.teamMemberContainer,
                  animationDelay: `${0.1 * (index % 8)}s`
                }}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* President */}
        {getPresident().length > 0 && (
          <div style={styles.teamCategory}>
            <h3 style={styles.categoryTitle}>President</h3>
            <div style={styles.presidentContainer}>
              {getPresident().map(member => (
                <div key={member.id} style={styles.presidentCard}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Core Team */}
        {getCoreTeam().length > 0 && (
          <div style={styles.teamCategory}>
            <h3 style={styles.categoryTitle}>Core Team</h3>
            <div style={styles.teamMembersGrid}>
              {getCoreTeam().map((member, index) => (
                <div key={member.id} className="team-member-container" style={{
                  ...styles.teamMemberContainer,
                  animationDelay: `${0.1 * (index % 8)}s`
                }}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Developers */}
        {getDevelopers().length > 0 && (
          <div style={styles.teamCategory}>
            <h3 style={styles.categoryTitle}>Developers</h3>
            <div style={styles.teamMembersGrid}>
              {getDevelopers().map((member, index) => (
                <div key={member.id} className="team-member-container" style={{
                  ...styles.teamMemberContainer,
                  animationDelay: `${0.1 * (index % 8)}s`
                }}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;