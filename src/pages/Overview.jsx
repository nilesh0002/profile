import React from 'react';

const Overview = ({ 
  theme, 
  githubStats, 
  leetcodeStats, 
  gfgStats 
}) => {
  // Generate GitHub streak url based on theme
  // Cache-bust with today's date so the streak image always shows the current date
  const today = new Date().toISOString().split('T')[0]; // e.g. "2026-05-21"
  const streakUrl = theme === 'light'
    ? `https://github-readme-streak-stats.herokuapp.com/?user=nilesh0002&theme=default&hide_border=true&background=ffffff&ring=0969da&fire=0969da&currStreakNum=24292f&v=${today}`
    : `https://github-readme-streak-stats.herokuapp.com/?user=nilesh0002&theme=dark&hide_border=true&background=0d1117&ring=58a6ff&fire=58a6ff&currStreakNum=c9d1d9&v=${today}`;

  return (
    <div className="gh-content">
      <div id="overview" className="readme-box">
        <div className="readme-header">
          <i className="fas fa-list-ul"></i> nilesh0002 / README.md
        </div>
        <div className="readme-body markdown-body">
          <h1>Hi there 👋, I'm Nilesh</h1>
          <p>
            I am a passionate Full Stack Developer with expertise in modern web technologies. I specialize in creating responsive, user-friendly web applications that deliver exceptional user experiences.
          </p>
          
          <div className="tech-stack mb-3" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
            <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
            <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
            <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
            <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
            <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
          </div>

          <ul>
            <li>🔭 Currently building ML-powered web apps with React &amp; FastAPI</li>
            <li>🌱 Learning System Design and Cloud Deployments (Render, Vercel)</li>
            <li>💬 Ask me about Python, JavaScript, Databases &amp; REST APIs</li>
            <li>🤝 Open to collaborating on interesting open source projects</li>
            <li>📫 Reach me at <a href="mailto:nilesh.singh0032@gmail.com">nilesh.singh0032@gmail.com</a></li>
          </ul>

          <h2 className="mt-4 border-top pt-3">Contribution Activity</h2>
          <img 
            id="github-streak" 
            src={streakUrl} 
            alt="GitHub Streak" 
            style={{ width: '100%', borderRadius: '6px', marginTop: '10px' }} 
          />
        </div>
      </div>

      <div className="stats-section mt-4">
        <h2 className="f4 mb-3">Developer Stats</h2>
        <div className="bento-grid">
          {/* GitHub Stats */}
          <div className="bento-card">
            <div className="card-header">
              <i className="fab fa-github"></i>
              <h3>GitHub</h3>
            </div>
            <div id="github-overview" className="stats-content">
              {githubStats.loading ? (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Loading...</p>
              ) : githubStats.error ? (
                <p className="error" style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', textAlign: 'center' }}>Failed to load data</p>
              ) : (
                <>
                  <div className="stat-row">
                    <span>Public Repos</span>
                    <span>{githubStats.publicRepos}</span>
                  </div>
                  <div className="stat-row">
                    <span>Followers</span>
                    <span>{githubStats.followers}</span>
                  </div>
                  <div className="stat-row">
                    <span>Following</span>
                    <span>{githubStats.following}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* LeetCode Stats */}
          <div className="bento-card">
            <div className="card-header">
              <i className="fas fa-code"></i>
              <h3>LeetCode</h3>
            </div>
            <div id="leetcode-overview" className="stats-content">
              {leetcodeStats.loading ? (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Loading...</p>
              ) : leetcodeStats.error ? (
                <p className="error" style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', textAlign: 'center' }}>Failed to load LeetCode data</p>
              ) : (
                <>
                  <div className="stat-row">
                    <span>Total Solved</span>
                    <span style={{ color: '#FFA116' }}>{leetcodeStats.totalSolved}</span>
                  </div>
                  <div className="stat-row">
                    <span>Easy</span>
                    <span style={{ color: '#00B8A3' }}>{leetcodeStats.easySolved}</span>
                  </div>
                  <div className="stat-row">
                    <span>Medium</span>
                    <span style={{ color: '#FFC01E' }}>{leetcodeStats.mediumSolved}</span>
                  </div>
                  <div className="stat-row">
                    <span>Hard</span>
                    <span style={{ color: '#EF4743' }}>{leetcodeStats.hardSolved}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* GeeksforGeeks Stats */}
          <div className="bento-card">
            <div className="card-header">
              <i className="fas fa-laptop-code"></i>
              <h3>GeeksforGeeks</h3>
            </div>
            <div id="gfg-overview" className="stats-content">
              {gfgStats.loading ? (
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gh-text-secondary)' }}>Loading...</p>
              ) : gfgStats.error ? (
                <p className="error" style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', textAlign: 'center' }}>Failed to load GeeksforGeeks data</p>
              ) : (
                <>
                  <div className="stat-row">
                    <span>Total Solved</span>
                    <span style={{ color: '#2ea043' }}>{gfgStats.totalSolved}</span>
                  </div>
                  <div className="stat-row">
                    <span>Coding Score</span>
                    <span style={{ color: '#58a6ff' }}>{gfgStats.codingScore}</span>
                  </div>
                  <div className="stat-row">
                    <span>Institute Rank</span>
                    <span style={{ color: '#f78166' }}>{gfgStats.instituteRank}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
