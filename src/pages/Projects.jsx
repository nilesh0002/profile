import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GITHUB_USERNAME = 'nilesh0002';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!res.ok) throw new Error('Failed to fetch repositories');
        const data = await res.json();
        // Filter repos that have a homepage (deployment link)
        const liveRepos = data.filter(repo => repo.homepage && repo.homepage.trim() !== '');
        setProjects(liveRepos);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="gh-content">
      <div className="page-header" style={{ borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 className="f4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-table"></i>Featured Projects
        </h1>
        <p className="page-subtitle" style={{ color: 'var(--gh-text-secondary)', fontSize: '13px', marginTop: '6px' }}>
          A collection of live projects fetched directly from GitHub — complete with deployment links.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '48px', color: 'var(--gh-text-secondary)', fontSize: '14px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}></i>
          Loading projects...
        </div>
      ) : error ? (
        <p style={{ color: 'var(--gh-text-secondary)' }}>Failed to load projects.</p>
      ) : projects.length === 0 ? (
        <p style={{ color: 'var(--gh-text-secondary)' }}>No live projects found.</p>
      ) : (
        <div className="projects-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {projects.map(project => (
            <div key={project.id} className="project-page-card" style={{ border: '1px solid var(--gh-border)', borderRadius: '8px', padding: '24px', background: 'var(--gh-panel-bg)', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}>
              <div className="project-icon" style={{ fontSize: '28px', marginBottom: '4px' }}>
                {project.language === 'JavaScript' || project.language === 'HTML' || project.language === 'CSS' || project.language === 'TypeScript' ? '🌐' : '💻'}
              </div>
              <div className="project-page-title" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gh-link)' }}>{project.name}</div>
              <p className="project-page-desc" style={{ fontSize: '13px', color: 'var(--gh-text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>
                {project.description || 'No description provided.'}
              </p>
              <div className="project-tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.language && <span className="tech-badge">{project.language}</span>}
                {project.topics && project.topics.map(topic => (
                  <span key={topic} className="tech-badge">{topic}</span>
                ))}
              </div>
              <div className="project-btns" style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="gh-btn">
                  <i className="fab fa-github" style={{ marginRight: '5px' }}></i>Code
                </a>
                <a 
                  href={project.homepage.startsWith('http') ? project.homepage : `https://${project.homepage}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gh-btn gh-btn-primary"
                >
                  <i className="fas fa-external-link-alt" style={{ marginRight: '5px' }}></i>Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '32px', padding: '20px', border: '1px dashed var(--gh-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--gh-text-secondary)' }}>
        <i className="fas fa-code" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}></i>
        More projects coming soon — check my <Link to="/repositories">Repositories</Link> for all my work on GitHub.
      </div>
    </div>
  );
};

export default Projects;
