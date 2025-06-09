import React, { useState, useEffect } from 'react';
import { matchService } from '../services/api';

const Results = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await matchService.getAll();
      const completedMatches = response.data
        .filter(match => match.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
      
      setMatches(completedMatches);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchResult = (match) => {
    if (!match.isHome) {
      return {
        ourScore: match.awayScore,
        theirScore: match.homeScore,
        result: match.awayScore > match.homeScore ? 'win' : 
                match.awayScore < match.homeScore ? 'loss' : 'draw'
      };
    } else {
      return {
        ourScore: match.homeScore,
        theirScore: match.awayScore,
        result: match.homeScore > match.awayScore ? 'win' : 
                match.homeScore < match.awayScore ? 'loss' : 'draw'
      };
    }
  };

  const filteredMatches = selectedFilter === 'all' 
    ? matches 
    : matches.filter(match => {
        const result = getMatchResult(match);
        return result.result === selectedFilter;
      });

  const getTeamStats = () => {
    const stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
    
    matches.forEach(match => {
      const result = getMatchResult(match);
      stats.goalsFor += result.ourScore || 0;
      stats.goalsAgainst += result.theirScore || 0;
      
      if (result.result === 'win') stats.wins++;
      else if (result.result === 'draw') stats.draws++;
      else if (result.result === 'loss') stats.losses++;
    });
    
    return stats;
  };

  const stats = getTeamStats();

  if (loading) {
    return <div className="loading">Se incarca rezultate...</div>;
  }

  return (
    <div className="results-page">
      <div className="container">
        <header className="page-header">
          <h1>Rezultate Meciuri</h1>
          <p>Performance si Statistici Recente</p>
        </header>

        {matches.length > 0 && (
          <div className="team-stats">
            <h2>Season Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{matches.length}</span>
                <span className="stat-label">Meciuri Jucate</span>
              </div>
              <div className="stat-item wins">
                <span className="stat-number">{stats.wins}</span>
                <span className="stat-label">Victorii</span>
              </div>
              <div className="stat-item draws">
                <span className="stat-number">{stats.draws}</span>
                <span className="stat-label">Egaluri</span>
              </div>
              <div className="stat-item losses">
                <span className="stat-number">{stats.losses}</span>
                <span className="stat-label">Infrangeri</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.goalsFor}</span>
                <span className="stat-label">Goluri Inscrise</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.goalsAgainst}</span>
                <span className="stat-label">Goluri Primite</span>
              </div>
            </div>
          </div>
        )}

        <div className="results-filter">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Results
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'win' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('win')}
          >
            Wins
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'draw' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('draw')}
          >
            Draws
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'loss' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('loss')}
          >
            Losses
          </button>
        </div>

        <div className="results-list">
          {filteredMatches.map(match => {
            const result = getMatchResult(match);
            return (
              <div key={match._id} className={`result-card ${result.result}`}>
                <div className="match-date">
                  <span className="date">{new Date(match.date).toLocaleDateString()}</span>
                  <span className="venue">{match.venue}</span>
                </div>
                
                <div className="match-teams">
                  <div className="team home-team">
                    <span className="team-name">
                      {match.isHome ? 'FC Thunder' : match.opponent}
                    </span>
                  </div>
                  
                  <div className="score">
                    <span className={`score-number ${result.result}`}>
                      {match.isHome ? match.homeScore : match.awayScore}
                    </span>
                    <span className="score-separator">-</span>
                    <span className={`score-number ${result.result}`}>
                      {match.isHome ? match.awayScore : match.homeScore}
                    </span>
                  </div>
                  
                  <div className="team away-team">
                    <span className="team-name">
                      {match.isHome ? match.opponent : 'AS Dacia'}
                    </span>
                  </div>
                </div>
                
                <div className="result-badge">
                  <span className={`badge ${result.result}`}>
                    {result.result.toUpperCase()}
                  </span>
                </div>
                
                {match.description && (
                  <div className="match-description">
                    <p>{match.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredMatches.length === 0 && matches.length > 0 && (
          <div className="no-results">
            <p>Niciun rezultat gasit.</p>
          </div>
        )}

        {matches.length === 0 && (
          <div className="no-results">
            <p>Niciun rezultat disponibil.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;