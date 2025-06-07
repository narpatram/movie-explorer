import React from 'react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import './FavoritesModal.css';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Movie[];
  onMovieClick: (imdbId: string) => void;
  onToggleFavorite: (movie: Movie) => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onMovieClick,
  onToggleFavorite
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMovieClick = (imdbId: string) => {
    onMovieClick(imdbId);
    onClose(); // Close favorites modal when opening movie detail
  };

  const handleFavoriteClick = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  return (
    <div className="favorites-modal-overlay" onClick={handleBackdropClick}>
      <div className="favorites-modal">
        <div className="favorites-modal-header">
          <h2>My Favorites</h2>
          <button className="favorites-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="favorites-modal-content">
          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <div className="empty-icon">💔</div>
              <h3>No favorites yet</h3>
              <p>Add movies to your favorites by clicking the star icon!</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((movie) => (
                <div 
                  key={movie.imdbID} 
                  className="favorite-movie-card"
                  onClick={() => handleMovieClick(movie.imdbID)}
                >
                  <div className="favorite-movie-poster">
                    <img
                      src={getImageUrl(movie.Poster)}
                      alt={movie.Title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200x300/e5e7eb/6b7280?text=🎬+No+Image';
                      }}
                    />
                    <button 
                      className="favorite-remove-btn"
                      onClick={(e) => handleFavoriteClick(e, movie)}
                      aria-label="Remove from favorites"
                    >
                      ★
                    </button>
                    <div className="favorite-movie-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>
                  <div className="favorite-movie-info">
                    <h4 className="favorite-movie-title">{movie.Title}</h4>
                    <div className="favorite-movie-details">
                      <span className="favorite-movie-year">{movie.Year}</span>
                      {movie.imdbRating && (
                        <span className="favorite-movie-rating">
                          ⭐ {movie.imdbRating}
                        </span>
                      )}
                    </div>
                    {movie.Genre && (
                      <p className="favorite-movie-genre">{movie.Genre}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="favorites-modal-footer">
          <span className="favorites-count">
            {favorites.length} movie{favorites.length !== 1 ? 's' : ''} in favorites
          </span>
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal; 