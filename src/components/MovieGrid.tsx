import React from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMoreResults?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  showLoadMoreButton?: boolean;
  onMovieClick?: (imdbId: string) => void;
  isFavorite?: (imdbId: string) => boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  isLoading = false, 
  isLoadingMore = false,
  hasMoreResults = false,
  error,
  onLoadMore,
  showLoadMoreButton = false,
  onMovieClick,
  isFavorite,
  onToggleFavorite
}) => {
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-${index}`} className="movie-card-skeleton">
        <div className="skeleton-poster">
          <span className="skeleton-emoji">🎬</span>
        </div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-details">
            <div className="skeleton-year"></div>
            <div className="skeleton-rating"></div>
          </div>
          <div className="skeleton-genre"></div>
        </div>
      </div>
    ));
  };

  if (error) {
    return (
      <div className="movie-grid-error">
        <div className="error-icon">😞</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading && movies.length === 0) {
    return (
      <div className="movie-grid">
        {renderSkeletons(8)}
      </div>
    );
  }

  if (!isLoading && movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <div className="empty-icon">🎭</div>
        <h3>No movies found</h3>
        <p>Try searching for a different movie title</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
            onClick={onMovieClick}
            isFavorite={isFavorite ? isFavorite(movie.imdbID) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        
        {/* Loading more skeletons */}
        {isLoadingMore && renderSkeletons(4)}
      </div>
      
      {/* Load more section */}
      {hasMoreResults && !isLoadingMore && (
        <div className="load-more-section">
          {showLoadMoreButton ? (
            <button 
              className="load-more-btn"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              <span>Load More Movies</span>
              <span className="load-more-icon">🎬</span>
            </button>
          ) : (
            <div className="auto-load-indicator">
              <div className="auto-load-text">Scroll down to load more movies</div>
              <div className="scroll-indicator">↓</div>
            </div>
          )}
        </div>
      )}
      
      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="loading-more-indicator">
          <div className="loading-spinner-large">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading more amazing movies...</p>
        </div>
      )}
      
      {/* End of results indicator */}
      {!hasMoreResults && movies.length > 10 && (
        <div className="end-of-results">
          <div className="end-icon">🎭</div>
          <p>You've reached the end of the results!</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid; 