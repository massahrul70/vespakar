// Theme Management
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const headerThemeSwitch = document.getElementById('header-theme-switch');
  
  // Load theme preference from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
  
  // Set the switch position based on the current theme
  if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
    
    // Listen for theme switch changes
    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? 'dark' : 'light';
      document.body.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Sync header theme switch
      if (headerThemeSwitch) {
        headerThemeSwitch.checked = newTheme === 'dark';
      }
    });
  }
  
  // Header theme switch
  if (headerThemeSwitch) {
    headerThemeSwitch.checked = savedTheme === 'dark';
    
    headerThemeSwitch.addEventListener('change', () => {
      const newTheme = headerThemeSwitch.checked ? 'dark' : 'light';
      document.body.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Sync sidebar theme switch
      if (themeSwitch) {
        themeSwitch.checked = newTheme === 'dark';
      }
    });
  }
  
  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const headerToggle = document.getElementById('header-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  function toggleSidebar() {
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed');
      
      // Save sidebar state to localStorage
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
  }
  
  if (sidebarToggle && sidebar) {
    // Load sidebar state from localStorage
    const sidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarState) {
      sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    }
    
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  if (headerToggle && sidebar) {
    // Load sidebar state from localStorage
    const sidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarState) {
      sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    }
    
    headerToggle.addEventListener('click', () => {
      // On mobile, show/hide sidebar
      if (window.innerWidth <= 992) {
        sidebar.classList.toggle('show');
      } else {
        // On desktop, collapse/expand sidebar
        toggleSidebar();
      }
    });
  }
  
  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('show')) {
      if (!sidebar.contains(e.target) && !headerToggle.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    }
  });
});