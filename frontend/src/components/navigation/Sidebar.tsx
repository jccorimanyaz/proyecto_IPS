import { useState } from 'react';
import '../../styles/dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    dispatch(logout());
    navigate('/login');
  };

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
          onClick={() => setExpanded((prev) => !prev)}
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
            <span>Piscinas</span>
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

        {user && (user.role === 'admin' || user.role === 'inspector') && (
          <li className="sidebar-item">
            <Link to="/admin/dashboard" className="sidebar-link text-decoration-none">
              <i className="lni lni-cog"></i>
              <span>Administrador</span>
            </Link>
          </li>
        )}
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link text-decoration-none">
          <i className="lni lni-exit"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

