import React, { useEffect } from 'react';
import './App.css';

// Update this array whenever you want to add, remove, or rewrite projects on the site.
const projects = [
  {
    title: 'Universal Sensor Board',
    category: 'Embedded Systems',
    desc: 'Senior design firmware work for the Apollo3 MCU focused on collecting, processing, and validating live environmental sensor data for an industrial IoT platform.',
    tech: ['C', 'C++', 'Firmware', 'J-Link'],
    link: 'https://github.com/JustFady',
  },
  {
    title: 'Heat Transfer Modeling',
    category: 'Simulation Project',
    desc: 'A C# desktop simulation that models heat transfer between a steel ball and boiling water with live temperature updates, visualization, and CSV export for analysis.',
    tech: ['C#', '.NET', 'Simulation', 'Data Export'],
    link: 'https://github.com/JustFady/HeatTransfer',
  },
  {
    title: 'HoopMetrics',
    category: 'Data and Analytics',
    desc: 'A basketball analytics tool that fetches NBA player data, stores it in AWS, and turns performance trends into visuals that are faster to scan and compare.',
    tech: ['Python', 'AWS S3', 'Data Pipelines'],
    link: 'https://github.com/JustFady/HoopMetrics',
  },
  {
    title: 'Three Classic Ciphers',
    category: 'Security Fundamentals',
    desc: 'A compact C++ implementation of classical encryption algorithms built to explore cryptography concepts, algorithm design, and careful systems programming.',
    tech: ['C++', 'Cryptography', 'Security'],
    link: 'https://github.com/JustFady/ThreeClassicCiphers',
  },
];

const strengths = [
  {
    title: 'Full-stack systems',
    copy: 'I like products that need both a polished interface and dependable backend logic. My best work lives where frontend clarity and backend structure have to meet in the middle.',
  },
  {
    title: 'Security-minded thinking',
    copy: 'My coursework leans into software security, and I like approaching systems with an eye for trust, resilience, and how things behave under pressure.',
  },
  {
    title: 'Leadership and mentoring',
    copy: 'From tutoring high school seniors to competing in team-based cyber challenges, I like work that blends technical execution with steady collaboration.',
  },
];

const stats = [
  { value: '26', label: 'public repositories' },
  { value: 'B.S.', label: 'computer science at Gonzaga' },
  { value: 'Sec', label: 'software security focus' },
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

      <main>
        <section id="home" className="hero" data-reveal>
          <div className="hero-copy">
            <p className="eyebrow">Portfolio 2026</p>
            <h1>Fady Youssef builds sharp software with clean execution.</h1>
            <p className="hero-text">
              Senior at Gonzaga University studying Computer Science with a software
              security concentration and a minor in Applied Mathematics, building
              full-stack projects with strong interfaces and practical technical depth.
            </p>

            <div className="hero-highlights">
              <span>Teaching Assistant</span>
              <span>Data Engineering Intern</span>
              <span>Software Security</span>
              <span>Embedded Systems</span>
            </div>

            <div className="hero-actions">
              <a href="#work" className="button button-primary">
                View work
              </a>
              <a
                href="/resume.pdf"
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
        </section>

        <section id="about" className="section section-split" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">About</p>
            <h2>Clean systems, cinematic presentation, and real utility.</h2>
          </div>

          <div className="about-grid">
            <p className="about-copy">
              I am a senior pursuing a B.S. in Computer Science at Gonzaga University
              with a software security concentration and a minor in Applied Mathematics.
              I like work that balances engineering discipline with a strong user
              experience, whether that means building dependable systems, clarifying
              technical complexity, or shaping interfaces that feel intentional.
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

          <p className="section-intro">
            The list below is meant to be easy to keep fresh. Swap projects in and
            out as your work changes, and use each card to emphasize what mattered
            most in the build.
          </p>

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
                try to build with that standard whether the project is data-heavy,
                security-focused, or just needs clearer product thinking.
              </p>
            </div>

            <div className="insight-list">
              <div>
                <h3>Technical range</h3>
                <p>React, Node.js, Java, Spring Boot, MongoDB, MySQL, Python, C#, and C++.</p>
              </div>
              <div>
                <h3>Security and competition</h3>
                <p>Active in Spokane Cyber Cup with hands-on exposure to vulnerability discovery, defense, and attack simulation work.</p>
              </div>
              <div>
                <h3>Community and communication</h3>
                <p>Based in Spokane, Washington and experienced in mentoring students through academic support and college application guidance.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer" data-reveal>
        <p className="eyebrow">Contact</p>
        <h2 className="footer-headline" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(1.4rem, 4vw, 3rem)', margin: '12px 0' }}>
          Let&apos;s connect and build something cool.
        </h2>

        <div className="footer-bottom">
          <a href="mailto:thefady4@gmail.com" className="footer-email">
            thefady4@gmail.com
          </a>
          
          <nav className="footer-nav">
            <a href="https://github.com/JustFady" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/fadyyoussef08/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
          </nav>
          
          <p className="footer-note">© 2026 Fady Youssef</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
