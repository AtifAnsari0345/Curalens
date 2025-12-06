/**
 * Custom hook for localStorage operations with JSON parsing/stringifying
 */
const useLocalStorage = () => {
  /**
   * Get a value from localStorage with fallback
   * @param {string} key - The localStorage key
   * @param {any} fallback - Default value if key doesn't exist
   * @returns {any} The stored value or fallback
   */
  const get = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return fallback;
    }
  };

  /**
   * Set a value in localStorage with JSON stringifying
   * @param {string} key - The localStorage key
   * @param {any} value - Value to store
   */
  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to localStorage:', error);
    }
  };

  return { get, set };
};

export default useLocalStorage;