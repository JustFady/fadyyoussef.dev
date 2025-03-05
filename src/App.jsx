// src/App.jsx
import React from 'react';
import NavBar from './NavBar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Hello, I'm Fady Youssef</h1>
          <p>Computer Science Student</p>
          <a href="#projects" className="cta">View My Work</a>
        </div>
        <div className="contact-info">
          <a href="mailto:fyoussef@zagmail.gonzaga.edu" className="contact-item">
            <i className="fas fa-envelope"></i> Email
          </a>
          <a href="https://github.com/JustFady" target="_blank" rel="noopener noreferrer" className="contact-item">
            <i className="fab fa-github"></i> GitHub
          </a>
          <a href="https://www.linkedin.com/in/justfadyy/" target="_blank" rel="noopener noreferrer" className="contact-item">
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <h2>About Me</h2>
        <p>
          I'm a passionate Computer Science student with a focus on building innovative solutions. 
          I love working with modern technologies and creating applications that make a difference.
        </p>
        <div className="skills-grid">
          <span className="skill-tag">JavaScript</span>
          <span className="skill-tag">React</span>
          <span className="skill-tag">Python</span>
          <span className="skill-tag">Java</span>
          <span className="skill-tag">C#</span>
          <span className="skill-tag">Git</span>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>HoopMetrics</h3>
            <p>A basketball analytics platform that aggregates real-time data on players and teams. It allows coaches, players, and fans to track performance stats, game trends, and advanced metrics through a user-friendly interface.</p>
            <div className="project-tech">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>
            <a href="https://github.com/JustFady" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>

          <div className="project-card">
            <h3>Hospital Management System</h3>
            <p>A comprehensive system for managing hospital operations, including patient records, staff management, and appointment scheduling.</p>
            <div className="project-tech">
              <span>Java</span>
              <span>Spring Boot</span>
              <span>MySQL</span>
            </div>
            <a href="https://github.com/JustFady/HospitalManagement" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>

          <div className="project-card">
            <h3>Three Classic Ciphers</h3>
            <p>Implementation of three classic encryption algorithms in C++. Demonstrates fundamental cryptography concepts and secure coding practices.</p>
            <div className="project-tech">
              <span>C++</span>
              <span>Cryptography</span>
            </div>
            <a href="https://github.com/JustFady/ThreeClassicCiphers" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>

          <div className="project-card">
            <h3>Heat Transfer</h3>
            <p>A project focused on simulating heat transfer processes using C# and .NET technologies.</p>
            <div className="project-tech">
              <span>C#</span>
              <span>.NET</span>
            </div>
            <a href="https://github.com/JustFady/HeatTransfer" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>

          <div className="project-card">
            <h3>Car Rental System</h3>
            <p>A C++ application for managing car rentals, featuring inventory management, booking system, and customer tracking functionality.</p>
            <div className="project-tech">
              <span>C++</span>
              <span>OOP</span>
            </div>
            <a href="https://github.com/JustFady/CarRental" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>

          <div className="project-card">
            <h3>CPSC Courses at Gonzaga University</h3>
            <p>Collection of coursework and projects completed during Computer Science studies at Gonzaga University.</p>
            <div className="project-tech">
              <span>Jupyter Notebook</span>
              <span>C++</span>
              <span>Python</span>
            </div>
            <a href="https://github.com/JustFady/CPSC_Courses_GU" className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Me Section */}
      <section id="contact" className="section contact-me-section">
        <h2>Contact Me</h2>
        <div className="contact-details">
          <div className="contact-info">
            <a href="mailto:fyoussef@zagmail.gonzaga.edu" className="contact-item">
              <i className="fas fa-envelope"></i> fyoussef@zagmail.gonzaga.edu
            </a>
            <a href="mailto:itsfadyy02@gmail.com" className="contact-item">
              <i className="fas fa-phone"></i>
            </a>
            <span className="contact-item">
              <i className="fas fa-map-marker-alt"></i> Spokane, WA
            </span>
          </div>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/justfadyy/" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://github.com/JustFady" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fab fa-github"></i> GitHub
            </a>
            <a href="/Youssef_Fady_Developer_Intern-4.pdf" target="_blank" rel="noopener noreferrer" className="social-item">
              <i className="fas fa-file"></i> Resume
            </a>
          </div>
        </div>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" placeholder="Message" required></textarea>
          <button type="submit" className="send-button">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <p>Designed & Built by Fady Youssef</p>
        <p>© 2025 All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
