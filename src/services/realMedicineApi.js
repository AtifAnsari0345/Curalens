import axios from 'axios';
import { getDetailedMedicineInfo } from '../data/detailedMedicineDatabase.js';

// Multiple API endpoints for comprehensive medicine data
const APIs = {
  FDA: 'https://api.fda.gov/drug',
  RXNORM: 'https://rxnav.nlm.nih.gov/REST',
  OPENFDA_DEVICE: 'https://api.fda.gov/device',
  DRUGBANK_PUBLIC: 'https://go.drugbank.com/public_api/v1'
};

/**
 * Advanced OCR correction for medicine names
 * @param {string} name - Raw OCR medicine name
 * @returns {string} - Corrected medicine name
 */
const correctOCRErrors = (name) => {
  if (!name) return '';
  
  // Common OCR corrections
  const corrections = {
    // Common letter substitutions
    'louprofen': 'ibuprofen',
    'ibuprufen': 'ibuprofen',
    'ibuprafen': 'ibuprofen',
    'paracetamol': 'acetaminophen',
    'acetaminaphen': 'acetaminophen',
    'acetaminophen': 'acetaminophen',
    'asprin': 'aspirin',
    'aspirn': 'aspirin',
    'metfarmin': 'metformin',
    'metfornin': 'metformin',
    'lisinopril': 'lisinopril',
    'lisinopnl': 'lisinopril',
    'atorvastatin': 'atorvastatin',
    'atorvastatm': 'atorvastatin',
    'amlodipine': 'amlodipine',
    'amlodipme': 'amlodipine',
    'omeprazole': 'omeprazole',
    'omeprazale': 'omeprazole',
    'dabigatran': 'dabigatran',
    'dabdigatran': 'dabigatran',
    'dabigatran etexilate': 'dabigatran etexilate',
    'dabigatran etexiate': 'dabigatran etexilate',
    'loratadine': 'loratadine',
    'loratadme': 'loratadine',
    'cetirizine': 'cetirizine',
    'cetirizme': 'cetirizine'
  };
  
  let corrected = name.toLowerCase().trim();
  
  // Remove common OCR artifacts
  corrected = corrected
    .replace(/^\d+\s+\d+\s+/, '') // Remove leading numbers like "3 10 "
    .replace(/^\d+\s+/, '') // Remove single leading number
    .replace(/\s+tablets?\s*ip$/i, '') // Remove "Tablets IP"
    .replace(/\s+capsules?$/i, '') // Remove "Capsules"
    .replace(/\s+tablets?$/i, '') // Remove "Tablets"
    .replace(/\s+pills?$/i, '') // Remove "Pills"
    .replace(/\s+mg$/i, '') // Remove "mg"
    .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Apply direct corrections
  if (corrections[corrected]) {
    return corrections[corrected];
  }
  
  // Try partial matches for compound names
  for (const [wrong, correct] of Object.entries(corrections)) {
    if (corrected.includes(wrong) || wrong.includes(corrected)) {
      return correct;
    }
  }
  
  return corrected;
};

/**
 * Search RxNorm API for medicine information
 * @param {string} drugName - Medicine name to search
 * @returns {Promise<Object|null>} - Medicine data or null
 */
const searchRxNorm = async (drugName) => {
  try {
    const correctedName = correctOCRErrors(drugName);
    
    // Search for RxCUI (RxNorm Concept Unique Identifier)
    const searchUrl = `${APIs.RXNORM}/drugs.json?name=${encodeURIComponent(correctedName)}`;
    const response = await axios.get(searchUrl, { timeout: 8000 });
    
    if (response.data?.drugGroup?.conceptGroup) {
      const concepts = response.data.drugGroup.conceptGroup;
      
      // Find the best match
      for (const group of concepts) {
        if (group.conceptProperties && group.conceptProperties.length > 0) {
          const concept = group.conceptProperties[0];
          
          // Get detailed information using RxCUI
          const detailsUrl = `${APIs.RXNORM}/rxcui/${concept.rxcui}/properties.json`;
          const detailsResponse = await axios.get(detailsUrl, { timeout: 5000 });
          
          if (detailsResponse.data?.properties) {
            return formatRxNormResponse(detailsResponse.data.properties, concept);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.log(`RxNorm API failed for ${drugName}:`, error.message);
    return null;
  }
};

/**
 * Search OpenFDA API for medicine information
 * @param {string} drugName - Medicine name to search
 * @returns {Promise<Object|null>} - Medicine data or null
 */
const searchOpenFDA = async (drugName) => {
  try {
    const correctedName = correctOCRErrors(drugName);
    
    // Try multiple search strategies
    const searchQueries = [
      `openfda.generic_name:"${correctedName}"`,
      `openfda.brand_name:"${correctedName}"`,
      `openfda.substance_name:"${correctedName}"`,
      `${correctedName}`
    ];
    
    for (const query of searchQueries) {
      try {
        const url = `${APIs.FDA}/label.json?search=${encodeURIComponent(query)}&limit=1`;
        const response = await axios.get(url, { timeout: 8000 });
        
        if (response.data?.results && response.data.results.length > 0) {
          return formatFDAResponse(response.data.results[0]);
        }
      } catch (searchError) {
        continue; // Try next search strategy
      }
    }
    
    return null;
  } catch (error) {
    console.log(`OpenFDA API failed for ${drugName}:`, error.message);
    return null;
  }
};

/**
 * Search NIH Drug Information API
 * @param {string} drugName - Medicine name to search
 * @returns {Promise<Object|null>} - Medicine data or null
 */
const searchNIHDrugs = async (drugName) => {
  try {
    const correctedName = correctOCRErrors(drugName);
    
    // Use DailyMed API (part of NIH)
    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(correctedName)}`;
    const response = await axios.get(url, { timeout: 8000 });
    
    if (response.data?.data && response.data.data.length > 0) {
      const drugData = response.data.data[0];
      return formatNIHResponse(drugData, correctedName);
    }
    
    return null;
  } catch (error) {
    console.log(`NIH DailyMed API failed for ${drugName}:`, error.message);
    return null;
  }
};

/**
 * Format RxNorm API response
 * @param {Object} properties - RxNorm properties
 * @param {Object} concept - RxNorm concept
 * @returns {Object} - Formatted medicine data
 */
const formatRxNormResponse = (properties, concept) => {
  return {
    id: `rxnorm-${concept.rxcui}`,
    name: properties.name || concept.name || 'Unknown',
    description: `${properties.name} - Prescription medication`,
    dosage: 'Follow your doctor\'s prescription',
    sideEffects: ['Consult your healthcare provider for side effects'],
    warnings: ['Take as prescribed by your doctor'],
    interactions: ['May interact with other medications'],
    rxcui: concept.rxcui,
    source: 'RxNorm',
    tty: properties.tty // Term type (e.g., IN = Ingredient, BN = Brand Name)
  };
};

/**
 * Format OpenFDA API response
 * @param {Object} fdaData - FDA API response
 * @returns {Object} - Formatted medicine data
 */
const formatFDAResponse = (fdaData) => {
  const openfda = fdaData.openfda || {};
  
  const name = openfda.generic_name?.[0] || 
               openfda.brand_name?.[0] || 
               openfda.substance_name?.[0] || 
               'Unknown Medicine';
  
  const description = fdaData.purpose?.[0] || 
                     fdaData.indications_and_usage?.[0] || 
                     'Prescription medication';
  
  const dosage = fdaData.dosage_and_administration?.[0] || 
                'Follow your doctor\'s prescription';
  
  const sideEffects = extractTextArray(fdaData.adverse_reactions?.[0]) || 
                     ['Consult your healthcare provider'];
  
  const warnings = extractTextArray(fdaData.warnings?.[0]) || 
                  ['Take as prescribed'];
  
  const interactions = extractTextArray(fdaData.drug_interactions?.[0]) || 
                      ['May interact with other medications'];
  
  return {
    id: `fda-${Date.now()}`,
    name: capitalizeWords(name),
    description: cleanText(description),
    dosage: cleanText(dosage),
    sideEffects: sideEffects.slice(0, 5),
    warnings: warnings.slice(0, 3),
    interactions: interactions.slice(0, 3),
    rxcui: openfda.rxcui?.[0] || null,
    source: 'FDA'
  };
};

/**
 * Format NIH DailyMed response
 * @param {Object} nihData - NIH API response
 * @param {string} searchName - Original search name
 * @returns {Object} - Formatted medicine data
 */
const formatNIHResponse = (nihData, searchName) => {
  return {
    id: `nih-${nihData.setid || Date.now()}`,
    name: capitalizeWords(searchName),
    description: `${capitalizeWords(searchName)} - FDA approved medication`,
    dosage: 'Follow your doctor\'s prescription',
    sideEffects: ['Consult your healthcare provider for side effects'],
    warnings: ['Take as prescribed by your doctor'],
    interactions: ['May interact with other medications'],
    rxcui: null,
    source: 'NIH DailyMed',
    setid: nihData.setid
  };
};

/**
 * Extract text array from FDA text
 * @param {string} text - Raw FDA text
 * @returns {Array<string>} - Array of extracted items
 */
const extractTextArray = (text) => {
  if (!text) return [];
  
  return text
    .split(/[•\n\r]/)
    .map(item => item.trim())
    .filter(item => item.length > 10 && item.length < 200)
    .slice(0, 5);
};

/**
 * Clean and truncate text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300) + (text.length > 300 ? '...' : '');
};

/**
 * Format detailed medicine data from local database
 * @param {Object} detailedData - Detailed medicine data
 * @returns {Object} - Formatted medicine data
 */
const formatDetailedMedicineData = (detailedData) => {
  return {
    id: detailedData.id,
    name: detailedData.name,
    genericName: detailedData.genericName,
    brandNames: detailedData.brandNames,
    description: detailedData.description,
    purpose: detailedData.purpose,
    howToUse: detailedData.howToUse,
    dosage: formatDosageInfo(detailedData.dosage),
    sideEffects: formatSideEffectsInfo(detailedData.sideEffects),
    warnings: detailedData.warnings,
    contraindications: detailedData.contraindications,
    interactions: detailedData.interactions,
    precautions: detailedData.precautions,
    pregnancyCategory: detailedData.pregnancyCategory,
    breastfeeding: detailedData.breastfeeding,
    rxcui: detailedData.rxcui,
    source: 'Comprehensive Database'
  };
};

/**
 * Format dosage information
 * @param {Object} dosageData - Dosage data object
 * @returns {string} - Formatted dosage string
 */
const formatDosageInfo = (dosageData) => {
  if (typeof dosageData === 'string') return dosageData;
  
  let formatted = '';
  if (dosageData.adults) {
    formatted += `Adults: ${dosageData.adults}`;
  }
  if (dosageData.children) {
    formatted += formatted ? ` | Children: ${dosageData.children}` : `Children: ${dosageData.children}`;
  }
  if (dosageData.elderly) {
    formatted += formatted ? ` | Elderly: ${dosageData.elderly}` : `Elderly: ${dosageData.elderly}`;
  }
  
  return formatted || 'Follow your doctor\'s prescription';
};

/**
 * Format side effects information
 * @param {Object} sideEffectsData - Side effects data object
 * @returns {Array<string>} - Formatted side effects array
 */
const formatSideEffectsInfo = (sideEffectsData) => {
  if (Array.isArray(sideEffectsData)) return sideEffectsData;
  
  const formatted = [];
  
  if (sideEffectsData.common) {
    formatted.push(`Common: ${sideEffectsData.common.join(', ')}`);
  }
  if (sideEffectsData.serious) {
    formatted.push(`Serious: ${sideEffectsData.serious.join(', ')}`);
  }
  if (sideEffectsData.rare) {
    formatted.push(`Rare: ${sideEffectsData.rare.join(', ')}`);
  }
  
  return formatted.length > 0 ? formatted : ['Consult your healthcare provider for side effects'];
};

/**
 * Capitalize words
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
 * Main function to search for medicine information across multiple sources
 * @param {string} medicineName - Medicine name to search
 * @returns {Promise<Object|null>} - Medicine information or null
 */
export const searchRealMedicineData = async (medicineName) => {
  if (!medicineName || medicineName.trim().length < 2) {
    return null;
  }
  
  console.log(`Searching for medicine: ${medicineName}`);
  
  // Step 1: Check detailed local database first (highest quality data)
  const detailedInfo = getDetailedMedicineInfo(medicineName);
  if (detailedInfo) {
    console.log(`Found detailed medicine data: ${detailedInfo.name}`);
    return formatDetailedMedicineData(detailedInfo);
  }
  
  // Step 2: Try external APIs as fallback
  const searchPromises = [
    searchRxNorm(medicineName),
    searchOpenFDA(medicineName),
    searchNIHDrugs(medicineName)
  ];
  
  try {
    // Wait for first successful result
    const results = await Promise.allSettled(searchPromises);
    
    // Return first successful result
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`Found medicine data from ${result.value.source}: ${result.value.name}`);
        return result.value;
      }
    }
    
    console.log(`No medicine data found for: ${medicineName}`);
    return null;
    
  } catch (error) {
    console.error('Error searching medicine APIs:', error);
    return null;
  }
};

/**
 * Search for similar medicine names (for suggestions)
 * @param {string} partialName - Partial medicine name
 * @returns {Promise<Array<string>>} - Array of similar medicine names
 */
export const searchSimilarMedicines = async (partialName) => {
  try {
    const correctedName = correctOCRErrors(partialName);
    
    // Search RxNorm for approximate matches
    const url = `${APIs.RXNORM}/approximateTerm.json?term=${encodeURIComponent(correctedName)}&maxEntries=5`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data?.approximateGroup?.candidate) {
      return response.data.approximateGroup.candidate
        .map(candidate => candidate.candidateName)
        .slice(0, 5);
    }
    
    return [];
  } catch (error) {
    console.log('Similar medicines search failed:', error.message);
    return [];
  }
};
