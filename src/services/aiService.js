/**
 * Service for simplifying medical text using AI techniques
 * Note: In a production app, this would call an actual AI API like OpenAI
 */

/**
 * Simplify medical text to patient-friendly language
 * @param {string} medicalText - The medical text to simplify
 * @returns {Promise<string>} - Simplified text
 */
export const simplifyMedicalText = async (medicalText) => {
  try {
    if (!medicalText || typeof medicalText !== 'string') {
      return 'No information available';
    }
    
    // In a real implementation, this would call an AI API
    // For now, we'll use a more comprehensive rule-based approach
    
    let simplifiedText = medicalText;
    
    // Expanded replacements for common medical terms
    const replacements = {
      // Medication types
      'analgesic': 'pain reliever',
      'antibiotic': 'medicine that fights bacterial infections',
      'anticoagulant': 'blood thinner',
      'antihypertensive': 'blood pressure lowering medicine',
      'anti-inflammatory': 'medicine that reduces swelling and inflammation',
      'bronchodilator': 'medicine that helps you breathe easier',
      'diuretic': 'water pill that removes excess fluid',
      'hypoglycemic': 'medicine that lowers blood sugar',
      'antidepressant': 'medicine that helps with depression',
      'antipsychotic': 'medicine that helps with certain mental health conditions',
      'antihistamine': 'medicine that reduces allergy symptoms',
      'antifungal': 'medicine that treats fungal infections',
      'antiviral': 'medicine that fights virus infections',
      'nsaid': 'non-steroidal anti-inflammatory drug',
      'NSAID': 'non-steroidal anti-inflammatory drug',
      'antipyretic': 'fever reducer',
      'anxiolytic': 'medication for anxiety',
      'hypnotic': 'sleep medication',
      'laxative': 'medication that helps with bowel movements',
      'antiemetic': 'medication for nausea and vomiting',
      'antacid': 'medication that neutralizes stomach acid',
      'decongestant': 'medication that relieves nasal congestion',
      'expectorant': 'medication that helps clear mucus',
      'immunosuppressant': 'medication that suppresses the immune system',
      'corticosteroid': 'steroid medication that reduces inflammation',
      'anticonvulsant': 'medication for seizures',
      'antiarrhythmic': 'medication for irregular heartbeat',
      'statins': 'cholesterol-lowering medications',
      
      // Administration routes
      'oral': 'taken by mouth',
      'topical': 'applied to the skin',
      'subcutaneous': 'injected under the skin',
      'intramuscular': 'injected into a muscle',
      'intravenous': 'given through a vein',
      'sublingual': 'placed under the tongue',
      'transdermal': 'absorbed through the skin',
      'ophthalmic': 'applied to the eyes',
      'otic': 'applied to the ears',
      'nasal': 'applied in the nose',
      'rectal': 'inserted into the rectum',
      'vaginal': 'inserted into the vagina',
      
      // Medical terms
      'contraindicated': 'should not be used',
      'adverse effects': 'side effects',
      'adverse reactions': 'side effects',
      'hypertension': 'high blood pressure',
      'hypotension': 'low blood pressure',
      'myocardial infarction': 'heart attack',
      'cerebrovascular accident': 'stroke',
      'gastrointestinal': 'related to the stomach and intestines',
      'hepatic': 'related to the liver',
      'renal': 'related to the kidneys',
      'pulmonary': 'related to the lungs',
      'cardiac': 'related to the heart',
      'neurological': 'related to the brain and nerves',
      'edema': 'swelling due to fluid buildup',
      'dyspnea': 'difficulty breathing',
      'pruritus': 'itching',
      'vertigo': 'dizziness',
      'nausea': 'feeling sick to your stomach',
      'pyrexia': 'fever',
      'somnolence': 'sleepiness',
      'insomnia': 'trouble sleeping',
      'anorexia': 'loss of appetite',
      'dyspepsia': 'indigestion',
      'constipation': 'trouble having bowel movements',
      'diarrhea': 'loose, watery stools',
      'hyperglycemia': 'high blood sugar',
      'hypoglycemia': 'low blood sugar',
      'tachycardia': 'fast heart rate',
      'bradycardia': 'slow heart rate',
      'hyponatremia': 'low sodium in the blood',
      'hyperkalemia': 'high potassium in the blood',
      'hypercholesterolemia': 'high cholesterol',
      'syndrome': 'condition',
      'reye\'s syndrome': 'Reye\'s syndrome (a rare but serious condition)',
      'hives': 'itchy red welts on the skin',
      'facial swelling': 'swelling of the face',
      'shock': 'a life-threatening condition',
      'asthma': 'a breathing condition',
      'wheezing': 'breathing with a whistling sound',
      'stomach bleeding': 'bleeding in the stomach',
      'severe stomach bleeding': 'serious bleeding in the stomach',
    };
    
    // Apply replacements
    Object.entries(replacements).forEach(([medical, simple]) => {
      const regex = new RegExp(`\\b${medical}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, simple);
    });
    
    // Improve readability of dosage instructions
    simplifiedText = simplifiedText
      .replace(/take (\d+) to (\d+) tablets/gi, 'take $1-$2 tablets')
      .replace(/adults and children (\d+) years and over/gi, 'For adults and children $1 years and over:')
      .replace(/children under (\d+) years/gi, 'For children under $1 years:')
      .replace(/not to exceed (\d+) tablets/gi, 'Do not take more than $1 tablets')
      .replace(/unless directed by a doctor/gi, 'unless your doctor directs otherwise')
      .replace(/consult a doctor/gi, 'consult your doctor')
      .replace(/drink a full glass of water/gi, 'Take with a full glass of water');
    
    // Break long paragraphs into shorter sentences
    simplifiedText = simplifiedText
      .replace(/\. /g, '.\n')
      .split('\n')
      .map(sentence => {
        // Shorten very long sentences
        if (sentence.length > 120) {
          // Try to find a natural break point
          const breakPoint = sentence.lastIndexOf(',', 120);
          if (breakPoint > 60) {
            return sentence.substring(0, breakPoint + 1) + '\n' + sentence.substring(breakPoint + 1);
          }
          return sentence;
        }
        return sentence;
      })
      .join('\n');
    
    // Organize warnings and side effects better
    if (simplifiedText.includes('warning') || simplifiedText.includes('Warning')) {
      simplifiedText = simplifiedText
        .replace(/warning[s]?\s*:/gi, 'Important Warning:')
        .replace(/allergy alert\s*:/gi, 'Allergy Alert:')
        .replace(/stomach bleeding warning\s*:/gi, 'Stomach Bleeding Warning:');
    }
    
    // Convert to bullet points for better readability when appropriate
    if (simplifiedText.length > 200 && !simplifiedText.includes('•')) {
      simplifiedText = simplifiedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Don't add bullet to header lines
          if (line.includes('Warning:') || line.includes('Alert:')) {
            return line;
          }
          return `• ${line}`;
        })
        .join('\n');
    }
    
    return simplifiedText;
  } catch (error) {
    console.error('Error simplifying text:', error);
    return medicalText || 'No information available'; // Return original text if simplification fails
  }
};

/**
 * Generate a simplified explanation for a medicine
 * @param {Object} medicineData - The medicine data from the API
 * @returns {Promise<Object>} - Object with simplified explanations
 */
export const generateSimplifiedExplanation = async (medicineData) => {
  if (!medicineData) return null;
  
  try {
    // Format and improve the text for each section
    const formatText = (text) => {
      if (!text) return '';
      
      // Fix capitalization and punctuation
      let formatted = text.trim();
      
      // Ensure first letter is capitalized
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      
      // Ensure proper sentence endings
      if (!formatted.endsWith('.') && !formatted.endsWith('!') && !formatted.endsWith('?')) {
        formatted += '.';
      }
      
      // Fix common grammar issues
      formatted = formatted
        .replace(/\s+/g, ' ')                // Remove extra spaces
        .replace(/\s+([.,;:!?])/g, '$1')     // Remove spaces before punctuation
        .replace(/([.,;:!?])([a-zA-Z])/g, '$1 $2') // Add space after punctuation if missing
        .replace(/\bi\b/g, 'I')             // Capitalize 'i' as a standalone word
        .replace(/\bconsult a doctor\b/gi, 'consult your doctor') // More personal
        .replace(/\bchildren under (\d+)\b/gi, 'children under $1 years of age') // More precise
        .replace(/\bevery (\d+) hours\b/gi, 'every $1 hours') // Consistent format
        .replace(/\s+\./g, '.')             // Remove space before period
        .replace(/\s+,/g, ',')              // Remove space before comma
        .replace(/\s+:/g, ':')              // Remove space before colon
        .replace(/\s+;/g, ';')              // Remove space before semicolon
        .replace(/\s+!/g, '!')              // Remove space before exclamation
        .replace(/\s+\?/g, '?');            // Remove space before question mark
      
      return formatted;
    };
    
    const simplifiedData = {
      ...medicineData,
      simplifiedPurpose: formatText(await simplifyMedicalText(medicineData.purpose)),
      simplifiedSideEffects: formatText(await simplifyMedicalText(medicineData.sideEffects)),
      simplifiedPrecautions: formatText(await simplifyMedicalText(medicineData.precautions)),
      simplifiedDosage: formatText(await simplifyMedicalText(medicineData.dosage)),
      simplifiedWhenToUse: formatText(await simplifyMedicalText(medicineData.whenToUse)),
      simplifiedHowToUse: formatText(await simplifyMedicalText(medicineData.howToUse)),
      simplifiedWhenNotToUse: formatText(await simplifyMedicalText(medicineData.whenNotToUse)),
    };
    
    return simplifiedData;
  } catch (error) {
    console.error('Error generating simplified explanation:', error);
    return medicineData; // Return original data if simplification fails
  }
};