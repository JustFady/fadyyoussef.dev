import { useEffect, useRef, useState } from 'react';
import './App.css';

const ROLES = ['Software Engineer', 'AI Integrations & MCP', 'Embedded Firmware', 'Security-Minded Builder'];
const PARTICLE_COLORS = ['#28ff7a', '#24b8ff', '#a855ff', '#ff305c'];
const EMAIL = 'mailto:itsfadyy02@gmail.com?subject=Hello%20from%20your%20site';
const LINKEDIN = 'https://www.linkedin.com/in/fadyyoussef08/';
const GITHUB = 'https://github.com/JustFady';
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* Background: drifting particles that also shift gently with scroll. */
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
      const count = Math.min(mobile ? 34 : 72, Math.max(24, Math.floor((width * height) / (mobile ? 36000 : 26000))));
      particles = Array.from({ length: count }, (_, index) => {
        const angle = ((index * 137.5) % 360) * (Math.PI / 180);
        const speed = 0.16 + (index % 7) * 0.02;
        return {
          x: (index * 97) % Math.max(width, 1),
          y: (index * 151) % Math.max(height, 1),
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2.4 + (index % 5) * 0.5,
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
          if (distance < 118) {
            ctx.strokeStyle = `rgba(130, 170, 255, ${0.22 * (1 - distance / 118)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.lineTo(pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        pos.forEach((q, i) => {
          const distance = Math.hypot(q.x - pointer.x, q.y - pointer.y);
          if (distance < 170) {
            ctx.strokeStyle = `${particles[i].color}${Math.round(110 * (1 - distance / 170)).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(q.x, q.y);
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

      pos.forEach((q, i) => {
        ctx.fillStyle = particles[i].color;
        ctx.beginPath();
        ctx.arc(q.x, q.y, particles[i].radius, 0, Math.PI * 2);
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
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', queueResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />;
}

function RotatingRole() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('is-in');

  useEffect(() => {
    if (reducedMotion()) return undefined;
    let swap;
    const id = window.setInterval(() => {
      setPhase('is-out');
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setPhase('is-in');
      }, 420);
    }, 3600);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(swap);
    };
  }, []);

  return (
    <p className={`hero-role ${phase}`} aria-live="polite">
      {ROLES[index]}
    </p>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12.713l11.985-8.71c-.347-.393-.827-.643-1.365-.643H1.38C.842 3.36.362 3.61.015 4.003L12 12.713zm0 1.603l-12-8.718v9.062C0 15.65.75 16.4 1.68 16.4h20.64c.93 0 1.68-.75 1.68-1.74v-9.062l-12 8.718z" />
    </svg>
  );
}

function App() {
  return (
    <>
      <ParticleBackground />
      <div className="aurora" aria-hidden="true" />

      <header className="site-header">
        <span className="brand" aria-label="Fady Youssef">
          FY
        </span>
      </header>

      <main>
        <section id="top" className="hero">
          <div className="hero-inner">
            <h1 className="hero-name">Fady Youssef</h1>
            <RotatingRole />
            <p className="hero-lead">
              I build software with a security-minded edge: AI integrations that run in production, firmware that
              talks to real hardware, and tools that make both easier to trust.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={GITHUB} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="btn" href={EMAIL}>
                Get in touch
              </a>
            </div>
            <div className="hero-social">
              <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href={EMAIL} aria-label="Email">
                <MailIcon />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
