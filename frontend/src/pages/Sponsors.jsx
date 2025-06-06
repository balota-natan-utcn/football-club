import React, { useState, useEffect } from 'react';
import { sponsorService } from '../services/api';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await sponsorService.getAll();
      setSponsors(response.data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSponsors = {
    main: sponsors.filter(sponsor => sponsor.tier === 'main'),
    secondary: sponsors.filter(sponsor => sponsor.tier === 'secondary'),
    partner: sponsors.filter(sponsor => sponsor.tier === 'partner')
  };

  if (loading) {
    return <div className="loading">Loading sponsors...</div>;
  }

  return (
    <div className="sponsors-page">
      <div className="container">
        <header className="page-header">
          <h1>Our Sponsors</h1>
          <p>We're proud to partner with these amazing organizations</p>
        </header>

        {groupedSponsors.main.length > 0 && (
          <section className="sponsor-tier">
            <h2>Main Sponsors</h2>
            <div className="sponsors-grid main-sponsors">
              {groupedSponsors.main.map(sponsor => (
                <div key={sponsor._id} className="sponsor-card main">
                  <div className="sponsor-logo">
                    <img 
                      src={`http://localhost:5000${sponsor.logo}`} 
                      alt={sponsor.name}
                    />
                  </div>
                  <div className="sponsor-info">
                    <h3>{sponsor.name}</h3>
                    {sponsor.description && <p>{sponsor.description}</p>}
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="sponsor-link"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {groupedSponsors.secondary.length > 0 && (
          <section className="sponsor-tier">
            <h2>Secondary Sponsors</h2>
            <div className="sponsors-grid secondary-sponsors">
              {groupedSponsors.secondary.map(sponsor => (
                <div key={sponsor._id} className="sponsor-card secondary">
                  <div className="sponsor-logo">
                    <img 
                      src={`http://localhost:5000${sponsor.logo}`} 
                      alt={sponsor.name}
                    />
                  </div>
                  <div className="sponsor-info">
                    <h3>{sponsor.name}</h3>
                    {sponsor.description && <p>{sponsor.description}</p>}
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="sponsor-link"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {groupedSponsors.partner.length > 0 && (
          <section className="sponsor-tier">
            <h2>Partners</h2>
            <div className="sponsors-grid partners">
              {groupedSponsors.partner.map(sponsor => (
                <div key={sponsor._id} className="sponsor-card partner">
                  <div className="sponsor-logo">
                    <img 
                      src={`http://localhost:5000${sponsor.logo}`} 
                      alt={sponsor.name}
                    />
                  </div>
                  <div className="sponsor-info">
                    <h3>{sponsor.name}</h3>
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="sponsor-link"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sponsors.length === 0 && (
          <div className="no-sponsors">
            <p>No sponsors to display at the moment.</p>
          </div>
        )}

        <section className="sponsor-cta">
          <div className="cta-content">
            <h2>Become a Sponsor</h2>
            <p>Join our family of supporters and help FC Thunder achieve greatness. 
               Contact us to learn about sponsorship opportunities.</p>
            <a href="/contact" className="btn btn-primary">Contact Us</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sponsors;