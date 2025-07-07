// Authentication Management
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  // Set default user as regular user
  if (!currentUser) {
    const defaultUser = {
      username: 'Pengguna',
      role: 'user',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
  }
  
  // Get current user (either existing or default)
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  // Set user info in the UI
  const userNameElements = document.querySelectorAll('#user-name, #header-user-name');
  const userRoleElement = document.getElementById('user-role');
  
  userNameElements.forEach(el => {
    if (el) el.textContent = user.username;
  });
  
  if (userRoleElement) {
    userRoleElement.textContent = user.role === 'expert' ? 'Expert' : 'User';
  }
  
  // Set role on body for CSS targeting
  document.body.dataset.role = user.role;
  
  // Setup expert login modal
  const expertLoginModal = setupModal('expert-login-modal', 'expert-login-btn', '.close-modal', 'cancel-expert-login');
  
  // Handle expert login form
  const expertLoginForm = document.getElementById('expert-login-form');
  if (expertLoginForm) {
    expertLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('expert-username').value.trim();
      const password = document.getElementById('expert-password').value.trim();
      
      // Check expert credentials
      if (username === 'admin' && password === 'admin123') {
        // Update user to expert
        const expertUser = {
          username: 'Admin',
          role: 'expert',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(expertUser));
        
        // Update UI
        userNameElements.forEach(el => {
          if (el) el.textContent = expertUser.username;
        });
        
        if (userRoleElement) {
          userRoleElement.textContent = 'Expert';
        }
        
        // Set role on body for CSS targeting
        document.body.dataset.role = expertUser.role;
        
        // Show logout button and hide login button
        const logoutBtn = document.getElementById('logout-btn');
        const expertLoginBtn = document.getElementById('expert-login-btn');
        
        if (logoutBtn) {
          logoutBtn.style.display = 'flex';
        }
        
        if (expertLoginBtn) {
          expertLoginBtn.style.display = 'none';
        }
        
        // Close modal and reset form
        expertLoginModal.close();
        expertLoginForm.reset();
        
        // Show success notification
        showSuccessNotification('Login berhasil! Anda sekarang masuk sebagai Expert.');
      } else {
        alert('Username atau password salah!');
      }
    });
  }
  
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    // Show/hide logout button based on role
    if (user.role === 'expert') {
      logoutBtn.style.display = 'flex';
      const expertLoginBtn = document.getElementById('expert-login-btn');
      if (expertLoginBtn) {
        expertLoginBtn.style.display = 'none';
      }
    } else {
      logoutBtn.style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', () => {
      // Reset to default user
      const defaultUser = {
        username: 'Pengguna',
        role: 'user',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
      
      // Update UI
      userNameElements.forEach(el => {
        if (el) el.textContent = defaultUser.username;
      });
      
      if (userRoleElement) {
        userRoleElement.textContent = 'User';
      }
      
      // Set role on body for CSS targeting
      document.body.dataset.role = defaultUser.role;
      
      // Hide logout button and show login button
      logoutBtn.style.display = 'none';
      const expertLoginBtn = document.getElementById('expert-login-btn');
      if (expertLoginBtn) {
        expertLoginBtn.style.display = 'flex';
      }
      
      showSuccessNotification('Logout berhasil! Anda sekarang masuk sebagai User biasa.');
    });
  }
});

// Success notification function
function showSuccessNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.success-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Modal functionality
function setupModal(modalId, openBtnId, closeBtnClass = '.close-modal', cancelBtnId = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return null;
  
  const openBtn = document.getElementById(openBtnId);
  const closeBtns = modal.querySelectorAll(closeBtnClass);
  const cancelBtn = cancelBtnId ? document.getElementById(cancelBtnId) : null;
  
  function openModal() {
    modal.classList.add('show');
  }
  
  function closeModal() {
    modal.classList.remove('show');
  }
  
  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  return {
    element: modal,
    open: openModal,
    close: closeModal
  };
}