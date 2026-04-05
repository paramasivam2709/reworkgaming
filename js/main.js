/* ========================================
   Stackly GAMING - Main JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimation();
  initSmoothScroll();
});

/* ========================================
   Navbar Scroll Effect
======================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
}

/* ========================================
   Mobile Menu Toggle
======================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuBtn || !navLinks) return;
  
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ========================================
   Scroll Reveal Animations
======================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', revealOnScroll);
}

/* ========================================
   Counter Animation
======================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  };
  
  // Use Intersection Observer to trigger counter animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (!counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter);
        }
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

/* ========================================
   Smooth Scroll
======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // Navbar height
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ========================================
   Utility Functions
======================================== */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* ========================================
   Form Validation
======================================== */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  if (formGroup) {
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  input.classList.add('error');
}

function clearError(input) {
  const formGroup = input.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('error');
  }
  input.classList.remove('error');
}

/* ========================================
   Local Storage Helpers
======================================== */
const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};

/* ========================================
   Toast Notifications
======================================== */
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--surface);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;
  
  // Add type-specific border color
  if (type === 'success') {
    toast.style.borderColor = 'var(--success)';
  } else if (type === 'error') {
    toast.style.borderColor = 'var(--error)';
  } else if (type === 'warning') {
    toast.style.borderColor = 'var(--warning)';
  }
  
  document.body.appendChild(toast);
  
  // Remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ========================================
   Loading Spinner
======================================== */
function showLoading(element) {
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.innerHTML = '<div class="spinner"></div>';
  spinner.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 15, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: inherit;
  `;
  
  element.style.position = 'relative';
  element.appendChild(spinner);
  
  return {
    hide: () => spinner.remove()
  };
}

/* ========================================
   Modal/Popup
======================================== */
function createModal(content, options = {}) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      ${options.closeButton !== false ? '<button class="modal-close">&times;</button>' : ''}
      <div class="modal-body">${content}</div>
    </div>
  `;
  
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
  `;
  
  const modalContent = modal.querySelector('.modal-content');
  modalContent.style.cssText = `
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    max-width: ${options.maxWidth || '500px'};
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: scaleIn 0.3s ease-out;
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close handlers
  const closeModal = () => {
    modal.style.animation = 'fadeIn 0.3s ease-out reverse';
    modalContent.style.animation = 'scaleIn 0.3s ease-out reverse';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  };
  
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  return {
    close: closeModal,
    element: modal
  };
}
