import React, { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'nilesh0002';

const langColors = {
  JavaScript: '#f1e05a', 
  Python: '#3572A5', 
  HTML: '#e34c26',
  CSS: '#563d7c', 
  TypeScript: '#2b7489', 
  Java: '#b07219',
  'C++': '#f34b7d', 
  C: '#555555', 
  Shell: '#89e051'
};

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!res.ok) throw new Error('Failed to fetch repositories');
        const data = await res.json();
        setRepos(data);
        setFilteredRepos(data);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  // Filter and search handling
  useEffect(() => {
    let result = repos;

    // Apply language filter
    if (activeFilter !== 'all') {
      result = result.filter(repo => repo.language === activeFilter);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(q) || 
        (repo.description || '').toLowerCase().includes(q)
      );
    }

    setFilteredRepos(result);
  }, [searchQuery, activeFilter, repos]);

  return (
    <div className="gh-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gh-border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 className="f4" style={{ margin: 0, fontSize: '18px' }}>
          <i className="fab fa-github" style={{ marginRight: '8px' }}></i>nilesh0002 / Repositories
        </h1>
        <span id="repo-count" style={{ color: 'var(--gh-text-secondary)', fontSize: '13px' }}>
          {loading ? '...' : `${repos.length} repositories`}
        </span>
      </div>

      <div className="repo-filters" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          id="repo-search" 
          className="gh-input repo-search" 
          placeholder="Find a repository…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: '1', minWidth: '200px', maxWidth: '320px', borderRadius: '6px', padding: '6px 12px' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`gh-btn ${activeFilter === 'all' ? 'gh-btn-primary' : ''}`}
            onClick={() => setActiveFilter('all')}
            style={{ 
              borderRadius: '20px', 
              padding: '5px 16px', 
              fontSize: '13px', 
              fontWeight: '500', 
              transition: 'all 0.2s ease',
              border: activeFilter === 'all' ? 'none' : '1px solid var(--gh-border)'
            }}
          >
            All
          </button>
          {['JavaScript', 'Python', 'HTML'].map(lang => (
            <button 
              key={lang}
              className={`gh-btn ${activeFilter === lang ? 'gh-btn-primary' : ''}`}
              onClick={() => setActiveFilter(lang)}
              style={{ 
                borderRadius: '20px', 
                padding: '5px 16px', 
                fontSize: '13px', 
                fontWeight: '500', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                transition: 'all 0.2s ease',
                border: activeFilter === lang ? 'none' : '1px solid var(--gh-border)'
              }}
            >
              <span style={{ 
                backgroundColor: langColors[lang], 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: activeFilter === lang ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none'
              }}></span>
              {lang}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '48px', color: 'var(--gh-text-secondary)', fontSize: '14px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}></i>
          Loading repositories...
        </div>
      ) : error ? (
        <p style={{ color: 'var(--gh-text-secondary)' }}>Failed to load repositories.</p>
      ) : (
        <div id="repos-container" className="repos-full-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredRepos.length === 0 ? (
            <p style={{ color: 'var(--gh-text-secondary)', gridColumn: '1/-1' }}>No repositories found.</p>
          ) : (
            filteredRepos.map(repo => (
              <div className="repo-card-full" key={repo.id}>
                <h3>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gh-link)', fontWeight: '600' }}>
                    {repo.name}
                  </a>
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--gh-text-secondary)', flexGrow: 1, marginBottom: '12px', lineHeight: '1.5' }}>
                  {repo.description || 'No description provided.'}
                </p>
                <div className="repo-meta" style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--gh-text-secondary)', alignItems: 'center', flexWrap: 'wrap' }}>
                  {repo.language && (
                    <span>
                      <span className="lang-dot" style={{ backgroundColor: langColors[repo.language] || '#8b949e', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '4px' }}></span>
                      {repo.language}
                    </span>
                  )}
                  <span><i className="fas fa-star"></i> {repo.stargazers_count}</span>
                  <span><i className="fas fa-code-branch"></i> {repo.forks_count}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    {repo.homepage && (
                      <a 
                        href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gh-btn gh-btn-primary" 
                        style={{ fontSize: '11px', padding: '2px 10px' }}
                      >
                        <i className="fas fa-external-link-alt" style={{ marginRight: '4px' }}></i>Demo
                      </a>
                    )}
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="gh-btn" 
                      style={{ fontSize: '11px', padding: '2px 10px' }}
                    >
                      View
                    </a>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Repositories;
