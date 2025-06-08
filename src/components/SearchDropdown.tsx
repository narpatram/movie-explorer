import React from 'react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import './SearchDropdown.css';

interface SearchDropdownProps {
  movies: Movie[];
  searchTerm: string;
  isLoading: boolean;
  isVisible: boolean;
  onSeeAllResults: () => void;
  onClose: () => void;
  totalResults?: number;
  onMovieClick?: (imdbId: string) => void;
  isFavorite?: (imdbId: string) => boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  movies,
  searchTerm,
  isLoading,
  isVisible,
  onSeeAllResults,
  onClose,
  totalResults = 0,
  onMovieClick,
  isFavorite,
  onToggleFavorite
}) => {
  if (!isVisible) return null;

  const previewMovies = movies.slice(0, 6); // Show only first 6 movies in dropdown

  // Prevent event bubbling to maintain input focus
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSeeAllClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSeeAllResults();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMovieClick = (e: React.MouseEvent, imdbId: string) => {
    e.stopPropagation();
    if (onMovieClick) {
      onMovieClick(imdbId);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <div className="search-dropdown">
      <div className="search-dropdown-content" onClick={handleDropdownClick}>
        {isLoading ? (
          <div className="dropdown-loading">
            <div className="loading-spinner"></div>
            <span>Searching movies...</span>
          </div>
        ) : (
          <>
            {previewMovies.length > 0 ? (
              <>
                
                <div className="dropdown-results">
                  {previewMovies.map((movie) => (
                    <div 
                      key={movie.imdbID} 
                      className="dropdown-movie-item"
                      onClick={(e) => handleMovieClick(e, movie.imdbID)}
                    >
                      <div className="dropdown-movie-poster">
                        <img
                          src={getImageUrl(movie.Poster)}
                          alt={movie.Title}
                          loading="lazy"
                                      onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjMwIiB5PSI0NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPvCfjqw8L3RleHQ+Cjwvc3ZnPg==';
            }}
                        />
                      </div>
                      <div className="dropdown-movie-info">
                        <h4 className="dropdown-movie-title">{movie.Title}</h4>
                        <div className="dropdown-movie-details">
                          <span className="dropdown-movie-year">{movie.Year}</span>
                          {movie.imdbRating && (
                            <span className="dropdown-movie-rating">
                              ⭐ {movie.imdbRating}
                            </span>
                          )}
                        </div>
                        {movie.Genre && (
                          <p className="dropdown-movie-genre">{movie.Genre}</p>
                        )}
                      </div>
                      <div className="dropdown-movie-actions">
                        <button 
                          className={`dropdown-favorite-btn ${isFavorite && isFavorite(movie.imdbID) ? 'favorite-active' : ''}`}
                          onClick={(e) => handleFavoriteClick(e, movie)}
                          aria-label={isFavorite && isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFavorite && isFavorite(movie.imdbID) ? '★' : '☆'}
                        </button>
                        <div className="dropdown-movie-action">
                          <span className="view-details-text">View Details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {movies.length > 6 && (
                  <div className="dropdown-see-all">
                    <button onClick={handleSeeAllClick} className="see-all-btn">
                      <span>See all results for "{searchTerm}"</span>
                      <span className="results-count">
                        ({totalResults > 0 ? totalResults : movies.length} movies)
                      </span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="dropdown-no-results">
                <div className="no-results-icon">🎬</div>
                <h4>No movies found</h4>
                <p>Try searching for a different movie title</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Backdrop to close dropdown */}
      <div className="search-dropdown-backdrop" onClick={handleBackdropClick}></div>
    </div>
  );
};

export default SearchDropdown; 