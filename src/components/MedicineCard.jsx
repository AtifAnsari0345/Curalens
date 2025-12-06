import { useState, useEffect } from 'react';
import { searchMedicineByName } from '../services/medicineApi';
import { generateSimplifiedExplanation } from '../services/aiService';
import useAuthContext from '../hooks/useAuthContext';
import '../styles/medicineCard.css';

function MedicineCard({ medicine, onUpdate, onAcceptToggle, onFetchInfo, onRemove, details = null, isAccepted: initialIsAccepted }) {
  const { isAuthenticated, checkMedicineSafety } = useAuthContext();
  const [isAccepted, setIsAccepted] = useState(true);
  const [name, setName] = useState(medicine.name);
  const [dose, setDose] = useState(medicine.dose);
  const [timesText, setTimesText] = useState(medicine.times?.join(', ') || '');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [safetyInfo, setSafetyInfo] = useState({ safe: true, warnings: [] });
  
  // Initialize from props
  useEffect(() => {
    setIsAccepted(initialIsAccepted !== undefined ? initialIsAccepted : (medicine.isAccepted !== undefined ? medicine.isAccepted : true));
    setName(medicine.name || '');
    setDose(medicine.dose || '');
    setTimesText(medicine.times?.join(', ') || '');
    
    // Check medicine safety based on user's medical history
    if (isAuthenticated && medicine.details && typeof checkMedicineSafety === 'function') {
      try {
        const safety = checkMedicineSafety(medicine.details);
        setSafetyInfo(safety);
      } catch (err) {
        console.error('Error checking medicine safety:', err);
        setSafetyInfo({ safe: true, warnings: [] });
      }
    }
  }, [medicine, initialIsAccepted, isAuthenticated, checkMedicineSafety]);
  
  const handleAcceptToggle = () => {
    const newAcceptedState = !isAccepted;
    setIsAccepted(newAcceptedState);
    if (onAcceptToggle) {
      onAcceptToggle(medicine.id, newAcceptedState);
    }
  };

  const handleRemove = () => {
    if (onRemove && window.confirm(`Are you sure you want to remove "${name}" from the list?`)) {
      onRemove(medicine.id);
    }
  };
  
  const handleUpdate = () => {
    // Parse times from comma-separated string
    const times = timesText.split(',').map(time => time.trim()).filter(time => time !== '');
    
    const updatedMedicine = {
      ...medicine,
      name,
      dose,
      times,
      reminderTimes: times // Pass the parsed times for notifications
    };
    onUpdate(updatedMedicine);
  };
  
  // Format side effects into proper sentences
  const formatSideEffects = (sideEffects) => {
    if (!sideEffects) return '';
    
    // Check if sideEffects is a string, if not convert it
    const sideEffectsText = typeof sideEffects === 'string' 
      ? sideEffects 
      : Array.isArray(sideEffects) 
        ? sideEffects.join(', ') 
        : String(sideEffects);
    
    // Split by common delimiters and clean up
    const effectsList = sideEffectsText
      .split(/[,;.]/)
      .map(effect => effect.trim())
      .filter(effect => effect.length > 0);
    
    // Format each effect as a proper sentence
    return effectsList
      .map(effect => {
        // Capitalize first letter if not already capitalized
        const formattedEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
        // Add period if not already present
        return formattedEffect.endsWith('.') ? formattedEffect : formattedEffect + '.';
      })
      .join(' ');
  };
  
  // Format usage guidelines
  const formatUsageGuidelines = (details) => {
    if (!details) return null;
    
    const guidelines = [];
    
    // When to use
    if (details.indications) {
      guidelines.push({
        title: 'When to Use',
        content: details.indications
      });
    }
    
    // When not to use
    if (details.contraindications) {
      const contraindications = typeof details.contraindications === 'string' 
        ? details.contraindications
        : String(details.contraindications);
      
      // Format sentences properly
      const formattedText = contraindications
        .split(/[.;]/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0)
        .map(sentence => {
          // Capitalize first letter
          const formatted = sentence.charAt(0).toUpperCase() + sentence.slice(1);
          // Add period if not already present
          return formatted.endsWith('.') ? formatted : formatted + '.';
        })
        .join(' ');
      
      guidelines.push({
        title: 'When Not to Use',
        content: formattedText
      });
    } else if (details.warnings) {
      const warnings = typeof details.warnings === 'string' 
        ? details.warnings
        : String(details.warnings);
      
      // Format sentences properly
      const formattedText = warnings
        .split(/[.;]/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0)
        .map(sentence => {
          // Capitalize first letter
          const formatted = sentence.charAt(0).toUpperCase() + sentence.slice(1);
          // Add period if not already present
          return formatted.endsWith('.') ? formatted : formatted + '.';
        })
        .join(' ');
      
      guidelines.push({
        title: 'When Not to Use',
        content: formattedText
      });
    }
    
    return guidelines;
  };
  
  const handleShowDetails = async () => {
    // Skip expansion for "Add Medicine" card
    if (medicine.id === 'add-medicine' || !name.trim()) {
      return;
    }
    
    try {
      setIsFetching(true);
      setError(null);
      
      // If details are already provided, use them
      if (details || medicine.details) {
        // Toggle expansion for this specific card only
        setIsExpanded(!isExpanded);
        setIsFetching(false);
        return;
      }
      
      // Fetch medicine information from API
      const medicineInfo = await searchMedicineByName(name);
      
      // Check if the result is an error message
      if (typeof medicineInfo === 'string' && medicineInfo.startsWith('❌')) {
        setError(medicineInfo);
        setIsFetching(false);
        return;
      }
      
      // Call the onFetchInfo callback with the information
      if (onFetchInfo) {
        onFetchInfo(medicine.id, medicineInfo);
      }
      
      // Expand the card to show details
      setIsExpanded(true);
      setIsFetching(false);
    } catch (err) {
      console.error('Error fetching medicine details:', err);
      setError('Failed to fetch medicine details. Please try again.');
      setIsFetching(false);
    }
  };
  
  // Render the medicine details if available
  const renderMedicineDetails = () => {
    const medicineDetails = details || medicine.details;
    
    if (!medicineDetails) {
      return null;
    }
    
    // Get usage guidelines
    const guidelines = formatUsageGuidelines(medicineDetails);
    
    // Helper function to render side effects list
    const renderSideEffectsList = (sideEffects) => {
      if (typeof sideEffects === 'string') {
        return <p>{sideEffects}</p>;
      }
      
      if (Array.isArray(sideEffects)) {
        return (
          <ul className="side-effects-list">
            {sideEffects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
        );
      }
      
      if (typeof sideEffects === 'object') {
        return (
          <div className="side-effects-categories">
            {sideEffects.common && (
              <div className="side-effect-category">
                <h5>Common:</h5>
                <ul>
                  {sideEffects.common.map((effect, index) => (
                    <li key={`common-${index}`}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {sideEffects.serious && (
              <div className="side-effect-category">
                <h5>Serious (seek medical attention):</h5>
                <ul className="serious-effects">
                  {sideEffects.serious.map((effect, index) => (
                    <li key={`serious-${index}`}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {sideEffects.rare && (
              <div className="side-effect-category">
                <h5>Rare:</h5>
                <ul>
                  {sideEffects.rare.map((effect, index) => (
                    <li key={`rare-${index}`}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }
      
      return <p>{formatSideEffects(sideEffects)}</p>;
    };
    
    // Helper function to render warnings list
    const renderWarningsList = (warnings) => {
      if (!warnings) return null;
      
      if (typeof warnings === 'string') {
        return <p>{warnings}</p>;
      }
      
      if (Array.isArray(warnings)) {
        return (
          <ul className="warnings-list">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        );
      }
      
      return <p>{warnings}</p>;
    };
    
    // Helper function to render dosage information
    const renderDosage = (dosage) => {
      if (!dosage) return null;
      
      if (typeof dosage === 'string') {
        return <p>{dosage}</p>;
      }
      
      if (typeof dosage === 'object') {
        return (
          <div className="dosage-categories">
            {dosage.adults && (
              <div className="dosage-category">
                <h5>Adults:</h5>
                <p>{dosage.adults}</p>
              </div>
            )}
            
            {dosage.children && (
              <div className="dosage-category">
                <h5>Children:</h5>
                <p>{dosage.children}</p>
              </div>
            )}
            
            {dosage.elderly && (
              <div className="dosage-category">
                <h5>Elderly:</h5>
                <p>{dosage.elderly}</p>
              </div>
            )}
          </div>
        );
      }
      
      return <p>{dosage}</p>;
    };
    
    return (
      <div className="medicine-details-expanded">
        {/* Description Section */}
        {medicineDetails.description && (
          <div className="detail-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
              </svg>
              Description
            </h4>
            <p>{medicineDetails.description}</p>
            
            {medicineDetails.purpose && medicineDetails.purpose !== medicineDetails.description && (
              <div className="purpose-section">
                <h5>Purpose:</h5>
                <p>{medicineDetails.purpose}</p>
              </div>
            )}
            
            {medicineDetails.brandNames && medicineDetails.brandNames.length > 0 && (
              <div className="brand-names">
                <h5>Brand Names:</h5>
                <p>{medicineDetails.brandNames.join(', ')}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Dosage Section */}
        {(medicineDetails.dosage || medicineDetails.dose) && (
          <div className="detail-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Dosage
            </h4>
            {renderDosage(medicineDetails.dosage || medicineDetails.dose)}
          </div>
        )}
        
        {/* Side Effects Section */}
        {medicineDetails.sideEffects && (
          <div className="detail-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              Side Effects
            </h4>
            {renderSideEffectsList(medicineDetails.sideEffects)}
          </div>
        )}
        
        {/* Warnings Section */}
        {medicineDetails.warnings && medicineDetails.warnings.length > 0 && (
          <div className="detail-section warnings-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              Warnings
            </h4>
            {renderWarningsList(medicineDetails.warnings)}
          </div>
        )}
        
        {/* Interactions Section */}
        {medicineDetails.interactions && medicineDetails.interactions.length > 0 && (
          <div className="detail-section interactions-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
              </svg>
              Drug Interactions
            </h4>
            {renderWarningsList(medicineDetails.interactions)}
          </div>
        )}
        
        {/* Directions Section */}
        {(medicineDetails.directions || medicineDetails.howToUse) && (
          <div className="detail-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
              Directions
            </h4>
            <p>{medicineDetails.directions || medicineDetails.howToUse}</p>
          </div>
        )}
        
        {/* Usage Guidelines Section */}
        {guidelines && guidelines.length > 0 && (
          <div className="detail-section">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                <polyline points="9 12 11 14 15 10"/>
                <line x1="9" y1="17" x2="15" y2="17"/>
              </svg>
              Usage Guidelines
            </h4>
            {guidelines.map((guideline, index) => (
              <div key={index} className="guideline-item">
                <h5>{guideline.title}</h5>
                <p>{guideline.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render safety warnings if any
  const renderSafetyWarnings = () => {
    if (!safetyInfo || safetyInfo.safe || !safetyInfo.warnings || safetyInfo.warnings.length === 0) {
      return null;
    }
    
    return (
      <div className="safety-warning">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div>
          <strong>Safety concerns:</strong>
          <ul>
            {safetyInfo.warnings.map((warning, index) => (
              <li key={index}><strong>HIGH RISK:</strong> {warning}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <h3>{name}</h3>
      
      <div className="medicine-details">
        <div className="detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.5 2a.5.5 0 0 0-1 0v7.21l-3.3-3.3a.5.5 0 0 0-.7.7l4 4a.5.5 0 0 0 .7 0l4-4a.5.5 0 0 0-.7-.7L8.5 9.21V2z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          <span><strong>Dose:</strong> {dose}</span>
        </div>
        
        <div className="detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          <span><strong>Times:</strong></span>
        </div>
        
        <div>
          {medicine.times && medicine.times.map((time, index) => (
            <span key={index} className="times">{time}</span>
          ))}
        </div>
      </div>
      
      {renderSafetyWarnings()}
      
      {error && <div className="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        {error}
      </div>}
      
      {isExpanded && renderMedicineDetails()}
      
      {!isExpanded && (medicine.details || details) && (
        <button 
          className="show-details" 
          onClick={handleShowDetails}
          disabled={isFetching}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
          </svg>
          Show Details
        </button>
      )}
      
      {isExpanded && (
        <button 
          className="hide-details" 
          onClick={() => setIsExpanded(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
          </svg>
          Hide Details
        </button>
      )}
      
      {!medicine.details && !details && !isExpanded && (
        <button 
          className="fetch-info" 
          onClick={handleShowDetails}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="spin" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Fetching...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              Fetch Info
            </>
          )}
        </button>
      )}
    </>
  );
}

export default MedicineCard;