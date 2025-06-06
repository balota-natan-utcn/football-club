import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService, matchService } from '../services/api';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [newsRes, matchesRes] = await Promise.all([
        newsService.getAll(),
        matchService.getAll()
      ]);

      setLatestNews(newsRes.data.slice(0, 3));
      
      const now = new Date();
      const upcoming = matchesRes.data
        .filter(match => new Date(match.date) > now && match.status === 'upcoming')
        .slice(0, 3);
      
      const recent = matchesRes.data
        .filter(match => match.status === 'completed')
        .slice(0, 3);

      setUpcomingMatches(upcoming);
      setRecentResults(recent);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FC Thunder</h1>
          <p>Your Local Football Champions</p>
          <div className="hero-actions">
            <Link to="/matches" className="btn btn-primary">View Matches</Link>
            <Link to="/team" className="btn btn-outline">Meet the Team</Link>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="home-section">
          <h2>Latest News</h2>
          <div className="news-grid">
            {latestNews.map(article => (
              <div key={article._id} className="news-card">
                {article.image && (
                  <img src={`http://localhost:5000${article.image}`} alt={article.title} />
                )}
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p>{article.content.substring(0, 150)}...</p>
                  <div className="news-meta">
                    <span>By {article.author}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/news" className="btn btn-secondary">View All News</Link>
        </section>

        <section className="home-section">
          <h2>Upcoming Matches</h2>
          <div className="matches-list">
            {upcomingMatches.map(match => (
              <div key={match._id} className="match-card">
                <div className="match-date">
                  <span className="date">{new Date(match.date).toLocaleDateString()}</span>
                  <span className="time">{match.time}</span>
                </div>
                <div className="match-teams">
                  <span className="home-team">FC Thunder</span>
                  <span className="vs">vs</span>
                  <span className="away-team">{match.opponent}</span>
                </div>
                <div className="match-venue">{match.venue}</div>
              </div>
            ))}
          </div>
          <Link to="/matches" className="btn btn-secondary">View All Matches</Link>
        </section>

        <section className="home-section">
          <h2>Recent Results</h2>
          <div className="results-list">
            {recentResults.map(match => (
              <div key={match._id} className="result-card">
                <div className="result-teams">
                  <span className="home-team">FC Thunder</span>
                  <span className="score">
                    {match.isHome ? match.homeScore : match.awayScore} - {match.isHome ? match.awayScore : match.homeScore}
                  </span>
                  <span className="away-team">{match.opponent}</span>
                </div>
                <div className="result-date">{new Date(match.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          <Link to="/results" className="btn btn-secondary">View All Results</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;