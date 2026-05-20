import React from 'react';
import { NavLink } from 'react-router-dom';

const Tabs = () => {
  return (
    <div className="gh-tabs">
      <div className="tabs-container">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'active' : ''}
          end
        >
          <i className="fas fa-book-open"></i> Overview
        </NavLink>
        <NavLink 
          to="/repositories" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <i className="fas fa-book"></i> Repositories
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <i className="fas fa-table"></i> Projects
        </NavLink>
        <NavLink 
          to="/education" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <i className="fas fa-graduation-cap"></i> Education
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          <i className="fas fa-envelope"></i> Contact
        </NavLink>
      </div>
    </div>
  );
};

export default Tabs;
