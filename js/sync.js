// Real-time Data Synchronization
class DataSync {
  constructor() {
    this.syncInterval = null;
    this.lastSyncTime = 0;
    this.syncKey = 'vespaExpertSystemSync';
    this.isOnline = navigator.onLine;
    
    this.init();
  }
  
  init() {
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('vespaExpertSystem')) {
        this.handleStorageChange(e);
      }
    });
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Start periodic sync
    this.startPeriodicSync();
    
    // Sync on page load
    this.syncData();
  }
  
  handleStorageChange(event) {
    const { key, newValue, oldValue } = event;
    
    // Skip if no new value (deletion)
    if (!newValue) return;
    
    // Determine what type of data changed
    let dataType = '';
    if (key === 'symptoms') dataType = 'symptoms';
    else if (key === 'damages') dataType = 'damages';
    else if (key === 'cfRules') dataType = 'cfRules';
    else if (key === 'diagnosisCount') dataType = 'diagnosisCount';
    
    if (dataType) {
      this.notifyDataChange(dataType, JSON.parse(newValue));
      this.updateUI(dataType);
    }
  }
  
  notifyDataChange(dataType, newData) {
    // Show notification about data update
    const messages = {
      symptoms: 'Data gejala telah diperbarui dari device lain',
      damages: 'Data kerusakan telah diperbarui dari device lain',
      cfRules: 'Aturan CF telah diperbarui dari device lain',
      diagnosisCount: 'Statistik diagnosis telah diperbarui'
    };
    
    if (messages[dataType]) {
      this.showSyncNotification(messages[dataType]);
    }
  }
  
  updateUI(dataType) {
    // Refresh UI based on current page
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('symptoms.html') && dataType === 'symptoms') {
      if (typeof loadSymptomsTable === 'function') {
        loadSymptomsTable();
      }
    } else if (currentPage.includes('damages.html') && (dataType === 'damages' || dataType === 'cfRules')) {
      if (typeof loadDamagesTable === 'function') {
        loadDamagesTable();
      }
    } else if (currentPage.includes('diagnosis.html') && (dataType === 'symptoms' || dataType === 'damages' || dataType === 'cfRules')) {
      if (typeof loadDiagnosisSymptoms === 'function') {
        loadDiagnosisSymptoms();
      }
    } else if ((currentPage.includes('index.html') || currentPage === '/') && dataType === 'diagnosisCount') {
      if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
      }
    }
    
    // Update dashboard stats if on any page
    if (typeof updateDashboardStats === 'function' && (dataType === 'symptoms' || dataType === 'damages' || dataType === 'diagnosisCount')) {
      updateDashboardStats();
    }
  }
  
  startPeriodicSync() {
    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, 30000);
  }
  
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  async syncData() {
    if (!this.isOnline) return;
    
    try {
      // Simulate server sync - in real implementation, this would be API calls
      const currentTime = Date.now();
      const syncData = {
        lastSync: currentTime,
        symptoms: getSymptoms(),
        damages: getDamages(),
        cfRules: getCFRules(),
        diagnosisCount: getDiagnosisCount()
      };
      
      // Store sync timestamp
      localStorage.setItem(this.syncKey, JSON.stringify({
        lastSync: currentTime,
        dataHash: this.generateDataHash(syncData)
      }));
      
      this.lastSyncTime = currentTime;
      
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
  
  generateDataHash(data) {
    // Simple hash function for data comparison
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
  
  showSyncNotification(message) {
    // Remove existing sync notification if any
    const existingNotification = document.querySelector('.sync-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.innerHTML = `
      <i class="fas fa-sync-alt"></i>
      <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
  
  // Force sync data from server (for manual refresh)
  async forceSyncFromServer() {
    this.showSyncNotification('Menyinkronkan data...');
    await this.syncData();
    this.updateUI('symptoms');
    this.updateUI('damages');
    this.updateUI('cfRules');
    this.updateUI('diagnosisCount');
  }
}

// Initialize sync when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dataSync = new DataSync();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.dataSync) {
    window.dataSync.stopPeriodicSync();
  }
});