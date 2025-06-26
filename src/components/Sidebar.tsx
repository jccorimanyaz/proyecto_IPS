import React, { useState } from 'react';
import '../styles/dashboard.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      id="sidebar"
      className={expanded ? 'expand' : ''}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="d-flex">
        <button
          className="toggle-btn"
          onClick={() => setExpanded(prev => !prev)}
        >
          <i className="lni lni-grid-alt"></i>
        </button>
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link text-decoration-none">
            Home
          </Link>
        </div>
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <Link to="/list" className="sidebar-link text-decoration-none">
            <i className="lni lni-list"></i>
            <span>Lista de Piscinas</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="#" className="sidebar-link text-decoration-none">
            <i className="lni lni-star"></i>
            <span>Favoritos</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="#" className="sidebar-link text-decoration-none">
            <i className="lni lni-envelope"></i>
            <span>Contáctanos</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <Link to="#" className="sidebar-link text-decoration-none">
          <i className="lni lni-exit"></i>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

