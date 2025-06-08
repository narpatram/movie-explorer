import React from 'react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: (imdbId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
  onAddToList?: (movie: Movie) => void;
  customActions?: (movie: Movie) => React.ReactNode;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite,
  onAddToList,
  customActions
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

  const handleAddToListClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card onClick
    if (onAddToList) {
      onAddToList(movie);
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
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+OrDwvdGV4dD4KPHRleHQgeD0iMTUwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
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
          {onAddToList && (
            <button 
              className="add-to-list-btn-inline"
              onClick={handleAddToListClick}
                              aria-label={`Add ${movie.Title} to a collection`}
            >
              + Add to Collection
            </button>
          )}
        </div>
        
        {movie.Genre && (
          <p className="movie-genre" aria-label={`Genres: ${movie.Genre}`}>{movie.Genre}</p>
        )}
        
        {movie.Plot && (
          <p className="movie-overview">{movie.Plot}</p>
        )}
        
        {/* Custom actions (for things like remove from list) */}
        {customActions && (
          <div className="movie-actions">
            {customActions(movie)}
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCard; 