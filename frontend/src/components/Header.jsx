import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>FC Thunder</h1>
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/team" onClick={() => setIsMenuOpen(false)}>Team</Link>
            <Link to="/matches" onClick={() => setIsMenuOpen(false)}>Matches</Link>
            <Link to="/results" onClick={() => setIsMenuOpen(false)}>Results</Link>
            <Link to="/news" onClick={() => setIsMenuOpen(false)}>News</Link>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
            <Link to="/sponsors" onClick={() => setIsMenuOpen(false)}>Sponsors</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;