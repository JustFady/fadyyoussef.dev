import './style.css';

// The two corner glows in style.css: teal top-left, violet bottom-right.
const PALETTE = ['36, 184, 255', '168, 85, 255'];
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const LINK = 118; // particle-to-particle network distance
const REACH = 140; // cursor constellation radius
const CELL = 140; // grid cell size, at least LINK and REACH so a 3x3 cell block covers both
const MAX_CURSOR_LINES = 16;
const MAX_NEAR_LINES = 24;

/* Background: particle network; on hover devices the particles near the cursor form a constellation. */
function particles() {
  const canvas = document.querySelector('.particle-canvas');
  const ctx = canvas.getContext('2d');
  const still = reducedMotion();
  // Touch-only devices and reduced motion keep the plain field.
  const constellation = !still && !window.matchMedia?.('(hover: none)').matches;
  let frame = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let particles = [];
  let resizeTimeout;
  let cells = [];
  let cols = 0;
  let rows = 0;
  let near = [];
  // strength eases towards 1 while the pointer is in the window and back to 0 after it leaves.
  const pointer = { x: 0, y: 0, active: false, strength: 0 };

  const createParticles = () => {
    const count = Math.min(82, Math.max(24, Math.floor((width * height) / 24000)));
    particles = Array.from({ length: count }, (_, index) => {
      const angle = ((index * 137.5) % 360) * (Math.PI / 180);
      const speed = 0.18 + (index % 7) * 0.02;
      // Smaller dots are dimmer, so the field reads as having depth.
      const depth = (index * 0.618034) % 1;
      const rgb = PALETTE[index % PALETTE.length];
      // R2 low-discrepancy sequence: even spread without the diagonal stripes a modulo grid makes on narrow screens.
      return {
        x: ((0.5 + (index + 1) * 0.7548776662) % 1) * width,
        y: ((0.5 + (index + 1) * 0.5698402909) % 1) * height,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.4 + depth * 2.4,
        rgb,
        fill: `rgba(${rgb}, ${(0.45 + depth * 0.5).toFixed(2)})`,
      };
    });
  };

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
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
    cols = Math.ceil(width / CELL) + 1;
    rows = Math.ceil(height / CELL) + 1;
    cells = Array.from({ length: cols * rows }, () => []);
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
      if (still) draw();
    }, 120);
  };

  // Uniform grid so each particle is only compared with its neighbours, not the whole field.
  const indexGrid = () => {
    cells.forEach((cell) => {
      cell.length = 0;
    });
    particles.forEach((p, i) => {
      const cx = Math.min(cols - 1, Math.floor(p.x / CELL));
      const cy = Math.min(rows - 1, Math.floor(p.y / CELL));
      cells[cy * cols + cx].push(i);
    });
  };

  const eachNeighbour = (x, y, fn) => {
    const cx = Math.floor(x / CELL);
    const cy = Math.floor(y / CELL);
    for (let gy = Math.max(0, cy - 1); gy <= Math.min(rows - 1, cy + 1); gy += 1) {
      for (let gx = Math.max(0, cx - 1); gx <= Math.min(cols - 1, cx + 1); gx += 1) {
        cells[gy * cols + gx].forEach(fn);
      }
    }
  };

  const line = (ax, ay, bx, by) => {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  };

  const move = () => {
    pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;
    // Particles found near the cursor last frame drift gently away from it.
    near.forEach(({ p, distance }) => {
      if (distance === 0) return;
      const force = (1 - distance / REACH) * 0.05 * pointer.strength;
      p.vx += ((p.x - pointer.x) / distance) * force;
      p.vy += ((p.y - pointer.y) / distance) * force;
    });
    particles.forEach((p) => {
      p.vx += (p.baseVx - p.vx) * 0.02;
      p.vy += (p.baseVy - p.vy) * 0.02;
      const velocity = Math.hypot(p.vx, p.vy);
      if (velocity > 0.95) {
        p.vx = (p.vx / velocity) * 0.95;
        p.vy = (p.vy / velocity) * 0.95;
      }
      p.x = (p.x + p.vx + width) % width;
      p.y = (p.y + p.vy + height) % height;
    });
  };

  const drawConstellation = () => {
    near = [];
    if (pointer.strength < 0.01) return;
    eachNeighbour(pointer.x, pointer.y, (i) => {
      const p = particles[i];
      const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
      if (distance < REACH) near.push({ p, distance });
    });
    near.sort((a, b) => a.distance - b.distance);
    near.length = Math.min(near.length, MAX_CURSOR_LINES);

    ctx.lineWidth = pixelRatio > 1 ? 0.75 : 1;
    let links = 0;
    for (let i = 0; i < near.length && links < MAX_NEAR_LINES; i += 1) {
      for (let j = i + 1; j < near.length && links < MAX_NEAR_LINES; j += 1) {
        const a = near[i].p;
        const b = near[j].p;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < REACH) {
          ctx.strokeStyle = `rgba(${a.rgb}, ${0.22 * (1 - distance / REACH) * pointer.strength})`;
          line(a.x, a.y, b.x, b.y);
          links += 1;
        }
      }
    }
    near.forEach(({ p, distance }) => {
      ctx.strokeStyle = `rgba(${p.rgb}, ${0.42 * (1 - distance / REACH) * pointer.strength})`;
      line(pointer.x, pointer.y, p.x, p.y);
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    if (!still) move();
    indexGrid();

    ctx.lineWidth = 1;
    particles.forEach((a, i) => {
      eachNeighbour(a.x, a.y, (j) => {
        if (j <= i) return;
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < LINK) {
          ctx.strokeStyle = `rgba(130, 170, 255, ${0.24 * (1 - distance / LINK)})`;
          line(a.x, a.y, b.x, b.y);
        }
      });
    });

    if (constellation) drawConstellation();

    particles.forEach((p) => {
      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const tick = () => {
    draw();
    frame = document.hidden ? 0 : window.requestAnimationFrame(tick);
  };

  resize();
  if (still) {
    draw();
  } else {
    tick();
    document.addEventListener('visibilitychange', () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden) tick();
    });
  }
  window.addEventListener('resize', queueResize, { passive: true });

  if (constellation) {
    const leave = () => {
      pointer.active = false;
    };
    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType === 'touch') return;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      },
      { passive: true },
    );
    document.addEventListener('pointerout', (event) => !event.relatedTarget && leave(), { passive: true });
    window.addEventListener('blur', leave);
  }
}

/* Role line under the name is typed, held, then deleted; stays static with reduced motion. */
const ROLES = ['Software Engineer', 'Embedded Systems', 'Backend', 'Security'];

function typedRole() {
  const box = document.querySelector('.hero-role');
  const text = box?.querySelector('.hero-role-text');
  if (!text || reducedMotion()) return;
  let index = 0;
  let shown = 0;
  let deleting = false;
  const later = (ms, busy) => {
    box.classList.toggle('is-busy', busy);
    window.setTimeout(step, ms);
  };
  function step() {
    if (document.hidden) return later(500, false);
    const role = ROLES[index];
    shown += deleting ? -1 : 1;
    text.textContent = role.slice(0, shown);
    if (!deleting && shown === role.length) {
      deleting = true;
      return later(2200, false);
    }
    if (deleting && shown === 0) {
      deleting = false;
      index = (index + 1) % ROLES.length;
      return later(450, false);
    }
    return later(deleting ? 38 : 65 + Math.random() * 55, true);
  }
  box.classList.add('is-typed');
  text.textContent = '';
  later(700, false);
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
typedRole();
copyEmail();
