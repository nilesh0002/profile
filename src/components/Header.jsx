import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="gh-header">
      <div className="header-container">
        <Link to="/" aria-label="Home">
          <i className="fab fa-github logo-icon"></i>
        </Link>

        <nav className="header-nav">
          <button 
            id="theme-toggle" 
            className="theme-toggle" 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
