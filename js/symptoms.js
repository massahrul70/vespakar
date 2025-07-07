// Symptoms table functionality
document.addEventListener('DOMContentLoaded', () => {
  // Setup modals
  const symptomModal = setupModal('symptom-modal', 'add-symptom-btn', '.close-modal', 'cancel-symptom');
  const deleteModal = setupModal('delete-modal', null, '.close-modal', 'cancel-delete');
  
  // Load symptoms data
  loadSymptomsTable();
  
  // Setup search functionality
  const searchInput = document.getElementById('search-symptoms');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadSymptomsTable(searchInput.value);
    });
  }
  
  // Generate next symptom code
  function generateNextSymptomCode() {
    const symptoms = getSymptoms();
    if (symptoms.length === 0) return 'G001';
    
    const lastCode = symptoms[symptoms.length - 1].code;
    const lastNumber = parseInt(lastCode.substring(1));
    const nextNumber = lastNumber + 1;
    return `G${nextNumber.toString().padStart(3, '0')}`;
  }
  
  // Handle add button to reset form and set next code
  const addSymptomBtn = document.getElementById('add-symptom-btn');
  if (addSymptomBtn) {
    addSymptomBtn.addEventListener('click', () => {
      document.getElementById('modal-title').textContent = 'Tambah Gejala Baru';
      document.getElementById('symptom-code').value = generateNextSymptomCode();
      document.getElementById('symptom-description').value = '';
      symptomForm.dataset.editing = 'false';
    });
  }
  
  // Handle symptom form submission
  const symptomForm = document.getElementById('symptom-form');
  if (symptomForm) {
    symptomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const code = document.getElementById('symptom-code').value.trim();
      const description = document.getElementById('symptom-description').value.trim();
      
      saveSymptom({ code, description });
      
      // Reset form and close modal
      symptomForm.reset();
      symptomForm.dataset.editing = 'false';
      symptomModal.close();
      
      // Reload table
      loadSymptomsTable();
    });
  }
  
  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const code = confirmDeleteBtn.dataset.code;
      if (code) {
        deleteSymptom(code);
        deleteModal.close();
        loadSymptomsTable();
      }
    });
  }
  
  function loadSymptomsTable(searchTerm = '') {
    const symptomsData = document.getElementById('symptoms-data');
    if (!symptomsData) return;
    
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
    
    // Clear existing rows
    symptomsData.innerHTML = '';
    
    // Check if there are symptoms
    if (symptoms.length === 0) {
      symptomsData.innerHTML = `
        <tr>
          <td colspan="3" class="empty-table">
            <i class="fas fa-search"></i>
            <p>Tidak ada gejala ditemukan</p>
          </td>
        </tr>
      `;
      return;
    }
    
    // Add rows for each symptom
    symptoms.forEach(symptom => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${symptom.code}</td>
        <td>${symptom.description}</td>
        <td class="expert-only">
          <div class="action-buttons">
            <button class="action-btn edit-btn" data-code="${symptom.code}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-code="${symptom.code}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      symptomsData.appendChild(row);
    });
    
    // Setup edit buttons
    const editButtons = symptomsData.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const symptom = symptoms.find(s => s.code === code);
        
        if (symptom) {
          document.getElementById('modal-title').textContent = 'Edit Gejala';
          document.getElementById('symptom-code').value = symptom.code;
          document.getElementById('symptom-code').readOnly = true;
          document.getElementById('symptom-description').value = symptom.description;
          symptomForm.dataset.editing = 'true';
          
          symptomModal.open();
        }
      });
    });
    
    // Setup delete buttons
    const deleteButtons = symptomsData.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        confirmDeleteBtn.dataset.code = code;
        deleteModal.open();
      });
    });
  }
});