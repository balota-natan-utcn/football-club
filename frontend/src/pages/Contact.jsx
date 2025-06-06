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
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <header className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with FC Thunder</p>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-section">
              <h3>Stadium Address</h3>
              <p>Thunder Stadium<br />
                 123 Football Street<br />
                 Sportsville, SP 12345</p>
            </div>
            
            <div className="info-section">
              <h3>Contact Information</h3>
              <p>Phone: (555) 123-4567<br />
                 Email: info@fcthunder.com<br />
                 Fax: (555) 123-4568</p>
            </div>
            
            <div className="info-section">
              <h3>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                 Saturday: 10:00 AM - 4:00 PM<br />
                 Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-form-container">
            {success ? (
              <div className="success-message">
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send us a Message</h3>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Name</label>
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
                  <label htmlFor="subject">Subject</label>
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
                  <label htmlFor="message">Message</label>
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
                  {loading ? 'Sending...' : 'Send Message'}
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