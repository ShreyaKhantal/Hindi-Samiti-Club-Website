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
    maxWidth: '1400px', // Increased for better spacing
    margin: '0 auto',
    padding: '0 40px', // Increased padding
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.8rem',
    marginBottom: '60px', // Increased margin
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
    marginBottom: '80px', // Consistent spacing between categories
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: '2rem', // Slightly larger
    marginBottom: '50px', // Increased margin
    color: '#d9531e',
    fontFamily: '"Poppins", sans-serif',
    position: 'relative',
    fontWeight: '600',
  },
  // Special styling for single member (President)
  presidentContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  presidentGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  presidentCard: {
    maxWidth: '380px',
    transform: 'scale(1.1)', // Slightly larger for emphasis
    boxShadow: '0 20px 40px rgba(217, 83, 30, 0.15)',
  },
  // Grid for Faculty Coordinators (typically 2-3 people)
  facultyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    justifyContent: 'center',
    maxWidth: '1000px', // Limit width for better centering
    margin: '0 auto',
  },
  // Grid for Core Team (larger group)
  coreTeamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '35px',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  // Grid for Developers
  developersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '35px',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  // Generic grid fallback
  teamMembersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '35px',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  teamMemberContainer: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'reveal 0.8s ease forwards',
    width: '100%',
    maxWidth: '320px', // Consistent max width
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '6px solid rgba(217, 83, 30, 0.2)',
    borderRadius: '50%',
    borderTopColor: '#d9531e',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#8b2f00',
    fontSize: '1.1rem',
    fontFamily: '"Poppins", sans-serif',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#d9531e',
    fontSize: '1.3rem',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Poppins", sans-serif',
    fontWeight: '500',
  },
  // Responsive breakpoints
  '@media (max-width: 1200px)': {
    container: {
      maxWidth: '1200px',
      padding: '0 30px',
    },
    facultyGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '0 20px',
    },
    sectionTitle: {
      fontSize: '2.2rem',
      marginBottom: '40px',
    },
    categoryTitle: {
      fontSize: '1.6rem',
      marginBottom: '30px',
    },
    teamCategory: {
      marginBottom: '60px',
    },
    facultyGrid: {
      gridTemplateColumns: '1fr',
      gap: '30px',
    },
    coreTeamGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
    },
    developersGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
    },
    teamMembersGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
    },
    presidentCard: {
      transform: 'scale(1.05)',
      maxWidth: '320px',
    },
  },
  '@media (max-width: 480px)': {
    teamSection: {
      padding: '60px 0',
    },
    container: {
      padding: '0 15px',
    },
    sectionTitle: {
      fontSize: '2rem',
      marginBottom: '30px',
    },
    categoryTitle: {
      fontSize: '1.4rem',
      marginBottom: '25px',
    },
    teamCategory: {
      marginBottom: '50px',
    },
    facultyGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    coreTeamGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    developersGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    teamMembersGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    presidentCard: {
      transform: 'scale(1)',
      maxWidth: '280px',
    },
    teamMemberContainer: {
      maxWidth: '100%',
    },
  },
};

// Enhanced keyframes with better animations
const addKeyframesToDocument = () => {
  if (typeof window !== 'undefined') {
    const existingStyle = document.getElementById('team-section-animations');
    if (existingStyle) return; // Prevent duplicate styles
    
    const style = document.createElement('style');
    style.id = 'team-section-animations';
    style.type = 'text/css';
    style.innerHTML = `
      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .team-member-container:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 35px rgba(217, 83, 30, 0.2);
      }
      
      /* Staggered animation delays */
      .team-member-container:nth-child(1) { animation-delay: 0.1s; }
      .team-member-container:nth-child(2) { animation-delay: 0.15s; }
      .team-member-container:nth-child(3) { animation-delay: 0.2s; }
      .team-member-container:nth-child(4) { animation-delay: 0.25s; }
      .team-member-container:nth-child(5) { animation-delay: 0.3s; }
      .team-member-container:nth-child(6) { animation-delay: 0.35s; }
      .team-member-container:nth-child(7) { animation-delay: 0.4s; }
      .team-member-container:nth-child(8) { animation-delay: 0.45s; }
      .team-member-container:nth-child(9) { animation-delay: 0.5s; }
      .team-member-container:nth-child(10) { animation-delay: 0.55s; }
      .team-member-container:nth-child(11) { animation-delay: 0.6s; }
      .team-member-container:nth-child(12) { animation-delay: 0.65s; }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
};

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
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

  // Helper function to get grid style based on role and count
  const getGridStyle = (role, count) => {
    const roleKey = role.toLowerCase();
    
    if (roleKey.includes('president')) {
      return styles.presidentGrid;
    } else if (roleKey.includes('faculty') || roleKey.includes('coordinator')) {
      return styles.facultyGrid;
    } else if (roleKey.includes('core')) {
      return styles.coreTeamGrid;
    } else if (roleKey.includes('developer')) {
      return styles.developersGrid;
    }
    
    return styles.teamMembersGrid;
  };

  // Group team members by role with better organization
  const getTeamMembersByRole = () => {
    const roles = {
      facultyCoordinators: [],
      president: [],
      coreTeam: [],
      developers: []
    };

    teamMembers.forEach(member => {
      const role = member.role.toLowerCase();
      
      if (role.includes('faculty') || role.includes('coordinator')) {
        roles.facultyCoordinators.push(member);
      } else if (role.includes('president')) {
        roles.president.push(member);
      } else if (role.includes('developer')) {
        roles.developers.push(member);
      } else {
        roles.coreTeam.push(member);
      }
    });

    return roles;
  };

  const renderTeamCategory = (title, members, categoryKey) => {
    if (members.length === 0) return null;

    const gridStyle = getGridStyle(categoryKey, members.length);
    const isPresident = categoryKey.toLowerCase().includes('president');

    return (
      <div style={styles.teamCategory} key={categoryKey}>
        <h3 style={styles.categoryTitle}>{title}</h3>
        <div style={gridStyle}>
          {members.map((member, index) => (
            <div
              key={`${member.id || member.name}-${index}`}
              className="team-member-container"
              style={{
                ...styles.teamMemberContainer,
                ...(isPresident ? styles.presidentCard : {})
              }}
            >
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section style={styles.teamSection}>
        <div style={styles.sectionDecoration}></div>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>
            Our Team
            <div style={styles.titleDecoration}></div>
          </h2>
          <div style={styles.culturalDecoration}></div>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={styles.teamSection}>
        <div style={styles.sectionDecoration}></div>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>
            Our Team
            <div style={styles.titleDecoration}></div>
          </h2>
          <div style={styles.culturalDecoration}></div>
          <div style={styles.errorMessage}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const teamRoles = getTeamMembersByRole();

  return (
    <section style={styles.teamSection}>
      <div style={styles.sectionDecoration}></div>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>
          Our Team
          <div style={styles.titleDecoration}></div>
        </h2>
        <div style={styles.culturalDecoration}></div>
        
        {/* Render team categories in hierarchical order */}
        {renderTeamCategory("Faculty Coordinators", teamRoles.facultyCoordinators, "faculty")}
        {renderTeamCategory("President", teamRoles.president, "president")}
        {renderTeamCategory("Core Team", teamRoles.coreTeam, "core")}
        {renderTeamCategory("Developers", teamRoles.developers, "developers")}
      </div>
    </section>
  );
};

export default TeamSection;