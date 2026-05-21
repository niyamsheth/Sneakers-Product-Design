/* ============================================================
   ATMOZ — SCRIPT.JS
   Premium Animations & Interactions
   Stitch MCP / GitHub Pages Ready
============================================================ */

// ── Wait for DOM + GSAP ──
window.addEventListener('load', () => {
  initAll();
});

function initAll() {
  initNoise();
  initCursor();
  initNavbar();
  initMobileMenu();
  initHeroParallax();
  initMarquee();
  initScrollReveal();
  initMagneticButtons();
  initInteractiveGrid();
  initCounters();

  // GSAP if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }
}

/* ============================================================
   NOISE CANVAS
============================================================ */
function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawNoise() {
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  let lastTime = 0;
  function noiseLoop(time) {
    if (time - lastTime > 80) { // ~12fps for noise
      drawNoise();
      lastTime = time;
    }
    requestAnimationFrame(noiseLoop);
  }
  requestAnimationFrame(noiseLoop);
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trailing effect
  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover states
  document.querySelectorAll('a, button, .shoe-card, .tech-item, .review-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '24px';
      cursor.style.height = '24px';
      cursor.style.background = 'transparent';
      cursor.style.border = '2px solid var(--orange)';
      cursorTrail.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--orange)';
      cursor.style.border = 'none';
      cursorTrail.style.opacity = '1';
    });
  });
}

/* ============================================================
   NAVBAR
============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ============================================================
   MOBILE MENU
============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);

    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });
}

/* ============================================================
   HERO PARALLAX — MOUSE MOVE
============================================================ */
function initHeroParallax() {
  const shoe   = document.getElementById('heroShoe');
  const bgText = document.querySelector('.hero-bg-text');
  if (!shoe) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx * 18;
    targetY = (e.clientY - cy) / cy * 12;
  });

  function animateShoe() {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;

    shoe.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) rotate(${currentX * 0.3}deg)`;

    if (bgText) {
      bgText.style.transform = `translate(calc(-50% + ${currentX * -0.4}px), calc(-50% + ${currentY * -0.4}px))`;
    }

    requestAnimationFrame(animateShoe);
  }
  animateShoe();

  // Scroll zoom on hero shoe
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const scale = 1 + scrolled * 0.0005;
    const opacity = 1 - scrolled * 0.002;
    shoe.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(${Math.min(scale, 1.3)})`;
    shoe.style.opacity = Math.max(opacity, 0);
  });
}

/* ============================================================
   MARQUEE — PAUSE ON HOVER
============================================================ */
function initMarquee() {
  document.querySelectorAll('.marquee-wrap').forEach(wrap => {
    const track = wrap.querySelector('.marquee-track');
    if (!track) return;

    wrap.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}

/* ============================================================
   SCROLL REVEAL — INTERSECTION OBSERVER
============================================================ */
function initScrollReveal() {
  // Auto-add reveal classes to sections
  const toReveal = [
    '.tech-item',
    '.review-card',
    '.shoe-card',
    '.contact-left',
    '.contact-right',
    '.section-title',
    '.section-label',
    '.int-stats .stat',
  ];

  toReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));
}

/* ============================================================
   MAGNETIC BUTTONS
============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    const strength = 30;

    btn.addEventListener('mousemove', (e) => {
      const rect  = btn.getBoundingClientRect();
      const bx    = rect.left + rect.width  / 2;
      const by    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - bx) * 0.35;
      const dy    = (e.clientY - by) * 0.35;

      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================================
   INTERACTIVE GRID CANVAS
============================================================ */
function initInteractiveGrid() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cols, rows, cells;
  let mouseX = -9999, mouseY = -9999;

  const CELL = 50;
  const PURPLE = '26,0,137';
  const ORANGE  = '254,94,50';
  const LIME    = '184,206,82';

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;

    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * CELL,
          y: r * CELL,
          brightness: 0,
          targetBrightness: 0,
          color: [PURPLE, ORANGE, LIME][Math.floor(Math.random() * 3)],
        });
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);

  canvas.closest('section').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.closest('section').addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    cells.forEach(cell => {
      const dx = cell.x - mouseX;
      const dy = cell.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 180;

      cell.targetBrightness = dist < radius ? (1 - dist / radius) * 0.85 : 0;
      cell.brightness += (cell.targetBrightness - cell.brightness) * 0.1;

      if (cell.brightness > 0.01) {
        ctx.beginPath();
        ctx.rect(cell.x, cell.y, CELL - 1, CELL - 1);
        ctx.fillStyle = `rgba(${cell.color},${cell.brightness * 0.4})`;
        ctx.fill();

        // Corner dots
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cell.color},${cell.brightness})`;
        ctx.fill();
      } else {
        // Faint grid dots
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,243,214,0.06)';
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   COUNTER ANIMATION
============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   GSAP ADVANCED ANIMATIONS
============================================================ */
function initGSAP() {
  // ── Collection cards stagger ──
  gsap.from('.shoe-card', {
    scrollTrigger: {
      trigger: '.collection-grid',
      start: 'top 80%',
    },
    y: 80,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'expo.out',
  });

  // ── Technology items ──
  gsap.from('.tech-item', {
    scrollTrigger: {
      trigger: '.tech-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: 'expo.out',
  });

  // ── Review cards ──
  gsap.from('.review-card', {
    scrollTrigger: {
      trigger: '.reviews-grid',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'expo.out',
  });

  // ── Interactive title ──
  const intTitle = document.querySelector('.int-title');
  if (intTitle) {
    gsap.from(intTitle, {
      scrollTrigger: {
        trigger: intTitle,
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
    });
  }

  // ── Contact heading ──
  const contactH = document.querySelector('.contact-heading');
  if (contactH) {
    gsap.from(contactH, {
      scrollTrigger: {
        trigger: contactH,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
    });
  }

  // ── Section titles parallax ──
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { y: 30 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // ── Hero content parallax ──
  gsap.to('.hero-content', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // ── Float annotation ──
  const ann = document.querySelector('.float-annotation');
  if (ann) {
    gsap.from(ann, {
      scrollTrigger: {
        trigger: '.collection',
        start: 'top 60%',
      },
      x: 40,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'expo.out',
    });
  }
}

/* ============================================================
   CONTACT FORM — SIMPLE FEEDBACK
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('.btn-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const span = submitBtn.querySelector('span');
    const arrow = submitBtn.querySelector('.submit-arrow');

    span.textContent = 'Sent!';
    arrow.textContent = '✓';
    submitBtn.style.background = 'linear-gradient(135deg, #1A0089, #B8CE52)';

    setTimeout(() => {
      span.textContent = 'Send Message';
      arrow.textContent = '→';
      submitBtn.style.background = '';
    }, 3000);
  });
});
