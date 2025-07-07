// Data Management
const DATA_VERSION = '1.2';

// Initialize data in localStorage if not exists
function initializeData() {
  // Check if data exists and version matches
  const dataVersion = localStorage.getItem('vespaExpertSystemVersion');
  
  if (dataVersion !== DATA_VERSION) {
    // Initialize symptoms data
    const symptoms = [
      { code: 'G001', description: 'Mesin yang susah untuk di hidupkan' },
      { code: 'G002', description: 'Mesin mati mendadak saat digunakan' },
      { code: 'G003', description: 'Percikan api lemah' },
      { code: 'G004', description: 'Mesin tersendat-sendat saat dihidupkan' },
      { code: 'G005', description: 'Bau bensin yang kuat karena bensin tidak turun ke karburator' },
      { code: 'G006', description: 'Kebocoran dibagian bahan bakar' },
      { code: 'G007', description: 'Lampu yang tidak berfungsi dengan baik (Mati)' },
      { code: 'G008', description: 'Salah alur listrik' },
      { code: 'G009', description: 'Kabel putus' },
      { code: 'G010', description: 'Suhu mesin yang meningkat secara drastis' },
      { code: 'G011', description: 'Suara kasar pada mesin' },
      { code: 'G012', description: 'Pengapian yang tidak konsisten' },
      { code: 'G013', description: 'Gigi perseneling yang terlepas saat digunakan' },
      { code: 'G014', description: 'Terdengar suara berdecit disaat mengganti gigi' },
      { code: 'G015', description: 'Getaran pada vespa yang berlebih saat berkendara' },
      { code: 'G016', description: 'Suspensi yang terasa tidak responsive' },
      { code: 'G017', description: 'Suara mengericik pada mesin' },
      { code: 'G018', description: 'Shock keluar oli' },
      { code: 'G019', description: 'Sering terjadinya macet' },
      { code: 'G020', description: 'Terdengar suara berdecit saat melintas jalan yang kasar' },
      { code: 'G021', description: 'Mesin susah untuk beralih gigi' },
      { code: 'G022', description: 'Suara berdecit saat mengerem' },
      { code: 'G023', description: 'Rem yang tidak responsive' },
      { code: 'G024', description: 'Pedal rem Terasa kendur' },
      { code: 'G025', description: 'Kompling terasa keras saat ditekan' },
      { code: 'G026', description: 'Kopling tidak mau netral' },
      { code: 'G027', description: 'Kopling kasar' },
      { code: 'G028', description: 'Suara berdecit/berderit dari roda atau ban' },
      { code: 'G029', description: 'Ban/roda haus secara tidak merata' },
      { code: 'G030', description: 'Stang susah saat di belokan' },
      { code: 'G031', description: 'Saat di rem ngebuang' },
      { code: 'G032', description: 'Saat berkendara bagian roda tidak stabil' },
      { code: 'G033', description: 'Mesin tidak nyala saat di stater' },
      { code: 'G034', description: 'Stater mati total' },
      { code: 'G035', description: 'Sein motor menyala tidak berkedip' },
      { code: 'G036', description: 'Sein motor mati' }
    ];
    
    // Initialize damages data with solutions
    const damages = [
      { 
        code: 'K001', 
        description: 'CDI vespa excel',
        solutions: [
          'Periksa kabel koneksi CDI',
          'Ganti CDI dengan yang baru jika rusak',
          'Periksa sistem kelistrikan terkait'
        ]
      },
      { 
        code: 'K002', 
        description: 'Busi vespa excel',
        solutions: [
          'Bersihkan busi dari kerak karbon',
          'Ganti busi dengan yang baru',
          'Setel celah busi sesuai spesifikasi'
        ]
      },
      { 
        code: 'K003', 
        description: 'Magnet kipas vespa excel',
        solutions: [
          'Periksa kondisi magnet kipas',
          'Ganti magnet kipas jika rusak',
          'Bersihkan area sekitar magnet'
        ]
      },
      { 
        code: 'K004', 
        description: 'Karburator Bakar vespa excel',
        solutions: [
          'Bersihkan karburator secara menyeluruh',
          'Ganti karburator jika rusak parah',
          'Setel campuran udara dan bahan bakar'
        ]
      },
      { 
        code: 'K005', 
        description: 'Pengereman vespa excel',
        solutions: [
          'Ganti kampas rem yang aus',
          'Setel kabel rem dengan benar',
          'Periksa sistem hidrolik rem'
        ]
      },
      { 
        code: 'K006', 
        description: 'Transmisi vespa excel',
        solutions: [
          'Ganti oli transmisi',
          'Setel kabel kopling',
          'Periksa gigi transmisi yang aus'
        ]
      },
      { 
        code: 'K007', 
        description: 'Suspensi vespa excel',
        solutions: [
          'Ganti shock absorber yang bocor',
          'Periksa bushing suspensi',
          'Setel ketinggian suspensi'
        ]
      },
      { 
        code: 'K008', 
        description: 'Kelistrikan vespa excel',
        solutions: [
          'Periksa semua kabel listrik',
          'Ganti sekring yang putus',
          'Tes kondisi aki'
        ]
      },
      { 
        code: 'K009', 
        description: 'Komstir vespa excel',
        solutions: [
          'Setel bearing komstir',
          'Ganti bearing komstir jika aus',
          'Periksa kondisi as komstir'
        ]
      },
      { 
        code: 'K010', 
        description: 'Kopling vespa excel',
        solutions: [
          'Setel mekanisme kopling',
          'Ganti plat kopling yang aus',
          'Periksa per kopling'
        ]
      },
      { 
        code: 'K011', 
        description: 'Ban vespa excel',
        solutions: [
          'Ganti ban yang aus atau rusak',
          'Periksa tekanan angin ban',
          'Balancing roda'
        ]
      },
      { 
        code: 'K012', 
        description: 'Roda vespa excel',
        solutions: [
          'Periksa bearing roda',
          'Setel keselarasan roda',
          'Ganti pelek jika bengkok'
        ]
      },
      { 
        code: 'K013', 
        description: 'Blok piston vespa excel',
        solutions: [
          'Overhaul mesin',
          'Ganti ring piston',
          'Periksa silinder dan piston'
        ]
      },
      { 
        code: 'K014', 
        description: 'Stater vespa excel',
        solutions: [
          'Periksa motor starter',
          'Ganti relay starter',
          'Periksa sambungan aki'
        ]
      },
      { 
        code: 'K015', 
        description: 'Lampu vespa excel',
        solutions: [
          'Ganti bohlam yang putus',
          'Periksa kabel lampu',
          'Tes saklar lampu'
        ]
      }
    ];
    
    // Initialize CF rules data
    const cfRules = [
      { damageCode: 'K001', symptomCode: 'G001', mb: 0.8, md: 0.2 },
      { damageCode: 'K001', symptomCode: 'G003', mb: 0.9, md: 0.3 },
      { damageCode: 'K001', symptomCode: 'G004', mb: 0.7, md: 0.4 },
      { damageCode: 'K001', symptomCode: 'G012', mb: 0.6, md: 0.2 },
      { damageCode: 'K001', symptomCode: 'G033', mb: 0.8, md: 0.4 },
      
      { damageCode: 'K002', symptomCode: 'G001', mb: 0.9, md: 0.1 },
      { damageCode: 'K002', symptomCode: 'G002', mb: 0.9, md: 0.2 },
      { damageCode: 'K002', symptomCode: 'G003', mb: 0.9, md: 0.1 },
      { damageCode: 'K002', symptomCode: 'G004', mb: 0.7, md: 0.2 },
      { damageCode: 'K002', symptomCode: 'G012', mb: 0.8, md: 0.2 },
      { damageCode: 'K002', symptomCode: 'G033', mb: 0.8, md: 0.3 },
      
      { damageCode: 'K003', symptomCode: 'G010', mb: 0.7, md: 0.3 },
      { damageCode: 'K003', symptomCode: 'G011', mb: 0.6, md: 0.5 },
      
      { damageCode: 'K004', symptomCode: 'G004', mb: 0.8, md: 0.3 },
      { damageCode: 'K004', symptomCode: 'G005', mb: 0.9, md: 0.2 },
      { damageCode: 'K004', symptomCode: 'G006', mb: 0.7, md: 0.2 },
      { damageCode: 'K004', symptomCode: 'G019', mb: 0.8, md: 0.4 },
      
      { damageCode: 'K005', symptomCode: 'G022', mb: 0.7, md: 0.3 },
      { damageCode: 'K005', symptomCode: 'G023', mb: 0.6, md: 0.2 },
      { damageCode: 'K005', symptomCode: 'G024', mb: 0.9, md: 0.4 },
      { damageCode: 'K005', symptomCode: 'G031', mb: 0.9, md: 0.2 },
      
      { damageCode: 'K006', symptomCode: 'G013', mb: 0.8, md: 0.3 },
      { damageCode: 'K006', symptomCode: 'G014', mb: 0.7, md: 0.4 },
      { damageCode: 'K006', symptomCode: 'G015', mb: 0.6, md: 0.5 },
      { damageCode: 'K006', symptomCode: 'G021', mb: 0.8, md: 0.3 },
      
      { damageCode: 'K007', symptomCode: 'G016', mb: 0.7, md: 0.2 },
      { damageCode: 'K007', symptomCode: 'G018', mb: 0.6, md: 0.4 },
      
      { damageCode: 'K008', symptomCode: 'G003', mb: 0.9, md: 0.2 },
      { damageCode: 'K008', symptomCode: 'G008', mb: 0.9, md: 0.3 },
      { damageCode: 'K008', symptomCode: 'G009', mb: 0.8, md: 0.4 },
      
      { damageCode: 'K009', symptomCode: 'G020', mb: 0.7, md: 0.3 },
      { damageCode: 'K009', symptomCode: 'G030', mb: 0.6, md: 0.2 },
      { damageCode: 'K009', symptomCode: 'G032', mb: 0.8, md: 0.3 },
      
      { damageCode: 'K010', symptomCode: 'G025', mb: 0.7, md: 0.4 },
      { damageCode: 'K010', symptomCode: 'G026', mb: 0.8, md: 0.3 },
      { damageCode: 'K010', symptomCode: 'G027', mb: 0.7, md: 0.2 },
      
      { damageCode: 'K011', symptomCode: 'G028', mb: 0.9, md: 0.3 },
      { damageCode: 'K011', symptomCode: 'G029', mb: 0.8, md: 0.4 },
      
      { damageCode: 'K012', symptomCode: 'G020', mb: 0.7, md: 0.3 },
      { damageCode: 'K012', symptomCode: 'G028', mb: 0.9, md: 0.2 },
      { damageCode: 'K012', symptomCode: 'G029', mb: 0.8, md: 0.4 },
      { damageCode: 'K012', symptomCode: 'G032', mb: 0.6, md: 0.5 },
      
      { damageCode: 'K013', symptomCode: 'G001', mb: 0.7, md: 0.2 },
      { damageCode: 'K013', symptomCode: 'G002', mb: 0.8, md: 0.3 },
      { damageCode: 'K013', symptomCode: 'G004', mb: 0.7, md: 0.4 },
      { damageCode: 'K013', symptomCode: 'G015', mb: 0.9, md: 0.3 },
      
      { damageCode: 'K014', symptomCode: 'G033', mb: 0.9, md: 0.2 },
      { damageCode: 'K014', symptomCode: 'G034', mb: 0.9, md: 0.1 },
      
      { damageCode: 'K015', symptomCode: 'G007', mb: 0.9, md: 0.1 },
      { damageCode: 'K015', symptomCode: 'G035', mb: 0.8, md: 0.2 },
      { damageCode: 'K015', symptomCode: 'G036', mb: 0.9, md: 0.1 }
    ];
    
    // Store data in localStorage
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
    localStorage.setItem('damages', JSON.stringify(damages));
    localStorage.setItem('cfRules', JSON.stringify(cfRules));
    localStorage.setItem('diagnosisCount', '0');
    localStorage.setItem('vespaExpertSystemVersion', DATA_VERSION);
    
    // Trigger sync notification for new data
    if (window.dataSync) {
      window.dataSync.showSyncNotification('Data sistem telah diinisialisasi');
    }
  }
}

// Get all symptoms
function getSymptoms() {
  return JSON.parse(localStorage.getItem('symptoms') || '[]');
}

// Get all damages
function getDamages() {
  return JSON.parse(localStorage.getItem('damages') || '[]');
}

// Get all CF rules
function getCFRules() {
  return JSON.parse(localStorage.getItem('cfRules') || '[]');
}

// Get CF rules for a specific damage
function getCFRulesForDamage(damageCode) {
  const cfRules = getCFRules();
  return cfRules.filter(rule => rule.damageCode === damageCode);
}

// Add or update a symptom
function saveSymptom(symptom) {
  const symptoms = getSymptoms();
  const index = symptoms.findIndex(s => s.code === symptom.code);
  
  if (index >= 0) {
    // Update existing
    symptoms[index] = symptom;
  } else {
    // Add new
    symptoms.push(symptom);
  }
  
  localStorage.setItem('symptoms', JSON.stringify(symptoms));
  
  // Trigger sync notification
  if (window.dataSync) {
    const action = index >= 0 ? 'diperbarui' : 'ditambahkan';
    window.dataSync.showSyncNotification(`Gejala ${symptom.code} ${action} dan disinkronkan`);
  }
}

// Delete a symptom
function deleteSymptom(code) {
  let symptoms = getSymptoms();
  symptoms = symptoms.filter(s => s.code !== code);
  localStorage.setItem('symptoms', JSON.stringify(symptoms));
  
  // Also remove any CF rules associated with this symptom
  let cfRules = getCFRules();
  cfRules = cfRules.filter(rule => rule.symptomCode !== code);
  localStorage.setItem('cfRules', JSON.stringify(cfRules));
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification(`Gejala ${code} dihapus dan disinkronkan`);
  }
}

// Add or update a damage
function saveDamage(damage) {
  const damages = getDamages();
  const index = damages.findIndex(d => d.code === damage.code);
  
  if (index >= 0) {
    // Update existing
    damages[index] = damage;
  } else {
    // Add new
    damages.push(damage);
  }
  
  localStorage.setItem('damages', JSON.stringify(damages));
  
  // Trigger sync notification
  if (window.dataSync) {
    const action = index >= 0 ? 'diperbarui' : 'ditambahkan';
    window.dataSync.showSyncNotification(`Kerusakan ${damage.code} ${action} dan disinkronkan`);
  }
}

// Delete a damage
function deleteDamage(code) {
  let damages = getDamages();
  damages = damages.filter(d => d.code !== code);
  localStorage.setItem('damages', JSON.stringify(damages));
  
  // Also remove any CF rules associated with this damage
  let cfRules = getCFRules();
  cfRules = cfRules.filter(rule => rule.damageCode !== code);
  localStorage.setItem('cfRules', JSON.stringify(cfRules));
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification(`Kerusakan ${code} dihapus dan disinkronkan`);
  }
}

// Save CF rules for a damage
function saveCFRulesForDamage(damageCode, rules) {
  let cfRules = getCFRules();
  
  // Remove existing rules for this damage
  cfRules = cfRules.filter(rule => rule.damageCode !== damageCode);
  
  // Add new rules
  cfRules = [...cfRules, ...rules];
  
  localStorage.setItem('cfRules', JSON.stringify(cfRules));
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification(`Aturan CF untuk ${damageCode} disinkronkan`);
  }
}

// Add CF rule
function addCFRule(rule) {
  const cfRules = getCFRules();
  
  // Check if rule already exists
  const existingIndex = cfRules.findIndex(r => 
    r.damageCode === rule.damageCode && r.symptomCode === rule.symptomCode
  );
  
  if (existingIndex >= 0) {
    // Update existing
    cfRules[existingIndex] = rule;
  } else {
    // Add new
    cfRules.push(rule);
  }
  
  localStorage.setItem('cfRules', JSON.stringify(cfRules));
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification(`Aturan CF ${rule.damageCode}-${rule.symptomCode} disinkronkan`);
  }
}

// Delete CF rule
function deleteCFRule(damageCode, symptomCode) {
  let cfRules = getCFRules();
  cfRules = cfRules.filter(rule => 
    !(rule.damageCode === damageCode && rule.symptomCode === symptomCode)
  );
  localStorage.setItem('cfRules', JSON.stringify(cfRules));
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification(`Aturan CF ${damageCode}-${symptomCode} dihapus dan disinkronkan`);
  }
}

// Increment diagnosis count
function incrementDiagnosisCount() {
  const count = parseInt(localStorage.getItem('diagnosisCount') || '0', 10);
  localStorage.setItem('diagnosisCount', (count + 1).toString());
  
  // Trigger sync notification
  if (window.dataSync) {
    window.dataSync.showSyncNotification('Statistik diagnosis diperbarui');
  }
}

// Get diagnosis count
function getDiagnosisCount() {
  return parseInt(localStorage.getItem('diagnosisCount') || '0', 10);
}

// Initialize data when the script loads
initializeData();