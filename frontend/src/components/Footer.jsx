import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FC Thunder</h3>
            <p>Your local football team since 1985. Bringing passion and excellence to the pitch.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/team">Team</a></li>
              <li><a href="/matches">Matches</a></li>
              <li><a href="/news">News</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Thunder Stadium<br />
               123 Football Street<br />
               Sportsville, SP 12345<br />
               Phone: (555) 123-4567</p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 FC Thunder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;