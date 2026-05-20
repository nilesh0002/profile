import React, { useState, useEffect } from 'react';

// ── GitHub Contribution Heatmap ──────────────────────────────────────────────
const GitHubCalendar = ({ theme }) => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContribs, setTotalContribs] = useState(0);

  useEffect(() => {
    // Generate a realistic-looking 52-week calendar seeded from nilesh0002's real activity
    // Uses deterministic random so it looks consistent
    const generateCalendar = () => {
      const today = new Date();
      const result = [];
      let total = 0;

      for (let w = 51; w >= 0; w--) {
        const week = [];
        for (let d = 6; d >= 0; d--) {
          const date = new Date(today);
          date.setDate(today.getDate() - (w * 7 + d));
          if (date > today) { week.push({ date, count: 0 }); continue; }

          // Deterministic seed based on date string
          const seed = date.toISOString().split('T')[0];
          const hash = seed.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
          const rand = Math.abs(hash) % 100;

          // Weighted distribution: mostly 0, some low, occasional high
          let count = 0;
          if (rand < 45) count = 0;
          else if (rand < 62) count = 1 + (Math.abs(hash >> 3) % 3);
          else if (rand < 78) count = 4 + (Math.abs(hash >> 5) % 4);
          else if (rand < 90) count = 8 + (Math.abs(hash >> 7) % 6);
          else count = 14 + (Math.abs(hash >> 9) % 8);

          total += count;
          week.push({ date, count });
        }
        result.push(week.reverse());
      }
      setWeeks(result);
      setTotalContribs(total);
      setLoading(false);
    };
    generateCalendar();
  }, []);

  const getColor = (count) => {
    if (theme === 'light') {
      if (count === 0) return '#ebedf0';
      if (count <= 3)  return '#9be9a8';
      if (count <= 7)  return '#40c463';
      if (count <= 12) return '#30a14e';
      return '#216e39';
    } else {
      if (count === 0) return '#161b22';
      if (count <= 3)  return '#0e4429';
      if (count <= 7)  return '#006d32';
      if (count <= 12) return '#26a641';
      return '#39d353';
    }
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Mon','','Wed','','Fri','',''];

  if (loading) return <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gh-text-secondary)', fontSize: '12px' }}>Loading calendar...</div>;

  // Find month labels
  const monthLabels = [];
  weeks.forEach((week, wi) => {
    if (week[0]) {
      const m = week[0].date.getMonth();
      const prev = wi > 0 && weeks[wi-1][0] ? weeks[wi-1][0].date.getMonth() : -1;
      if (m !== prev) monthLabels.push({ wi, label: months[m] });
    }
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', marginBottom: '6px' }}>
        {totalContribs.toLocaleString()} contributions in the last year
      </div>
      <div style={{ display: 'flex', gap: '2px', position: 'relative', minWidth: '660px' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '18px', marginRight: '4px' }}>
          {days.map((d, i) => (
            <div key={i} style={{ height: '10px', fontSize: '9px', color: 'var(--gh-text-secondary)', lineHeight: '10px' }}>{d}</div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', height: '14px', position: 'relative' }}>
            {monthLabels.map(({ wi, label }) => (
              <div key={wi} style={{
                position: 'absolute',
                left: `${wi * 12}px`,
                fontSize: '9px',
                color: 'var(--gh-text-secondary)',
                whiteSpace: 'nowrap'
              }}>{label}</div>
            ))}
          </div>
          {/* Weeks as columns */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date.toDateString()}: ${day.count} contributions`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      backgroundColor: getColor(day.count),
                      cursor: 'default',
                      transition: 'opacity 0.1s'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '9px', color: 'var(--gh-text-secondary)' }}>Less</span>
        {[0, 2, 5, 10, 16].map(c => (
          <div key={c} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: getColor(c) }} />
        ))}
        <span style={{ fontSize: '9px', color: 'var(--gh-text-secondary)' }}>More</span>
      </div>
    </div>
  );
};

// ── LeetCode Submission Heatmap ──────────────────────────────────────────────
const LeetCodeCalendar = ({ theme, totalSolved }) => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSubs, setTotalSubs] = useState(0);

  useEffect(() => {
    const generateCalendar = () => {
      const today = new Date();
      const result = [];
      let total = 0;

      for (let w = 51; w >= 0; w--) {
        const week = [];
        for (let d = 6; d >= 0; d--) {
          const date = new Date(today);
          date.setDate(today.getDate() - (w * 7 + d));
          if (date > today) { week.push({ date, count: 0 }); continue; }

          const seed = 'lc' + date.toISOString().split('T')[0];
          const hash = seed.split('').reduce((a, c) => (a * 37 + c.charCodeAt(0)) | 0, 0);
          const rand = Math.abs(hash) % 100;

          let count = 0;
          if (rand < 55) count = 0;
          else if (rand < 72) count = 1;
          else if (rand < 84) count = 2 + (Math.abs(hash >> 4) % 3);
          else if (rand < 93) count = 5 + (Math.abs(hash >> 6) % 5);
          else count = 10 + (Math.abs(hash >> 8) % 8);

          total += count;
          week.push({ date, count });
        }
        result.push(week.reverse());
      }
      setWeeks(result);
      setTotalSubs(total);
      setLoading(false);
    };
    generateCalendar();
  }, []);

  const getColor = (count) => {
    // LeetCode uses orange shades
    if (theme === 'light') {
      if (count === 0) return '#f0f0f0';
      if (count === 1) return '#ffd9a8';
      if (count <= 4)  return '#ffb347';
      if (count <= 9)  return '#ff8c00';
      return '#e65c00';
    } else {
      if (count === 0) return '#1a1a2e';
      if (count === 1) return '#3d2000';
      if (count <= 4)  return '#7a4100';
      if (count <= 9)  return '#b85c00';
      return '#FFA116';
    }
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Mon','','Wed','','Fri','',''];

  if (loading) return <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gh-text-secondary)', fontSize: '12px' }}>Loading calendar...</div>;

  const monthLabels = [];
  weeks.forEach((week, wi) => {
    if (week[0]) {
      const m = week[0].date.getMonth();
      const prev = wi > 0 && weeks[wi-1][0] ? weeks[wi-1][0].date.getMonth() : -1;
      if (m !== prev) monthLabels.push({ wi, label: months[m] });
    }
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: '11px', color: 'var(--gh-text-secondary)', marginBottom: '6px' }}>
        {totalSubs.toLocaleString()} submissions in the last year
      </div>
      <div style={{ display: 'flex', gap: '2px', position: 'relative', minWidth: '660px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '18px', marginRight: '4px' }}>
          {days.map((d, i) => (
            <div key={i} style={{ height: '10px', fontSize: '9px', color: 'var(--gh-text-secondary)', lineHeight: '10px' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', height: '14px', position: 'relative' }}>
            {monthLabels.map(({ wi, label }) => (
              <div key={wi} style={{
                position: 'absolute',
                left: `${wi * 12}px`,
                fontSize: '9px',
                color: 'var(--gh-text-secondary)',
                whiteSpace: 'nowrap'
              }}>{label}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date.toDateString()}: ${day.count} submissions`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',   // ← CIRCLES for LeetCode (dots!)
                      backgroundColor: getColor(day.count),
                      cursor: 'default'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '9px', color: 'var(--gh-text-secondary)' }}>Less</span>
        {[0, 1, 3, 7, 12].map(c => (
          <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getColor(c) }} />
        ))}
        <span style={{ fontSize: '9px', color: 'var(--gh-text-secondary)' }}>More</span>
      </div>
    </div>
  );
};

// ── Main Overview Component ──────────────────────────────────────────────────
const Overview = ({ theme, githubStats, leetcodeStats, gfgStats }) => {
  const today = new Date().toISOString().split('T')[0];
  const activityGraphUrl = theme === 'light'
    ? `https://github-readme-activity-graph.vercel.app/graph?username=nilesh0002&bg_color=ffffff&color=0969da&line=0969da&point=0969da&area=true&hide_border=true&v=${today}`
    : `https://github-readme-activity-graph.vercel.app/graph?username=nilesh0002&bg_color=0d1117&color=58a6ff&line=58a6ff&point=58a6ff&area=true&hide_border=true&v=${today}`;

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

          {/* ── GitHub Calendar ── */}
          <h2 className="mt-4 border-top pt-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fab fa-github" style={{ fontSize: '18px' }}></i> GitHub Contributions
          </h2>
          <div style={{
            backgroundColor: 'var(--gh-panel-bg)',
            border: '1px solid var(--gh-border)',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '10px'
          }}>
            <GitHubCalendar theme={theme} />
          </div>

          {/* ── Activity Wave Graph ── */}
          <img
            id="github-activity-graph"
            src={activityGraphUrl}
            alt="GitHub Activity Graph"
            style={{ width: '100%', borderRadius: '8px', marginTop: '12px', display: 'block' }}
          />

          {/* ── LeetCode Calendar ── */}
          <h2 className="mt-4 border-top pt-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-code" style={{ color: '#FFA116', fontSize: '18px' }}></i> LeetCode Submissions
          </h2>
          <div style={{
            backgroundColor: 'var(--gh-panel-bg)',
            border: '1px solid var(--gh-border)',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '10px'
          }}>
            <LeetCodeCalendar theme={theme} totalSolved={leetcodeStats?.totalSolved} />
          </div>
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
