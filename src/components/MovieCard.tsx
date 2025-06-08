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
    <article 
      className="movie-card" 
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.Title} (${movie.Year})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="movie-poster">
        <img
          src={getImageUrl(movie.Poster)}
          alt={`Movie poster for ${movie.Title}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=🎬+No+Image';
            e.currentTarget.alt = `No poster available for ${movie.Title}`;
          }}
        />
        
        {/* Favorite Star Button */}
        <button 
          className={`favorite-btn ${isFavorite ? 'favorite-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
          tabIndex={0}
        >
          <span className="favorite-icon" aria-hidden="true">
            {isFavorite ? '★' : '☆'}
          </span>
        </button>
        
        <div className="movie-overlay" aria-hidden="true">
          <div className="movie-overlay-content">
            <span className="view-details">View Details</span>
          </div>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        
        <div className="movie-details">
          <span className="movie-year" aria-label={`Released in ${movie.Year}`}>{movie.Year}</span>
          {movie.imdbRating && (
            <span className="movie-rating" aria-label={`IMDB rating ${movie.imdbRating} out of 10`}>
              <span aria-hidden="true">⭐</span> {movie.imdbRating}
            </span>
          )}
        </div>
        
        {movie.Genre && (
          <p className="movie-genre" aria-label={`Genres: ${movie.Genre}`}>{movie.Genre}</p>
        )}
        
        {movie.Plot && (
          <p className="movie-overview">{movie.Plot}</p>
        )}
      </div>
    </article>
  );
};

export default MovieCard; 