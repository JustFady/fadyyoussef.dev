import { useEffect, useRef, useState } from 'react';
import './App.css';

const ROLES = ['Software Engineer', 'AI Integrations & MCP', 'Embedded Firmware', 'Security-Minded Builder'];
const PARTICLE_COLORS = ['#28ff7a', '#24b8ff', '#a855ff', '#ff305c'];
const EMAIL = 'mailto:thefady4@gmail.com?subject=Hello%20from%20your%20site';
const LINKEDIN = 'https://www.linkedin.com/in/fadyyoussef08/';
const GITHUB = 'https://github.com/JustFady';
const CALENDLY = ''; // e.g. 'https://calendly.com/fadyyoussef/intro' — a booking button appears once set

const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const PROJECTS = [
  {
    title: 'mcp-serial',
    description: 'An MCP server that lets Claude open a serial console, send commands, tail firmware logs with filters, and flash STM32/ESP32 boards behind an explicit confirm and an allow-listed firmware directory.',
    tags: ['Python', 'MCP', 'Embedded'],
    link: 'https://github.com/JustFady/mcp-serial',
    accent: '#28ff7a',
  },
  {
    title: 'Aegis',
    description: 'A pre-commit guardrail that audits the staged git diff for security issues with an LLM, caches verdicts per file-diff in SQLite, and offers to apply the suggested fix before the commit goes through.',
    tags: ['TypeScript', 'Security', 'CLI'],
    link: 'https://github.com/JustFady/Aegis',
    accent: '#24b8ff',
  },
  {
    title: 'kinetic-edge',
    description: 'A local video-AI pipeline in C++ and Python that tracks players and the ball with YOLOv8, flags boundary violations and acceleration spikes, and ships as a Docker-packaged desktop tool.',
    tags: ['C++', 'Python', 'YOLOv8'],
    link: 'https://github.com/JustFady/kinetic-edge',
    accent: '#a855ff',
  },
  {
    title: 'OurPL-Lang',
    description: 'A small programming language built from scratch in Java: hand-written lexer and recursive-descent parser, tree-walking interpreter, functions, closures, block scoping and control flow, with an automated test suite.',
    tags: ['Java', 'Interpreters', 'Parsing'],
    link: 'https://github.com/JustFady/OurPL-Lang',
    accent: '#ffb020',
  },
  {
    title: 'Orderbook Organism',
    description: 'A React prototype that turns order-book activity into a replayable pressure landscape, built to make market microstructure easier to see and explain.',
    tags: ['React', 'Vite', 'Data replay'],
    link: 'https://github.com/JustFady/orderbook-organism',
    accent: '#ff305c',
  },
  {
    title: 'CrimsonCode 2026',
    description: 'A Kotlin Multiplatform emergency-response app with an OTP flow, contacts, map and list event browsing, and Supabase-backed event creation, built at a 24-hour hackathon.',
    tags: ['Kotlin', 'Compose', 'Supabase'],
    link: 'https://github.com/JustFady/CrimsonCode2026',
    accent: '#24b8ff',
  },
];

const FACETS = [
  {
    title: 'AI integrations',
    text: 'Agents with tools, MCP servers, retrieval over real documents, and LLM features that ship with evals and logging instead of demos.',
    accent: '#24b8ff',
  },
  {
    title: 'Embedded systems',
    text: 'Firmware on STM32, ESP32 and Apollo3 with FreeRTOS, SPI/I2C drivers, J-Link debugging, and telemetry from the device to the cloud.',
    accent: '#28ff7a',
  },
  {
    title: 'Security-minded by default',
    text: 'Gonzaga CS with a software-security concentration; I build tools like Aegis and phishing-awareness training because the threat model is part of the design.',
    accent: '#a855ff',
  },
];

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

/* Scroll-linked values: page progress, hero dissolve. One rAF-throttled listener. */
function useScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const still = reducedMotion();
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
      const heroP = still ? 0 : Math.min(1, window.scrollY / (window.innerHeight * 0.6));
      root.style.setProperty('--hero-p', heroP.toFixed(3));
      root.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

/* Which section is under the middle of the viewport: drives nav highlight and the ambient glow. */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    document.documentElement.dataset.section = active;
  }, [active]);

  return active;
}

/* Fade-up on entry for anything marked data-reveal. */
function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return undefined;
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* Cursor-following light on cards (pointer devices only). */
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return undefined;
    let ticking = false;
    let last = null;
    const apply = () => {
      ticking = false;
      if (!last) return;
      const card = last.target.closest('[data-spotlight]');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${last.clientX - rect.left}px`);
      card.style.setProperty('--my', `${last.clientY - rect.top}px`);
    };
    const onMove = (event) => {
      last = event;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
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
  const sectionIds = useRef(SECTIONS.map((s) => s.id)).current;
  const active = useScrollSpy(sectionIds);
  useScrollEffects();
  useReveal();
  useSpotlight();

  return (
    <>
      <ParticleBackground />
      <div className="aurora" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Back to top">
          FY
        </a>
        <nav className="site-links" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={s.id === 'contact' ? 'site-links-cta' : undefined}
              aria-current={active === s.id ? 'location' : undefined}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="top" className="hero">
          <div className="hero-inner">
            <p className="hero-status">
              <span className="hero-dot" />
              Open to select projects · Austin, TX
            </p>
            <h1 className="hero-name">Fady Youssef</h1>
            <RotatingRole />
            <p className="hero-lead">
              I build software with a security-minded edge: AI integrations that run in production, firmware that
              talks to real hardware, and tools that make both easier to trust.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#work">
                See my work
              </a>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">
                GitHub
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
          <a className="scroll-cue" href="#work" aria-label="Scroll to work">
            <span />
          </a>
        </section>

        <section id="work" className="section">
          <div className="section-head" data-reveal>
            <p className="kicker">Selected work</p>
            <h2>Things I have built.</h2>
            <p className="lead">
              A mix of tools I use, systems I wanted to understand, and problems that were more fun to solve than to
              read about. Everything here is open source.
            </p>
          </div>
          <div className="work-grid">
            {PROJECTS.map((project, index) => (
              <a
                key={project.title}
                className="card work-card"
                href={project.link}
                target="_blank"
                rel="noreferrer"
                style={{ '--accent': project.accent, '--delay': `${(index % 2) * 80}ms` }}
                data-reveal
                data-spotlight
              >
                <div className="work-top">
                  <h3>{project.title}</h3>
                  <span className="work-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <p>{project.description}</p>
                <ul className="work-tags" aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
          <p className="work-more" data-reveal>
            More on{' '}
            <a href={GITHUB} target="_blank" rel="noreferrer">
              github.com/JustFady
            </a>
            .
          </p>
        </section>

        <section id="about" className="section">
          <div className="section-head" data-reveal>
            <p className="kicker">About</p>
            <h2>Three things I keep coming back to.</h2>
            <p className="lead">
              Gonzaga University, B.S. Computer Science (2026) with a software-security concentration. Firmware
              engineer by day. The rest of the time I am wiring language models into real systems, running, or
              making beats.
            </p>
          </div>
          <div className="facets">
            {FACETS.map((facet, index) => (
              <article
                key={facet.title}
                className="facet"
                style={{ '--accent': facet.accent, '--delay': `${index * 90}ms` }}
                data-reveal
                data-spotlight
              >
                <h3>{facet.title}</h3>
                <p>{facet.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="contact-card" data-reveal data-spotlight>
            <p className="kicker">Contact</p>
            <h2>Say hello.</h2>
            <p className="lead">
              {CALENDLY
                ? 'Open to select AI-integration and embedded projects. Book a 20-minute call or send an email; I reply within a day.'
                : 'Open to select AI-integration and embedded projects. Send an email or a message on LinkedIn; I reply within a day.'}
            </p>
            <div className="hero-actions">
              {CALENDLY && (
                <a className="btn btn-primary" href={CALENDLY} target="_blank" rel="noreferrer">
                  Book a 20-minute call
                </a>
              )}
              <a className={`btn ${CALENDLY ? '' : 'btn-primary'}`} href={EMAIL}>
                thefady4@gmail.com
              </a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <p className="contact-meta">Austin, TX · remote-friendly</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Fady Youssef</span>
        <nav aria-label="Footer">
          <a href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/JustFady/FY-Portfolio" target="_blank" rel="noreferrer">
            Source
          </a>
          <a className="to-top" href="#top">
            Back to top ↑
          </a>
        </nav>
      </footer>
    </>
  );
}

export default App;
