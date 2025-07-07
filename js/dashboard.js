// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update stats
  updateDashboardStats();
  
  function updateDashboardStats() {
    // Get counts
    const symptoms = getSymptoms();
    const damages = getDamages();
    const diagnosisCount = getDiagnosisCount();
    
    // Update UI
    const symptomCountElement = document.getElementById('symptom-count');
    const damageCountElement = document.getElementById('damage-count');
    const diagnosisCountElement = document.getElementById('diagnosis-count');
    
    if (symptomCountElement) {
      symptomCountElement.textContent = symptoms.length;
    }
    
    if (damageCountElement) {
      damageCountElement.textContent = damages.length;
    }
    
    if (diagnosisCountElement) {
      diagnosisCountElement.textContent = diagnosisCount;
    }
  }
});