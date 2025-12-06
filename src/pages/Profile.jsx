import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { useAppContext } from '../store/AppContext';
import '../styles/profile.css';

function Profile() {
  const { user, medicalHistory, updateProfile, updateMedicalHistory, logout, isAuthenticated } = useAuthContext();
  const { elderlyMode, toggleElderlyMode } = useAppContext();
  const navigate = useNavigate();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Populate form with existing data
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
      }
      
      if (medicalHistory) {
        setConditions(medicalHistory.conditions?.join(', ') || '');
        setAllergies(medicalHistory.allergies?.join(', ') || '');
        setCurrentMedications(medicalHistory.currentMedications?.join(', ') || '');
      }
    }
  }, [isAuthenticated, user, medicalHistory, navigate]);
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSuccessMessage('Profile updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleMedicalSubmit = (e) => {
    e.preventDefault();
    
    // Parse comma-separated values into arrays
    const conditionsArray = conditions
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
      
    const allergiesArray = allergies
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
      
    const medicationsArray = currentMedications
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    updateMedicalHistory({
      conditions: conditionsArray,
      allergies: allergiesArray,
      currentMedications: medicationsArray
    });
    
    setSuccessMessage('Medical history updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <div className="profile-section">
        <h2>Personal Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <button type="submit" className="primary-button">Update Profile</button>
        </form>
      </div>
      
      <div className="profile-section">
        <h2>Medical History</h2>
        <p className="section-description">
          This information will be used to provide personalized medicine recommendations and warnings.
        </p>
        
        <form onSubmit={handleMedicalSubmit}>
          <div className="form-group">
            <label htmlFor="conditions">Medical Conditions</label>
            <textarea
              id="conditions"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="Enter your medical conditions (separated by commas)"
              rows="3"
            />
            <small>Example: diabetes, hypertension, asthma</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Enter your allergies (separated by commas)"
              rows="3"
            />
            <small>Example: penicillin, sulfa drugs, peanuts</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="medications">Current Medications</label>
            <textarea
              id="medications"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Enter your current medications (separated by commas)"
              rows="3"
            />
            <small>Example: lisinopril, metformin, albuterol</small>
          </div>
          
          <button type="submit" className="primary-button">Update Medical History</button>
        </form>
      </div>
      
      
      <div className="profile-section">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Profile;