/* ═══════════════════════════════════════════
   CIPHER.EXE — Main JavaScript
   Three.js + GSAP + Lenis
   ═══════════════════════════════════════════ */

/* ─── PRELOADER BOOT SEQUENCE ─────────────── */
(function initPreloader() {
  const loader   = document.getElementById('preloader');
  const bar      = document.getElementById('preloaderBar');
  const statusEl = document.getElementById('preloaderStatus');
  const pctEl    = document.getElementById('preloaderPct');
  if (!loader) return;

  const steps = [
    { pct: 15,  msg: 'INITIALIZING KERNEL...' },
    { pct: 32,  msg: 'LOADING NEURAL MESH...' },
    { pct: 55,  msg: 'MOUNTING FILE SYSTEM...' },
    { pct: 71,  msg: 'DECRYPTING ASSETS...' },
    { pct: 88,  msg: 'CALIBRATING RENDERER...' },
    { pct: 100, msg: 'ACCESS GRANTED' },
  ];

  let current = 0;
  function runStep() {
    if (current >= steps.length) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        document.getElementById('floatWidget').classList.add('visible');
      }, 500);
      return;
    }
    const step = steps[current++];
    gsap.to(bar, { width: step.pct + '%', duration: 0.4, ease: 'power2.inOut' });
    if (statusEl) statusEl.textContent = step.msg;
    if (pctEl)    pctEl.textContent    = step.pct + '%';
    setTimeout(runStep, 380 + Math.random() * 180);
  }
  runStep();
})();

/* ─── SCROLL PROGRESS BAR ────────────────── */
window.addEventListener('scroll', () => {
  const el   = document.getElementById('scrollProgress');
  if (!el) return;
  const doc  = document.documentElement;
  const pct  = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  el.style.width = pct + '%';
}, { passive: true });

/* ─── LIVE CLOCK ─────────────────────────── */
function updateClock() {
  const el = document.getElementById('fwTime');
  if (!el) return;
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${hh}:${mm}:${ss}`;
}
updateClock();
setInterval(updateClock, 1000);

/* ─── LENIS SMOOTH SCROLL ─────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});
function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

// Wire Lenis into GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);

/* ─── CURSOR ─────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' });
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  gsap.set(cursorTrail, { x: trailX, y: trailY });
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ─── SYSTEM LOG TYPING ──────────────────── */
const logMessages = [
  'INITIALIZING SYSTEM...',
  'LOADING NEURAL NETWORK...',
  'DECRYPTING PORTFOLIO DATA...',
  'ESTABLISHING SECURE CONNECTION...',
  'ACCESS GRANTED — WELCOME, OPERATIVE',
];
const logEl = document.getElementById('logLine');
let logIdx = 0, charIdx = 0;
let logInterval;

function typeLog() {
  if (!logEl) return;
  const msg = logMessages[logIdx];
  if (charIdx <= msg.length) {
    logEl.textContent = msg.slice(0, charIdx) + (charIdx < msg.length ? '▋' : '');
    charIdx++;
  } else {
    clearInterval(logInterval);
    setTimeout(() => {
      charIdx = 0;
      logIdx = (logIdx + 1) % logMessages.length;
      logInterval = setInterval(typeLog, 50);
    }, 2000);
  }
}
logInterval = setInterval(typeLog, 50);

/* ─── HERO THREE.JS SCENE ────────────────── */
(function initHeroScene() {
  const canvas   = document.getElementById('heroCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  /* Particle system */
  const COUNT = 3000;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 180;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const isRed = Math.random() < 0.15;
    if (isRed) {
      colors[i * 3]     = 1.0;
      colors[i * 3 + 1] = 0.0;
      colors[i * 3 + 2] = 0.15;
    } else {
      const v = Math.random() * 0.4 + 0.1;
      colors[i * 3]     = v;
      colors[i * 3 + 1] = v;
      colors[i * 3 + 2] = v;
    }
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* Floating wireframe shapes */
  const shapes = [];
  const shapeDefs = [
    { geo: new THREE.IcosahedronGeometry(6, 0),   pos: [-30, 15, -20] },
    { geo: new THREE.OctahedronGeometry(4, 0),    pos: [35, -10, -15] },
    { geo: new THREE.TetrahedronGeometry(5, 0),   pos: [-20, -20, -10] },
    { geo: new THREE.IcosahedronGeometry(3, 0),   pos: [20, 20, -5]  },
    { geo: new THREE.OctahedronGeometry(2.5, 0),  pos: [0,  -15, -30] },
  ];

  shapeDefs.forEach(({ geo: g, pos }) => {
    const mesh = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, opacity: 0.15, transparent: true })
    );
    mesh.position.set(...pos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    shapes.push(mesh);
  });

  /* Grid plane */
  const gridGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
  const gridMat = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, opacity: 0.04, transparent: true });
  const grid    = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -25;
  scene.add(grid);

  /* Mouse parallax */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* Animate */
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    shapes.forEach((s, i) => {
      s.rotation.x += 0.003 + i * 0.0005;
      s.rotation.y += 0.004 + i * 0.0003;
      s.position.y += Math.sin(t * 0.5 + i) * 0.02;
    });

    camera.position.x += (mx * 8 - camera.position.x) * 0.04;
    camera.position.y += (-my * 4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ─── HERO GSAP ANIMATIONS ───────────────── */
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('#titleLine1', { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' })
  .to('#titleLine2', { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.5')
  .to('#titleLine3', { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.5')
  .to('.hero-sub',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
  .to('.hero-cta',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
  .to('.hero-data-panel', { opacity: 1, duration: 0.6 }, '-=0.4')
  .to('.hero-scroll-hint', { opacity: 1, duration: 0.5 }, '-=0.2');

/* ─── CODE RAIN (ABOUT AVATAR) ───────────── */
(function initCodeRain() {
  const container = document.getElementById('codeRain');
  if (!container) return;
  const chars = '01アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMN0123456789!@#$%';
  const cols  = 10;

  for (let c = 0; c < cols; c++) {
    const col = document.createElement('div');
    col.style.cssText = `
      position:absolute; top:0; left:${c * 10}%;
      width:10%; height:100%;
      display:flex; flex-direction:column;
      animation: codeRainCol ${1 + Math.random()}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    for (let r = 0; r < 20; r++) {
      const span = document.createElement('span');
      span.textContent = chars[Math.floor(Math.random() * chars.length)];
      span.style.cssText = 'display:block; opacity:' + (Math.random() * 0.5) + ';';
      col.appendChild(span);
    }
    container.appendChild(col);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes codeRainCol {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
  `;
  document.head.appendChild(style);

  setInterval(() => {
    container.querySelectorAll('span').forEach(s => {
      if (Math.random() < 0.1) s.textContent = chars[Math.floor(Math.random() * chars.length)];
    });
  }, 100);
})();

/* ─── SKILLS THREE.JS (BACKGROUND GRID) ──── */
(function initSkillsScene() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;

  const rect     = canvas.parentElement.getBoundingClientRect();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 500);
  camera.position.z = 80;

  /* Particle grid */
  const COUNT = 800;
  const pos   = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 150;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xff0033, size: 0.4, transparent: true, opacity: 0.5
  }));
  scene.add(pts);

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clk = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    pts.rotation.y = clk.getElapsedTime() * 0.05;
    renderer.render(scene, camera);
  })();
})();

/* ─── CONTACT THREE.JS BACKGROUND ──────────── */
(function initContactScene() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.z = 60;

  /* Torus knot */
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(12, 3, 120, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, opacity: 0.12, transparent: true })
  );
  knot.position.set(40, 0, -20);
  scene.add(knot);

  /* Particles */
  const COUNT = 600;
  const pos   = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 120;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0x888888, size: 0.4, transparent: true, opacity: 0.4
  }));
  scene.add(pts);

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clk = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clk.getElapsedTime();
    knot.rotation.x = t * 0.3;
    knot.rotation.y = t * 0.2;
    pts.rotation.y  = t * 0.03;
    renderer.render(scene, camera);
  })();
})();

/* ─── PROJECT PREVIEW CANVASES ───────────── */
(function initProjectCanvases() {
  [
    { id: 'projectCanvas1', color: 0xff0033, type: 'icosa' },
    { id: 'projectCanvas2', color: 0x00eeff, type: 'torus' },
    { id: 'projectCanvas3', color: 0xff0033, type: 'sphere' },
  ].forEach(({ id, color, type }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 8;

    const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, opacity: 0.3, transparent: true });

    let mesh;
    if (type === 'icosa')  mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 1), mat);
    else if (type === 'torus')  mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.8, 0.5, 80, 12), mat);
    else mesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), mat);
    scene.add(mesh);

    /* Particle ring */
    const cnt = 300;
    const rPos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const r     = 3.5 + Math.random() * 1.5;
      rPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      rPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      rPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
    scene.add(new THREE.Points(rGeo, new THREE.PointsMaterial({ color, size: 0.04, transparent: true, opacity: 0.6 })));

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const clk = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clk.getElapsedTime();
      mesh.rotation.x = t * 0.4;
      mesh.rotation.y = t * 0.3;
      renderer.render(scene, camera);
    })();
  });
})();

/* ─── SCROLL ANIMATIONS ──────────────────── */
// About section
gsap.fromTo('.about-content', { opacity: 0, x: 60 }, {
  opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about', start: 'top 70%' }
});
gsap.fromTo('.about-visual', { opacity: 0, x: -60 }, {
  opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about', start: 'top 70%' }
});

// Stat bars fill on scroll
ScrollTrigger.create({
  trigger: '.about-stats',
  start: 'top 80%',
  onEnter: () => {
    document.querySelectorAll('.stat-fill').forEach(el => el.classList.add('animated'));
  }
});

// Section headers
document.querySelectorAll('.section-header').forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

// Skills cards stagger
gsap.utils.toArray('.skill-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    delay: i * 0.12,
    scrollTrigger: { trigger: '.skills-grid', start: 'top 75%' }
  });
});

// Skill level bars
ScrollTrigger.create({
  trigger: '.skills-grid',
  start: 'top 70%',
  onEnter: () => {
    document.querySelectorAll('.skill-level-fill').forEach(el => el.classList.add('animated'));
  }
});

// Project items
gsap.utils.toArray('.project-item').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});

// Contact
gsap.fromTo('.contact-info', { opacity: 0, x: -50 }, {
  opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-grid', start: 'top 75%' }
});
gsap.fromTo('.contact-form-wrap', { opacity: 0, x: 50 }, {
  opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-grid', start: 'top 75%' }
});
gsap.fromTo('.form-terminal-header', { opacity: 0 }, {
  opacity: 1, duration: 0.5,
  scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 80%' }
});

// Parallax grid layers
gsap.utils.toArray('.section-bg-grid').forEach(el => {
  gsap.to(el, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
});

/* ─── NAV ACTIVE LINK ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: () => {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        const id = sec.getAttribute('id');
        navLinks.forEach(l => {
          l.style.color = l.getAttribute('href') === '#' + id
            ? 'var(--white)' : '';
        });
      }
    });
  }
});

/* ─── NAV SCROLL TINT ────────────────────── */
ScrollTrigger.create({
  start: 80,
  onEnter:      () => document.getElementById('nav').style.background = 'rgba(5,5,5,0.97)',
  onLeaveBack:  () => document.getElementById('nav').style.background = 'rgba(5,5,5,0.85)',
});

/* ─── GLITCH HOVER ON SKILLS ─────────────── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { x: (Math.random() - 0.5) * 4, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' });
  });
});

/* ─── CONTACT FORM SUBMIT ────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn');
  const orig = btn.querySelector('.btn-text').textContent;
  btn.querySelector('.btn-text').textContent = 'TRANSMISSION SENT ✓';
  btn.style.background = '#00ff88';
  btn.style.borderColor = '#00ff88';
  btn.style.color = '#000';
  setTimeout(() => {
    btn.querySelector('.btn-text').textContent = orig;
    btn.style.cssText = '';
    e.target.reset();
  }, 3000);
});

/* ─── RANDOM GLITCH FLASH ────────────────── */
function randomGlitch() {
  const titles = document.querySelectorAll('.glitch-text');
  if (!titles.length) return;
  const el = titles[Math.floor(Math.random() * titles.length)];
  gsap.to(el, { x: (Math.random() - 0.5) * 10, skewX: (Math.random() - 0.5) * 6, duration: 0.06, yoyo: true, repeat: 3, ease: 'none' });
}
setInterval(randomGlitch, 4000 + Math.random() * 3000);

/* ─── NAV LINK SMOOTH SCROLL ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
  });
});

/* ─── MAGNETIC BUTTONS ───────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) * 0.35;
    const dy     = (e.clientY - cy) * 0.35;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

/* ─── PROJECT TITLE GLITCH ON HOVER ────────── */
document.querySelectorAll('.project-title').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.timeline()
      .to(el, { skewX: 8, duration: 0.07, ease: 'none' })
      .to(el, { skewX: -6, duration: 0.07, ease: 'none' })
      .to(el, { skewX: 4, duration: 0.06, ease: 'none' })
      .to(el, { skewX: 0, duration: 0.06, ease: 'none' });
  });
});

/* ─── SKILL CARD COUNT-UP ON ENTER ─────────── */
ScrollTrigger.create({
  trigger: '.skills-grid',
  start: 'top 70%',
  once: true,
  onEnter: () => {
    document.querySelectorAll('.skill-card').forEach(card => {
      const fill = card.querySelector('.skill-level-fill');
      const lvl  = parseFloat(getComputedStyle(fill).getPropertyValue('--lvl'));
      gsap.fromTo({ v: 0 }, { v: lvl }, {
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: function() {},
      });
    });
  }
});

/* ─── TICKER REVERSE ON HOVER ───────────────── */
const tickerTrack = document.getElementById('tickerTrack');
if (tickerTrack) {
  tickerTrack.parentElement.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.parentElement.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}
