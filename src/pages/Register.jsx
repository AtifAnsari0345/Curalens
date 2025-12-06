import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { useToast } from '../components/Toast';
import '../styles/auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // Simple password strength calculation
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains numbers or special chars
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
    
    // Set feedback based on strength
    if (strength < 25) {
      setPasswordFeedback('Weak');
    } else if (strength < 75) {
      setPasswordFeedback('Moderate');
    } else {
      setPasswordFeedback('Strong');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      setIsLoading(false);
      return;
    }
    
    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      showToast('Please choose a stronger password', 'error');
      setIsLoading(false);
      return;
    }
    
    try {
      await register({ name, email, password });
      showToast('Registration successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  // Get color for password strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 25) return '#f44336';
    if (passwordStrength < 50) return '#ff9800';
    if (passwordStrength < 75) return '#ffeb3b';
    return '#4caf50';
  };

  return (
    <div className="auth-container">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="auth-card" id="main-content">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Get personalized medicine information</p>
        
        {error && <div className="auth-error" role="alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              aria-required="true"
              aria-invalid={error && !name ? "true" : "false"}
              required
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
              aria-required="true"
              aria-invalid={error && !email ? "true" : "false"}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              aria-required="true"
              aria-invalid={error && !password ? "true" : "false"}
              aria-describedby="password-strength-text password-requirements"
              required
            />
            {password && (
              <>
                <div className="password-strength">
                  <div 
                    className="password-strength-bar" 
                    style={{ 
                      width: `${passwordStrength}%`, 
                      backgroundColor: getStrengthColor() 
                    }}
                    aria-hidden="true"
                  ></div>
                </div>
                <div className="password-strength-text" id="password-strength-text">
                  Password strength: {passwordFeedback}
                </div>
                <div className="password-requirements" id="password-requirements">
                  <span className="visually-hidden">Password requirements:</span>
                  <ul>
                    <li className={password.length >= 8 ? "requirement-met" : ""}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "requirement-met" : ""}>
                      At least one uppercase letter
                    </li>
                    <li className={/[a-z]/.test(password) ? "requirement-met" : ""}>
                      At least one lowercase letter
                    </li>
                    <li className={/[0-9!@#$%^&*(),.?":{}|<>]/.test(password) ? "requirement-met" : ""}>
                      At least one number or special character
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              aria-required="true"
              aria-invalid={error && !confirmPassword ? "true" : "false"}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;