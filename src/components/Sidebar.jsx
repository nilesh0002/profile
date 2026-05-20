import React from 'react';

const Sidebar = ({ followersCount, followingCount }) => {
  return (
    <aside className="gh-sidebar">
      <div className="avatar-wrapper">
        <img src="/image/profile.jpg" alt="Nilesh Singh" className="avatar" />
      </div>
      <h1 className="vcard-names">
        <span className="p-name">Nilesh Singh</span>
        <span className="p-nickname">nilesh0002</span>
      </h1>
      <div className="user-profile-bio">
        Full Stack Developer with hands-on experience building ML-powered web apps using React &amp; FastAPI. I love turning complex backend systems into clean, intuitive interfaces. Currently seeking opportunities in web development.
      </div>
      <div className="open-to-work mb-3">
        <span className="otw-badge">
          <span className="otw-dot"></span> Open to Work
        </span>
      </div>
      <a 
        href="/Nilesh_Singh_Resume.pdf" 
        download 
        className="gh-btn w-full mb-3" 
        style={{ textAlign: 'center', display: 'block' }}
      >
        <i className="fas fa-download" style={{ marginRight: '6px' }}></i> Download Resume
      </a>
      
      <div className="vcard-details">
        <div className="detail-item">
          <i className="fas fa-users"></i>{' '}
          <span>{followersCount !== null ? followersCount : '...'}</span> followers ·{' '}
          <span>{followingCount !== null ? followingCount : '...'}</span> following
        </div>
        <div className="detail-item">
          <i className="fas fa-map-marker-alt"></i> India
        </div>
        <div className="detail-item">
          <i className="fas fa-graduation-cap"></i> B.Tech CSE Student
        </div>
        
        <div className="gh-social-links">
          <a href="mailto:nilesh.singh0032@gmail.com" title="Email Nilesh">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="https://twitter.com/nil_esh__" target="_blank" rel="noopener noreferrer" title="Twitter Profile">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/in/nileshsingh98" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/nilesh0002" target="_blank" rel="noopener noreferrer" title="GitHub Profile">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
      
      <div className="border-top pt-3 mt-3">
        <h2 className="h4 mb-2">Skills</h2>
        <div className="topic-tags">
          <span className="topic-tag">Python</span>
          <span className="topic-tag">JavaScript</span>
          <span className="topic-tag">HTML5</span>
          <span className="topic-tag">CSS3</span>
          <span className="topic-tag">C Language</span>
          <span className="topic-tag">DBMS</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
