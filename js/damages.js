// Damages table functionality
document.addEventListener('DOMContentLoaded', () => {
  // Setup modals
  const damageModal = setupModal('damage-modal', 'add-damage-btn', '.close-modal', 'cancel-damage');
  const deleteModal = setupModal('delete-modal', null, '.close-modal', 'cancel-delete');
  const cfRulesModal = setupModal('cf-rules-modal', null, '.close-modal');
  const addCfRuleModal = setupModal('add-cf-rule-modal', 'add-cf-rule-btn', '.close-modal', 'cancel-cf-rule');
  
  // Load damages data
  loadDamagesTable();
  
  // Setup search functionality
  const searchInput = document.getElementById('search-damages');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadDamagesTable(searchInput.value);
    });
  }
  
  // Generate next damage code
  function generateNextDamageCode() {
    const damages = getDamages();
    if (damages.length === 0) return 'K001';
    
    const lastCode = damages[damages.length - 1].code;
    const lastNumber = parseInt(lastCode.substring(1));
    const nextNumber = lastNumber + 1;
    return `K${nextNumber.toString().padStart(3, '0')}`;
  }
  
  // Handle add button to reset form and set next code
  const addDamageBtn = document.getElementById('add-damage-btn');
  if (addDamageBtn) {
    addDamageBtn.addEventListener('click', () => {
      document.getElementById('modal-title').textContent = 'Tambah Kerusakan Baru';
      document.getElementById('damage-code').value = generateNextDamageCode();
      document.getElementById('damage-code').readOnly = true;
      document.getElementById('damage-description').value = '';
      document.getElementById('damage-solutions').value = '';
      damageForm.dataset.editing = 'false';
    });
  }
  
  // Handle damage form submission
  const damageForm = document.getElementById('damage-form');
  if (damageForm) {
    damageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const code = document.getElementById('damage-code').value.trim();
      const description = document.getElementById('damage-description').value.trim();
      const solutionsText = document.getElementById('damage-solutions').value.trim();
      
      // Convert solutions text to array by splitting on new lines and filtering empty lines
      const solutions = solutionsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map((line, index) => {
          // Remove existing numbering if present
          const cleanLine = line.replace(/^\d+\.\s*/, '');
          return cleanLine;
        });
      
      saveDamage({ code, description, solutions });
      
      // Reset form and close modal
      damageForm.reset();
      damageForm.dataset.editing = 'false';
      damageModal.close();
      
      // Reload table
      loadDamagesTable();
    });
  }
  
  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const type = confirmDeleteBtn.dataset.type;
      const code = confirmDeleteBtn.dataset.code;
      const symptomCode = confirmDeleteBtn.dataset.symptomCode;
      
      if (type === 'damage' && code) {
        deleteDamage(code);
        deleteModal.close();
        loadDamagesTable();
      } else if (type === 'cf-rule' && code && symptomCode) {
        deleteCFRule(code, symptomCode);
        deleteModal.close();
        loadCFRulesTable(code);
      }
    });
  }
  
  // Handle CF Rule form submission
  const cfRuleForm = document.getElementById('cf-rule-form');
  if (cfRuleForm) {
    cfRuleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const damageCode = document.getElementById('cf-damage-code').textContent;
      const symptomCode = document.getElementById('cf-symptom').value;
      const mb = parseFloat(document.getElementById('cf-mb').value);
      const md = parseFloat(document.getElementById('cf-md').value);
      
      // Validate
      if (!symptomCode) {
        alert('Silakan pilih gejala');
        return;
      }
      
      // Add CF rule
      addCFRule({
        damageCode,
        symptomCode,
        mb,
        md
      });
      
      // Reset form and close modal
      cfRuleForm.reset();
      addCfRuleModal.close();
      
      // Reload CF rules table
      loadCFRulesTable(damageCode);
    });
  }
  
  // Handle save CF rules button
  const saveCfRulesBtn = document.getElementById('save-cf-rules');
  if (saveCfRulesBtn) {
    saveCfRulesBtn.addEventListener('click', () => {
      cfRulesModal.close();
    });
  }
  
  function loadDamagesTable(searchTerm = '') {
    const damagesData = document.getElementById('damages-data');
    if (!damagesData) return;
    
    // Get damages data
    let damages = getDamages();
    
    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      damages = damages.filter(d => 
        d.code.toLowerCase().includes(term) || 
        d.description.toLowerCase().includes(term)
      );
    }
    
    // Clear existing rows
    damagesData.innerHTML = '';
    
    // Check if there are damages
    if (damages.length === 0) {
      damagesData.innerHTML = `
        <tr>
          <td colspan="3" class="empty-table">
            <i class="fas fa-search"></i>
            <p>Tidak ada kerusakan ditemukan</p>
          </td>
        </tr>
      `;
      return;
    }
    
    // Add rows for each damage
    damages.forEach(damage => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${damage.code}</td>
        <td>${damage.description}</td>
        <td class="expert-only">
          <div class="action-buttons">
            <button class="action-btn edit-btn" data-code="${damage.code}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-code="${damage.code}">
              <i class="fas fa-trash"></i>
            </button>
            <button class="action-btn cf-btn" data-code="${damage.code}">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </td>
      `;
      
      damagesData.appendChild(row);
    });
    
    // Setup edit buttons
    const editButtons = damagesData.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const damage = damages.find(d => d.code === code);
        
        if (damage) {
          document.getElementById('modal-title').textContent = 'Edit Kerusakan';
          document.getElementById('damage-code').value = damage.code;
          document.getElementById('damage-code').readOnly = true;
          document.getElementById('damage-description').value = damage.description;
          
          // Convert solutions array to numbered text
          const solutionsText = damage.solutions && damage.solutions.length > 0 
            ? damage.solutions.map((solution, index) => `${index + 1}. ${solution}`).join('\n')
            : '';
          document.getElementById('damage-solutions').value = solutionsText;
          
          damageForm.dataset.editing = 'true';
          
          damageModal.open();
        }
      });
    });
    
    // Setup delete buttons
    const deleteButtons = damagesData.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        confirmDeleteBtn.dataset.type = 'damage';
        confirmDeleteBtn.dataset.code = code;
        deleteModal.open();
      });
    });
    
    // Setup CF rules buttons
    const cfButtons = damagesData.querySelectorAll('.cf-btn');
    cfButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        const damage = damages.find(d => d.code === code);
        
        if (damage) {
          document.getElementById('cf-modal-title').textContent = `Aturan CF untuk ${damage.code}`;
          document.getElementById('cf-damage-code').textContent = damage.code;
          document.getElementById('cf-damage-description').textContent = damage.description;
          
          // Store damage code for the add CF rule form
          document.getElementById('cf-damage-code').textContent = damage.code;
          
          // Load CF rules table
          loadCFRulesTable(damage.code);
          
          cfRulesModal.open();
        }
      });
    });
  }
  
  function loadCFRulesTable(damageCode) {
    const cfRulesData = document.getElementById('cf-rules-data');
    if (!cfRulesData) return;
    
    // Get CF rules for this damage
    const cfRules = getCFRulesForDamage(damageCode);
    const symptoms = getSymptoms();
    
    // Clear existing rows
    cfRulesData.innerHTML = '';
    
    // Check if there are CF rules
    if (cfRules.length === 0) {
      cfRulesData.innerHTML = `
        <tr>
          <td colspan="6" class="empty-table">
            <i class="fas fa-search"></i>
            <p>Tidak ada aturan CF ditemukan untuk kerusakan ini</p>
          </td>
        </tr>
      `;
    } else {
      // Add rows for each CF rule
      cfRules.forEach(rule => {
        const symptom = symptoms.find(s => s.code === rule.symptomCode);
        const cf = (rule.mb - rule.md).toFixed(2);
        
        if (symptom) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${symptom.code}</td>
            <td>${symptom.description}</td>
            <td>${rule.mb.toFixed(1)}</td>
            <td>${rule.md.toFixed(1)}</td>
            <td>${cf}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn delete-btn" data-damage-code="${rule.damageCode}" data-symptom-code="${rule.symptomCode}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          `;
          
          cfRulesData.appendChild(row);
        }
      });
      
      // Setup delete buttons for CF rules
      const deleteButtons = cfRulesData.querySelectorAll('.delete-btn');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const damageCode = btn.dataset.damageCode;
          const symptomCode = btn.dataset.symptomCode;
          
          confirmDeleteBtn.dataset.type = 'cf-rule';
          confirmDeleteBtn.dataset.code = damageCode;
          confirmDeleteBtn.dataset.symptomCode = symptomCode;
          deleteModal.open();
        });
      });
    }
    
    // Populate symptoms dropdown for adding new CF rule
    const symptomsDropdown = document.getElementById('cf-symptom');
    if (symptomsDropdown) {
      // Clear existing options
      symptomsDropdown.innerHTML = '<option value="">Pilih gejala</option>';
      
      // Get symptoms that are not already in CF rules for this damage
      const usedSymptomCodes = cfRules.map(rule => rule.symptomCode);
      const availableSymptoms = symptoms.filter(s => !usedSymptomCodes.includes(s.code));
      
      // Add options for each available symptom
      availableSymptoms.forEach(symptom => {
        const option = document.createElement('option');
        option.value = symptom.code;
        option.textContent = `${symptom.code} - ${symptom.description}`;
        symptomsDropdown.appendChild(option);
      });
    }
  }
});