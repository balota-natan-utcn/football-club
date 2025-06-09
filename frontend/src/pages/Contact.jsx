import React, { useState } from 'react';
import { contactService } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactService.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Eroare la trimiterea mesajului');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <header className="page-header">
          <h1>Contacteaza-ne</h1>
          <p>Ia legatura cu AS Dacia</p>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-section">
              <h3>Adresa</h3>
              <p>Teren Supur<br />
                 12 Nustiu Strada<br />
                 Supuru de Jos, 447300</p>
            </div>
            
            <div className="info-section">
              <h3>Informatii Contact</h3>
              <p>Telefon: 0777437229<br />
                 Email: info@asdacia.com</p>
            </div>
            
            <div className="info-section">
              
            </div>
          </div>

          <div className="contact-form-container">
            {success ? (
              <div className="success-message">
                <h3>Mesaj trimis cu succes!</h3>
                <p>Iti multumim pentru ca ne contactezi. Iti raspundem curand.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSuccess(false)}
                >
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Trimite-ne un mesaj</h3>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Nume</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subiect</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mesaj</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Se trimite...' : 'Trimite mesaj'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;