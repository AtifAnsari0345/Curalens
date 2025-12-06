import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

// Custom hook to use the auth context
export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}