import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create context
const AppContext = createContext();

// Default state
const defaultState = {
  elderlyMode: false,
  medicines: [] // each: { id: string, name: string, dose: string, times: string[], details: Object }
};

// Storage key
const STORAGE_KEY = 'curalens_state_v1';

// Custom hook to use the app context
function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// App Provider component for global state management
function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const { get, set } = useLocalStorage();
  
  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = get(STORAGE_KEY, defaultState);
    setState(savedState);
  }, []);
  
  // Save state to localStorage when it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Ensure we're saving the current state with the updated medicines array
      set(STORAGE_KEY, {
        ...state,
        medicines: [...state.medicines] // Create a new array to ensure proper update
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [state, set]);
  
  // Action: Toggle elderly mode
  const toggleElderlyMode = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      elderlyMode: !prevState.elderlyMode
    }));
  }, []);
  
  // Action: Add medicine with enhanced details
  const addMedicine = useCallback(async ({ id, name, dose, timesText, times, reminderTimes = [], details = null }) => {
    if (!name.trim()) return { success: false, error: 'Medicine name cannot be empty' }; // Don't add empty medicines
    
    try {
      // Parse times from comma-separated text if timesText is provided, otherwise use times array
      const parsedTimes = times || (timesText ? timesText
        .split(',')
        .map(time => time.trim())
        .filter(time => time !== '')
      : []);
      
      // Format times consistently
      const formattedTimes = parsedTimes.map(time => {
        if (typeof time === 'string') {
          const [hours, minutes] = time.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }
        }
        return time;
      });
      
      // Use provided ID if available, otherwise generate a new one
      const medicineId = id || `medicine-${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Check for duplicates by name and dose
      let isDuplicate = false;
      setState(prevState => {
        isDuplicate = prevState.medicines.some(
          m => m.name.toLowerCase() === name.trim().toLowerCase() && 
               m.dose === (dose || 'As prescribed').trim()
        );
        
        if (isDuplicate) return prevState;
        
        // Create the new medicine object
        const newMedicine = {
          id: medicineId,
          name: name.trim(),
          dose: (dose || 'As prescribed').trim(),
          times: formattedTimes,
          reminderTimes: reminderTimes || [], // Store the raw time values for notifications
          details // New field for medicine details
        };
        
        // Add to MongoDB via API service (will be implemented)
        import('../services/medicineApi').then(module => 
          module.addMedicine(newMedicine)
        ).catch(err => console.error('API error:', err));
        
        // Update local state
        return {
          ...prevState,
          medicines: [...prevState.medicines, newMedicine]
        };
      });
      
      return isDuplicate 
        ? { success: false, error: 'This medicine already exists' }
        : { success: true, medicine: { id: medicineId, name: name.trim(), dose: dose.trim(), times: formattedTimes, details } };
    } catch (error) {
      console.error('Error adding medicine:', error);
      return { success: false, error: error.message || 'Failed to add medicine' };
    }
  }, []);
  
  // Action: Update medicine details
  const updateMedicineDetails = useCallback((id, details) => {
    setState(prevState => ({
      ...prevState,
      medicines: prevState.medicines.map(medicine => 
        medicine.id === id ? { ...medicine, details } : medicine
      )
    }));
  }, []);
  
  // Action: Remove medicine
  const removeMedicine = useCallback((id) => {
    if (!id) return; // Don't proceed if no ID is provided
    
    setState(prevState => {
      // Create a new array with all medicines except the one with the matching id
      const updatedMedicines = prevState.medicines.filter(medicine => medicine.id !== id);
      
      // Only update state if we actually removed something
      if (updatedMedicines.length === prevState.medicines.length) {
        console.warn(`No medicine found with ID: ${id}`);
        return prevState; // No change needed
      }
      
      // Return the new state with the updated medicines array
      return {
        ...prevState,
        medicines: updatedMedicines
      };
    });
  }, []);
  
  // Context value
  const value = {
    ...state,
    toggleElderlyMode,
    addMedicine,
    updateMedicineDetails,
    removeMedicine
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Export as default object with named properties
const AppContextExports = {
  AppProvider,
  useAppContext
};

export default AppContextExports;
export { AppProvider, useAppContext };