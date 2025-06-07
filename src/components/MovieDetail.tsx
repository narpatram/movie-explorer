import React, { useEffect, useState } from 'react';
import type { Movie } from '../types/movie';
import { getMovieDetails, getImageUrl } from '../services/movieApi';
import './MovieDetail.css';

interface MovieDetailProps {
  isOpen: boolean;
  onClose: () => void;
  imdbId: string | null;
  isFavorite?: (imdbId: string) => boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ isOpen, onClose, imdbId, isFavorite, onToggleFavorite }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && imdbId) {
      fetchMovieDetails(imdbId);
    }
  }, [isOpen, imdbId]);

  const fetchMovieDetails = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movie details');
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleFavoriteClick = () => {
    if (movie && onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  const isMovieFavorite = movie && isFavorite ? isFavorite(movie.imdbID) : false;

  if (!isOpen) return null;

  return (
    <div className="movie-detail-overlay" onClick={handleBackdropClick}>
      <div className="movie-detail-modal">
        <div className="movie-detail-controls">
          {movie && (
            <button 
              className={`movie-detail-favorite ${isMovieFavorite ? 'favorite-active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isMovieFavorite ? '★' : '☆'}
            </button>
          )}
          <button className="movie-detail-close" onClick={handleCloseClick}>
            ✕
          </button>
        </div>

        {isLoading && (
          <div className="movie-detail-loading">
            <div className="detail-spinner"></div>
            <p>Loading movie details...</p>
          </div>
        )}

        {error && (
          <div className="movie-detail-error">
            <div className="error-icon">😞</div>
            <h3>Failed to load movie details</h3>
            <p>{error}</p>
            <button onClick={handleCloseClick} className="error-close-btn">
              Close
            </button>
          </div>
        )}

        {movie && !isLoading && !error && (
          <div className="movie-detail-content">
            <div className="movie-detail-header">
              <div className="movie-detail-poster">
                <img
                  src={getImageUrl(movie.Poster)}
                  alt={movie.Title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=🎬+No+Image';
                  }}
                />
              </div>
              
              <div className="movie-detail-info">
                <h1 className="movie-detail-title">{movie.Title}</h1>
                
                <div className="movie-detail-meta">
                  <span className="movie-year">{movie.Year}</span>
                  <span className="movie-rated">{movie.Rated}</span>
                  <span className="movie-runtime">{movie.Runtime}</span>
                </div>

                <div className="movie-detail-ratings">
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="rating-item">
                      <span className="rating-label">IMDB</span>
                      <span className="rating-value">⭐ {movie.imdbRating}/10</span>
                    </div>
                  )}
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    <div className="additional-ratings">
                      {movie.Ratings.map((rating, index) => (
                        <div key={index} className="rating-item">
                          <span className="rating-label">{rating.Source}</span>
                          <span className="rating-value">{rating.Value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="movie-detail-genres">
                  {movie.Genre && movie.Genre.split(', ').map((genre) => (
                    <span key={genre} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="movie-detail-body">
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="movie-plot">
                  <h3>Plot</h3>
                  <p>{movie.Plot}</p>
                </div>
              )}

              <div className="movie-detail-credits">
                <div className="credits-grid">
                  {movie.Director && movie.Director !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Director</span>
                      <span className="credit-value">{movie.Director}</span>
                    </div>
                  )}
                  
                  {movie.Writer && movie.Writer !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Writer</span>
                      <span className="credit-value">{movie.Writer}</span>
                    </div>
                  )}
                  
                  {movie.Actors && movie.Actors !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Cast</span>
                      <span className="credit-value">{movie.Actors}</span>
                    </div>
                  )}
                  
                  {movie.Language && movie.Language !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Language</span>
                      <span className="credit-value">{movie.Language}</span>
                    </div>
                  )}
                  
                  {movie.Country && movie.Country !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Country</span>
                      <span className="credit-value">{movie.Country}</span>
                    </div>
                  )}
                  
                  {movie.Released && movie.Released !== 'N/A' && (
                    <div className="credit-item">
                      <span className="credit-label">Released</span>
                      <span className="credit-value">{movie.Released}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail; 