import './style.css';

const PARTICLE_COLORS = ['#28ff7a', '#24b8ff', '#a855ff', '#ff305c'];
const ROLES = ['Software Engineer', 'AI Integrations & MCP', 'Embedded Firmware', 'Security-Minded Builder'];
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* Background: drifting particles. */
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
    const mobile = width < 720;
    const count = mobile ? 12 : 20;
    particles = Array.from({ length: count }, (_, index) => {
      const angle = ((index * 137.5) % 360) * (Math.PI / 180);
      const speed = 0.06 + (index % 7) * 0.012;
      return {
        x: (index * 97) % Math.max(width, 1),
        y: (index * 151) % Math.max(height, 1),
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.6 + (index % 5) * 0.35,
        depth: 0.4 + (index % 4) * 0.2,
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
    const scroll = still ? 0 : window.scrollY * 0.12;
    const pos = particles.map((p) => ({ x: p.x, y: (((p.y - scroll * p.depth) % height) + height) % height }));

    if (!still) {
      particles.forEach((p, i) => {
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;
        if (pointer.active) {
          const dx = pos[i].x - pointer.x;
          const dy = pos[i].y - pointer.y;
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

    for (let i = 0; i < pos.length; i += 1) {
      for (let j = i + 1; j < pos.length; j += 1) {
        const distance = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (distance < 160) {
          ctx.strokeStyle = `rgba(130, 170, 255, ${0.1 * (1 - distance / 160)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.stroke();
        }
      }
    }


    pos.forEach((q, i) => {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = particles[i].color;
      ctx.beginPath();
      ctx.arc(q.x, q.y, particles[i].radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

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
  document.addEventListener('visibilitychange', onVisibility);
}

/* Rotating role line. */
function rotatingRole() {
  const el = document.querySelector('.hero-role');
  if (!el || reducedMotion()) return;
  let index = 0;
  setInterval(() => {
    el.classList.replace('is-in', 'is-out');
    setTimeout(() => {
      index = (index + 1) % ROLES.length;
      el.textContent = ROLES[index];
      el.classList.replace('is-out', 'is-in');
    }, 420);
  }, 3600);
}

particles();
rotatingRole();
