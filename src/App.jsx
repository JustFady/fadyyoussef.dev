import React, { useEffect } from 'react';
import Globe from './Globe';
import './App.css';

const projects = [
  {
    title: 'HoopMetrics',
    category: 'Analytics Platform',
    desc: 'A basketball intelligence platform that turns real-time player and team data into fast, readable performance insights for coaches, athletes, and fans.',
    tech: ['React', 'Node.js', 'MongoDB'],
    link: 'https://github.com/JustFady',
  },
  {
    title: 'Hospital Management System',
    category: 'Operations Software',
    desc: 'A full workflow system for patient records, staff coordination, and scheduling designed to make day-to-day hospital operations more reliable.',
    tech: ['Java', 'Spring Boot', 'MySQL'],
    link: 'https://github.com/JustFady/HospitalManagement',
  },
  {
    title: 'Three Classic Ciphers',
    category: 'Security Fundamentals',
    desc: 'A compact C++ implementation of classic encryption algorithms built to explore core cryptography ideas and careful systems programming.',
    tech: ['C++', 'Cryptography'],
    link: 'https://github.com/JustFady/ThreeClassicCiphers',
  },
  {
    title: 'Heat Transfer',
    category: 'Simulation Project',
    desc: 'A C# and .NET project focused on modeling heat transfer behavior with an emphasis on technical accuracy and clear implementation.',
    tech: ['C#', '.NET'],
    link: 'https://github.com/JustFady/HeatTransfer',
  },
];

const strengths = [
  {
    title: 'Full-stack systems',
    copy: 'I like products that need both a polished interface and dependable backend logic. My best work lives where those two worlds have to cooperate cleanly.',
  },
  {
    title: 'Sharp problem solving',
    copy: 'I enjoy the hard part: clarifying messy requirements, breaking problems down, and finding solutions that stay readable after the deadline passes.',
  },
  {
    title: 'Built for momentum',
    copy: 'I care about building things that move teams forward, whether that means shipping features, improving workflows, or making the codebase easier to trust.',
  },
];

const stats = [
  { value: '4+', label: 'portfolio projects' },
  { value: 'CS', label: 'student at Gonzaga' },
  { value: '100%', label: 'focus on usable software' },
];

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <div className="page-noise" aria-hidden="true" />

      <header className="topbar" data-reveal>
        <a href="#home" className="brand">
          FY
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero" data-reveal>
          <div className="hero-copy">
            <p className="eyebrow">Portfolio 2026</p>
            <h1>Fady Youssef builds software with clarity, pace, and taste.</h1>
            <p className="hero-text">
              Computer Science student at Gonzaga University focused on full-stack
              development, thoughtful interfaces, and products that feel sharp from
              the first click.
            </p>

            <div className="hero-actions">
              <a href="#work" className="button button-primary">
                View work
              </a>
              <a
                href="/Youssef_Fady_Developer_Intern-4.pdf"
                className="button button-secondary"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>

            <div className="stat-row">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-tile">
                  <span>{stat.value}</span>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-panel">
              <div className="panel-header">
                <span />
                <span />
                <span />
              </div>
              <div className="panel-body">
                <Globe />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section section-split" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2>Clean systems, cinematic presentation, and real utility.</h2>
          </div>

          <div className="about-grid">
            <p className="about-copy">
              I am a junior pursuing a B.S. in Computer Science, and I like work that
              balances engineering discipline with a strong user experience. That
              usually means building dependable systems, making technical information
              easier to understand, and shaping interfaces that feel considered instead
              of accidental.
            </p>

            <div className="strength-grid">
              {strengths.map((item) => (
                <article key={item.title} className="strength-card">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Projects that show how I think, build, and refine.</h2>
          </div>

          <div className="project-list">
            {projects.map((project, index) => (
              <article key={project.title} className="project-card">
                <div className="project-meta">
                  <span className="project-index">0{index + 1}</span>
                  <p>{project.category}</p>
                </div>

                <div className="project-main">
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>

                  <div className="tag-row">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="project-link-wrap">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    Open project
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section insight-band" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">What I bring</p>
            <h2>I like shipping software that earns trust quickly.</h2>
          </div>

          <div className="insight-layout">
            <div className="insight-quote">
              <p>
                Good software should feel fast, composed, and easy to understand. I
                try to build with that standard even when the project is technically
                dense.
              </p>
            </div>

            <div className="insight-list">
              <div>
                <h3>Technical range</h3>
                <p>React, Node.js, Java, Spring Boot, MongoDB, MySQL, C#, and C++.</p>
              </div>
              <div>
                <h3>Working style</h3>
                <p>Structured, collaborative, and focused on momentum without losing code quality.</p>
              </div>
              <div>
                <h3>Current base</h3>
                <p>Spokane, Washington with roots in product thinking and engineering fundamentals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer" data-reveal>
        <div className="footer-copy">
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s build something that feels finished.</h2>
          <p>
            Reach out for internships, collaborations, or projects that need clean
            execution and a strong interface.
          </p>
        </div>

        <div className="footer-actions">
          <a href="mailto:fyoussef@zagmail.gonzaga.edu" className="footer-email">
            fyoussef@zagmail.gonzaga.edu
          </a>
          <div className="footer-links">
            <a href="https://github.com/JustFady" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/justfadyy" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <p className="footer-note">© 2026 Fady Youssef</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
