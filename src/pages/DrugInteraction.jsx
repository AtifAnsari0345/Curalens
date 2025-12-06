import React, { useState, useEffect, useRef } from 'react';
import drugInteractionApi from '../services/drugInteractionApi';
import { getInteractionAlternatives } from '../services/alternativeMedicineService';
import { useToast } from '../components/Toast';
import '../styles/drug-interaction.css';
import '../styles/full-width-override.css';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback component for ErrorBoundary
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-boundary-fallback">
      <h2>Something went wrong</h2>
      <p>We encountered an error while processing your request.</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

function DrugInteraction() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisPerformed, setAnalysisPerformed] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'online' : 'offline');
  const { showToast } = useToast();
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const [fullWidth, setFullWidth] = useState(false); // Add state for controlling layout width
  const [alternativeSuggestions, setAlternativeSuggestions] = useState({}); // Store alternative medicine suggestions
  
  // Fallback medication database (used if API fails)
  const fallbackMedicationDatabase = [
    { id: '1191', name: 'Aspirin', generic: 'aspirin', category: 'NSAID/Antiplatelet' },
    { id: '5640', name: 'Ibuprofen', generic: 'ibuprofen', category: 'NSAID' },
    { id: '161', name: 'Paracetamol', generic: 'acetaminophen', category: 'Analgesic/Antipyretic' },
    { id: '3498', name: 'Warfarin', generic: 'warfarin', category: 'Anticoagulant' },
    { id: '6809', name: 'Clopidogrel', generic: 'clopidogrel', category: 'Antiplatelet' },
    { id: '20001', name: 'Metformin', generic: 'metformin', category: 'Antidiabetic' },
    { id: '20002', name: 'Atorvastatin', generic: 'atorvastatin', category: 'Statin/Lipid-lowering' },
    { id: '20003', name: 'Amlodipine', generic: 'amlodipine', category: 'Calcium Channel Blocker' },
    { id: '20004', name: 'Azithromycin', generic: 'azithromycin', category: 'Antibiotic/Macrolide' },
    { id: '20005', name: 'Pantoprazole', generic: 'pantoprazole', category: 'Proton Pump Inhibitor' },
    { id: '10001', name: 'Ashwagandha', generic: 'withania somnifera', category: 'Ayurvedic/Adaptogen' },
    { id: '10002', name: 'Turmeric', generic: 'curcuma longa', category: 'Ayurvedic/Anti-inflammatory' }
  ];

  // Fallback interaction database (used if API fails)
  const fallbackInteractionDatabase = [
    { 
      medications: ['Warfarin', 'Aspirin', 'Ibuprofen'], 
      severity: 'high', 
      status: 'Unsafe',
      description: 'Increased risk of serious bleeding. These medications are both blood thinners and their combination significantly increases bleeding risk.' 
    },
    { 
      medications: ['Atorvastatin', 'Azithromycin'], 
      severity: 'medium', 
      status: 'Use Caution',
      description: 'Azithromycin may increase statin levels, increasing risk of muscle damage.' 
    },
    { 
      medications: ['Paracetamol', 'Ibuprofen'], 
      severity: 'low', 
      status: 'Use Caution',
      description: 'Generally safe to use together when following recommended dosages, but may increase risk of kidney damage with prolonged use.' 
    }
  ];

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      showToast('You are now online. Full functionality available.', 'success');
    };

    const handleOffline = () => {
      setNetworkStatus('offline');
      showToast('You are offline. Limited functionality available using local database.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Handle search input changes with debouncing
  useEffect(() => {
    if (searchTerm.length > 1) {
      setIsLoading(true);
      setValidationError('');
      
      // Clear previous timeout
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      
      // Set new timeout for debouncing
      searchDebounceRef.current = setTimeout(async () => {
        try {
          // First try local database for faster response
          const localResults = fallbackMedicationDatabase.filter(med => 
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            med.generic.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          // If we have local results, use them immediately for better UX
          if (localResults.length > 0) {
            const sortedResults = localResults.sort((a, b) => {
              const aNameLower = a.name.toLowerCase();
              const bNameLower = b.name.toLowerCase();
              const searchTermLower = searchTerm.toLowerCase();
              
              if (aNameLower === searchTermLower && bNameLower !== searchTermLower) return -1;
              if (bNameLower === searchTermLower && aNameLower !== searchTermLower) return 1;
              
              if (aNameLower.startsWith(searchTermLower) && !bNameLower.startsWith(searchTermLower)) return -1;
              if (bNameLower.startsWith(searchTermLower) && !aNameLower.startsWith(searchTermLower)) return 1;
              
              return aNameLower.localeCompare(bNameLower);
            });
            
            setSuggestions(sortedResults.slice(0, 6));
          }
          
          // Try API for more comprehensive results if online
          if (networkStatus === 'online') {
            try {
              // Handle the new API response format
              const apiResponse = await drugInteractionApi.searchMedications(searchTerm, {
                limit: 10,
                region: 'global',
                includeAyurvedic: true
              });
              
              console.log('🔍 API Response:', apiResponse);
              
              if (apiResponse.results && apiResponse.results.length > 0) {
                // Transform API results to match our expected format
                const apiResults = apiResponse.results.map(med => ({
                  id: med.id || med.rxcui,
                  name: med.name,
                  generic: med.generic || med.name,
                  category: med.category || 'Medication',
                  source: med.source || 'api',
                  alternateNames: med.alternateNames || []
                }));
                
                // Combine with local results, remove duplicates
                const allResults = [...localResults, ...apiResults];
                const uniqueResults = [];
                const seenIds = new Set();
                
                for (const med of allResults) {
                  if (!seenIds.has(med.id)) {
                    seenIds.add(med.id);
                    uniqueResults.push(med);
                  }
                }
                
                setSuggestions(uniqueResults.slice(0, 6));
              }
            } catch (apiError) {
              console.error("API search failed:", apiError);
              // Continue with local results only
              if (localResults.length === 0) {
                setSuggestions([]);
              }
            }
          }
        } catch (err) {
          console.error("Search error:", err);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
    
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm, networkStatus]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add medication to the list
  const addMedication = (medication) => {
    if (medications.some(med => med.id === medication.id)) {
      showToast('This medication is already in your list', 'error');
      return;
    }
    
    setMedications([...medications, medication]);
    setSearchTerm('');
    setSuggestions([]);
    setAnalysisPerformed(false);
    showToast(`Added ${medication.name} to your list`, 'success');
    
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = async (suggestion) => {
    try {
      // Ensure we have a valid ID
      if (!suggestion.id && suggestion.name) {
        // If no ID, create one or try to get from API
        if (networkStatus === 'online') {
          setIsLoading(true);
          try {
            const rxcuiResult = await drugInteractionApi.getRxCui(suggestion.name);
            if (rxcuiResult.rxcui) {
              suggestion.id = String(rxcuiResult.rxcui); // Ensure it's a string
            } else {
              // Create a fallback ID
              suggestion.id = `fallback_${Date.now()}`;
            }
          } catch (err) {
            console.error("Error getting RxCUI:", err);
            // Use a fallback ID
            suggestion.id = `fallback_${Date.now()}`;
          }
          setIsLoading(false);
        } else {
          // Offline - create a consistent fallback ID
          suggestion.id = `fallback_${suggestion.name.toLowerCase().replace(/\s+/g, '_')}`;
        }
      } else if (suggestion.id) {
        // Ensure existing ID is a string
        suggestion.id = String(suggestion.id);
      }
      
      addMedication(suggestion);
    } catch (err) {
      console.error("Error handling suggestion:", err);
      // Add medication anyway with available information
      if (!suggestion.id) {
        suggestion.id = `fallback_${Date.now()}`;
      }
      addMedication(suggestion);
    }
  };

  // Remove medication from the list
  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
    setAnalysisPerformed(false);
    showToast('Medication removed from your list', 'success');
  };

  // Check for interactions between medications
  const checkInteractions = async () => {
    if (medications.length < 2) {
      setValidationError('Please add at least 2 medications to check for interactions');
      showToast('At least 2 medications are required', 'error');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setValidationError('');
    setAlternativeSuggestions({}); // Clear previous suggestions
    
    try {
      // Get RxCUIs for all medications - Handle both string and number IDs
      const rxcuis = medications.map(med => {
        const id = med.id;
        // Convert to string and check if it's a fallback ID
        const idStr = String(id);
        return idStr.startsWith('fallback_') ? null : id;
      }).filter(id => id != null); // Remove null values
      
      console.log('🔬 Checking interactions for RxCUIs:', rxcuis);
      
      if (rxcuis.length < 2) {
        // If we don't have enough RxCUIs, use fallback
        console.log('⚠️ Not enough valid RxCUIs, using fallback interactions');
        checkFallbackInteractions();
        setIsLoading(false);
        return;
      }
      
      let result;
      try {
        // Handle the new API response format
        result = await drugInteractionApi.checkInteractions(rxcuis, {
          includeEvidence: true,
          includeMechanisms: true,
          severity: 'all'
        });
        
        console.log('📊 API Interaction Results:', result);
        
        if (result.interactions && result.interactions.length > 0) {
          // Transform API results to match our expected format
          const transformedInteractions = result.interactions.map(interaction => ({
            medications: [interaction.drug1, interaction.drug2],
            severity: interaction.severity,
            status: interaction.severity === 'high' ? 'Unsafe' : 
                   interaction.severity === 'medium' ? 'Use Caution' : 'Safe',
            description: interaction.description,
            recommendation: interaction.recommendation
          }));
          
          setInteractions(transformedInteractions);
          setAnalysisPerformed(true);
          
          // Get alternative medicine suggestions for high-severity interactions
          const highSeverityInteractions = transformedInteractions.filter(
            interaction => interaction.severity === 'high'
          );
          
          if (highSeverityInteractions.length > 0) {
            const interactingMeds = highSeverityInteractions.flatMap(interaction => interaction.medications);
            const uniqueInteractingMeds = [...new Set(interactingMeds)];
            
            const alternatives = getInteractionAlternatives(uniqueInteractingMeds, medications);
            setAlternativeSuggestions(alternatives);
            console.log('💊 Alternative suggestions:', alternatives);
          }
          
          // Only show toast for interactions found, not for no interactions
          showToast(`Found ${transformedInteractions.length} potential interaction(s)`, 'warning');
        } else {
          // No interactions found via API
          setInteractions([]);
          setAnalysisPerformed(true);
          // REMOVED: Don't show toast for no interactions to avoid duplication
          // The UI will show the "No interactions found" message in the results section
        }
      } catch (apiError) {
        console.error("API interaction check failed:", apiError);
        // Use fallback if API fails
        checkFallbackInteractions();
      }
    } catch (err) {
      console.error('Error checking interactions:', err);
      setError('Failed to check interactions. Please try again.');
      showToast('Failed to check interactions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for interactions using fallback database
  const checkFallbackInteractions = () => {
    const medicationNames = medications.map(med => med.name);
    const foundInteractions = [];
    
    fallbackInteractionDatabase.forEach(interaction => {
      const matchingMeds = medicationNames.filter(medName => 
        interaction.medications.some(interactionMed => 
          medName.toLowerCase().includes(interactionMed.toLowerCase()) ||
          interactionMed.toLowerCase().includes(medName.toLowerCase())
        )
      );
      
      if (matchingMeds.length >= 2) {
        let recommendation = '';
        if (interaction.severity === 'high') {
          recommendation = 'Avoid this combination. Consult your healthcare provider immediately if you are currently taking these medications together.';
        } else if (interaction.severity === 'medium') {
          recommendation = 'Monitor for side effects. Your healthcare provider may need to adjust dosages or timing of administration.';
        } else {
          recommendation = 'Be aware of potential interaction. Monitor for minor changes in effectiveness or side effects.';
        }
        
        foundInteractions.push({
          ...interaction,
          recommendation,
          medications: matchingMeds
        });
      }
    });
    
    setInteractions(foundInteractions);
    setAnalysisPerformed(true);
    
    // Get alternative medicine suggestions for high-severity interactions
    const highSeverityInteractions = foundInteractions.filter(
      interaction => interaction.severity === 'high'
    );
    
    if (highSeverityInteractions.length > 0) {
      const interactingMeds = highSeverityInteractions.flatMap(interaction => interaction.medications);
      const uniqueInteractingMeds = [...new Set(interactingMeds)];
      
      const alternatives = getInteractionAlternatives(uniqueInteractingMeds, medications);
      setAlternativeSuggestions(alternatives);
      console.log('💊 Alternative suggestions (fallback):', alternatives);
    }
    
    if (foundInteractions.length > 0) {
      showToast(`Found ${foundInteractions.length} potential interaction(s) using local database`, 'warning');
    } else {
      // REMOVED: Don't show toast for no interactions to avoid duplication
      // The UI will show the "No interactions found" message in the results section
    }
  };

  // Get severity class for styling
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'moderate':
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'Unsafe': return 'status-unsafe';
      case 'Use Caution': return 'status-caution';
      case 'Safe': return 'status-safe';
      default: return '';
    }
  };

  // Handle retry when API fails
  const handleRetry = () => {
    setError('');
    checkInteractions();
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <div className="page-container">
        <div className="section drug-interaction-container full-width-container">
          <h1 className="page-title">Drug Interaction Checker</h1>
          <p className="subtitle">Check for potential interactions between your medications</p>
          
          {networkStatus === 'offline' && (
            <div className="network-warning">
              <p>You are currently offline. Limited functionality available using local database.</p>
            </div>
          )}
          
          <div className="disclaimer-box">
            <h3>Important Medical Disclaimer</h3>
            <p>
              This tool is for informational purposes only and is not a substitute for professional medical advice.
              Always consult with a qualified healthcare provider before making any changes to your medication regimen.
            </p>
            <p>
              <strong>In case of emergency:</strong> Call 108 (National Emergency Number) or 1800-180-1104 (National Poison Control Helpline) or visit the nearest emergency department.
            </p>
          </div>
          
          <div className="content-wrapper">
            <div className="medication-search">
              <h2>Add Your Medications</h2>
              <div className="search-container">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a medication by brand or generic name..."
                  aria-label="Search for a medication"
                  className="search-input"
                  ref={searchInputRef}
                />
                
                {isLoading && searchTerm.length > 1 && (
                  <div className="search-loading">
                    <span className="spinner-small"></span>
                    <span>Searching...</span>
                  </div>
                )}
                
                {suggestions.length > 0 && (
                  <ul className="suggestions-list" ref={suggestionsRef}>
                    {suggestions.map((med, index) => (
                      <li key={med.id || `med-${index}`} onClick={() => handleSuggestionClick(med)}>
                        <strong>{med.name}</strong> 
                        <span className="generic-name">({med.generic})</span>
                        <span className="category-tag">{med.category}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="medications-list">
              <h2>Your Medications ({medications.length})</h2>
              {medications.length === 0 ? (
                <p className="empty-list">No medications added yet. Search and add medications above.</p>
              ) : (
                <>
                  <ul className="med-list">
                    {medications.map(med => (
                      <li key={med.id} className="med-item">
                        <div className="med-info">
                          <strong>{med.name}</strong>
                          <span className="generic-name">{med.generic}</span>
                          <span className="category-tag">{med.category}</span>
                        </div>
                        <button 
                          onClick={() => removeMedication(med.id)}
                          className="remove-med-btn"
                          aria-label={`Remove ${med.name}`}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  {validationError && (
                    <div className="validation-error">
                      {validationError}
                    </div>
                  )}
                  
                  <button 
                    className="check-interactions-btn"
                    onClick={checkInteractions}
                    disabled={isLoading || medications.length < 2}
                  >
                    {isLoading ? 'Checking Interactions...' : `Check Interactions (${medications.length} medications)`}
                  </button>
                  
                  <p className="minimum-requirement">
                    <small>* At least 2 medications are required to check interactions</small>
                  </p>
                </>
              )}
            </div>
          </div>
          
          {analysisPerformed && medications.length > 1 && (
            <div className="interaction-results">
              <h2>Interaction Analysis</h2>
              
              {isLoading ? (
                <div className="loading-spinner">
                  <span className="spinner"></span>
                  <p>Checking for interactions...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <p>{error}</p>
                  <button 
                    onClick={handleRetry}
                    className="retry-btn"
                  >
                    Retry
                  </button>
                </div>
              ) : interactions.length > 0 ? (
                <div className="interactions-found">
                  <p className="interaction-summary">
                    Found {interactions.length} potential interaction{interactions.length !== 1 ? 's' : ''} between your medications.
                  </p>
                  
                  <ul className="interactions-list">
                    {interactions.map((interaction, index) => (
                      <li key={index} className={`interaction-item ${getStatusClass(interaction.status)}`}>
                        <div className="interaction-header">
                          <span className={`interaction-status ${getStatusClass(interaction.status)}`}>
                            {interaction.status}
                          </span>
                          <span className={`interaction-severity ${getSeverityClass(interaction.severity)}`}>
                            {interaction.severity.charAt(0).toUpperCase() + interaction.severity.slice(1)} Severity
                          </span>
                        </div>
                        <div className="interaction-medications">
                          <strong>Between:</strong> {interaction.medications.join(' and ')}
                        </div>
                        <p className="interaction-description">{interaction.description}</p>
                        {interaction.recommendation && (
                          <div className="interaction-recommendation">
                            <strong>Recommendation:</strong> {interaction.recommendation}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="interaction-disclaimer">
                    <p>
                      <strong>Note:</strong> This information is based on medical literature and drug databases. 
                      Individual responses to drug combinations may vary. Always consult with your healthcare provider.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="no-interactions">
                  <p className="safe-message">No interactions found between your current medications.</p>
                  <p className="disclaimer-small">
                    Note: This tool may not detect all possible interactions. Always consult with your healthcare provider.
                  </p>
                </div>
              )}
              
              {/* Alternative Medicine Suggestions */}
              {alternativeSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 ml-3">Alternative Medicine Suggestions</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Based on the high-severity interactions found, here are some safer alternatives you can discuss with your healthcare provider:
                  </p>
                  <div className="space-y-3">
                    {alternativeSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-blue-900">{suggestion.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {suggestion.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Indications:</strong> {suggestion.indications}
                        </p>
                        {suggestion.contraindications && (
                          <p className="text-xs text-orange-600">
                            <strong>Contraindications:</strong> {suggestion.contraindications}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Important:</strong> Always consult your healthcare provider before switching medications. These suggestions are based on therapeutic categories and may not be suitable for your specific condition.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="additional-info">
            <h3>About Drug Interactions</h3>
            <p>
              Drug interactions occur when a drug's effect changes when taken with another substance.
              This can increase or decrease the effectiveness of one or both drugs, or cause unexpected side effects.
            </p>
            <p>
              Interactions can occur with:
            </p>
            <ul>
              <li>Prescription medications</li>
              <li>Over-the-counter drugs</li>
              <li>Herbal supplements and vitamins</li>
              <li>Food and beverages</li>
              <li>Medical conditions</li>
            </ul>
            <p>
              Always keep an updated list of all medications you take and share it with your healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default DrugInteraction;