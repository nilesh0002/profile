import React from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  return (
    <div className="gh-content">
      <div className="page-header" style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 className="f4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-table"></i>Featured Projects
        </h1>
        <p className="page-subtitle" style={{ color: 'var(--gh-text-secondary)', fontSize: '13px', marginTop: '6px' }}>
          A collection of projects I've built — spanning ML, web development, and more.
        </p>
      </div>

      <div className="projects-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Project 1 */}
        <div className="project-page-card" style={{ border: '1px solid var(--gh-border)', borderRadius: '8px', padding: '24px', background: 'var(--gh-panel-bg)', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}>
          <div className="project-icon" style={{ fontSize: '28px', marginBottom: '4px' }}>✈️</div>
          <div className="project-page-title" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gh-link)' }}>Flight Price Predictor</div>
          <p className="project-page-desc" style={{ fontSize: '13px', color: 'var(--gh-text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>
            A full-stack ML-powered application that predicts flight ticket prices based on route, date, airline, and other parameters. Features a React frontend, FastAPI backend, and a scikit-learn regression model trained on real-world data.
          </p>
          <div className="project-tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="tech-badge">React</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">scikit-learn</span>
            <span className="tech-badge">Render</span>
          </div>
          <div className="project-btns" style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <a href="https://github.com/nilesh0002" target="_blank" rel="noopener noreferrer" className="gh-btn">
              <i className="fab fa-github" style={{ marginRight: '5px' }}></i>Code
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="gh-btn gh-btn-primary">
              <i className="fas fa-external-link-alt" style={{ marginRight: '5px' }}></i>Live Demo
            </a>
          </div>
        </div>

        {/* Project 2 */}
        <div className="project-page-card" style={{ border: '1px solid var(--gh-border)', borderRadius: '8px', padding: '24px', background: 'var(--gh-panel-bg)', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}>
          <div className="project-icon" style={{ fontSize: '28px', marginBottom: '4px' }}>🌐</div>
          <div className="project-page-title" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gh-link)' }}>Personal Portfolio</div>
          <p className="project-page-desc" style={{ fontSize: '13px', color: 'var(--gh-text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>
            This very portfolio website! Built with React, Vite, and custom CSS in a GitHub-inspired dark mode design. Features live GitHub, LeetCode, and GeeksforGeeks stats fetched from real APIs, a theme toggle, and a serverless contact form powered by EmailJS.
          </p>
          <div className="project-tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">GitHub API</span>
            <span className="tech-badge">EmailJS</span>
          </div>
          <div className="project-btns" style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <a href="https://github.com/nilesh0002/potfolio-main" target="_blank" rel="noopener noreferrer" className="gh-btn">
              <i className="fab fa-github" style={{ marginRight: '5px' }}></i>Code
            </a>
            <Link to="/" className="gh-btn gh-btn-primary">
              <i className="fas fa-eye" style={{ marginRight: '5px' }}></i>You're Here!
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', padding: '20px', border: '1px dashed var(--gh-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--gh-text-secondary)' }}>
        <i className="fas fa-code" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}></i>
        More projects coming soon — check my <Link to="/repositories">Repositories</Link> for all my work on GitHub.
      </div>
    </div>
  );
};

export default Projects;
