const formatMedicineInfo = (medicineData) => {
  // Validate medicine name first
  if (!medicineData || !medicineData.name || medicineData.name === 'Unknown') {
    return "No information available.";
  }

  try {
    // Return structured data object instead of formatted string
    return {
      name: medicineData.name,
      purpose: formatUses(medicineData.purpose),
      howToUse: formatHowToUse(medicineData.howToUse),
      dosage: formatDosage(medicineData.dosage),
      sideEffects: formatSideEffects(medicineData.sideEffects),
      whenNotToUse: formatContraindications(medicineData.whenNotToUse),
      precautions: formatPrecautions(medicineData.precautions)
    };
  } catch (error) {
    return "No information available.";
  }
};

// Helper functions to format each section
const formatUses = (purpose) => {
  if (!purpose || purpose.includes('No information available')) {
    return "Consult your healthcare provider for specific use information.";
  }
  // Extract first 1-2 sentences for concise summary
  const sentences = purpose.split(/[.!?]\s+/);
  return sentences.slice(0, 2).join('. ') + '.';
};

const formatHowToUse = (howToUse) => {
  if (!howToUse || howToUse.includes('No information available')) {
    return "Take as directed by your doctor.";
  }
  // Extract first 1-2 sentences for concise instructions
  const sentences = howToUse.split(/[.!?]\s+/);
  return sentences.slice(0, 2).join('. ') + '.';
};

const formatDosage = (dosage) => {
  if (!dosage || dosage.includes('No information available')) {
    return "Varies – follow doctor's prescription.";
  }
  // Extract typical dosage pattern if available
  const dosageMatch = dosage.match(/\d+\s*(?:mg|g|ml|tablet)s?\s+(?:every|per|daily|twice|once)/i);
  return dosageMatch ? dosageMatch[0] : "Varies – follow doctor's prescription.";
};

const formatSideEffects = (sideEffects) => {
  if (!sideEffects || sideEffects.includes('No information available')) {
    return "Consult your healthcare provider for side effect information.";
  }
  // Extract and format 3-5 main side effects
  const effects = sideEffects
    .split(/[.,;]\s+/)
    .filter(effect => effect.length > 3 && !effect.toLowerCase().includes('rare'))
    .slice(0, 5)
    .map(effect => effect.trim())
    .join('. ');
  return effects || "Consult your healthcare provider for side effect information.";
};

const formatContraindications = (contraindications) => {
  if (!contraindications || contraindications.includes('No information available')) {
    return "Consult your healthcare provider for specific contraindications.";
  }
  // Extract first 2-3 lines of contraindications
  const lines = contraindications.split(/[.!?]\s+/).slice(0, 2).join('. ') + '.';
  return lines;
};

const formatPrecautions = (precautions) => {
  if (!precautions || precautions.includes('No information available')) {
    return "Store in a cool, dry place. Keep out of reach of children.";
  }
  // Extract key precautions and storage information
  const lines = precautions.split(/[.!?]\s+/).slice(0, 3).join('. ') + '.';
  return lines;
};

export default formatMedicineInfo;