import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const TITLES = [
  'CS Student @ Gonzaga',
  'Language Designer',
  'Distance Runner',
  'Beat Maker',
  'Security Enthusiast'
];

const PARTICLE_COLORS = ['#28ff7a', '#24b8ff', '#a855ff', '#ff305c'];

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let width = 0;
    let height = 0;
    let particles = [];
    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const createParticles = () => {
      const count = Math.min(82, Math.max(46, Math.floor((width * height) / 24000)));

      particles = Array.from({ length: count }, (_, index) => {
        const angle = ((index * 137.5) % 360) * (Math.PI / 180);
        const speed = 0.18 + ((index % 7) * 0.02);

        return {
          x: ((index * 97) % Math.max(width, 1)),
          y: ((index * 151) % Math.max(height, 1)),
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
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.vx += (particle.baseVx - particle.vx) * 0.02;
        particle.vy += (particle.baseVy - particle.vy) * 0.02;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = 150;

          if (distance > 0 && distance < influence) {
            const force = (1 - distance / influence) * 0.075;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        const velocity = Math.hypot(particle.vx, particle.vy);
        const maxVelocity = 0.95;

        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }

        particle.x = (particle.x + particle.vx + width) % width;
        particle.y = (particle.y + particle.vy + height) % height;
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const first = particles[i];
          const second = particles[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.hypot(dx, dy);
          const maxDistance = 118;

          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(130, 170, 255, ${0.24 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(second.x, second.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        particles.forEach((particle) => {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const maxDistance = 170;

          if (distance < maxDistance) {
            ctx.strokeStyle = `${particle.color}${Math.round(120 * (1 - distance / maxDistance))
              .toString(16)
              .padStart(2, '0')}`;
            ctx.lineWidth = 1.25;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        });

        const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 95);
        gradient.addColorStop(0, 'rgba(168, 85, 255, 0.18)');
        gradient.addColorStop(0.45, 'rgba(36, 184, 255, 0.08)');
        gradient.addColorStop(1, 'rgba(40, 255, 122, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 95, 0, Math.PI * 2);
        ctx.fill();
      }

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState('fade-in');

  useEffect(() => {
    const timeout = setInterval(() => {
      setFadeProp('fade-out');
      
      setTimeout(() => {
        setTitleIndex((prevIndex) => (prevIndex + 1) % TITLES.length);
        setFadeProp('fade-in');
      }, 500); // Wait for fade out to complete before changing text and fading in

    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(timeout);
  }, []);



  return (
    <div className="app-container">
      
      <ParticleBackground />

      {/* Main Content */}
      <div className="content">
        <h1 className="name">Fady Youssef</h1>
        <div className="title-container">
          <h2 className={`title ${fadeProp}`}>
            {TITLES[titleIndex]}
          </h2>
        </div>
      </div>

      {/* Icon Links */}
      <div className="icon-bar">
        <a href="https://github.com/JustFady" target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub" data-label="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/fadyyoussef08/" target="_blank" rel="noreferrer" className="icon-link" aria-label="LinkedIn" data-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="icon-link" aria-label="Resume" data-label="Resume">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
          </svg>
        </a>
        <a href="mailto:thefady4@gmail.com" className="icon-link" aria-label="Email" data-label="Email">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12.713l11.985-8.71c-.347-.393-.827-.643-1.365-.643H1.38C.842 3.36.362 3.61.015 4.003L12 12.713zm0 1.603l-12-8.718v9.062C0 15.65.75 16.4 1.68 16.4h20.64c.93 0 1.68-.75 1.68-1.74v-9.062l-12 8.718z" />
          </svg>
        </a>
      </div>

    </div>
  );
}

export default App;
