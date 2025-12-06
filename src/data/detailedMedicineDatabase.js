// Comprehensive medicine database with detailed, accurate information
// Data sourced from FDA labels, medical references, and clinical guidelines

export const detailedMedicineDatabase = {
  'famotidine': {
    id: 'detailed-famotidine',
    name: 'Famotidine',
    genericName: 'Famotidine',
    brandNames: ['Pepcid', 'Pepcid AC', 'Heartburn Relief'],
    description: 'H2 receptor antagonist that reduces stomach acid production. Used to treat heartburn, acid reflux, GERD, and peptic ulcers.',
    
    purpose: 'Treats heartburn, acid indigestion, sour stomach, and prevents heartburn associated with acid indigestion and sour stomach brought on by eating or drinking certain foods and beverages.',
    
    howToUse: 'Take by mouth with or without food as directed. For prevention of heartburn, take 15-60 minutes before eating foods or drinking beverages that cause heartburn. Do not take more than 2 tablets in 24 hours unless directed by your doctor.',
    
    dosage: {
      adults: 'For heartburn relief: 10-20 mg once or twice daily. For GERD: 20 mg twice daily. For peptic ulcer: 40 mg once daily at bedtime or 20 mg twice daily.',
      children: 'Consult pediatrician for appropriate dosing based on weight and condition.',
      elderly: 'May need dose adjustment based on kidney function.'
    },
    
    sideEffects: {
      common: ['Headache', 'Dizziness', 'Constipation', 'Diarrhea', 'Fatigue'],
      serious: ['Severe stomach pain', 'Difficulty swallowing', 'Persistent heartburn', 'Signs of kidney problems', 'Unusual bleeding or bruising'],
      rare: ['Severe allergic reactions', 'Confusion (especially in elderly)', 'Depression', 'Hallucinations']
    },
    
    warnings: [
      'Do not use if you have trouble or pain swallowing food, vomiting with blood, or bloody or black stools',
      'Stop use and ask a doctor if your heartburn continues or worsens',
      'Consult doctor before use if you have kidney disease',
      'May interact with certain HIV medications and antifungal drugs'
    ],
    
    contraindications: [
      'Hypersensitivity to famotidine or other H2 receptor antagonists',
      'Severe kidney disease (without dose adjustment)',
      'History of acute porphyria'
    ],
    
    interactions: [
      'Atazanavir (HIV medication) - may reduce effectiveness',
      'Ketoconazole, itraconazole - famotidine may reduce absorption',
      'Warfarin - monitor INR more closely',
      'Antacids - may be taken together but space doses'
    ],
    
    precautions: [
      'Take exactly as prescribed or as directed on package',
      'Do not exceed recommended dose',
      'Store at room temperature away from moisture and heat',
      'Keep out of reach of children',
      'Consult doctor if symptoms persist after 2 weeks of treatment'
    ],
    
    pregnancyCategory: 'B - Generally safe during pregnancy',
    breastfeeding: 'Passes into breast milk in small amounts - consult doctor',
    
    rxcui: '4278',
    source: 'Detailed Database'
  },

  'ibuprofen': {
    id: 'detailed-ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Nuprin', 'Brufen'],
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) that reduces inflammation, pain, and fever by blocking cyclooxygenase enzymes.',
    
    purpose: 'Relieves pain from headaches, dental pain, menstrual cramps, muscle aches, arthritis, and reduces fever. Also reduces inflammation from injuries and conditions like arthritis.',
    
    howToUse: 'Take with food or milk to prevent stomach upset. Swallow tablets whole with a full glass of water. Do not lie down for at least 10 minutes after taking. Use the lowest effective dose for the shortest duration.',
    
    dosage: {
      adults: 'Pain/Fever: 200-400 mg every 4-6 hours as needed. Maximum: 1200 mg in 24 hours (OTC) or 3200 mg (prescription). Arthritis: 400-800 mg 3-4 times daily.',
      children: '10 mg/kg every 6-8 hours. Maximum: 40 mg/kg/day. Not recommended under 6 months.',
      elderly: 'Start with lower doses due to increased risk of side effects.'
    },
    
    sideEffects: {
      common: ['Stomach upset', 'Nausea', 'Heartburn', 'Dizziness', 'Mild headache'],
      serious: ['Stomach bleeding or ulcers', 'High blood pressure', 'Heart problems', 'Kidney problems', 'Liver damage', 'Severe allergic reactions'],
      rare: ['Stevens-Johnson syndrome', 'Aseptic meningitis', 'Severe skin reactions']
    },
    
    warnings: [
      'Increases risk of serious cardiovascular events, heart attack, and stroke',
      'Increases risk of serious gastrointestinal bleeding, ulceration, and perforation',
      'Do not use if you have had an allergic reaction to aspirin or other NSAIDs',
      'Stop use if you experience stomach pain, heartburn, or signs of bleeding'
    ],
    
    contraindications: [
      'Allergy to ibuprofen, aspirin, or other NSAIDs',
      'Active peptic ulcer disease or GI bleeding',
      'Severe heart failure',
      'Third trimester of pregnancy',
      'Severe kidney or liver disease'
    ],
    
    interactions: [
      'Warfarin and blood thinners - increased bleeding risk',
      'ACE inhibitors and ARBs - reduced effectiveness, kidney problems',
      'Diuretics - reduced effectiveness',
      'Lithium - increased lithium levels',
      'Methotrexate - increased toxicity',
      'Aspirin - increased GI bleeding risk'
    ],
    
    precautions: [
      'Take with food to reduce stomach irritation',
      'Do not exceed recommended dose or duration',
      'Avoid alcohol while taking ibuprofen',
      'Stay hydrated and monitor for signs of kidney problems',
      'Regular monitoring needed for long-term use'
    ],
    
    pregnancyCategory: 'C (D in third trimester) - Avoid in late pregnancy',
    breastfeeding: 'Compatible with breastfeeding in usual doses',
    
    rxcui: '5640',
    source: 'Detailed Database'
  },

  'acetaminophen': {
    id: 'detailed-acetaminophen',
    name: 'Acetaminophen',
    genericName: 'Acetaminophen',
    brandNames: ['Tylenol', 'Panadol', 'Feverall', 'Mapap'],
    description: 'Analgesic and antipyretic medication that reduces pain and fever. Works by blocking pain signals in the brain and affecting the body\'s temperature regulation.',
    
    purpose: 'Relieves mild to moderate pain from headaches, muscle aches, menstrual periods, colds and sore throats, toothaches, backaches, and reactions to vaccinations. Also reduces fever.',
    
    howToUse: 'Take by mouth with or without food. May be taken with milk or food if stomach upset occurs. Do not crush or chew extended-release tablets. Use measuring device for liquid forms.',
    
    dosage: {
      adults: 'Regular strength: 325-650 mg every 4-6 hours. Extra strength: 500-1000 mg every 6-8 hours. Maximum: 3000-4000 mg in 24 hours.',
      children: '10-15 mg/kg every 4-6 hours. Maximum: 75 mg/kg/day. Use weight-based dosing when possible.',
      elderly: 'Same as adult dosing but monitor liver function more closely.'
    },
    
    sideEffects: {
      common: ['Rare with normal doses', 'Mild nausea (uncommon)'],
      serious: ['Liver damage (with overdose)', 'Severe skin reactions', 'Allergic reactions'],
      rare: ['Stevens-Johnson syndrome', 'Toxic epidermal necrolysis', 'Acute liver failure']
    },
    
    warnings: [
      'Do not exceed maximum daily dose - can cause severe liver damage',
      'Avoid alcohol while taking acetaminophen',
      'Check all medications for acetaminophen to avoid accidental overdose',
      'Stop use and contact doctor if pain worsens or lasts more than 10 days'
    ],
    
    contraindications: [
      'Severe liver disease or liver failure',
      'Known hypersensitivity to acetaminophen',
      'Chronic alcohol use (relative contraindication)'
    ],
    
    interactions: [
      'Warfarin - may enhance anticoagulant effect with regular use',
      'Alcohol - increased risk of liver toxicity',
      'Phenytoin, carbamazepine - may increase acetaminophen toxicity',
      'Isoniazid - increased risk of liver toxicity'
    ],
    
    precautions: [
      'Never exceed 4000 mg in 24 hours from all sources',
      'Read labels of all medications to check for acetaminophen',
      'Avoid alcohol consumption while taking',
      'Store safely away from children - leading cause of pediatric poisoning',
      'Seek immediate medical attention for overdose'
    ],
    
    pregnancyCategory: 'B - Safe during pregnancy when used as directed',
    breastfeeding: 'Compatible with breastfeeding',
    
    rxcui: '161',
    source: 'Detailed Database'
  },

  'aspirin': {
    id: 'detailed-aspirin',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    brandNames: ['Bayer', 'Bufferin', 'Ecotrin', 'St. Joseph'],
    description: 'NSAID that reduces pain, inflammation, and fever. Also has antiplatelet effects used for cardiovascular protection.',
    
    purpose: 'Relieves pain, reduces inflammation and fever. Low-dose aspirin used for heart attack and stroke prevention in high-risk patients.',
    
    howToUse: 'Take with food or after meals to reduce stomach irritation. Swallow enteric-coated tablets whole. For cardiovascular protection, take at the same time each day.',
    
    dosage: {
      adults: 'Pain/fever: 325-650 mg every 4 hours. Anti-inflammatory: 2400-4000 mg daily in divided doses. Cardioprotective: 75-100 mg daily.',
      children: 'Generally not recommended under 16 due to Reye\'s syndrome risk. If prescribed: 10-15 mg/kg every 4-6 hours.',
      elderly: 'Lower doses recommended due to increased bleeding risk.'
    },
    
    sideEffects: {
      common: ['Stomach irritation', 'Heartburn', 'Nausea', 'Easy bruising', 'Ringing in ears (tinnitus)'],
      serious: ['GI bleeding or ulcers', 'Increased bleeding risk', 'Kidney problems', 'Severe allergic reactions'],
      rare: ['Reye\'s syndrome (in children)', 'Liver toxicity', 'Severe skin reactions']
    },
    
    warnings: [
      'Increases risk of serious bleeding, especially GI and intracranial',
      'Do not give to children under 16 with viral infections (Reye\'s syndrome risk)',
      'May increase risk of heart attack and stroke with high doses',
      'Stop before surgery due to bleeding risk'
    ],
    
    contraindications: [
      'Active peptic ulcer or GI bleeding',
      'Hemophilia or bleeding disorders',
      'Children under 16 with viral infections',
      'Third trimester of pregnancy',
      'Severe kidney or liver disease'
    ],
    
    interactions: [
      'Warfarin - significantly increased bleeding risk',
      'Other NSAIDs - increased GI bleeding risk',
      'ACE inhibitors - reduced effectiveness',
      'Methotrexate - increased toxicity',
      'Alcohol - increased GI bleeding risk'
    ],
    
    precautions: [
      'Take with food to reduce stomach irritation',
      'Monitor for signs of bleeding (black stools, easy bruising)',
      'Regular monitoring for long-term use',
      'Avoid alcohol consumption',
      'Inform healthcare providers before procedures'
    ],
    
    pregnancyCategory: 'D - Avoid in pregnancy, especially third trimester',
    breastfeeding: 'Use caution - passes into breast milk',
    
    rxcui: '1191',
    source: 'Detailed Database'
  },

  'metformin': {
    id: 'detailed-metformin',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Fortamet', 'Glumetza', 'Riomet'],
    description: 'Biguanide antidiabetic medication that decreases glucose production by the liver and improves insulin sensitivity.',
    
    purpose: 'First-line treatment for type 2 diabetes mellitus. Helps control blood sugar levels and may aid in weight management. Sometimes used for PCOS.',
    
    howToUse: 'Take with meals to reduce stomach upset. Start with low dose and gradually increase as tolerated. Swallow extended-release tablets whole - do not crush or chew.',
    
    dosage: {
      adults: 'Initial: 500 mg twice daily or 850 mg once daily with meals. Maintenance: 1000-2000 mg daily in divided doses. Maximum: 2550 mg daily.',
      children: '10 years and older: Initial 500 mg twice daily, maximum 2000 mg daily.',
      elderly: 'Start with lower doses and monitor kidney function closely.'
    },
    
    sideEffects: {
      common: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste', 'Loss of appetite', 'Gas', 'Bloating'],
      serious: ['Lactic acidosis (rare but serious)', 'Vitamin B12 deficiency with long-term use', 'Severe kidney problems'],
      rare: ['Severe allergic reactions', 'Liver problems']
    },
    
    warnings: [
      'Risk of lactic acidosis - stop before surgery, contrast procedures, or if kidney problems develop',
      'Can cause vitamin B12 deficiency with long-term use',
      'May need to stop temporarily during illness, dehydration, or kidney problems',
      'Regular monitoring of kidney function required'
    ],
    
    contraindications: [
      'Severe kidney disease (eGFR <30 mL/min/1.73m²)',
      'Metabolic acidosis or diabetic ketoacidosis',
      'Severe liver disease',
      'Heart failure requiring medication',
      'History of lactic acidosis'
    ],
    
    interactions: [
      'Contrast dye - stop metformin before procedures',
      'Alcohol - increased risk of lactic acidosis',
      'Diuretics - may affect kidney function',
      'Corticosteroids - may increase blood sugar',
      'Cimetidine - may increase metformin levels'
    ],
    
    precautions: [
      'Take with meals to reduce GI side effects',
      'Stay well hydrated',
      'Monitor blood sugar regularly',
      'Check kidney function periodically',
      'Monitor vitamin B12 levels with long-term use',
      'Inform healthcare providers before procedures'
    ],
    
    pregnancyCategory: 'B - Generally safe in pregnancy for diabetes',
    breastfeeding: 'Compatible with breastfeeding',
    
    rxcui: '6809',
    source: 'Detailed Database'
  },

  'lisinopril': {
    id: 'detailed-lisinopril',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril', 'Qbrelis'],
    description: 'ACE inhibitor that relaxes blood vessels by blocking the enzyme that produces angiotensin II, reducing blood pressure and heart workload.',
    
    purpose: 'Treats high blood pressure (hypertension), heart failure, and improves survival after heart attack. Also used to protect kidneys in diabetic patients.',
    
    howToUse: 'Take by mouth with or without food, usually once daily. Take at the same time each day. May be taken with other blood pressure medications.',
    
    dosage: {
      adults: 'Hypertension: Initial 10 mg once daily, usual range 20-40 mg daily. Heart failure: Initial 5 mg once daily, target 20-35 mg daily. Post-MI: 5-10 mg daily.',
      children: '6 years and older: 0.07 mg/kg once daily, maximum 5 mg daily initially.',
      elderly: 'Start with lower doses (2.5-5 mg daily) due to increased sensitivity.'
    },
    
    sideEffects: {
      common: ['Dry cough (10-15% of patients)', 'Dizziness', 'Headache', 'Fatigue', 'Nausea'],
      serious: ['Angioedema (swelling of face, lips, tongue)', 'Severe hypotension', 'Kidney problems', 'High potassium levels'],
      rare: ['Liver problems', 'Severe allergic reactions', 'Blood disorders']
    },
    
    warnings: [
      'Can cause life-threatening angioedema, especially in first dose',
      'May cause severe drop in blood pressure with first dose',
      'Can worsen kidney function, especially with dehydration',
      'May increase potassium levels - monitor regularly'
    ],
    
    contraindications: [
      'History of angioedema with ACE inhibitors',
      'Pregnancy (can cause fetal harm)',
      'Bilateral renal artery stenosis',
      'Hypersensitivity to lisinopril or other ACE inhibitors'
    ],
    
    interactions: [
      'Potassium supplements/salt substitutes - increased potassium risk',
      'NSAIDs - reduced effectiveness, kidney problems',
      'Diuretics - increased hypotension risk',
      'Lithium - increased lithium levels',
      'Aliskiren - avoid in diabetes or kidney disease'
    ],
    
    precautions: [
      'Monitor blood pressure regularly, especially when starting',
      'Check kidney function and potassium levels periodically',
      'Rise slowly from sitting/lying to prevent dizziness',
      'Stay hydrated but don\'t overdo fluids',
      'Avoid potassium supplements unless prescribed',
      'Seek immediate help for swelling of face, lips, or tongue'
    ],
    
    pregnancyCategory: 'D - Can cause fetal harm, avoid in pregnancy',
    breastfeeding: 'Compatible with breastfeeding in usual doses',
    
    rxcui: '29046',
    source: 'Detailed Database'
  },

  'duexis': {
    id: 'detailed-duexis',
    name: 'Duexis',
    genericName: 'Famotidine/Ibuprofen',
    brandNames: ['Duexis'],
    description: 'Combination medication containing ibuprofen (NSAID) for pain/inflammation and famotidine (H2 blocker) to reduce stomach acid and protect against NSAID-induced ulcers.',
    
    purpose: 'Treats pain and inflammation while reducing the risk of stomach ulcers that can be caused by ibuprofen. Used for conditions like osteoarthritis and rheumatoid arthritis in patients at risk for gastric ulcers.',
    
    howToUse: 'Take exactly as prescribed, usually three times daily with food. Swallow tablets whole - do not crush, chew, or split. Take with a full glass of water and remain upright for at least 30 minutes.',
    
    dosage: {
      adults: 'One tablet (ibuprofen 800 mg/famotidine 26.6 mg) three times daily with food. Maximum daily dose: 3 tablets (2400 mg ibuprofen/79.8 mg famotidine).',
      children: 'Not recommended for children under 18 years.',
      elderly: 'Use lowest effective dose for shortest duration. Monitor closely for side effects.'
    },
    
    sideEffects: {
      common: ['Nausea', 'Diarrhea', 'Constipation', 'Headache', 'Dizziness', 'Gas', 'Stomach pain'],
      serious: ['GI bleeding or perforation', 'Heart attack or stroke', 'High blood pressure', 'Kidney problems', 'Liver damage', 'Severe allergic reactions'],
      rare: ['Stevens-Johnson syndrome', 'Toxic epidermal necrolysis', 'Aseptic meningitis', 'Blood disorders']
    },
    
    warnings: [
      'Contains ibuprofen - increases risk of serious cardiovascular events, heart attack, and stroke',
      'Increases risk of serious gastrointestinal bleeding, ulceration, and perforation',
      'Do not use with other NSAIDs or if allergic to aspirin/NSAIDs',
      'May cause elevated blood pressure - monitor regularly',
      'Stop use before surgery due to bleeding risk'
    ],
    
    contraindications: [
      'Allergy to ibuprofen, famotidine, aspirin, or other NSAIDs',
      'Active peptic ulcer disease or GI bleeding',
      'Severe heart failure',
      'Third trimester of pregnancy',
      'Coronary artery bypass graft (CABG) surgery recovery',
      'Severe kidney or liver disease'
    ],
    
    interactions: [
      'Warfarin and anticoagulants - increased bleeding risk',
      'ACE inhibitors/ARBs - reduced effectiveness, kidney problems',
      'Diuretics - reduced effectiveness, kidney problems',
      'Lithium - increased lithium levels',
      'Methotrexate - increased toxicity',
      'Aspirin - increased GI bleeding risk',
      'Atazanavir - famotidine may reduce effectiveness'
    ],
    
    precautions: [
      'Take with food to reduce stomach irritation',
      'Do not exceed prescribed dose or duration',
      'Avoid alcohol while taking this medication',
      'Monitor blood pressure regularly',
      'Watch for signs of GI bleeding (black stools, stomach pain)',
      'Stay hydrated and monitor kidney function',
      'Inform all healthcare providers about this medication'
    ],
    
    pregnancyCategory: 'C (D in third trimester) - Avoid in late pregnancy',
    breastfeeding: 'Not recommended - both components pass into breast milk',
    
    rxcui: '1037042',
    source: 'Detailed Database'
  },

  'omeprazole': {
    id: 'detailed-omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Prilosec OTC', 'Zegerid'],
    description: 'Proton pump inhibitor (PPI) that reduces stomach acid production by blocking the enzyme system responsible for acid secretion in gastric parietal cells.',
    
    purpose: 'Treats gastroesophageal reflux disease (GERD), peptic ulcers, Zollinger-Ellison syndrome, and erosive esophagitis. Also used to prevent NSAID-induced ulcers and as part of H. pylori eradication therapy.',
    
    howToUse: 'Take before eating, preferably in the morning. Swallow capsules whole or open and sprinkle contents on applesauce - do not chew granules. For best results, take at the same time each day.',
    
    dosage: {
      adults: 'GERD: 20 mg once daily for 4-8 weeks. Peptic ulcer: 20-40 mg once daily. H. pylori: 20 mg twice daily with antibiotics. Zollinger-Ellison: 60 mg once daily initially.',
      children: '1 year and older: 5-20 mg once daily based on weight. <20 kg: 10 mg daily, ≥20 kg: 20 mg daily.',
      elderly: 'Same as adult dosing - no adjustment needed for age alone.'
    },
    
    sideEffects: {
      common: ['Headache', 'Nausea', 'Diarrhea', 'Stomach pain', 'Gas', 'Constipation', 'Dizziness'],
      serious: ['C. difficile infection', 'Bone fractures (long-term use)', 'Low magnesium levels', 'Vitamin B12 deficiency', 'Kidney problems'],
      rare: ['Severe allergic reactions', 'Liver problems', 'Lupus-like syndrome', 'Severe skin reactions']
    },
    
    warnings: [
      'Long-term use may increase risk of bone fractures, especially hip, wrist, and spine',
      'May increase risk of C. difficile-associated diarrhea',
      'Can cause low magnesium levels with prolonged use',
      'May mask symptoms of gastric cancer',
      'Prolonged use may lead to vitamin B12 deficiency'
    ],
    
    contraindications: [
      'Hypersensitivity to omeprazole or other PPIs',
      'Concurrent use with rilpivirine-containing products',
      'Known hypersensitivity to substituted benzimidazoles'
    ],
    
    interactions: [
      'Clopidogrel - may reduce effectiveness',
      'Warfarin - may increase INR and bleeding risk',
      'Diazepam, phenytoin - may increase levels',
      'Atazanavir, nelfinavir - reduced absorption',
      'Methotrexate - increased levels and toxicity',
      'Digoxin - may increase digoxin levels'
    ],
    
    precautions: [
      'Take before meals for best absorption',
      'Do not crush or chew delayed-release capsules',
      'Use lowest effective dose for shortest duration',
      'Monitor magnesium levels with long-term use',
      'Gradual dose reduction may be needed to prevent rebound acid hypersecretion',
      'Regular monitoring for long-term users'
    ],
    
    pregnancyCategory: 'C - Use only if benefits outweigh risks',
    breastfeeding: 'Caution advised - limited data available',
    
    rxcui: '7646',
    source: 'Detailed Database'
  }
};

// Function to get detailed medicine information
export const getDetailedMedicineInfo = (medicineName) => {
  const normalizedName = medicineName.toLowerCase().trim();
  
  // Direct match
  if (detailedMedicineDatabase[normalizedName]) {
    return detailedMedicineDatabase[normalizedName];
  }
  
  // Check brand names and alternative names
  for (const [key, medicine] of Object.entries(detailedMedicineDatabase)) {
    if (medicine.brandNames?.some(brand => 
      brand.toLowerCase().includes(normalizedName) || 
      normalizedName.includes(brand.toLowerCase())
    )) {
      return medicine;
    }
    
    if (medicine.genericName?.toLowerCase().includes(normalizedName) || 
        normalizedName.includes(medicine.genericName?.toLowerCase())) {
      return medicine;
    }
  }
  
  return null;
};

export default detailedMedicineDatabase;
