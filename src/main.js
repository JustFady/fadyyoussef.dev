import './style.css';

const PARTICLE_COLORS = ['#28ff7a', '#24b8ff', '#a855ff', '#ff305c'];
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* Background: particle network that reacts to the cursor (restored from 216ec7f). */
function particles() {
  const canvas = document.querySelector('.particle-canvas');
  const ctx = canvas.getContext('2d');
  const still = reducedMotion();
  let frame = 0;
  let width = 0;
  let height = 0;
  let particles = [];
  let resizeTimeout;
  let paused = false;
  const pointer = { x: 0, y: 0, active: false };

  const createParticles = () => {
    const count = Math.min(82, Math.max(24, Math.floor((width * height) / 24000)));
    particles = Array.from({ length: count }, (_, index) => {
      const angle = ((index * 137.5) % 360) * (Math.PI / 180);
      const speed = 0.18 + (index % 7) * 0.02;
      // R2 low-discrepancy sequence: even spread without the diagonal stripes a modulo grid makes on narrow screens.
      return {
        x: ((0.5 + (index + 1) * 0.7548776662) % 1) * width,
        y: ((0.5 + (index + 1) * 0.5698402909) % 1) * height,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.8 + (index % 5) * 0.55,
        color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      };
    });
  };

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const previousWidth = width || window.innerWidth;
    const previousHeight = height || window.innerHeight;
    const previous = particles;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (!previous.length || Math.abs(width - previousWidth) > 120) {
      createParticles();
      return;
    }
    particles = previous.map((p) => ({ ...p, x: (p.x / previousWidth) * width, y: (p.y / previousHeight) * height }));
  };

  const queueResize = () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      resize();
      if (still) draw(false);
    }, 120);
  };

  const draw = (loop = true) => {
    ctx.clearRect(0, 0, width, height);

    if (!still) {
      particles.forEach((p) => {
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 150) {
            const force = (1 - distance / 150) * 0.075;
            p.vx += (dx / distance) * force;
            p.vy += (dy / distance) * force;
          }
        }
        const velocity = Math.hypot(p.vx, p.vy);
        if (velocity > 0.95) {
          p.vx = (p.vx / velocity) * 0.95;
          p.vy = (p.vy / velocity) * 0.95;
        }
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
      });
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 118) {
          ctx.strokeStyle = `rgba(130, 170, 255, ${0.24 * (1 - distance / 118)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (pointer.active && !still) {
      particles.forEach((p) => {
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (distance < 170) {
          const alpha = Math.round(120 * (1 - distance / 170))
            .toString(16)
            .padStart(2, '0');
          ctx.strokeStyle = `${p.color}${alpha}`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });

      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 95);
      glow.addColorStop(0, 'rgba(168, 85, 255, 0.18)');
      glow.addColorStop(0.45, 'rgba(36, 184, 255, 0.08)');
      glow.addColorStop(1, 'rgba(40, 255, 122, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 95, 0, Math.PI * 2);
      ctx.fill();
    }

    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    if (loop && !still && !paused) frame = window.requestAnimationFrame(() => draw(true));
  };

  const onPointerMove = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };
  const onPointerLeave = () => {
    pointer.active = false;
  };
  const onVisibility = () => {
    paused = document.hidden;
    if (!paused && !still) {
      window.cancelAnimationFrame(frame);
      draw(true);
    }
  };

  resize();
  draw(!still);


  window.addEventListener('resize', queueResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('pointerup', (event) => event.pointerType !== 'mouse' && onPointerLeave(), { passive: true });
  window.addEventListener('pointercancel', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
}


const PROJECTS = [
  {
    title: 'Universal Sensor Board',
    description:
      'Senior design project in collaboration with Itron. C/C++ FreeRTOS firmware for an Apollo3 MCU that collects, processes and transmits environmental sensor data, with HAL drivers for real-time SPI and I2C sensors, validated with J-Link debugging.',
    tags: ['C/C++', 'FreeRTOS', 'SPI / I2C'],
    note: 'Hardware project with Itron, so the code is not public.',
    accent: '#28ff7a',
  },
  {
    title: 'mcp-serial',
    description:
      'A tool server that lets AI coding assistants work a microcontroller the way you would at a serial console: list ports, read and filter logs, and flash STM32 or ESP32 boards. Flashing needs an explicit confirm and an allow-listed firmware directory.',
    tags: ['Python', 'Serial', 'STM32 / ESP32'],
    link: 'https://github.com/JustFady/mcp-serial',
    accent: '#24b8ff',
  },
  {
    title: 'OurPL-Lang',
    description:
      'Java interpreter for a small language (course project): hand-written lexer, recursive descent parser, and tree-walk evaluator with closures and lexical scoping; JUnit tests for the lexer and parser.',
    tags: ['Java', 'Interpreters', 'Maven'],
    link: 'https://github.com/JustFady/OurPL-Lang',
    accent: '#a855ff',
  },
  {
    title: 'Kinetic-Edge',
    description:
      'An offline video pipeline that tracks basketball players and the ball with YOLOv8. C++ ingests frames with OpenCV, Python runs the tracking, and the tool flags out-of-bounds plays, sudden acceleration spikes and possession changes.',
    tags: ['C++', 'Python', 'Computer Vision'],
    link: 'https://github.com/JustFady/kinetic-edge',
    accent: '#ff305c',
  },
  {
    title: 'Phishing Awareness Training Platform',
    description:
      'A phishing simulation built with Flask and Docker, with tests and GitHub Actions CI, later published as a static GitHub Pages demo. It walks people through a realistic password-reset lure and never collects or stores credentials.',
    tags: ['Security', 'Flask', 'GitHub Actions'],
    link: 'https://github.com/JustFady/GU-Phishing-Awareness',
    accent: '#ffb020',
  },
  {
    title: 'docpipe',
    description:
      'A pipeline for real-world PDFs: classify each document, extract fields to a typed schema, check rules like total = subtotal + tax, and send anything doubtful to a person with the evidence attached. An eval command reports per-field precision and recall.',
    tags: ['Python', 'Validation', 'CLI'],
    link: 'https://github.com/JustFady/docpipe',
    accent: '#24b8ff',
  },
  {
    title: 'Three Classic Ciphers',
    description: 'A C++ terminal app that encrypts and decrypts text with the Caesar, Vigenère and one-time pad ciphers.',
    tags: ['C++', 'Cryptography'],
    link: 'https://github.com/JustFady/ThreeClassicCiphers',
    accent: '#a855ff',
  },
  {
    title: 'CrimsonCode2026',
    description:
      'A Kotlin Multiplatform emergency-response app with OTP sign-in, contacts, map and list event browsing, and Supabase-backed event creation.',
    tags: ['Kotlin', 'Compose', 'Supabase'],
    link: 'https://github.com/JustFady/CrimsonCode2026',
    accent: '#28ff7a',
  },
  {
    title: 'Heat Transfer Laboratory',
    description:
      'A heat-transfer lab for a steel ball dropped into boiling water, with randomized trials, live charts and CSV export. It runs in the browser, and the original Windows Forms version is still included.',
    tags: ['C#', 'JavaScript', 'Simulation'],
    link: 'https://github.com/JustFady/HeatTransfer',
    accent: '#ff305c',
  },
];

/* Home / About / Projects views, driven by the URL hash (restored from 216ec7f's tabs). */
function tabs() {
  const links = [...document.querySelectorAll('.nav-tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const names = panels.map((panel) => panel.dataset.panel);

  const show = (name, moveFocus) => {
    const target = names.includes(name) ? name : 'home';
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== target;
    });
    links.forEach((link) => {
      if (link.dataset.tab === target) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (moveFocus && target !== 'home') {
      document.querySelector(`[data-panel="${target}"] h1`)?.focus({ preventScroll: true });
    }
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const name = link.dataset.tab;
      history.replaceState(null, '', name === 'home' ? window.location.pathname : `#${name}`);
      show(name, true);
    });
  });
  window.addEventListener('hashchange', () => show(window.location.hash.slice(1), true));
  show(window.location.hash.slice(1), false);
}

/* Split-focus project browser: numbered list on one side, detail card on the other. */
function projects() {
  const list = document.querySelector('.project-list');
  const detail = document.querySelector('.project-detail');
  if (!list || !detail) return;
  const title = detail.querySelector('h2');
  const text = detail.querySelector('.project-detail-content p');
  const tags = detail.querySelector('.project-tags');
  const link = detail.querySelector('.project-detail-link');
  const note = detail.querySelector('.project-detail-note');

  const buttons = PROJECTS.map((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-list-item';
    button.style.setProperty('--project-accent', project.accent);
    button.setAttribute('aria-controls', 'project-detail');
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong');
    name.textContent = project.title;
    const sub = document.createElement('small');
    sub.textContent = project.tags.slice(0, 2).join(' / ');
    button.append(number, name, sub);
    button.addEventListener('click', () => {
      select(index);
      // Single-column layout puts the card below the list, so bring it into view.
      if (window.matchMedia('(max-width: 780px)').matches) {
        detail.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    });
    list.append(button);
    return button;
  });

  function select(index) {
    const project = PROJECTS[index];
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    detail.style.setProperty('--project-accent', project.accent);
    title.textContent = project.title;
    text.textContent = project.description;
    tags.setAttribute('aria-label', `${project.title} technologies`);
    tags.replaceChildren(
      ...project.tags.map((tag) => {
        const item = document.createElement('li');
        item.textContent = tag;
        return item;
      }),
    );
    link.hidden = !project.link;
    if (project.link) {
      link.href = project.link;
      link.setAttribute('aria-label', `Open ${project.title} on GitHub`);
    }
    note.hidden = !project.note;
    note.textContent = project.note || '';
  }

  select(0);

  // Fade the bottom edge only while rows are scrolled out of view (desktop scroll area).
  const area = document.querySelector('.project-focus');
  const updateFade = () => {
    area.classList.toggle('has-more', area.scrollHeight - area.scrollTop - area.clientHeight > 2);
  };
  area.addEventListener('scroll', updateFade, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(updateFade).observe(area);
  else window.addEventListener('resize', updateFade, { passive: true });
}

/* Role line under the name rotates every 4 s (restored from 216ec7f); stays fixed with reduced motion. */
const TITLES = [
  'Software Engineer · Austin, TX',
  'Embedded & backend software',
  'Software Engineer at Tyr Laboratories',
  'Gonzaga CS, Software Security',
];

function rotatingTitle() {
  const role = document.querySelector('.hero-role-text');
  if (!role || reducedMotion()) return;
  let index = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    role.classList.add('is-out');
    window.setTimeout(() => {
      index = (index + 1) % TITLES.length;
      role.textContent = TITLES[index];
      role.classList.remove('is-out');
    }, 420);
  }, 4000);
}

/* Email icon copies the address (works for webmail users); falls back to mailto. */
function copyEmail() {
  const link = document.querySelector('.email-link');
  const note = document.querySelector('.copy-note');
  if (!link || !note || !navigator.clipboard) return;
  let timer;
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText('itsfadyy02@gmail.com');
      note.textContent = 'Email copied';
    } catch {
      window.location.href = link.href;
      return;
    }
    note.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove('is-on'), 1800);
  });
}

particles();
rotatingTitle();
tabs();
projects();
copyEmail();
