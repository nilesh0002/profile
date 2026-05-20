import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Tabs from './components/Tabs';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Overview from './pages/Overview';
import Repositories from './pages/Repositories';
import Projects from './pages/Projects';
import Education from './pages/Education';
import Contact from './pages/Contact';

const GITHUB_USERNAME = 'nilesh0002';
const LEETCODE_USERNAME = 'nilesh0002';
const GFG_USERNAME = 'nilesh98';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [githubStats, setGithubStats] = useState({
    loading: true,
    error: false,
    publicRepos: 0,
    followers: 0,
    following: 0
  });

  const [leetcodeStats, setLeetcodeStats] = useState({
    loading: true,
    error: false,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });

  const [gfgStats, setGfgStats] = useState({
    loading: true,
    error: false,
    totalSolved: 0,
    codingScore: 0,
    instituteRank: '-'
  });

  // Handle Theme state change
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = (e) => {
    if (e) e.preventDefault();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch GitHub profile statistics
  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('GitHub API failed');
        const data = await response.json();
        setGithubStats({
          loading: false,
          error: false,
          publicRepos: data.public_repos || 0,
          followers: data.followers || 0,
          following: data.following || 0
        });
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setGithubStats(prev => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchGitHub();
  }, []);

  // Fetch LeetCode solved status
  useEffect(() => {
    const fetchLeetcode = async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`);
        if (!response.ok) throw new Error('LeetCode API failed');
        const data = await response.json();
        setLeetcodeStats({
          loading: false,
          error: false,
          totalSolved: data.solvedProblem || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0
        });
      } catch (err) {
        console.error('Error fetching LeetCode stats:', err);
        setLeetcodeStats(prev => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchLeetcode();
  }, []);

  // Fetch GeeksforGeeks profile status
  useEffect(() => {
    const fetchGFG = async () => {
      try {
        const response = await fetch(`https://geeks-for-geeks-api-two.vercel.app/v1/geeksforgeeks/${GFG_USERNAME}`);
        if (!response.ok) throw new Error('GFG API failed');
        const data = await response.json();
        setGfgStats({
          loading: false,
          error: false,
          totalSolved: data.info?.totalProblemsSolved || 0,
          codingScore: data.info?.codingScore || 0,
          instituteRank: data.info?.instituteRank || '-'
        });
      } catch (err) {
        console.error('Error fetching GeeksforGeeks stats:', err);
        setGfgStats(prev => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchGFG();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Tabs />
        
        <div style={{ maxWidth: '1280px', margin: '16px auto 0', padding: '0 32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="gh-btn" 
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 12px' }}
          >
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
          </button>
        </div>

        <main className="gh-main">
          <Sidebar 
            followersCount={githubStats.loading ? null : githubStats.followers}
            followingCount={githubStats.loading ? null : githubStats.following}
          />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <Overview 
                  theme={theme}
                  githubStats={githubStats}
                  leetcodeStats={leetcodeStats}
                  gfgStats={gfgStats}
                />
              } 
            />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
