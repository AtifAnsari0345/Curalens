import axios from 'axios';

const FDA_API_BASE = 'https://api.fda.gov/drug';

/**
 * Search for drug information using OpenFDA API
 * @param {string} drugName - Name of the drug to search
 * @returns {Promise<Object|null>} - Drug information or null if not found
 */
export const searchFDADrug = async (drugName) => {
  try {
    if (!drugName || drugName.trim() === '') {
      return null;
    }

    // Clean the drug name
    const cleanName = drugName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '+');

    // Try to get drug label information
    const labelUrl = `${FDA_API_BASE}/label.json?search=openfda.generic_name:"${cleanName}"+openfda.brand_name:"${cleanName}"&limit=1`;
    
    const response = await axios.get(labelUrl, {
      timeout: 5000 // 5 second timeout
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      const drugData = response.data.results[0];
      return formatFDAResponse(drugData);
    }

    return null;
  } catch (error) {
    // If FDA API fails, return null to fall back to local database
    console.log(`FDA API search failed for ${drugName}:`, error.message);
    return null;
  }
};

/**
 * Format FDA API response into our standard format
 * @param {Object} fdaData - Raw FDA API response
 * @returns {Object} - Formatted drug information
 */
const formatFDAResponse = (fdaData) => {
  try {
    const openfda = fdaData.openfda || {};
    
    // Get the drug name (prefer generic name)
    const genericName = openfda.generic_name?.[0] || '';
    const brandName = openfda.brand_name?.[0] || '';
    const name = genericName || brandName || 'Unknown';

    // Extract relevant sections
    const purpose = fdaData.purpose?.[0] || 
                   fdaData.indications_and_usage?.[0] || 
                   'Pain reliever and fever reducer';

    const dosage = fdaData.dosage_and_administration?.[0] || 
                  'Follow your doctor\'s prescription';

    const sideEffects = fdaData.adverse_reactions?.[0] || 
                       fdaData.warnings?.[0] || 
                       'Consult your healthcare provider';

    const warnings = fdaData.warnings?.[0] || 
                    fdaData.contraindications?.[0] || 
                    'Consult your healthcare provider before use';

    const interactions = fdaData.drug_interactions?.[0] || 
                        'May interact with other medications';

    // Clean up the text (FDA data can be very long)
    const cleanText = (text) => {
      if (!text) return '';
      // Remove excessive whitespace and limit length
      return text
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500) + (text.length > 500 ? '...' : '');
    };

    return {
      id: `fda-${Date.now()}`,
      name: capitalizeWords(name),
      description: cleanText(purpose),
      dosage: cleanText(dosage),
      sideEffects: extractListItems(sideEffects),
      warnings: extractListItems(warnings),
      interactions: extractListItems(interactions),
      rxcui: openfda.rxcui?.[0] || null,
      source: 'FDA'
    };
  } catch (error) {
    console.error('Error formatting FDA response:', error);
    return null;
  }
};

/**
 * Extract list items from FDA text
 * @param {string} text - Text containing list items
 * @returns {Array<string>} - Array of items
 */
const extractListItems = (text) => {
  if (!text) return [];
  
  // Try to extract bullet points or numbered items
  const items = text
    .split(/[•\n\r]/)
    .map(item => item.trim())
    .filter(item => item.length > 10 && item.length < 200)
    .slice(0, 5); // Limit to 5 items

  return items.length > 0 ? items : [text.substring(0, 200)];
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Search for drug by RxCUI (RxNorm Concept Unique Identifier)
 * @param {string} rxcui - RxCUI to search
 * @returns {Promise<Object|null>} - Drug information or null
 */
export const searchByRxCUI = async (rxcui) => {
  try {
    const url = `${FDA_API_BASE}/label.json?search=openfda.rxcui:"${rxcui}"&limit=1`;
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data && response.data.results && response.data.results.length > 0) {
      return formatFDAResponse(response.data.results[0]);
    }

    return null;
  } catch (error) {
    console.log(`FDA API RxCUI search failed for ${rxcui}:`, error.message);
    return null;
  }
};
