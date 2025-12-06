import React from 'react';
import axios from 'axios';

// Define API URL with proper endpoint
const API_URL = 'http://localhost:5000/api/users';

// Create context
export const AuthContext = React.createContext(null);

// Default state
const defaultState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tokenExpiry: null,
  medicalHistory: {
    conditions: [],
    allergies: [],
    currentMedications: []
  }
};

// Storage key
const AUTH_STORAGE_KEY = 'curalens_auth_v1';

// Session duration in milliseconds (30 days)
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  // State management
  const [authState, setAuthState] = React.useState(defaultState);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  // Load auth state from localStorage on component mount
  React.useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
          if (savedAuth && isMounted) {
            const parsedAuth = JSON.parse(savedAuth);
            
            // Check token expiration
            if (parsedAuth.tokenExpiry && Date.now() > parsedAuth.tokenExpiry) {
              localStorage.removeItem(AUTH_STORAGE_KEY);
              setAuthState(defaultState);
            } else {
              // Set axios auth header immediately
              if (parsedAuth.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${parsedAuth.token}`;
              }
              
              setAuthState({
                ...parsedAuth,
                isAuthenticated: true
              });
            }
          }
        }
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error('Error loading auth state:', error);
        if (isMounted) {
          setAuthState(defaultState);
          setLoading(false);
          setError(error.message);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Save auth state to localStorage when it changes
  React.useEffect(() => {
    if (!authState.token) return;
    
    try {
      const authToSave = {
        ...authState,
        tokenExpiry: Date.now() + SESSION_DURATION
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authToSave));
      }
      
      // Set axios auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } catch (error) {
      console.error('Error saving auth state:', error);
      setError(error.message);
    }
  }, [authState.token, authState.user]);
  
  // Authentication methods
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Sending registration request to', `${API_URL}/register`);
      
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log('AuthContext: Registration response:', response.data);
      
      const { token, _id, name, email, elderlyMode, medicalHistory } = response.data;
      
      // Create user object
      const user = {
        _id: _id || '',
        name: name || '',
        email: email || '',
        elderlyMode: elderlyMode || false
      };
      
      // Update auth state
      const newAuthState = {
        isAuthenticated: true,
        user,
        token,
        tokenExpiry: Date.now() + SESSION_DURATION,
        medicalHistory: medicalHistory || defaultState.medicalHistory
      };
      
      setAuthState(newAuthState);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      }
      
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setLoading(false);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status 
      };
    }
  };
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Sending login request to', `${API_URL}/login`);
      console.log('AuthContext: Login credentials:', { email: credentials.email });
      
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('AuthContext: Login response received:', response.data);
      
      // Safely extract data from response
      const { token, _id, name, email, elderlyMode, medicalHistory } = response.data;
      
      // Create a user object with safe defaults
      const user = {
        _id: _id || '',
        name: name || '',
        email: email || '',
        elderlyMode: elderlyMode || false
      };
      
      // Set token in axios headers for future requests
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Update auth state
      const newAuthState = {
        isAuthenticated: true,
        user,
        token,
        tokenExpiry: Date.now() + SESSION_DURATION,
        medicalHistory: medicalHistory || defaultState.medicalHistory
      };
      
      setAuthState(newAuthState);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      }
      
      console.log('AuthContext: Login successful, state updated');
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setLoading(false);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status 
      };
    }
  };
  
  const logout = () => {
    setAuthState(defaultState);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    delete axios.defaults.headers.common['Authorization'];
  };

  // ADD THIS MISSING FUNCTION - Update User Profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Updating profile with data:', profileData);
      
      const response = await axios.put(`${API_URL}/profile`, profileData);
      console.log('AuthContext: Profile update response:', response.data);
      
      const { _id, name, email, elderlyMode, medicalHistory, token } = response.data;
      
      // Update user data in state
      const updatedUser = {
        _id: _id || authState.user?._id,
        name: name || authState.user?.name,
        email: email || authState.user?.email,
        elderlyMode: elderlyMode !== undefined ? elderlyMode : authState.user?.elderlyMode
      };
      
      // Update auth state with new data
      const newAuthState = {
        ...authState,
        user: updatedUser,
        medicalHistory: medicalHistory || authState.medicalHistory,
        ...(token && { token }) // Update token if provided
      };
      
      setAuthState(newAuthState);
      
      // Save to localStorage if token changed
      if (token && typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          ...newAuthState,
          tokenExpiry: Date.now() + SESSION_DURATION
        }));
      }
      
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setLoading(false);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };
  
  const updateMedicalHistory = async (medicalHistoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${API_URL}/profile`, {
        medicalHistory: medicalHistoryData
      });
      
      // Update both medicalHistory and user state
      setAuthState(prev => ({
        ...prev,
        medicalHistory: response.data.medicalHistory,
        user: {
          ...prev.user,
          medicalHistory: response.data.medicalHistory
        }
      }));
      
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setLoading(false);
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };
  
  // Check medicine safety based on user's medical history
  const checkMedicineSafety = (medicineDetails) => {
    // Default safety response
    const safetyResponse = { 
      safe: true, 
      warnings: [],
      severity: 'low',
      recommendations: []
    };
    
    // If no user or no medical history, return cautionary response
    if (!authState.user || !authState.medicalHistory) {
      safetyResponse.safe = false;
      safetyResponse.severity = 'medium';
      safetyResponse.warnings.push('Unable to verify safety: No medical profile available');
      safetyResponse.recommendations.push('Complete your medical profile for accurate safety information');
      return safetyResponse;
    }
    
    // Extract user's medical conditions and allergies
    const { conditions = [], allergies = [], currentMedications = [] } = authState.medicalHistory;
    
    // Comprehensive safety check logic
    if (medicineDetails) {
      // 1. Check for contraindications with medical conditions
      if (conditions.length > 0) {
        // Check explicit contraindications
        if (medicineDetails.whenNotToUse) {
          conditions.forEach(condition => {
            if (medicineDetails.whenNotToUse.toLowerCase().includes(condition.toLowerCase())) {
              safetyResponse.safe = false;
              safetyResponse.severity = 'high';
              safetyResponse.warnings.push(`CONTRAINDICATED: This medicine should not be used by people with ${condition}`);
              safetyResponse.recommendations.push(`Consult your healthcare provider for alternatives safe for ${condition}`);
            }
          });
        }
        
        // Check warnings section for cautions
        if (medicineDetails.warnings && typeof medicineDetails.warnings === 'string') {
          conditions.forEach(condition => {
            if (medicineDetails.warnings.toLowerCase().includes(condition.toLowerCase())) {
              if (safetyResponse.safe) { // Don't downgrade from unsafe
                safetyResponse.safe = false;
                safetyResponse.severity = 'medium';
              }
              safetyResponse.warnings.push(`CAUTION: This medicine requires special consideration for people with ${condition}`);
              safetyResponse.recommendations.push(`Consult your healthcare provider before using with ${condition}`);
            }
          });
        } else if (medicineDetails.warnings && Array.isArray(medicineDetails.warnings)) {
          // Handle case where warnings is an array
          medicineDetails.warnings.forEach(warning => {
            if (typeof warning === 'string') {
              conditions.forEach(condition => {
                if (warning.toLowerCase().includes(condition.toLowerCase())) {
                  if (safetyResponse.safe) {
                    safetyResponse.safe = false;
                    safetyResponse.severity = 'medium';
                  }
                  safetyResponse.warnings.push(`CAUTION: This medicine requires special consideration for people with ${condition}`);
                  safetyResponse.recommendations.push(`Consult your healthcare provider before using with ${condition}`);
                }
              });
            }
          });
        }
        
        // Check specific high-risk conditions
        const highRiskConditions = {
          'liver disease': ['acetaminophen', 'paracetamol', 'statins', 'methotrexate'],
          'kidney disease': ['nsaids', 'ibuprofen', 'naproxen', 'aspirin', 'diuretics'],
          'heart disease': ['nsaids', 'stimulants', 'decongestants'],
          'hypertension': ['decongestants', 'nsaids', 'corticosteroids'],
          'diabetes': ['corticosteroids', 'thiazide diuretics'],
          'asthma': ['beta-blockers', 'aspirin', 'nsaids'],
          'pregnancy': ['retinoids', 'ace inhibitors', 'statins', 'nsaids']
        };
        
        Object.entries(highRiskConditions).forEach(([condition, riskyMeds]) => {
          if (conditions.some(c => c.toLowerCase().includes(condition))) {
            riskyMeds.forEach(med => {
              if (medicineDetails.name?.toLowerCase().includes(med) || 
                  medicineDetails.ingredients?.toLowerCase().includes(med)) {
                safetyResponse.safe = false;
                safetyResponse.severity = 'high';
                safetyResponse.warnings.push(`HIGH RISK: ${med} may worsen ${condition}`);
                safetyResponse.recommendations.push(`Consult your healthcare provider about ${med} with ${condition}`);
              }
            });
          }
        });
      }
      
      // 2. Check for allergies with enhanced severity
      if (allergies.length > 0 && medicineDetails.ingredients) {
        allergies.forEach(allergy => {
          if (medicineDetails.ingredients.toLowerCase().includes(allergy.toLowerCase())) {
            safetyResponse.safe = false;
            safetyResponse.severity = 'high';
            safetyResponse.warnings.push(`ALLERGEN ALERT: This medicine contains ${allergy} which you are allergic to`);
            safetyResponse.recommendations.push(`Avoid this medication due to your ${allergy} allergy`);
          }
        });
      }
      
      // 3. Check for drug interactions with current medications
      if (currentMedications.length > 0) {
        // Common drug interaction pairs (simplified)
        const interactionPairs = {
          'warfarin': ['nsaids', 'aspirin', 'antibiotics', 'antifungals'],
          'ssri': ['maoi', 'tramadol', 'triptans'],
          'ace inhibitors': ['potassium supplements', 'spironolactone', 'nsaids'],
          'digoxin': ['amiodarone', 'verapamil', 'diuretics'],
          'statins': ['fibrates', 'cyclosporine', 'macrolide antibiotics']
        };
        
        currentMedications.forEach(currentMed => {
          // Check if current medication is a key in interaction pairs
          Object.entries(interactionPairs).forEach(([med, interactors]) => {
            if (currentMed.toLowerCase().includes(med)) {
              interactors.forEach(interactor => {
                if (medicineDetails.name?.toLowerCase().includes(interactor) || 
                    medicineDetails.ingredients?.toLowerCase().includes(interactor)) {
                  safetyResponse.safe = false;
                  safetyResponse.severity = 'high';
                  safetyResponse.warnings.push(`INTERACTION ALERT: May interact with your current medication ${currentMed}`);
                  safetyResponse.recommendations.push(`Consult your healthcare provider about potential interaction with ${currentMed}`);
                }
              });
            }
            
            // Check if new medicine is a key and current meds are interactors
            if (medicineDetails.name?.toLowerCase().includes(med)) {
              if (interactors.some(interactor => currentMed.toLowerCase().includes(interactor))) {
                safetyResponse.safe = false;
                safetyResponse.severity = 'high';
                safetyResponse.warnings.push(`INTERACTION ALERT: May interact with your current medication ${currentMed}`);
                safetyResponse.recommendations.push(`Consult your healthcare provider about potential interaction with ${currentMed}`);
              }
            }
          });
        });
      }
      
      // 4. Add general caution if no specific issues found but medicine has known side effects
      if (safetyResponse.safe && medicineDetails.sideEffects) {
        // Check if sideEffects is an array, if not convert it to an array
        const sideEffectsArray = Array.isArray(medicineDetails.sideEffects) 
          ? medicineDetails.sideEffects 
          : [medicineDetails.sideEffects];
          
        if (sideEffectsArray.length > 0) {
          safetyResponse.recommendations.push(`Monitor for common side effects: ${sideEffectsArray.join(', ')}`);
        }
      }
    } else {
      // No medicine details provided
      safetyResponse.safe = false;
      safetyResponse.severity = 'medium';
      safetyResponse.warnings.push('Unable to verify safety: Incomplete medicine information');
      safetyResponse.recommendations.push('Provide complete medicine details for accurate safety assessment');
    }
    
    return safetyResponse;
  };

  // Clear error
  const clearError = () => setError(null);

  // Context value
  const contextValue = {
    ...authState,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile, // ADD THIS TO CONTEXT
    updateMedicalHistory,
    checkMedicineSafety,
    clearError
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};