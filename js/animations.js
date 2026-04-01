/* ========================================
   Stackly GAMING - Advanced Animations
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initMagneticButtons();
  initTextScramble();
  initGlitchEffect();
  initTypewriter();
  initHoverTilt();
});

/* ========================================
   Parallax Effect
======================================== */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

/* ========================================
   Magnetic Buttons
======================================== */
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.btn, .social-link, .nav-link');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ========================================
   Text Scramble Effect
======================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initTextScramble() {
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  
  scrambleElements.forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.innerText;
    
    el.addEventListener('mouseenter', () => {
      fx.setText(originalText);
    });
  });
}

/* ========================================
   Glitch Effect
======================================== */
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll('[data-glitch]');
  
  glitchElements.forEach(el => {
    const originalText = el.innerText;
    
    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.innerText = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
          })
          .join('');
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
        }
        
        iterations += 1/3;
      }, 30);
    });
  });
}

/* ========================================
   Typewriter Effect
======================================== */
function initTypewriter() {
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  
  typewriterElements.forEach(el => {
    const text = el.getAttribute('data-typewriter');
    const speed = parseInt(el.getAttribute('data-typewriter-speed')) || 100;
    
    el.innerHTML = '';
    el.classList.add('typewriter');
    
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    // Start typing when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(el);
        }
      });
    });
    
    observer.observe(el);
  });
}

/* ========================================
   3D Hover Tilt Effect
======================================== */
function initHoverTilt() {
  const tiltElements = document.querySelectorAll('.card, .match-card, .blog-card, .pricing-card');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ========================================
   Scroll Progress Indicator
======================================== */
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent-cyan));
    z-index: 10001;
    transition: width 0.1s ease-out;
  `;
  
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Initialize scroll progress
createScrollProgress();

/* ========================================
   Cursor Trail Effect
======================================== */
function createCursorTrail() {
  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-trail';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
  `;
  
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const maxParticles = 20;
  
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.life = 1;
      this.decay = 0.02;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.98;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163, 230, 53, ${this.life * 0.5})`;
      ctx.fill();
    }
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  let moveTimeout;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
    
    if (particles.length < maxParticles) {
      particles.push(new Particle(mouseX, mouseY));
    }
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Initialize cursor trail
createCursorTrail();

/* ========================================
   Wave Animation for Section Dividers
======================================== */
function createWaveDivider() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach((section, index) => {
    if (index < sections.length - 1) {
      const wave = document.createElement('div');
      wave.className = 'wave-divider';
      wave.innerHTML = `
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                fill="var(--surface)" fill-opacity="0.5"/>
        </svg>
      `;
      wave.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
      `;
      
      section.style.position = 'relative';
      section.appendChild(wave);
    }
  });
}

// Initialize wave dividers
createWaveDivider();

/* ========================================
   Neon Flicker Animation
======================================== */
function initNeonFlicker() {
  const neonElements = document.querySelectorAll('.neon-text');
  
  neonElements.forEach(el => {
    setInterval(() => {
      const opacity = 0.8 + Math.random() * 0.2;
      el.style.opacity = opacity;
    }, 100);
  });
}

initNeonFlicker();

/* ========================================
   Stagger Animation for Lists
======================================== */
function initStaggerAnimations() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  staggerContainers.forEach(container => {
    const children = container.children;
    const delay = parseFloat(container.dataset.stagger) || 0.1;
    
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * delay}s`;
      child.classList.add('animate-slide-in-up');
    });
  });
}

initStaggerAnimations();

/* ========================================
   Background Gradient Animation
======================================== */
function initAnimatedGradient() {
  const gradientElements = document.querySelectorAll('[data-animated-gradient]');
  
  gradientElements.forEach(el => {
    let angle = 0;
    
    const animate = () => {
      angle = (angle + 0.5) % 360;
      el.style.background = `linear-gradient(${angle}deg, var(--primary), var(--accent-cyan), var(--accent-purple))`;
      requestAnimationFrame(animate);
    };
    
    animate();
  });
}

initAnimatedGradient();

/* ========================================
   Confetti Effect
======================================== */
function createConfetti(x, y) {
  const colors = ['#a3e635', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    const angle = (Math.PI * 2 * i) / confettiCount;
    const velocity = 5 + Math.random() * 5;
    let posX = x;
    let posY = y;
    let velX = Math.cos(angle) * velocity;
    let velY = Math.sin(angle) * velocity;
    let rotation = 0;
    let rotationSpeed = (Math.random() - 0.5) * 20;
    let opacity = 1;
    
    const animate = () => {
      posX += velX;
      posY += velY;
      velY += 0.3; // Gravity
      rotation += rotationSpeed;
      opacity -= 0.02;
      
      confetti.style.left = posX + 'px';
      confetti.style.top = posY + 'px';
      confetti.style.transform = `rotate(${rotation}deg)`;
      confetti.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Add confetti on button clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});
