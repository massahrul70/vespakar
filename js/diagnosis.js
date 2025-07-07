// Diagnosis functionality
document.addEventListener('DOMContentLoaded', () => {
  // Setup modal
  const resultDetailModal = setupModal('result-detail-modal', null, '.close-modal');
  
  // Load symptoms for diagnosis
  loadDiagnosisSymptoms();
  
  // Setup search functionality
  const searchInput = document.getElementById('search-symptoms');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadDiagnosisSymptoms(searchInput.value);
    });
  }
  
  // Handle run diagnosis button
  const runDiagnosisBtn = document.getElementById('run-diagnosis');
  if (runDiagnosisBtn) {
    runDiagnosisBtn.addEventListener('click', () => {
      runDiagnosis();
    });
  }
  
  // Handle reset button
  const resetDiagnosisBtn = document.getElementById('reset-diagnosis');
  if (resetDiagnosisBtn) {
    resetDiagnosisBtn.addEventListener('click', () => {
      resetDiagnosis();
    });
  }
  
  function loadDiagnosisSymptoms(searchTerm = '') {
    const symptomsList = document.getElementById('symptoms-list');
    if (!symptomsList) return;
    
    // Get symptoms data
    let symptoms = getSymptoms();
    
    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      symptoms = symptoms.filter(s => 
        s.code.toLowerCase().includes(term) || 
        s.description.toLowerCase().includes(term)
      );
    }
    
    // Clear existing items
    symptomsList.innerHTML = '';
    
    // Check if there are symptoms
    if (symptoms.length === 0) {
      symptomsList.innerHTML = `
        <div class="empty-table">
          <i class="fas fa-search"></i>
          <p>Tidak ada gejala ditemukan</p>
        </div>
      `;
      return;
    }
    
    // Add items for each symptom
    symptoms.forEach(symptom => {
      const item = document.createElement('div');
      item.className = 'symptom-item';
      item.dataset.code = symptom.code;
      
      item.innerHTML = `
        <div class="symptom-header">
          <div class="symptom-info">
            <div class="symptom-code">${symptom.code}</div>
            <div class="symptom-title">${symptom.description}</div>
          </div>
          <button class="symptom-clear" type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="confidence-selector">
          <div class="confidence-label">Tingkat Keyakinan:</div>
          <div class="confidence-options">
            ${confidenceLevels.slice(0, 5).map((level, index) => `
              <div class="confidence-option" data-value="${level.value}" data-index="${index}">
                ${level.display}
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      symptomsList.appendChild(item);
      
      // Setup confidence options
      const confidenceOptions = item.querySelectorAll('.confidence-option');
      confidenceOptions.forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          confidenceOptions.forEach(opt => opt.classList.remove('selected'));
          
          // Add selected class to clicked option
          option.classList.add('selected');
          
          // Store the selected value on the item
          item.dataset.confidence = option.dataset.value;
          
          // Add selected class to item
          item.classList.add('selected');
        });
      });
      
      // Setup clear button
      const clearBtn = item.querySelector('.symptom-clear');
      clearBtn.addEventListener('click', () => {
        // Remove all selections
        confidenceOptions.forEach(opt => opt.classList.remove('selected'));
        item.classList.remove('selected');
        delete item.dataset.confidence;
      });
    });
  }
  
  function runDiagnosis() {
    // Show loading
    document.getElementById('diagnosis-loading').style.display = 'flex';
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('results-content').style.display = 'none';
    
    // Get selected symptoms
    const selectedSymptoms = [];
    const symptomItems = document.querySelectorAll('.symptom-item');
    
    symptomItems.forEach(item => {
      const code = item.dataset.code;
      const confidence = parseFloat(item.dataset.confidence || 0);
      
      if (confidence > 0) {
        selectedSymptoms.push({
          code,
          confidence
        });
      }
    });
    
    // Check if any symptoms are selected
    if (selectedSymptoms.length === 0) {
      document.getElementById('diagnosis-loading').style.display = 'none';
      document.getElementById('no-results').style.display = 'flex';
      return;
    }
    
    // Perform diagnosis with a slight delay to show loading effect
    setTimeout(() => {
      const results = performDiagnosis(selectedSymptoms);
      
      // Check if there are results
      if (results.length === 0) {
        document.getElementById('diagnosis-loading').style.display = 'none';
        document.getElementById('no-results').style.display = 'flex';
        return;
      }
      
      // Display results
      displayResults(results, selectedSymptoms);
      
      // Hide loading, show results
      document.getElementById('diagnosis-loading').style.display = 'none';
      document.getElementById('no-results').style.display = 'none';
      document.getElementById('results-content').style.display = 'flex';
      
      // Increment diagnosis count
      incrementDiagnosisCount();
    }, 1000);
  }
  
  function displayResults(results, selectedSymptoms) {
    const topResultElement = document.getElementById('top-result');
    const resultsListElement = document.getElementById('results-list');
    
    // Clear existing results
    topResultElement.innerHTML = '';
    resultsListElement.innerHTML = '';
    
    // Get symptoms data for display
    const allSymptoms = getSymptoms();
    
    // Display top result
    const topResult = results[0];
    
    // Find the symptoms that contributed to this result
    const symptomsContributed = topResult.symptomsContributed.map(s => {
      const symptom = allSymptoms.find(sym => sym.code === s.code);
      return {
        ...s,
        description: symptom ? symptom.description : 'Gejala Tidak Dikenal'
      };
    });
    
    topResultElement.innerHTML = `
      <div class="top-result-header">
        <div class="top-result-title">${topResult.description}</div>
        <div class="result-percentage">${topResult.percentage}%</div>
      </div>
      <div class="top-result-description">
        <p>Diagnosis paling mungkin berdasarkan gejala yang dipilih.</p>
        <p>Kode: ${topResult.code}</p>
      </div>
      <div class="top-result-symptoms">
        <h4>Gejala yang Berkontribusi:</h4>
        <div>
          ${symptomsContributed.map(s => `
            <span class="symptom-chip">${s.code}</span>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary view-detail-btn" data-code="${topResult.code}">
        <i class="fas fa-search"></i>
        <span>Lihat Detail</span>
      </button>
    `;
    
    // Add click handler for view detail button
    const viewDetailBtn = topResultElement.querySelector('.view-detail-btn');
    if (viewDetailBtn) {
      viewDetailBtn.addEventListener('click', () => {
        showResultDetail(topResult, allSymptoms);
      });
    }
    
    // Create results section with title
    const resultsSection = document.createElement('div');
    resultsSection.className = 'results-section';
    resultsSection.innerHTML = `
      <h3>Semua Kemungkinan Kerusakan</h3>
      <div class="results-list" id="results-list-items"></div>
    `;
    
    resultsListElement.appendChild(resultsSection);
    
    const resultsListItems = document.getElementById('results-list-items');
    
    // Display all results
    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.dataset.code = result.code;
      
      item.innerHTML = `
        <div class="result-info">
          <div class="result-title">${result.description}</div>
          <div class="result-code">${result.code}</div>
        </div>
        <div class="result-percentage">${result.percentage}%</div>
      `;
      
      resultsListItems.appendChild(item);
      
      // Add click handler for result item
      item.addEventListener('click', () => {
        showResultDetail(result, allSymptoms);
      });
    });
  }
  
  function showResultDetail(result, allSymptoms) {
    // Set modal title
    document.getElementById('detail-modal-title').textContent = `${result.code} - ${result.description}`;
    
    // Get damage details element
    const damageDetailsElement = document.getElementById('damage-details');
    
    // Find the symptoms that contributed to this result
    const symptomsContributed = result.symptomsContributed.map(s => {
      const symptom = allSymptoms.find(sym => sym.code === s.code);
      return {
        ...s,
        description: symptom ? symptom.description : 'Gejala Tidak Dikenal'
      };
    });
    
    // Get damage data to access solutions
    const damages = getDamages();
    const damageData = damages.find(d => d.code === result.code);
    const solutions = damageData?.solutions || [];
    
    // Set damage details content
    damageDetailsElement.innerHTML = `
      <div class="damage-info">
        <h3>${result.description}</h3>
        <p class="damage-description">Kode Kerusakan: ${result.code}</p>
        <div class="damage-cf">Tingkat Keyakinan: ${result.percentage}%</div>
      </div>
      
      <div class="symptoms-contributed">
        <h3>Gejala yang Berkontribusi</h3>
        ${symptomsContributed.map(s => `
          <div class="symptom-contribution">
            <div class="symptom-contribution-info">
              <div class="symptom-contribution-title">${s.description}</div>
              <div class="symptom-contribution-code">${s.code}</div>
            </div>
            <div class="symptom-contribution-value">+${Math.round(s.cf * 100)}%</div>
          </div>
        `).join('')}
      </div>
      
      <div class="repair-suggestions">
        <h3>Saran Perbaikan</h3>
        ${solutions.length > 0 ? solutions.map(solution => `
          <div class="repair-suggestion-item">
            <div class="repair-suggestion-title">• ${solution}</div>
          </div>
        `).join('') : `
          <div class="repair-suggestion-item">
            <div class="repair-suggestion-title">Konsultasi dengan Teknisi</div>
            <div class="repair-suggestion-description">Disarankan untuk berkonsultasi dengan teknisi ahli untuk penanganan lebih lanjut.</div>
          </div>
        `}
      </div>
    `;
    
    // Open modal
    resultDetailModal.open();
  }
  
  function resetDiagnosis() {
    // Reset all confidence selections
    const confidenceOptions = document.querySelectorAll('.confidence-option');
    confidenceOptions.forEach(option => {
      option.classList.remove('selected');
    });
    
    const symptomItems = document.querySelectorAll('.symptom-item');
    symptomItems.forEach(item => {
      item.classList.remove('selected');
      delete item.dataset.confidence;
    });
    
    // Hide results
    document.getElementById('diagnosis-loading').style.display = 'none';
    document.getElementById('results-content').style.display = 'none';
    document.getElementById('no-results').style.display = 'flex';
  }
});