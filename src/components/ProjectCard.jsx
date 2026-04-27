import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.title}</h3>
        <div className="project-tech">
          {project.tech.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
      <p>{project.description}</p>
      <div className="project-footer">
        <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
          View Project <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
