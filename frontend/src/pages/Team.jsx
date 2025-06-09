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
      console.error('Eroare la incarcarea jucatorilor:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = selectedPosition === 'all' 
    ? players 
    : players.filter(player => player.position === selectedPosition);

  const positions = ['all', 'Portar', 'Fundas', 'Mijlocas', 'Atacant'];

  if (loading) {
    return <div className="loading">Se incarca echipa...</div>;
  }

  return (
    <div className="team-page">
      <div className="container">
        <header className="page-header">
          <h1>Echipa Noastra</h1>
          <p>Jucatorii care reprezinta echipa AS Dacia Supur</p>
        </header>

        <div className="position-filter">
          {positions.map(position => (
            <button
              key={position}
              className={`filter-btn ${selectedPosition === position ? 'active' : ''}`}
              onClick={() => setSelectedPosition(position)}
            >
              {position === 'all' ? 'Toti Jucatorii' : position}
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
                  <span>Varsta: {player.age}</span>
                  {player.height && <span>Inaltime: {player.height}</span>}
                  {player.weight && <span>Greutate: {player.weight}</span>}
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
            <p>Niciun jucator gasit pentru pozitia respectiva.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;