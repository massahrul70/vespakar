// Certainty Factor calculation
// Define confidence levels and their CF values
const confidenceLevels = [
  { name: 'Very Confident', value: 1.0, display: 'Sangat Yakin' },
  { name: 'Confident', value: 0.8, display: 'Yakin' },
  { name: 'Somewhat Confident', value: 0.6, display: 'Cukup Yakin' },
  { name: 'Somewhat Doubtful', value: 0.4, display: 'Sedikit Ragu' },
  { name: 'Very Doubtful', value: 0.2, display: 'Sangat Ragu' },
  { name: 'Not Selected', value: 0, display: 'Tidak Dipilih' }
];

// Calculate CF for a single symptom-damage pair
function calculateCF(mb, md, userConfidence) {
  // If user didn't select this symptom, CF is 0
  if (userConfidence === 0) return 0;
  
  // Calculate base CF (MB - MD)
  const baseCF = mb - md;
  
  // Adjust CF based on user confidence
  return baseCF * userConfidence;
}

// Combine multiple CFs for the same damage
function combineCF(cf1, cf2) {
  if (cf1 >= 0 && cf2 >= 0) {
    return cf1 + cf2 * (1 - cf1);
  } else if (cf1 < 0 && cf2 < 0) {
    return cf1 + cf2 * (1 + cf1);
  } else {
    return (cf1 + cf2) / (1 - Math.min(Math.abs(cf1), Math.abs(cf2)));
  }
}

// Perform diagnosis based on user selected symptoms
function performDiagnosis(selectedSymptoms) {
  // Get data
  const damages = getDamages();
  const cfRules = getCFRules();
  
  // Calculate CF for each damage
  const results = damages.map(damage => {
    // Get rules for this damage
    const damageRules = cfRules.filter(rule => rule.damageCode === damage.code);
    
    // Calculate CF for each selected symptom
    let cfCombined = 0;
    let firstRule = true;
    const symptomsContributed = [];
    
    damageRules.forEach(rule => {
      // Get user confidence for this symptom
      const userSymptom = selectedSymptoms.find(s => s.code === rule.symptomCode);
      const userConfidence = userSymptom ? userSymptom.confidence : 0;
      
      // Calculate CF for this symptom
      const cf = calculateCF(rule.mb, rule.md, userConfidence);
      
      // If CF > 0, this symptom contributes to the diagnosis
      if (cf > 0) {
        symptomsContributed.push({
          code: rule.symptomCode,
          cf
        });
        
        // Combine CF with previous results
        if (firstRule) {
          cfCombined = cf;
          firstRule = false;
        } else {
          cfCombined = combineCF(cfCombined, cf);
        }
      }
    });
    
    return {
      code: damage.code,
      description: damage.description,
      cf: cfCombined,
      percentage: Math.round(cfCombined * 100),
      symptomsContributed
    };
  });
  
  // Filter out damages with CF = 0 and sort by CF (descending)
  return results
    .filter(result => result.cf > 0)
    .sort((a, b) => b.cf - a.cf);
}