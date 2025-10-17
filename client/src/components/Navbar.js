import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-3 fw-bold text-primary me-2">🧵</span>
          <span className="fs-5 fw-semibold text-dark">Shunmugam Textiles</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <div className="d-flex align-items-center me-3">
                  <FaUser className="text-muted me-2" />
                  <span className="small text-dark">{user?.name || 'User'}</span>
                  <span className="small text-muted ms-1">({user?.role})</span>
                </div>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/supervisor'}
                  className="btn btn-primary btn-sm me-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center"
                >
                  <FaSignOutAlt className="me-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <FaSignInAlt className="me-1" />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 