import React, { useState, useEffect } from 'react';
import { galleryService } from '../services/api';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await galleryService.getAll();
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedType === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === selectedType);

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <header className="page-header">
          <h1>Photo & Video Gallery</h1>
          <p>Memories and highlights from FC Thunder</p>
        </header>

        <div className="gallery-filter">
          <button
            className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Media
          </button>
          <button
            className={`filter-btn ${selectedType === 'image' ? 'active' : ''}`}
            onClick={() => setSelectedType('image')}
          >
            Photos
          </button>
          <button
            className={`filter-btn ${selectedType === 'video' ? 'active' : ''}`}
            onClick={() => setSelectedType('video')}
          >
            Videos
          </button>
        </div>

        <div className="gallery-grid">
          {filteredItems.map(item => (
            <div key={item._id} className="gallery-item" onClick={() => openModal(item)}>
              <div className="media-container">
                {item.type === 'image' ? (
                  <img 
                    src={`http://localhost:5000${item.url}`} 
                    alt={item.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="video-thumbnail">
                    <video 
                      src={`http://localhost:5000${item.url}`}
                      poster={item.thumbnail ? `http://localhost:5000${item.thumbnail}` : undefined}
                    />
                    <div className="play-overlay">
                      <span className="play-icon">▶</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="item-info">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <span className="media-type">{item.type}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && galleryItems.length > 0 && (
          <div className="no-items">
            <p>No {selectedType === 'all' ? 'media' : selectedType + 's'} found.</p>
          </div>
        )}

        {galleryItems.length === 0 && (
          <div className="no-items">
            <p>No media items available yet.</p>
          </div>
        )}
      </div>

      {/* Modal for enlarged view */}
      {selectedItem && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            
            <div className="modal-media">
              {selectedItem.type === 'image' ? (
                <img 
                  src={`http://localhost:5000${selectedItem.url}`} 
                  alt={selectedItem.title}
                />
              ) : (
                <video 
                  src={`http://localhost:5000${selectedItem.url}`}
                  controls
                  autoPlay
                />
              )}
            </div>
            
            <div className="modal-info">
              <h3>{selectedItem.title}</h3>
              {selectedItem.description && <p>{selectedItem.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;