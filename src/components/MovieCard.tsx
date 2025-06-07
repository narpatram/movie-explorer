import React from 'react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: (imdbId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie.imdbID);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card onClick
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster">
        <img
          src={getImageUrl(movie.Poster)}
          alt={movie.Title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=🎬+No+Image';
          }}
        />
        
        {/* Favorite Star Button */}
        <button 
          className={`favorite-btn ${isFavorite ? 'favorite-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="favorite-icon">
            {isFavorite ? '★' : '☆'}
          </span>
        </button>
        
        <div className="movie-overlay">
          <div className="movie-overlay-content">
            <span className="view-details">View Details</span>
          </div>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        
        <div className="movie-details">
          <span className="movie-year">{movie.Year}</span>
          {movie.imdbRating && (
            <span className="movie-rating">
              ⭐ {movie.imdbRating}
            </span>
          )}
        </div>
        
        {movie.Genre && (
          <p className="movie-genre">{movie.Genre}</p>
        )}
        
        {movie.Plot && (
          <p className="movie-overview">{movie.Plot}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard; 