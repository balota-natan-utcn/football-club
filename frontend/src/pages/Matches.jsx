import React, { useState, useEffect } from 'react';
import { matchService } from '../services/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchService.getAll();
      const now = new Date();
      const upcomingMatches = response.data
        .filter(match => new Date(match.date) > now && match.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setMatches(upcomingMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Se incarca meciurile...</div>;
  }

  return (
    <div className="matches-page">
      <div className="container">
        <header className="page-header">
          <h1>Meciuri Viitoare</h1>
          <p>Nu rata urmatoarele meciuri</p>
        </header>

        <div className="matches-grid">
          {matches.map(match => (
            <div key={match._id} className="match-card-detailed">
              <div className="match-header">
                <div className="match-date">
                  <span className="day">{new Date(match.date).getDate()}</span>
                  <span className="month">{new Date(match.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="match-time">{match.time}</div>
              </div>
              
              <div className="match-teams">
                <div className="team home-team">
                  <div className="team-logo">⚽</div>
                  <span>FC Thunder</span>
                </div>
                
                <div className="vs-section">
                  <span className="vs">VS</span>
                </div>
                
                <div className="team away-team">
                  <div className="team-logo">⚽</div>
                  <span>{match.opponent}</span>
                </div>
              </div>
              
              <div className="match-venue">
                <span>📍 {match.venue}</span>
              </div>
              
              {match.description && (
                <div className="match-description">
                  <p>{match.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="no-matches">
            <p>Niciun meci programat curand.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;