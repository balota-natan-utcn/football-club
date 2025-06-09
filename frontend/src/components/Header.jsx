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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>FC Thunder</h1>
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={closeMenu}>Acasa</Link>
            <Link to="/team" onClick={closeMenu}>Echipa</Link>
            <Link to="/matches" onClick={closeMenu}>Meciuri</Link>
            <Link to="/results" onClick={closeMenu}>Rezultate</Link>
            <Link to="/news" onClick={closeMenu}>Stiri</Link>
            <Link to="/gallery" onClick={closeMenu}>Galerie</Link>
            <Link to="/sponsors" onClick={closeMenu}>Sponsori</Link>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </nav>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="btn btn-secondary">Deconectare</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">Logare</Link>
                <Link to="/register" className="btn btn-primary">Inregistrare</Link>
              </div>
            )}
          </div>

          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;