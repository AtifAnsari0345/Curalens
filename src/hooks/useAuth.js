import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context values and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;