import React from 'react'
import { useState, useEffect } from 'react'
import { useAppContext } from '../store/AppContext'
import MedicineCard from '../components/MedicineCard'
import NotificationSettings from '../components/NotificationSettings'
import TimeSelector from '../components/TimeSelector'
import { useToast } from '../components/Toast'
import '../styles/dashboard.css'
import '../styles/full-width-override.css'
import '../styles/new-responsive.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Dashboard = () => {
  const { medicines, addMedicine, removeMedicine, updateMedicineDetails } = useAppContext();
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const { showToast } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    if (!selectedTimes || selectedTimes.length === 0) {
      showToast('Please add at least one reminder time', 'error');
      return;
    }
    
    // Format times for storage
    const timesText = selectedTimes.map(time => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }).join(', ');
    
    try {
      const result = await addMedicine({ name, dose, timesText, reminderTimes: selectedTimes });
      
      // Clear form
      setName('');
      setDose('');
      setSelectedTimes([]);
      showToast('Medicine added with reminders', 'success');
    } catch (error) {
      console.error('Error adding medicine:', error);
      showToast('Failed to add medicine', 'error');
    }
  };
  
  const handleMedicineUpdate = (updatedMedicine) => {
    console.log('Medicine updated:', updatedMedicine);
  };
  
  const handleFetchInfo = async (medicineId, medicineInfo) => {
    updateMedicineDetails(medicineId, medicineInfo);
  };
  
  return (
    <div className="content full-width-container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
            </svg>
            Dashboard
          </h1>
          <button onClick={() => {
            const medicinesData = medicines.map(med => {
              return `Medicine: ${med.name}\nDose: ${med.dose}\nTimes: ${med.times.join(', ')}\n\n`;
            }).join('');
            
            const dataBlob = new Blob([`CuraLens Medicines List\n\n${medicinesData}`], { type: 'text/plain' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'curalens-medicines.txt';
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }} className="download-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span className="button-text">Download Medicines List</span>
          </button>
        </div>
        
        <NotificationSettings />
        
        <div className="dashboard-layout responsive-layout">
          {/* Section A: Add Medicine Form */}
          <div className="add-medicine-form">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Medicine
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="medicine-name">Medicine Name</label>
                <input
                  id="medicine-name"
                  type="text"
                  placeholder="Enter medicine name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-label="Medicine name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="medicine-dose">Dose</label>
                <input
                  id="medicine-dose"
                  type="text"
                  placeholder="Enter dose (e.g., 10mg)"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  required
                  aria-label="Medicine dose"
                />
              </div>
              
              <div className="reminder-times">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Reminder Times
                </h3>
                <TimeSelector 
                  selectedTimes={selectedTimes}
                  onChange={setSelectedTimes}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={!name.trim() || !dose.trim() || selectedTimes.length === 0}
                aria-label="Add medicine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Medicine
              </button>
            </form>
          </div>
          
          {/* Section B: Medicines List */}
          <div className="medicine-list">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Your Medicines
            </h2>
            
            {medicines.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                <p>No medicines added yet. Add your first medicine or scan a prescription.</p>
              </div>
            ) : (
              <div className="medicine-cards">
                {medicines.map((medicine) => (
                  <div key={medicine.id} className="medicine-card">
                    <div className="medicine-card-content">
                      <MedicineCard
                        medicine={medicine}
                        onUpdate={handleMedicineUpdate}
                        onFetchInfo={handleFetchInfo}
                      />
                      <div className="actions">
                        <button 
                          className="delete" 
                          onClick={() => removeMedicine(medicine.id)}
                          aria-label={`Remove ${medicine.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard