import React, { useState, useEffect } from 'react';
import { newsService } from '../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsService.getAll();
      const publishedNews = response.data.filter(article => article.published);
      setNews(publishedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'match', 'player', 'club', 'general'];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  if (loading) {
    return <div className="loading">Se incarca articolele...</div>;
  }

  return (
    <div className="news-page">
      <div className="container">
        <header className="page-header">
          <h1>Ultimele Stiri</h1>
          <p>Ramai la curent cu ultimele stiri si anunturi ale AS Dacia</p>
        </header>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All News' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="news-grid">
          {filteredNews.map(article => (
            <article key={article._id} className="news-article">
              {article.image && (
                <div className="article-image">
                  <img src={`http://localhost:5000${article.image}`} alt={article.title} />
                </div>
              )}
              
              <div className="article-content">
                <div className="article-category">
                  <span className={`category-badge ${article.category}`}>
                    {article.category}
                  </span>
                </div>
                
                <h2 className="article-title">{article.title}</h2>
                
                <div className="article-meta">
                  <span className="author">By {article.author}</span>
                  <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="article-excerpt">
                  <p>{article.content.substring(0, 200)}...</p>
                </div>
                
                <button className="read-more-btn">Citeste mai departe</button>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && news.length > 0 && (
          <div className="no-news">
            <p>Niciun articol in categoria {selectedCategory}</p>
          </div>
        )}

        {news.length === 0 && (
          <div className="no-news">
            <p>Niciun articol disponibil.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;