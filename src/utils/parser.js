import { v4 as uuidv4 } from 'uuid';
import medicinesList from '../data/medicines.json';

/**
 * Normalize text for better matching
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, ' ')        // Replace multiple spaces with a single space
    .trim();
};

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Distance score
 */
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  return track[str2.length][str1.length];
};

/**
 * Calculate similarity ratio between two strings (0-100)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity percentage
 */
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 100;
  
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return similarity;
};

/**
 * Find best medicine match from database
 * @param {string} medicineName - Medicine name to match
 * @param {number} threshold - Similarity threshold (0-100)
 * @returns {string|null} - Best match or null if no match found
 */
const findBestMedicineMatch = (medicineName, threshold = 75) => {
  if (!medicineName) return null;
  if (medicineName.length < 3) return null; // Skip very short strings
  
  const normalizedName = normalizeText(medicineName);
  let bestMatch = null;
  let bestScore = 0;
  
  // Exact match check first
  const exactMatch = medicinesList.find(med => 
    normalizeText(med) === normalizedName);
  
  if (exactMatch) {
    return { name: exactMatch, score: 100 };
  }
  
  // Check for substring match (e.g., "Lisinopril" in "Lisinopril 10mg")
  const substringMatch = medicinesList.find(med => 
    normalizedName.includes(normalizeText(med)) || 
    normalizeText(med).includes(normalizedName));
  
  if (substringMatch) {
    const subScore = 90; // High confidence for substring matches
    if (subScore > bestScore) {
      bestScore = subScore;
      bestMatch = substringMatch;
    }
  }
  
  // Fuzzy matching for everything else
  for (const medicine of medicinesList) {
    const normalizedMedicine = normalizeText(medicine);
    const score = calculateSimilarity(normalizedName, normalizedMedicine);
    
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = medicine;
    }
  }
  
  return bestMatch ? { name: bestMatch, score: bestScore } : null;
};

/**
 * Parse OCR text to extract medicine information
 * @param {string} ocrText - The raw OCR text to parse
 * @returns {Array<{id: string, name: string, dose: string, times: string[]}>} - Array of parsed medicines
 */
export const parseMedicines = (ocrText) => {
  if (!ocrText || typeof ocrText !== 'string') {
    return [];
  }
  
  // Split text into lines and remove empty lines
  const lines = ocrText
    .split('\n')
    .map(line => line.trim())
    .filter(line => {
      // Filter out lines that are too short or contain only special characters
      if (line.length < 3) return false;
      // Filter out lines with only numbers and spaces
      if (/^[\d\s\W]+$/.test(line)) return false;
      // Filter out lines with less than 2 letters
      const letterCount = (line.match(/[a-zA-Z]/g) || []).length;
      if (letterCount < 2) return false;
      return true;
    });
  
  // Regular expressions for parsing
  const doseRegex = /(\d+(?:\.\d+)?\s*(?:mg|g|mcg|IU|tablet|tab|capsule|caps|ml|mL|unit|pill|dose|patch|spray|drop|drops|application|puff|injection|shot)s?)/i;
  const timesRegex = /\b(?:\d{1,2}(?::\d{2})?\s?(?:am|pm)|morning|noon|evening|night|daily|once daily|twice daily|bd|tid|tds|qid|\d times daily|every \d+ hours|with meals|after meals|before meals|as needed|prn)\b/gi;
  
  // Parse each line for potential medicines
  const medicines = [];
  const processedNames = new Set(); // To avoid duplicates
  
  // First pass: Extract using dose pattern
  for (const line of lines) {
    // Check if line contains a dose pattern
    const doseMatch = line.match(doseRegex);
    
    if (doseMatch) {
      const dose = doseMatch[0].trim();
      const doseIndex = line.indexOf(dose);
      
      // Extract name (text before dose)
      let name = line.substring(0, doseIndex).trim();
      name = name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim(); // Clean up punctuation
      
      // Skip if name is too short or looks like garbage
      if (name.length < 3 || /^[\d\s]+$/.test(name)) {
        continue;
      }
      
      // Find best match for the medicine name
      const bestMatch = findBestMedicineMatch(name);
      const finalName = bestMatch ? bestMatch.name : name;
      
      // Skip if no good match found and original name looks suspicious
      if (!bestMatch && (name.length < 4 || name.split(' ').length > 5)) {
        continue;
      }
      
      // Extract times
      const timesMatches = line.match(timesRegex) || [];
      const times = timesMatches.map(time => time.trim());
      
      // Only add if we have at least a name and dose and not a duplicate
      if (finalName && !processedNames.has(finalName.toLowerCase())) {
        processedNames.add(finalName.toLowerCase());
        medicines.push({
          id: uuidv4(),
          name: finalName,
          originalName: name, // Keep original for reference
          dose,
          times,
          matchScore: bestMatch ? bestMatch.score : 0
        });
      }
    }
  }
  
  // Second pass: Look for medicine names without doses
  for (const line of lines) {
    // Skip lines that already matched with doses
    if (line.match(doseRegex)) continue;
    
    // Try to match multi-word medicine names first
    // Look for 2-3 word combinations that might be medicine names
    const words = line.split(/[,;.\s]+/).filter(word => word.length > 2);
    
    // Try different word combinations (1-3 words)
    for (let i = 0; i < words.length; i++) {
      // Single word
      let phrase = words[i];
      let bestMatch = findBestMedicineMatch(phrase);
      
      // Try two-word phrase if available
      if (i < words.length - 1) {
        const twoWordPhrase = words[i] + ' ' + words[i+1];
        const twoWordMatch = findBestMedicineMatch(twoWordPhrase);
        if (twoWordMatch && (!bestMatch || twoWordMatch.score > bestMatch.score)) {
          bestMatch = twoWordMatch;
          phrase = twoWordPhrase;
          i++; // Skip the next word since we used it
        }
      }
      
      // Try three-word phrase if available
      if (i < words.length - 2) {
        const threeWordPhrase = words[i] + ' ' + words[i+1] + ' ' + words[i+2];
        const threeWordMatch = findBestMedicineMatch(threeWordPhrase);
        if (threeWordMatch && (!bestMatch || threeWordMatch.score > bestMatch.score)) {
          bestMatch = threeWordMatch;
          phrase = threeWordPhrase;
          i += 2; // Skip the next two words since we used them
        }
      }
      
      if (bestMatch && !processedNames.has(bestMatch.name.toLowerCase())) {
        processedNames.add(bestMatch.name.toLowerCase());
        medicines.push({
          id: uuidv4(),
          name: bestMatch.name,
          originalName: phrase,
          dose: '',  // No dose detected
          times: [],
          matchScore: bestMatch.score
        });
      }
    }
  }
  
  return medicines;
};