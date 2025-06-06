import React, { useState, useEffect } from 'react';
import { playerService } from '../services/api';

const Team = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState('all');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await playerService.getAll();
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = selectedPosition === 'all' 
    ? players 
    : players.filter(player => player.position === selectedPosition);

  const positions = ['all', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  if (loading) {
    return <div className="loading">Loading team...</div>;
  }

  return (
    <div className="team-page">
      <div className="container">
        <header className="page-header">
          <h1>Our Team</h1>
          <p>Meet the talented players who represent FC Thunder</p>
        </header>

        <div className="position-filter">
          {positions.map(position => (
            <button
              key={position}
              className={`filter-btn ${selectedPosition === position ? 'active' : ''}`}
              onClick={() => setSelectedPosition(position)}
            >
              {position === 'all' ? 'All Players' : position}
            </button>
          ))}
        </div>

        <div className="players-grid">
          {filteredPlayers.map(player => (
            <div key={player._id} className="player-card">
              <div className="player-image">
                {player.photo ? (
                  <img src={`http://localhost:5000${player.photo}`} alt={player.name} />
                ) : (
                  <div className="placeholder-image">
                    <span>{player.name.charAt(0)}</span>
                  </div>
                )}
                <div className="jersey-number">{player.jerseyNumber}</div>
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <p className="position">{player.position}</p>
                <div className="player-details">
                  <span>Age: {player.age}</span>
                  {player.height && <span>Height: {player.height}</span>}
                  {player.weight && <span>Weight: {player.weight}</span>}
                </div>
                {player.bio && (
                  <p className="player-bio">{player.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="no-players">
            <p>No players found for the selected position.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;