import axios from 'axios';

const API_URL = 'http://localhost:5000/api/medicines';

// Search medicine by name (for compatibility with existing components)
export const searchMedicineByName = async (name) => {
  try {
    if (!name || name.trim() === '') {
      return [];
    }
    const response = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name.trim())}`);
    return response.data;
  } catch (error) {
    console.error('Error searching medicine:', error.response?.data?.message || error.message);
    // Return empty array but also throw a toast notification in the component
    return [];
  }
};

// Get all medicines for the current user
export const getUserMedicines = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch medicines');
  }
};

// Add a new medicine
export const addMedicine = async (medicineData) => {
  try {
    const response = await axios.post(API_URL, medicineData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add medicine');
  }
};

// Update medicine details
export const updateMedicine = async (id, medicineData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, medicineData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update medicine');
  }
};

// Toggle medicine acceptance
export const toggleMedicineAcceptance = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/toggle-accept`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle medicine acceptance');
  }
};

// Delete a medicine
export const deleteMedicine = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete medicine');
  }
};