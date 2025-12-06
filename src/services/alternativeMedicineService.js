// Alternative Medicine Suggestions Service
// Provides safe therapeutic alternatives for medications with high-severity interactions

export const therapeuticAlternatives = {
  // NSAIDs/Anti-inflammatory alternatives
  'Aspirin': {
    category: 'Antiplatelet/Anti-inflammatory',
    alternatives: [
      {
        name: 'Clopidogrel',
        generic: 'clopidogrel',
        category: 'Antiplatelet',
        rxcui: '6809',
        safety: 'Generally safer than aspirin for bleeding risk when used alone',
        indications: ['Cardiovascular protection', 'Stroke prevention'],
        contraindications: ['Active bleeding', 'Severe liver disease']
      },
      {
        name: 'Acetaminophen',
        generic: 'acetaminophen',
        category: 'Analgesic/Antipyretic',
        rxcui: '161',
        safety: 'Safer for pain/fever, no antiplatelet effect',
        indications: ['Pain relief', 'Fever reduction'],
        contraindications: ['Severe liver disease', 'High daily doses']
      },
      {
        name: 'Celecoxib',
        generic: 'celecoxib',
        category: 'COX-2 Inhibitor',
        rxcui: '205323',
        safety: 'Lower GI bleeding risk than traditional NSAIDs',
        indications: ['Arthritis', 'Pain', 'Inflammation'],
        contraindications: ['Sulfa allergy', 'Heart disease']
      }
    ]
  },

  // Anticoagulant alternatives
  'Warfarin': {
    category: 'Anticoagulant',
    alternatives: [
      {
        name: 'Rivaroxaban',
        generic: 'rivaroxaban',
        category: 'Direct Oral Anticoagulant (DOAC)',
        rxcui: '1364448',
        safety: 'Lower bleeding risk than warfarin, no INR monitoring',
        indications: ['Atrial fibrillation', 'DVT/PE treatment', 'Stroke prevention'],
        contraindications: ['Active bleeding', 'Severe kidney disease']
      },
      {
        name: 'Apixaban',
        generic: 'apixaban',
        category: 'Direct Oral Anticoagulant (DOAC)',
        rxcui: '1364439',
        safety: 'Lower bleeding risk than warfarin, no INR monitoring',
        indications: ['Atrial fibrillation', 'DVT/PE treatment'],
        contraindications: ['Active bleeding', 'Severe liver disease']
      },
      {
        name: 'Dabigatran',
        generic: 'dabigatran',
        category: 'Direct Thrombin Inhibitor',
        rxcui: '602505',
        safety: 'Lower bleeding risk than warfarin, no INR monitoring',
        indications: ['Atrial fibrillation', 'DVT/PE treatment'],
        contraindications: ['Active bleeding', 'Severe kidney disease']
      }
    ]
  },

  // NSAID alternatives
  'Ibuprofen': {
    category: 'NSAID',
    alternatives: [
      {
        name: 'Acetaminophen',
        generic: 'acetaminophen',
        category: 'Analgesic/Antipyretic',
        rxcui: '161',
        safety: 'No GI bleeding risk, safe with anticoagulants',
        indications: ['Pain relief', 'Fever reduction'],
        contraindications: ['Severe liver disease', 'High daily doses']
      },
      {
        name: 'Celecoxib',
        generic: 'celecoxib',
        category: 'COX-2 Inhibitor',
        rxcui: '205323',
        safety: 'Lower GI bleeding risk than traditional NSAIDs',
        indications: ['Arthritis', 'Pain', 'Inflammation'],
        contraindications: ['Sulfa allergy', 'Heart disease']
      },
      {
        name: 'Topical Diclofenac',
        generic: 'diclofenac topical',
        category: 'Topical NSAID',
        rxcui: '352051',
        safety: 'Minimal systemic absorption, lower interaction risk',
        indications: ['Localized pain', 'Arthritis (joint pain)'],
        contraindications: ['Open wounds', 'Skin infections']
      }
    ]
  },

  // Antiplatelet alternatives
  'Clopidogrel': {
    category: 'Antiplatelet',
    alternatives: [
      {
        name: 'Aspirin',
        generic: 'aspirin',
        category: 'Antiplatelet',
        rxcui: '1191',
        safety: 'Well-established, lower cost alternative',
        indications: ['Cardiovascular protection', 'Stroke prevention'],
        contraindications: ['Active bleeding', 'Severe GI disease']
      },
      {
        name: 'Ticagrelor',
        generic: 'ticagrelor',
        category: 'Antiplatelet (P2Y12 inhibitor)',
        rxcui: '1114191',
        safety: 'More potent than clopidogrel, faster onset',
        indications: ['Acute coronary syndrome', 'Stent placement'],
        contraindications: ['Active bleeding', 'History of intracranial hemorrhage']
      }
    ]
  },

  // Proton Pump Inhibitor alternatives
  'Omeprazole': {
    category: 'Proton Pump Inhibitor',
    alternatives: [
      {
        name: 'Famotidine',
        generic: 'famotidine',
        category: 'H2 Blocker',
        rxcui: '4278',
        safety: 'Lower interaction potential than PPIs',
        indications: ['Heartburn', 'Acid reflux', 'Ulcer prevention'],
        contraindications: ['Severe kidney disease (without dose adjustment)']
      },
      {
        name: 'Ranitidine',
        generic: 'ranitidine',
        category: 'H2 Blocker',
        rxcui: '8279',
        safety: 'Lower interaction potential than PPIs',
        indications: ['Heartburn', 'Acid reflux', 'Ulcer treatment'],
        contraindications: ['Severe kidney disease']
      },
      {
        name: 'Pantoprazole',
        generic: 'pantoprazole',
        category: 'Proton Pump Inhibitor',
        rxcui: '20005',
        safety: 'Lower interaction potential than omeprazole',
        indications: ['GERD', 'Ulcer treatment', 'Acid reduction'],
        contraindications: ['Severe liver disease']
      }
    ]
  }
};

// Alternative medicine suggestions based on therapeutic need
export const therapeuticCategories = {
  'Pain Relief': {
    firstLine: [
      { name: 'Acetaminophen', rxcui: '161', safety: 'Safest for most patients' },
      { name: 'Topical NSAIDs', rxcui: '352051', safety: 'Minimal systemic effects' }
    ],
    secondLine: [
      { name: 'Celecoxib', rxcui: '205323', safety: 'Lower GI risk than traditional NSAIDs' },
      { name: 'Tramadol', rxcui: '38637', safety: 'Opioid-like, monitor for dependence' }
    ]
  },
  'Inflammation': {
    firstLine: [
      { name: 'Celecoxib', rxcui: '205323', safety: 'COX-2 selective, lower GI risk' },
      { name: 'Topical NSAIDs', rxcui: '352051', safety: 'Localized treatment' }
    ],
    secondLine: [
      { name: 'Prednisone', rxcui: '8640', safety: 'Steroid, significant side effects' },
      { name: 'Methotrexate', rxcui: '6813', safety: 'DMARD, requires monitoring' }
    ]
  },
  'Heart Protection': {
    firstLine: [
      { name: 'Clopidogrel', rxcui: '6809', safety: 'Alternative antiplatelet' },
      { name: 'Apixaban', rxcui: '1364439', safety: 'DOAC, no INR monitoring' }
    ],
    secondLine: [
      { name: 'Rivaroxaban', rxcui: '1364448', safety: 'DOAC, once daily dosing' },
      { name: 'Dabigatran', rxcui: '602505', safety: 'Direct thrombin inhibitor' }
    ]
  },
  'Acid Reduction': {
    firstLine: [
      { name: 'Famotidine', rxcui: '4278', safety: 'H2 blocker, fewer interactions' },
      { name: 'Ranitidine', rxcui: '8279', safety: 'H2 blocker, well-tolerated' }
    ],
    secondLine: [
      { name: 'Pantoprazole', rxcui: '20005', safety: 'PPI, lower interaction than omeprazole' },
      { name: 'Esomeprazole', rxcui: '301849', safety: 'PPI, alternative to omeprazole' }
    ]
  }
};

/**
 * Get alternative medicine suggestions for a given medication
 * @param {string} medicationName - Name of the medication to find alternatives for
 * @param {Array} currentMedications - List of current medications to avoid interactions
 * @param {string} interactionSeverity - Severity of the interaction ('high', 'medium', 'low')
 * @returns {Object} Alternative suggestions with safety information
 */
export const getAlternativeMedicines = (medicationName, currentMedications = [], interactionSeverity = 'high') => {
  const medicationKey = Object.keys(therapeuticAlternatives).find(key => 
    key.toLowerCase() === medicationName.toLowerCase() ||
    therapeuticAlternatives[key].category.toLowerCase().includes(medicationName.toLowerCase())
  );

  if (!medicationKey) {
    // Try to find by therapeutic category
    const categoryKey = Object.keys(therapeuticCategories).find(cat => 
      cat.toLowerCase().includes(medicationName.toLowerCase())
    );
    
    if (categoryKey) {
      return {
        primaryMedication: medicationName,
        alternatives: therapeuticCategories[categoryKey],
        recommendation: `Consider these ${categoryKey.toLowerCase()} alternatives:`
      };
    }
    
    return {
      primaryMedication: medicationName,
      alternatives: [],
      recommendation: 'Consult healthcare provider for safe alternatives'
    };
  }

  const alternatives = therapeuticAlternatives[medicationKey];
  
  // Filter out alternatives that interact with current medications
  const safeAlternatives = alternatives.alternatives.filter(alt => {
    return !currentMedications.some(currentMed => {
      // Simple check - in real implementation, would check interaction database
      return currentMed.name.toLowerCase().includes(alt.name.toLowerCase());
    });
  });

  return {
    primaryMedication: medicationName,
    category: alternatives.category,
    alternatives: safeAlternatives,
    recommendation: interactionSeverity === 'high' 
      ? 'Consider these safer alternatives to avoid serious interactions:'
      : 'These alternatives may have lower interaction risk:',
    urgency: interactionSeverity === 'high' ? 'immediate' : 'consider'
  };
};

/**
 * Get alternative suggestions for high-severity drug interactions
 * @param {Array} interactingMedications - Array of medication names causing high-severity interaction
 * @param {Array} allMedications - All medications patient is taking
 * @returns {Object} Suggestions for alternative medications
 */
export const getInteractionAlternatives = (interactingMedications, allMedications = []) => {
  const suggestions = {};
  
  interactingMedications.forEach(medName => {
    const alternatives = getAlternativeMedicines(medName, allMedications, 'high');
    if (alternatives.alternatives.length > 0) {
      suggestions[medName] = alternatives;
    }
  });
  
  return {
    suggestions,
    generalRecommendation: 'Consult your healthcare provider before making any medication changes.',
    priority: Object.keys(suggestions).length > 0 ? 'high' : 'consult_provider'
  };
};

export default {
  therapeuticAlternatives,
  therapeuticCategories,
  getAlternativeMedicines,
  getInteractionAlternatives
};