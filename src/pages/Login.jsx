import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { useToast } from '../components/Toast';
import '../styles/auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check for saved email in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      console.log('Attempting login with:', { email });
      
      // Connect to the backend API
      const result = await login({ email, password });
      console.log('Login result:', result);
      
      if (result && result.success) {
        showToast('Login successful!', 'success');
        setIsLoading(false); // Make sure to set loading to false before navigation
        
        // Force a redirect to dashboard without setTimeout
        navigate('/dashboard', { replace: true });
      } else {
        const errorMsg = result?.error || 'Login failed. Please check your credentials.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="auth-card" id="main-content">
        <h1>Welcome to CuraLens</h1>
        <p className="auth-subtitle">Sign in to access your CuraLens account</p>
        
        {error && <div className="auth-error" role="alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
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
              placeholder="Enter your password"
              aria-required="true"
              aria-invalid={error && !password ? "true" : "false"}
              required
            />
          </div>
          
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        

        
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;