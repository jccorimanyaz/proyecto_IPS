import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <nav className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: '280px' }}>
    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span className="fs-4">Admin Panel</span>
    </a>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `nav-link text-white${isActive ? ' active' : ''}`
          }
        >
          <i className="bi bi-graph-up me-2" /> Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
            to="/admin/list"
            className={({ isActive }) => 
                `nav-link text-white${isActive ? ' active' : ''}`
            }
        >
          <i className="bi bi-table me-2" /> Gestionar Piscinas
        </NavLink>
      </li>
    </ul>
    <hr />
  </nav>
);

export default Sidebar;