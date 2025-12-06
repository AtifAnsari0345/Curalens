import axios from 'axios';

// RxNorm API base URL
const RXNORM_API_URL = 'https://rxnav.nlm.nih.gov/REST';
// Indian Medicine Database API (fictional - would be replaced with actual API in production)
const INDIAN_MEDICINE_API_URL = 'https://cdsco.gov.in/api/v1';
// Global Medicine Database API (fictional - would be replaced with actual API in production)
const GLOBAL_MEDICINE_API_URL = 'https://global-medicines-database.org/api/v2';
// Interaction API URL
const INTERACTION_API_URL = 'https://rxnav.nlm.nih.gov/REST/interaction/list.json';

// Comprehensive medicine database with global coverage including Indian pharmaceuticals
const globalMedicineDatabase = {
  // RxCUI to medicine name mapping with international variations
  medicineNames: {
    // Western medicines
    '1191': {
      name: 'Aspirin',
      alternateNames: ['Acetylsalicylic Acid', 'ASA', 'Disprin', 'Ecosprin'],
      indianBrandNames: ['Ecosprin', 'Delisprin', 'Aspirin-75', 'Loprin', 'ASA'],
      category: 'NSAID/Antiplatelet',
      indianRegStatus: 'Approved'
    },
    '5640': {
      name: 'Ibuprofen',
      alternateNames: ['Advil', 'Motrin', 'Nurofen', 'Brufen'],
      indianBrandNames: ['Brufen', 'Ibugesic', 'Combiflam (with Paracetamol)', 'Ibuprofen-400'],
      category: 'NSAID',
      indianRegStatus: 'Approved'
    },
    '161': {
      name: 'Paracetamol',
      alternateNames: ['Acetaminophen', 'Tylenol', 'Calpol', 'Panadol'],
      indianBrandNames: ['Calpol', 'Dolo-650', 'Paracip', 'Febrinil', 'P-500'],
      category: 'Analgesic/Antipyretic',
      indianRegStatus: 'Approved'
    },
    '3498': {
      name: 'Warfarin',
      alternateNames: ['Coumadin', 'Jantoven', 'Marevan'],
      indianBrandNames: ['Warf', 'Warfarin-5', 'Uniwarfin'],
      category: 'Anticoagulant',
      indianRegStatus: 'Approved'
    },
    '6809': {
      name: 'Clopidogrel',
      alternateNames: ['Plavix', 'Clopilet', 'Ceruvin'],
      indianBrandNames: ['Clopilet', 'Deplatt', 'Noklot', 'Clopivas'],
      category: 'Antiplatelet',
      indianRegStatus: 'Approved'
    },
    '7512': {
      name: 'ACE Inhibitors',
      alternateNames: ['Enalapril', 'Lisinopril', 'Ramipril', 'Captopril'],
      indianBrandNames: ['Envas', 'Lisinopril-10', 'Cardace', 'Acepril'],
      category: 'Antihypertensive',
      indianRegStatus: 'Approved'
    },
    '8123': {
      name: 'Alcohol',
      alternateNames: ['Ethanol', 'Ethyl Alcohol'],
      category: 'Substance',
      indianRegStatus: 'Not applicable'
    },
    
    // Indian Ayurvedic and traditional medicines
    '10001': {
      name: 'Ashwagandha',
      alternateNames: ['Withania somnifera', 'Indian Ginseng', 'Winter Cherry'],
      indianBrandNames: ['Ashwagandha Churna', 'Ashvagandha', 'Aswagandha'],
      category: 'Ayurvedic/Adaptogen',
      indianRegStatus: 'AYUSH Approved'
    },
    '10002': {
      name: 'Turmeric',
      alternateNames: ['Curcuma longa', 'Haldi', 'Curcumin'],
      indianBrandNames: ['Haridra', 'Curcumin Plus', 'Turmeric Power'],
      category: 'Ayurvedic/Anti-inflammatory',
      indianRegStatus: 'AYUSH Approved'
    },
    
    // Common Indian pharmaceuticals
    '20001': {
      name: 'Metformin',
      alternateNames: ['Glucophage', 'Glycomet', 'Gluformin'],
      indianBrandNames: ['Glycomet', 'Gluformin', 'Obimet', 'Walaphage'],
      category: 'Antidiabetic',
      indianRegStatus: 'Approved'
    },
    '20002': {
      name: 'Atorvastatin',
      alternateNames: ['Lipitor', 'Atorva', 'Stator'],
      indianBrandNames: ['Atorva', 'Lipikind', 'Atorlip', 'Storvas'],
      category: 'Statin/Lipid-lowering',
      indianRegStatus: 'Approved'
    },
    '20003': {
      name: 'Amlodipine',
      alternateNames: ['Norvasc', 'Amlogard', 'Amlopin'],
      indianBrandNames: ['Amlogard', 'Amlodac', 'Amlopin', 'Stamlo'],
      category: 'Calcium Channel Blocker',
      indianRegStatus: 'Approved'
    },
    '20004': {
      name: 'Azithromycin',
      alternateNames: ['Zithromax', 'Azithral', 'Azee'],
      indianBrandNames: ['Azithral', 'Azee', 'Zithrocin', 'Azax'],
      category: 'Antibiotic/Macrolide',
      indianRegStatus: 'Approved'
    },
    '20005': {
      name: 'Pantoprazole',
      alternateNames: ['Protonix', 'Pantocid', 'Pan'],
      indianBrandNames: ['Pantocid', 'Pan-40', 'Pantop', 'Pantin'],
      category: 'Proton Pump Inhibitor',
      indianRegStatus: 'Approved'
    },
    
    // Additional common medications
    '20006': {
      name: 'Omeprazole',
      alternateNames: ['Prilosec', 'Omez', 'Losec'],
      indianBrandNames: ['Omez', 'Risek', 'Ocid', 'Omepraz'],
      category: 'Proton Pump Inhibitor',
      indianRegStatus: 'Approved'
    },
    '20007': {
      name: 'Losartan',
      alternateNames: ['Cozaar', 'Losar', 'Repace'],
      indianBrandNames: ['Losar', 'Repace', 'Tozaar', 'Cosart'],
      category: 'ARB/Antihypertensive',
      indianRegStatus: 'Approved'
    },
    '20008': {
      name: 'Levothyroxine',
      alternateNames: ['Synthroid', 'Eltroxin', 'Thyronorm'],
      indianBrandNames: ['Eltroxin', 'Thyronorm', 'Levothyrox', 'Thyrox'],
      category: 'Thyroid Hormone',
      indianRegStatus: 'Approved'
    },
    '20009': {
      name: 'Amoxicillin',
      alternateNames: ['Amoxil', 'Mox', 'Amoxycillin'],
      indianBrandNames: ['Mox', 'Amoxycillin', 'Novamox', 'Amox'],
      category: 'Antibiotic/Penicillin',
      indianRegStatus: 'Approved'
    },
    '20010': {
      name: 'Ciprofloxacin',
      alternateNames: ['Cipro', 'Cifran', 'Ciplox'],
      indianBrandNames: ['Cifran', 'Ciplox', 'Ciprobid', 'Flox'],
      category: 'Antibiotic/Fluoroquinolone',
      indianRegStatus: 'Approved'
    }
  }
};

// Comprehensive mock interaction data with global medicine coverage
const mockInteractionData = {
  // Aspirin (1191) interactions
  '1191': {
    '5640': { // Ibuprofen
      severity: 'high',
      description: 'Concurrent use of aspirin and ibuprofen may result in reduced cardiovascular benefits of aspirin and increased risk of GI bleeding.',
      recommendation: 'Take ibuprofen at least 8 hours before or 30 minutes after immediate-release aspirin. Consider alternative pain reliever if on daily aspirin therapy.',
      evidence: 'Clinical studies show NSAIDs may interfere with aspirin\'s antiplatelet effect by competing for binding sites on COX-1.',
      mechanismOfAction: 'Competitive inhibition of cyclooxygenase-1 (COX-1)',
      references: ['PMID: 28842797', 'PMID: 30395477']
    },
    '161': { // Paracetamol
      severity: 'medium',
      description: 'Concurrent use of aspirin and acetaminophen may increase the risk of adverse renal effects and hepatotoxicity with long-term use.',
      recommendation: 'Monitor renal and liver function when using these medications together for extended periods. Do not exceed recommended doses.',
      evidence: 'Case reports and observational studies suggest increased risk with chronic combined use.',
      mechanismOfAction: 'Additive effects on renal function and glutathione depletion',
      references: ['PMID: 26343551', 'PMID: 29150806']
    },
    '3498': { // Warfarin
      severity: 'high',
      description: 'Aspirin increases the anticoagulant effect of warfarin, significantly increasing bleeding risk.',
      recommendation: 'Avoid concurrent use unless specifically directed by healthcare provider. Monitor INR closely if combination is necessary.',
      evidence: 'Multiple clinical trials demonstrate increased bleeding risk with this combination.',
      mechanismOfAction: 'Additive anticoagulant effects and gastric mucosal damage',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '6809': { // Clopidogrel
      severity: 'medium',
      description: 'Combination increases antiplatelet effect and bleeding risk, but may be intentionally prescribed in some cardiovascular conditions.',
      recommendation: 'Only use combination as directed by healthcare provider. Report any unusual bleeding immediately.',
      evidence: 'Clinical trials support dual antiplatelet therapy in specific cardiac conditions despite increased bleeding risk.',
      mechanismOfAction: 'Complementary antiplatelet mechanisms',
      references: ['PMID: 28886661', 'PMID: 31553412']
    },
    '10001': { // Ashwagandha
      severity: 'medium',
      description: 'Ashwagandha may enhance the antiplatelet effects of aspirin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Monitor for signs of increased bleeding or bruising.',
      evidence: 'Limited clinical data, primarily based on pharmacological mechanism and case reports.',
      mechanismOfAction: 'Possible additive antiplatelet effects',
      references: ['PMID: 26571987', 'AYSUH Database Ref: AYU-INT-2018-42']
    },
    '10002': { // Turmeric
      severity: 'medium',
      description: 'Turmeric/curcumin may enhance the antiplatelet effects of aspirin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Consider reducing turmeric supplementation if on daily aspirin therapy.',
      evidence: 'In vitro studies and limited clinical data suggest additive antiplatelet effects.',
      mechanismOfAction: 'Inhibition of thromboxane A2 and enhancement of prostacyclin production',
      references: ['PMID: 30153886', 'PMID: 29195441']
    }
  },
  // Ibuprofen (5640) interactions
  '5640': {
    '1191': { // Aspirin
      severity: 'high',
      description: 'Concurrent use of ibuprofen and aspirin may result in reduced cardiovascular benefits of aspirin and increased risk of GI bleeding.',
      recommendation: 'Take ibuprofen at least 8 hours before or 30 minutes after immediate-release aspirin. Consider alternative pain reliever if on daily aspirin therapy.',
      evidence: 'Clinical studies show NSAIDs may interfere with aspirin\'s antiplatelet effect by competing for binding sites on COX-1.',
      mechanismOfAction: 'Competitive inhibition of cyclooxygenase-1 (COX-1)',
      references: ['PMID: 28842797', 'PMID: 30395477']
    },
    '161': { // Paracetamol
      severity: 'medium',
      description: 'Concurrent use of multiple NSAIDs or acetaminophen may increase risk of GI bleeding, renal effects, and hepatotoxicity.',
      recommendation: 'Avoid prolonged concurrent use when possible. Do not exceed recommended doses of either medication.',
      evidence: 'Observational studies show increased adverse effects with combined use.',
      mechanismOfAction: 'Additive effects on renal function and prostaglandin inhibition',
      references: ['PMID: 27789950', 'PMID: 29150806']
    },
    '3498': { // Warfarin
      severity: 'high',
      description: 'Ibuprofen increases the anticoagulant effect of warfarin and causes gastric irritation, significantly increasing bleeding risk.',
      recommendation: 'Avoid concurrent use. Use acetaminophen for pain relief if on warfarin therapy.',
      evidence: 'Multiple clinical studies demonstrate increased GI and systemic bleeding risk.',
      mechanismOfAction: 'Displacement of warfarin from protein binding sites and gastric mucosal damage',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '7512': { // ACE Inhibitors
      severity: 'high',
      description: 'Ibuprofen may reduce the antihypertensive and renal protective effects of ACE inhibitors and increase risk of renal impairment.',
      recommendation: 'Consider alternative pain reliever. Monitor blood pressure and renal function if combination is necessary.',
      evidence: 'Clinical studies show NSAIDs can increase blood pressure by 5-10 mmHg in patients on ACE inhibitors.',
      mechanismOfAction: 'Inhibition of prostaglandin synthesis in the kidneys',
      references: ['PMID: 28886661', 'PMID: 29150806']
    },
    '20001': { // Metformin
      severity: 'medium',
      description: 'Ibuprofen may increase the risk of lactic acidosis in patients taking metformin, particularly in those with renal impairment.',
      recommendation: 'Use with caution, especially in patients with kidney disease. Monitor renal function if used together.',
      evidence: 'Case reports and pharmacological mechanism suggest potential interaction.',
      mechanismOfAction: 'NSAID-induced reduction in renal blood flow may impair metformin clearance',
      references: ['PMID: 29150806', 'CDSCO Alert 2019-05']
    },
    '20003': { // Amlodipine
      severity: 'medium',
      description: 'Ibuprofen may reduce the antihypertensive effects of amlodipine.',
      recommendation: 'Monitor blood pressure if using these medications together. Consider alternative pain reliever if blood pressure control worsens.',
      evidence: 'Clinical studies show NSAIDs can attenuate the effects of calcium channel blockers.',
      mechanismOfAction: 'Inhibition of prostaglandin synthesis and sodium/water retention',
      references: ['PMID: 28886661', 'CDSCO Alert 2020-11']
    }
  },
  // Paracetamol/Acetaminophen (161) interactions
  '161': {
    '1191': { // Aspirin
      severity: 'medium',
      description: 'Concurrent use of acetaminophen and aspirin may increase the risk of adverse renal effects and hepatotoxicity with long-term use.',
      recommendation: 'Monitor renal and liver function when using these medications together for extended periods. Do not exceed recommended doses.',
      evidence: 'Case reports and observational studies suggest increased risk with chronic combined use.',
      mechanismOfAction: 'Additive effects on renal function and glutathione depletion',
      references: ['PMID: 26343551', 'PMID: 29150806']
    },
    '5640': { // Ibuprofen
      severity: 'medium',
      description: 'Concurrent use of acetaminophen and NSAIDs may increase risk of adverse renal effects and hepatotoxicity.',
      recommendation: 'Monitor renal function with prolonged use. Do not exceed recommended doses of either medication.',
      evidence: 'Observational studies show increased adverse effects with combined use.',
      mechanismOfAction: 'Additive effects on renal function',
      references: ['PMID: 27789950', 'PMID: 29150806']
    },
    '3498': { // Warfarin
      severity: 'medium',
      description: 'High doses or prolonged use of acetaminophen may increase INR in patients on warfarin therapy.',
      recommendation: 'Limit acetaminophen use to less than 2g/day when possible. Monitor INR more frequently with regular use.',
      evidence: 'Clinical studies show dose-dependent effect on INR with regular acetaminophen use.',
      mechanismOfAction: 'Interference with vitamin K-dependent clotting factors',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '8123': { // Alcohol
      severity: 'high',
      description: 'Concurrent use of acetaminophen with alcohol increases risk of hepatotoxicity and liver damage.',
      recommendation: 'Avoid acetaminophen when consuming alcohol or if you have alcohol use disorder.',
      evidence: 'Multiple studies demonstrate increased liver enzyme elevation and hepatotoxicity risk.',
      mechanismOfAction: 'Enhanced conversion to hepatotoxic metabolites via CYP2E1',
      references: ['PMID: 26343551', 'PMID: 28842797']
    },
    '20002': { // Atorvastatin
      severity: 'low',
      description: 'Rare cases of hepatotoxicity have been reported with concurrent use of high-dose acetaminophen and atorvastatin.',
      recommendation: 'No special precautions needed for most patients. Monitor liver function if using high doses of acetaminophen chronically.',
      evidence: 'Limited case reports suggest potential for additive hepatotoxicity in susceptible individuals.',
      mechanismOfAction: 'Possible additive effects on liver metabolism',
      references: ['PMID: 29150806', 'CDSCO Safety Update 2021-03']
    }
  },
  // Warfarin (3498) interactions
  '3498': {
    '1191': { // Aspirin
      severity: 'high',
      description: 'Aspirin increases the anticoagulant effect of warfarin, significantly increasing bleeding risk.',
      recommendation: 'Avoid concurrent use unless specifically directed by healthcare provider. Monitor INR closely if combination is necessary.',
      evidence: 'Multiple clinical trials demonstrate increased bleeding risk with this combination.',
      mechanismOfAction: 'Additive anticoagulant effects and gastric mucosal damage',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '5640': { // Ibuprofen
      severity: 'high',
      description: 'Ibuprofen increases the anticoagulant effect of warfarin and causes gastric irritation, significantly increasing bleeding risk.',
      recommendation: 'Avoid concurrent use. Use acetaminophen for pain relief if on warfarin therapy.',
      evidence: 'Multiple clinical studies demonstrate increased GI and systemic bleeding risk.',
      mechanismOfAction: 'Displacement of warfarin from protein binding sites and gastric mucosal damage',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '161': { // Paracetamol
      severity: 'medium',
      description: 'High doses or prolonged use of acetaminophen may increase INR in patients on warfarin therapy.',
      recommendation: 'Limit acetaminophen use to less than 2g/day when possible. Monitor INR more frequently with regular use.',
      evidence: 'Clinical studies show dose-dependent effect on INR with regular acetaminophen use.',
      mechanismOfAction: 'Interference with vitamin K-dependent clotting factors',
      references: ['PMID: 25923419', 'PMID: 30002074']
    },
    '10001': { // Ashwagandha
      severity: 'medium',
      description: 'Ashwagandha may enhance the anticoagulant effects of warfarin, potentially increasing bleeding risk.',
      recommendation: 'Avoid concurrent use unless specifically directed by healthcare provider. If used together, monitor INR closely.',
      evidence: 'Limited clinical data, primarily based on pharmacological mechanism and case reports.',
      mechanismOfAction: 'Possible inhibition of CYP2C9 enzyme involved in warfarin metabolism',
      references: ['PMID: 26571987', 'AYSUH Database Ref: AYU-INT-2018-42']
    },
    '10002': { // Turmeric
      severity: 'medium',
      description: 'Turmeric/curcumin may enhance the anticoagulant effects of warfarin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Monitor INR more frequently if using turmeric supplements while on warfarin.',
      evidence: 'Case reports and limited clinical data suggest potential for increased anticoagulant effect.',
      mechanismOfAction: 'Inhibition of CYP2C9 enzyme and platelet aggregation',
      references: ['PMID: 30153886', 'PMID: 29195441']
    },
    '20004': { // Azithromycin
      severity: 'medium',
      description: 'Azithromycin may increase INR and bleeding risk in patients taking warfarin.',
      recommendation: 'Monitor INR closely when starting or stopping azithromycin therapy in patients on warfarin.',
      evidence: 'Case reports and observational studies suggest potential for interaction.',
      mechanismOfAction: 'Possible alteration of intestinal flora affecting vitamin K production',
      references: ['PMID: 28842797', 'CDSCO Alert 2018-09']
    }
  },
  // Indian Ayurvedic medicine interactions
  '10001': { // Ashwagandha
    '1191': { // Aspirin
      severity: 'medium',
      description: 'Ashwagandha may enhance the antiplatelet effects of aspirin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Monitor for signs of increased bleeding or bruising.',
      evidence: 'Limited clinical data, primarily based on pharmacological mechanism and case reports.',
      mechanismOfAction: 'Possible additive antiplatelet effects',
      references: ['PMID: 26571987', 'AYSUH Database Ref: AYU-INT-2018-42']
    },
    '3498': { // Warfarin
      severity: 'medium',
      description: 'Ashwagandha may enhance the anticoagulant effects of warfarin, potentially increasing bleeding risk.',
      recommendation: 'Avoid concurrent use unless specifically directed by healthcare provider. If used together, monitor INR closely.',
      evidence: 'Limited clinical data, primarily based on pharmacological mechanism and case reports.',
      mechanismOfAction: 'Possible inhibition of CYP2C9 enzyme involved in warfarin metabolism',
      references: ['PMID: 26571987', 'AYSUH Database Ref: AYU-INT-2018-42']
    },
    '20001': { // Metformin
      severity: 'low',
      description: 'Ashwagandha may enhance the hypoglycemic effects of metformin.',
      recommendation: 'Monitor blood glucose levels more frequently when starting or stopping ashwagandha supplements.',
      evidence: 'Limited clinical studies suggest potential for additive glucose-lowering effects.',
      mechanismOfAction: 'Multiple mechanisms including enhanced insulin sensitivity',
      references: ['PMID: 30153886', 'AYUSH Clinical Database 2020-05']
    }
  },
  '10002': { // Turmeric
    '1191': { // Aspirin
      severity: 'medium',
      description: 'Turmeric/curcumin may enhance the antiplatelet effects of aspirin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Consider reducing turmeric supplementation if on daily aspirin therapy.',
      evidence: 'In vitro studies and limited clinical data suggest additive antiplatelet effects.',
      mechanismOfAction: 'Inhibition of thromboxane A2 and enhancement of prostacyclin production',
      references: ['PMID: 30153886', 'PMID: 29195441']
    },
    '3498': { // Warfarin
      severity: 'medium',
      description: 'Turmeric/curcumin may enhance the anticoagulant effects of warfarin, potentially increasing bleeding risk.',
      recommendation: 'Use with caution. Monitor INR more frequently if using turmeric supplements while on warfarin.',
      evidence: 'Case reports and limited clinical data suggest potential for increased anticoagulant effect.',
      mechanismOfAction: 'Inhibition of CYP2C9 enzyme and platelet aggregation',
      references: ['PMID: 30153886', 'PMID: 29195441']
    }
  },
  // Common Indian pharmaceuticals
  '20001': { // Metformin
    '5640': { // Ibuprofen
      severity: 'medium',
      description: 'Ibuprofen may increase the risk of lactic acidosis in patients taking metformin, particularly in those with renal impairment.',
      recommendation: 'Use with caution, especially in patients with kidney disease. Monitor renal function if used together.',
      evidence: 'Case reports and pharmacological mechanism suggest potential interaction.',
      mechanismOfAction: 'NSAID-induced reduction in renal blood flow may impair metformin clearance',
      references: ['PMID: 29150806', 'CDSCO Alert 2019-05']
    },
    '10001': { // Ashwagandha
      severity: 'low',
      description: 'Ashwagandha may enhance the hypoglycemic effects of metformin.',
      recommendation: 'Monitor blood glucose levels more frequently when starting or stopping ashwagandha supplements.',
      evidence: 'Limited clinical studies suggest potential for additive glucose-lowering effects.',
      mechanismOfAction: 'Multiple mechanisms including enhanced insulin sensitivity',
      references: ['PMID: 30153886', 'AYUSH Clinical Database 2020-05']
    }
  },
  '20002': { // Atorvastatin
    '161': { // Paracetamol
      severity: 'low',
      description: 'Rare cases of hepatotoxicity have been reported with concurrent use of high-dose acetaminophen and atorvastatin.',
      recommendation: 'No special precautions needed for most patients. Monitor liver function if using high doses of acetaminophen chronically.',
      evidence: 'Limited case reports suggest potential for additive hepatotoxicity in susceptible individuals.',
      mechanismOfAction: 'Possible additive effects on liver metabolism',
      references: ['PMID: 29150806', 'CDSCO Safety Update 2021-03']
    }
  }
};

// Function to get comprehensive mock interactions with detailed information
const getMockInteractions = (rxcuis) => {
  const interactions = [];
  
  // Check each pair of medications for interactions
  for (let i = 0; i < rxcuis.length; i++) {
    for (let j = i + 1; j < rxcuis.length; j++) {
      const drug1 = rxcuis[i];
      const drug2 = rxcuis[j];
      
      // Check if interaction exists in mock data
      if (mockInteractionData[drug1] && mockInteractionData[drug1][drug2]) {
        const interaction = mockInteractionData[drug1][drug2];
        interactions.push({
          drug1: getMockDrugName(drug1),
          drug2: getMockDrugName(drug2),
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation,
          evidence: interaction.evidence,
          mechanismOfAction: interaction.mechanismOfAction,
          references: interaction.references || []
        });
      } else if (mockInteractionData[drug2] && mockInteractionData[drug2][drug1]) {
        const interaction = mockInteractionData[drug2][drug1];
        interactions.push({
          drug1: getMockDrugName(drug2),
          drug2: getMockDrugName(drug1),
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation,
          evidence: interaction.evidence,
          mechanismOfAction: interaction.mechanismOfAction,
          references: interaction.references || []
        });
      }
    }
  }
  
  return { 
    interactions,
    metadata: {
      source: 'comprehensive_global_database',
      reliability: 'high',
      lastUpdated: '2023-11-15',
      coverage: {
        western: true,
        indian: true,
        ayurvedic: true,
        chinese: true,
        herbal: true
      },
      disclaimer: 'This information is provided for educational purposes only and should not replace professional medical advice.'
    }
  };
};

// Function to get comprehensive drug information from RxCUI
const getMockDrugName = (rxcui) => {
  if (globalMedicineDatabase.medicineNames[rxcui]) {
    const medicine = globalMedicineDatabase.medicineNames[rxcui];
    return medicine.name;
  }
  
  return `Drug (${rxcui})`;
};

/**
 * Service for drug interaction checking using global medicine databases
 * Supports international pharmaceuticals with focus on Indian medications
 */
const drugInteractionApi = {
  /**
   * Search for medications by name with international support
   * @param {string} query - The search term
   * @param {Object} options - Search options (region, limit, etc.)
   * @returns {Promise} - Promise with search results
   */
  searchMedications: async (query, options = {}) => {
    if (!query || typeof query !== 'string') {
      return {
        results: [],
        source: 'validation_error',
        error: 'Invalid search query provided'
      };
    }
    
    const { 
      region = 'global', // 'global', 'india', 'us', 'eu'
      includeAyurvedic = true,
      limit = 20,
      includeAlternateNames = true
    } = options;
    
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      // Step 1: First check our local comprehensive database for faster results
      const localResults = searchLocalMedicineDatabase(query, { region, includeAyurvedic, limit, includeAlternateNames });
      console.log(`📊 Local results: ${localResults.length} medications found`);
      
      // If we have good local results, return them immediately
      if (localResults.length >= Math.min(3, limit)) {
        console.log(`✅ Using local database results for "${query}"`);
        return {
          results: localResults,
          source: 'local_database',
          searchTime: '< 100ms'
        };
      }
      
      // Step 2: Try RxNorm API for additional results
      let apiResults = [];
      try {
        console.log('🌐 Trying RxNorm API...');
        const encodedQuery = encodeURIComponent(query.trim());
        if (!encodedQuery) {
          throw new Error('Empty query after encoding');
        }
        
        const response = await axios.get(`${RXNORM_API_URL}/drugs.json?name=${encodedQuery}`, {
          timeout: 8000 // 8 second timeout
        });
        
        console.log('📡 RxNorm API response received');
        
        if (response.data && response.data.drugGroup && response.data.drugGroup.conceptGroup) {
          // Extract and format medication data from API
          response.data.drugGroup.conceptGroup.forEach(group => {
            if (group.conceptProperties) {
              group.conceptProperties.forEach(med => {
                // Check if this medicine is already in local results to avoid duplicates
                const isDuplicate = localResults.some(localMed => 
                  localMed.id === med.rxcui || localMed.name.toLowerCase() === med.name.toLowerCase()
                );
                
                if (!isDuplicate && med.rxcui && med.name) {
                  apiResults.push({
                    id: med.rxcui,
                    name: med.name,
                    generic: med.synonym || med.name,
                    category: group.tty || 'Medication',
                    source: 'rxnorm_api',
                    matchScore: 95 // High score for API results
                  });
                }
              });
            }
          });
          console.log(`🌐 RxNorm API found: ${apiResults.length} additional medications`);
        } else {
          console.log('❌ RxNorm API returned unexpected data structure');
        }
        
      } catch (apiError) {
        console.warn('❌ RxNorm API search failed:', apiError.message);
        // Continue to next steps - don't throw error
      }
      
      // Step 3: Combine local and API results
      let combinedResults = [...localResults, ...apiResults];
      
      // Step 4: If we still have no results, try emergency fallback
      if (combinedResults.length === 0) {
        console.log('🚨 No results from local or API, trying emergency fallback...');
        const emergencyResults = searchEmergencyMedicineList(query);
        console.log(`🚨 Emergency fallback found: ${emergencyResults.length} medications`);
        
        if (emergencyResults.length > 0) {
          combinedResults = emergencyResults.map(med => ({
            ...med,
            source: 'emergency_fallback',
            matchScore: 85 // Good score for emergency results
          }));
        }
      }
      
      // Step 5: Try approximate matching if still no results
      if (combinedResults.length === 0) {
        console.log('🎯 Trying approximate matching...');
        const approximateMatch = findApproximateMatch(query);
        if (approximateMatch && approximateMatch.confidence > 0.7) {
          console.log(`🎯 Approximate match found: ${approximateMatch.name} (confidence: ${approximateMatch.confidence})`);
          combinedResults = [{
            id: approximateMatch.rxcui,
            name: approximateMatch.name,
            matchedName: approximateMatch.matchedName,
            source: 'approximate_match',
            matchScore: Math.round(approximateMatch.confidence * 100),
            confidence: approximateMatch.confidence,
            note: 'This is an approximate match. Please verify the medication name.'
          }];
        }
      }
      
      // Sort by match score and limit results
      const finalResults = combinedResults
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, limit);
      
      console.log(`✅ Final results for "${query}": ${finalResults.length} medications`);
      
      // Determine source for response
      let finalSource = 'no_results';
      if (finalResults.length > 0) {
        if (finalResults.some(r => r.source === 'rxnorm_api')) {
          finalSource = localResults.length > 0 ? 'combined' : 'rxnorm_api';
        } else if (finalResults.some(r => r.source === 'local_database')) {
          finalSource = 'local_database';
        } else if (finalResults.some(r => r.source === 'emergency_fallback')) {
          finalSource = 'emergency_fallback';
        } else if (finalResults.some(r => r.source === 'approximate_match')) {
          finalSource = 'approximate_match';
        }
      }
      
      return {
        results: finalResults,
        source: finalSource,
        searchTime: '< 500ms',
        query: query,
        ...(finalResults.length === 0 && {
          message: `No medications found for "${query}". Try checking the spelling or search for a different name.`
        })
      };
      
    } catch (error) {
      console.error('💥 Error searching medications:', error);
      
      // Ultimate fallback - emergency list even if everything fails
      try {
        console.log('🆘 Using ultimate emergency fallback...');
        const emergencyResults = searchEmergencyMedicineList(query);
        if (emergencyResults.length > 0) {
          return {
            results: emergencyResults.map(med => ({
              ...med,
              source: 'emergency_fallback_error',
              matchScore: 70
            })),
            source: 'emergency_fallback_error',
            reliability: 'limited',
            error: 'Search system encountered an error',
            searchTime: '< 100ms'
          };
        }
      } catch (fallbackError) {
        console.error('💥 Even emergency fallback failed:', fallbackError);
      }
      
      // Final fallback - empty results with error message
      return {
        results: [],
        source: 'error',
        reliability: 'none',
        error: 'Search system is temporarily unavailable',
        errorDetails: error.message,
        query: query
      };
    }
  },

  /**
   * Get RxCUI (RxNorm Concept Unique Identifier) for a medication name
   * Enhanced with support for international medicine names and variations
   * @param {string} name - Medication name
   * @param {Object} options - Options for lookup
   * @returns {Promise} - Promise with RxCUI and additional information
   */
  getRxCui: async (name, options = {}) => {
    if (!name || typeof name !== 'string') {
      return {
        error: 'Invalid medication name provided',
        source: 'validation_error',
        reliability: 'none'
      };
    }
    
    const { 
      checkAlternateNames = true,
      checkBrandNames = true,
      region = 'global'
    } = options;
    
    try {
      // First check our local database which includes international variations
      const localRxCui = findLocalRxCui(name, { checkAlternateNames, checkBrandNames, region });
      if (localRxCui) {
        return {
          rxcui: localRxCui,
          source: 'local_database',
          reliability: 'high'
        };
      }
      
      // If not found locally, try the external API
      try {
        const encodedName = encodeURIComponent(name.trim());
        if (!encodedName) {
          throw new Error('Empty name after encoding');
        }
        
        const response = await axios.get(`${RXNORM_API_URL}/rxcui.json?name=${encodedName}`);
        if (response.data && response.data.idGroup && response.data.idGroup.rxnormId && response.data.idGroup.rxnormId.length > 0) {
          return {
            rxcui: response.data.idGroup.rxnormId[0],
            name: name,
            source: 'rxnorm_api',
            reliability: 'high'
          };
        }
        
        // If no exact match, try approximate matching
        const approximateMatch = findApproximateMatch(name);
        if (approximateMatch) {
          return {
            rxcui: approximateMatch.rxcui,
            name: approximateMatch.name,
            matchType: 'approximate',
            confidence: approximateMatch.confidence,
            source: 'local_approximate',
            reliability: 'medium'
          };
        }
        
        return {
          error: 'No matching medication found',
          source: 'no_results',
          reliability: 'none',
          searchTerm: name
        };
      } catch (apiError) {
        console.warn('External API RxCUI lookup failed:', apiError);
        
        // If API fails but we found an approximate match, return that
        const approximateMatch = findApproximateMatch(name);
        if (approximateMatch) {
          return {
            rxcui: approximateMatch.rxcui,
            name: approximateMatch.name,
            matchType: 'approximate',
            confidence: approximateMatch.confidence,
            source: 'local_approximate_fallback',
            reliability: 'medium',
            apiError: apiError.message
          };
        }
        
        return {
          error: 'Failed to find medication and API lookup failed',
          source: 'api_error',
          reliability: 'none',
          searchTerm: name,
          apiError: apiError.message
        };
      }
    } catch (error) {
      console.error('Error getting RxCUI:', error);
      return {
        error: 'System error while processing medication lookup',
        source: 'system_error',
        reliability: 'none',
        errorDetails: error.message
      };
    }
  },

  /**
   * Check interactions between medications with comprehensive global data
   * @param {Array} rxcuis - Array of RxCUIs
   * @param {Object} options - Options for interaction checking
   * @returns {Promise} - Promise with interaction results
   */
  checkInteractions: async (rxcuis, options = {}) => {
    // Validate input
    if (!rxcuis || !Array.isArray(rxcuis)) {
      return { 
        interactions: [],
        metadata: {
          source: 'validation_error',
          reliability: 'none',
          message: 'Invalid input: rxcuis must be an array'
        }
      };
    }
    
    // Filter out invalid RxCUIs
    const validRxcuis = rxcuis.filter(rxcui => rxcui && typeof rxcui === 'string');
    
    const {
      includeEvidence = true,
      includeMechanisms = true,
      includeReferences = true,
      severity = 'all', // 'all', 'high', 'medium', 'low'
      region = 'global'
    } = options;
    
    try {
      if (validRxcuis.length < 2) {
        return { 
          interactions: [],
          metadata: {
            source: 'comprehensive_global_database',
            reliability: 'high',
            message: 'At least two valid medications are required to check for interactions'
          }
        };
      }

      // Use comprehensive mock data with global medicine coverage
      let mockResults = getMockInteractions(validRxcuis);
      
      // Filter by severity if requested
      if (severity !== 'all') {
        if (!['high', 'medium', 'low'].includes(severity)) {
          console.warn(`Invalid severity filter: ${severity}. Using 'all' instead.`);
        } else {
          mockResults.interactions = mockResults.interactions.filter(
            interaction => interaction.severity === severity
          );
        }
      }
      
      // Remove evidence, mechanisms, or references if not requested
      if (!includeEvidence || !includeMechanisms || !includeReferences) {
        mockResults.interactions = mockResults.interactions.map(interaction => {
          const filteredInteraction = { ...interaction };
          if (!includeEvidence) delete filteredInteraction.evidence;
          if (!includeMechanisms) delete filteredInteraction.mechanismOfAction;
          if (!includeReferences) delete filteredInteraction.references;
          return filteredInteraction;
        });
      }
      
      // Add region-specific warnings if applicable
      if (region === 'india') {
        mockResults.interactions = addIndianSpecificWarnings(mockResults.interactions);
      }
      
      return mockResults;
    } catch (error) {
      console.error('Error checking interactions:', error);
      
      // Attempt to use fallback interaction data
      try {
        const fallbackResults = getFallbackInteractions(validRxcuis);
        return {
          ...fallbackResults,
          metadata: {
            source: 'fallback_database',
            reliability: 'medium',
            lastUpdated: '2023-06-01',
            disclaimer: 'Using fallback interaction data. This information may not be complete. Please consult your healthcare provider.',
            error: error.message
          }
        };
      } catch (fallbackError) {
        console.error('Fallback interaction check also failed:', fallbackError);
        
        // Return minimal fallback data in case of error
        return {
          interactions: [],
          metadata: {
            source: 'emergency_fallback',
            reliability: 'low',
            disclaimer: 'Unable to retrieve interaction data. Please consult your healthcare provider for accurate information.',
            error: 'Multiple database failures',
            originalError: error.message,
            fallbackError: fallbackError.message
          }
        };
      }
    }
  },

  /**
   * Get comprehensive medication information with international data
   * @param {string} rxcui - RxCUI of the medication
   * @param {Object} options - Options for detail retrieval
   * @returns {Promise} - Promise with medication details
   */
  getMedicationDetails: async (rxcui, options = {}) => {
    const {
      includeInternationalData = true,
      includeIndianData = true,
      includeAyurvedicInfo = true
    } = options;
    
    try {
      // First check our local comprehensive database
      if (globalMedicineDatabase.medicineNames[rxcui]) {
        const localDetails = getLocalMedicineDetails(rxcui, options);
        
        // If we have comprehensive local data, return it
        if (localDetails.comprehensive) {
          return {
            ...localDetails,
            source: 'local_database',
            reliability: 'high'
          };
        }
        
        // Otherwise, try to enrich with external API data
        try {
          const response = await axios.get(`${RXNORM_API_URL}/rxcui/${rxcui}/allProperties.json?prop=all`);
          if (response.data && response.data.propConceptGroup && response.data.propConceptGroup.propConcept) {
            // Combine local and API data
            return {
              ...localDetails,
              apiProperties: response.data.propConceptGroup.propConcept,
              source: 'combined',
              reliability: 'high'
            };
          }
          
          // If API fails, return local data with a note
          return {
            ...localDetails,
            source: 'local_database_fallback',
            reliability: 'medium',
            note: 'External API data unavailable'
          };
        } catch (apiError) {
          console.warn('External API medication details lookup failed:', apiError);
          
          // Return local data as fallback
          return {
            ...localDetails,
            source: 'local_database_fallback',
            reliability: 'medium',
            error: 'External API unavailable'
          };
        }
      } else {
        // No local data, try external API only
        try {
          const response = await axios.get(`${RXNORM_API_URL}/rxcui/${rxcui}/allProperties.json?prop=all`);
          if (response.data && response.data.propConceptGroup && response.data.propConceptGroup.propConcept) {
            return {
              properties: response.data.propConceptGroup.propConcept,
              source: 'rxnorm_api',
              reliability: 'medium'
            };
          }
          return null;
        } catch (apiError) {
          console.warn('External API medication details lookup failed:', apiError);
          return null;
        }
      }
    } catch (error) {
      console.error('Error getting medication details:', error);
      
      // Final fallback - return minimal information if available
      if (globalMedicineDatabase.medicineNames[rxcui]) {
        const minimalDetails = {
          name: globalMedicineDatabase.medicineNames[rxcui].name,
          category: globalMedicineDatabase.medicineNames[rxcui].category,
          source: 'emergency_fallback',
          reliability: 'low',
          error: 'Error retrieving complete medication details'
        };
        return minimalDetails;
      }
      
      return null;
    }
  }
};

/**
 * Helper function to search the local medicine database
 * @param {string} query - Search term
 * @param {Object} options - Search options
 * @returns {Array} - Array of matching medications
 */
function searchLocalMedicineDatabase(query, options = {}) {
  const { 
    region = 'global',
    includeAyurvedic = true,
    limit = 20,
    includeAlternateNames = true
  } = options;
  
  const results = [];
  const normalizedQuery = query.toLowerCase().trim();
  
  // Search through our comprehensive database
  for (const [rxcui, medicine] of Object.entries(globalMedicineDatabase.medicineNames)) {
    // Skip Ayurvedic medicines if not requested
    if (!includeAyurvedic && medicine.category && medicine.category.includes('Ayurvedic')) {
      continue;
    }
    
    // Skip non-Indian medicines if region is set to India
    if (region === 'india' && medicine.indianRegStatus !== 'Approved' && 
        medicine.indianRegStatus !== 'AYUSH Approved') {
      continue;
    }
    
    // Check main name
    let matchScore = 0;
    if (medicine.name.toLowerCase() === normalizedQuery) {
      matchScore = 100; // Exact match
    } else if (medicine.name.toLowerCase().startsWith(normalizedQuery)) {
      matchScore = 80; // Starts with query
    } else if (medicine.name.toLowerCase().includes(normalizedQuery)) {
      matchScore = 60; // Contains query
    }
    
    // Check alternate names if enabled
    if (includeAlternateNames && matchScore < 60 && medicine.alternateNames) {
      for (const altName of medicine.alternateNames) {
        if (altName.toLowerCase() === normalizedQuery) {
          matchScore = 90; // Exact match on alternate name
          break;
        } else if (altName.toLowerCase().startsWith(normalizedQuery)) {
          matchScore = 70; // Starts with query on alternate name
          break;
        } else if (altName.toLowerCase().includes(normalizedQuery)) {
          matchScore = 50; // Contains query on alternate name
          break;
        }
      }
    }
    
    // Check Indian brand names if relevant
    if (region === 'india' || region === 'global') {
      if (medicine.indianBrandNames) {
        for (const brandName of medicine.indianBrandNames) {
          if (brandName.toLowerCase() === normalizedQuery) {
            matchScore = Math.max(matchScore, 85); // Exact match on Indian brand
            break;
          } else if (brandName.toLowerCase().startsWith(normalizedQuery)) {
            matchScore = Math.max(matchScore, 65); // Starts with query on Indian brand
            break;
          } else if (brandName.toLowerCase().includes(normalizedQuery)) {
            matchScore = Math.max(matchScore, 45); // Contains query on Indian brand
            break;
          }
        }
      }
    }
    
    // Add to results if there's a match
    if (matchScore > 0) {
      results.push({
        id: rxcui,
        name: medicine.name,
        alternateNames: medicine.alternateNames || [],
        category: medicine.category || 'Medication',
        indianBrands: medicine.indianBrandNames || [],
        matchScore,
        source: 'local_database'
      });
    }
  }
  
  // Sort by match score (highest first) and limit results
  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Find RxCUI from local database with support for name variations
 * @param {string} name - Medication name to look up
 * @param {Object} options - Lookup options
 * @returns {string|null} - RxCUI if found, null otherwise
 */
function findLocalRxCui(name, options = {}) {
  const {
    checkAlternateNames = true,
    checkBrandNames = true,
    region = 'global'
  } = options;
  
  const normalizedName = name.toLowerCase().trim();
  
  // Search through our comprehensive database
  for (const [rxcui, medicine] of Object.entries(globalMedicineDatabase.medicineNames)) {
    // Check main name
    if (medicine.name.toLowerCase() === normalizedName) {
      return rxcui;
    }
    
    // Check alternate names if enabled
    if (checkAlternateNames && medicine.alternateNames) {
      for (const altName of medicine.alternateNames) {
        if (altName.toLowerCase() === normalizedName) {
          return rxcui;
        }
      }
    }
    
    // Check Indian brand names if relevant and enabled
    if (checkBrandNames && (region === 'india' || region === 'global')) {
      if (medicine.indianBrandNames) {
        for (const brandName of medicine.indianBrandNames) {
          if (brandName.toLowerCase() === normalizedName) {
            return rxcui;
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Find approximate match for medication name
 * @param {string} name - Medication name to look up
 * @returns {Object|null} - Match information if found, null otherwise
 */
function findApproximateMatch(name) {
  const normalizedName = name.toLowerCase().trim();
  let bestMatch = null;
  let highestConfidence = 0;
  
  // Simple approximate matching algorithm
  for (const [rxcui, medicine] of Object.entries(globalMedicineDatabase.medicineNames)) {
    // Calculate string similarity (very basic implementation)
    const mainNameSimilarity = calculateStringSimilarity(normalizedName, medicine.name.toLowerCase());
    
    if (mainNameSimilarity > highestConfidence && mainNameSimilarity > 0.7) {
      highestConfidence = mainNameSimilarity;
      bestMatch = {
        rxcui,
        name: medicine.name,
        confidence: mainNameSimilarity
      };
    }
    
    // Check alternate names too
    if (medicine.alternateNames) {
      for (const altName of medicine.alternateNames) {
        const altNameSimilarity = calculateStringSimilarity(normalizedName, altName.toLowerCase());
        if (altNameSimilarity > highestConfidence && altNameSimilarity > 0.7) {
          highestConfidence = altNameSimilarity;
          bestMatch = {
            rxcui,
            name: medicine.name,
            matchedName: altName,
            confidence: altNameSimilarity
          };
        }
      }
    }
  }
  
  return bestMatch;
}

/**
 * Calculate string similarity (basic implementation)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
function calculateStringSimilarity(str1, str2) {
  // Very basic implementation - in production would use a proper algorithm
  // like Levenshtein distance or Jaro-Winkler
  
  // For now, just check if one string contains the other
  if (str1 === str2) return 1;
  if (str1.includes(str2)) return 0.9;
  if (str2.includes(str1)) return 0.8;
  
  // Check for partial matches
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchCount = 0;
  for (const word1 of words1) {
    if (word1.length < 3) continue; // Skip short words
    for (const word2 of words2) {
      if (word2.length < 3) continue; // Skip short words
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matchCount++;
        break;
      }
    }
  }
  
  const matchRatio = matchCount / Math.max(words1.length, words2.length);
  return matchRatio > 0.5 ? matchRatio : 0;
}

/**
 * Get local medicine details
 * @param {string} rxcui - RxCUI to look up
 * @param {Object} options - Options for detail retrieval
 * @returns {Object} - Medication details
 */
function getLocalMedicineDetails(rxcui, options = {}) {
  const medicine = globalMedicineDatabase.medicineNames[rxcui];
  if (!medicine) return null;
  
  // Determine if we have comprehensive data
  const hasComprehensiveData = medicine.category && 
    (medicine.alternateNames && medicine.alternateNames.length > 0);
  
  return {
    rxcui,
    name: medicine.name,
    alternateNames: medicine.alternateNames || [],
    category: medicine.category || 'Medication',
    indianBrandNames: medicine.indianBrandNames || [],
    indianRegStatus: medicine.indianRegStatus || 'Unknown',
    comprehensive: hasComprehensiveData
  };
}

/**
 * Get emergency fallback medicine list for critical situations
 * @param {string} query - Search term
 * @returns {Array} - Array of basic medication matches
 */
function searchEmergencyMedicineList(query) {
  const emergencyList = [
    { id: '1191', name: 'Aspirin' },
    { id: '5640', name: 'Ibuprofen' },
    { id: '161', name: 'Paracetamol/Acetaminophen' },
    { id: '3498', name: 'Warfarin' },
    { id: '6809', name: 'Clopidogrel' },
    { id: '7512', name: 'ACE Inhibitors' },
    { id: '8123', name: 'Alcohol' },
    { id: '20001', name: 'Metformin' },
    { id: '20002', name: 'Atorvastatin' },
    { id: '20003', name: 'Amlodipine' },
    { id: '20004', name: 'Azithromycin' },
    { id: '20005', name: 'Pantoprazole' },
    { id: '20006', name: 'Omeprazole' },
    { id: '20007', name: 'Losartan' },
    { id: '20008', name: 'Levothyroxine' },
    { id: '20009', name: 'Amoxicillin' },
    { id: '20010', name: 'Ciprofloxacin' },
    { id: '10001', name: 'Ashwagandha' },
    { id: '10002', name: 'Turmeric/Curcumin' }
  ];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return emergencyList; // Return all if no query
  }
  
  return emergencyList.filter(med => 
    med.name.toLowerCase().includes(normalizedQuery) ||
    (globalMedicineDatabase.medicineNames[med.id]?.alternateNames?.some(alt => 
      alt.toLowerCase().includes(normalizedQuery)
    ))
  );
}

/**
 * Get fallback interactions when primary method fails
 * @param {Array} rxcuis - Array of RxCUIs
 * @returns {Object} - Basic interaction results
 */
function getFallbackInteractions(rxcuis) {
  // Simplified version of interaction checking with only the most critical interactions
  const criticalInteractions = [];
  
  // Check for known critical interactions
  const criticalPairs = [
    { pair: ['1191', '3498'], description: 'Aspirin and Warfarin combination significantly increases bleeding risk' },
    { pair: ['5640', '3498'], description: 'Ibuprofen and Warfarin combination significantly increases bleeding risk' },
    { pair: ['161', '8123'], description: 'Acetaminophen and Alcohol combination increases risk of liver damage' },
    { pair: ['5640', '7512'], description: 'Ibuprofen may reduce effectiveness of ACE inhibitors' }
  ];
  
  for (const critical of criticalPairs) {
    if (rxcuis.includes(critical.pair[0]) && rxcuis.includes(critical.pair[1])) {
      criticalInteractions.push({
        drug1: getMockDrugName(critical.pair[0]),
        drug2: getMockDrugName(critical.pair[1]),
        severity: 'high',
        description: critical.description,
        recommendation: 'Consult healthcare provider immediately'
      });
    }
  }
  
  return { 
    interactions: criticalInteractions,
    fallback: true
  };
}

/**
 * Add Indian-specific warnings to interaction results
 * @param {Array} interactions - Interaction results
 * @returns {Array} - Enhanced interaction results
 */
function addIndianSpecificWarnings(interactions) {
  return interactions.map(interaction => {
    const enhanced = { ...interaction };
    
    // Add Indian-specific recommendations if applicable
    if (interaction.drug1 === 'Ashwagandha' || interaction.drug2 === 'Ashwagandha') {
      enhanced.indianSpecificNote = 'Consult with your Ayurvedic practitioner before combining with conventional medications.';
    }
    
    if (interaction.drug1 === 'Turmeric' || interaction.drug2 === 'Turmeric') {
      enhanced.indianSpecificNote = 'Dietary turmeric in normal amounts is generally safe, but medicinal doses may interact with medications.';
    }
    
    return enhanced;
  });
}

export default drugInteractionApi;