import React from 'react';
import type { Movie } from '../types/movie';
import './FilterPanel.css';

export interface FilterOptions {
  genres: string[];
  yearRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  movies: Movie[]; // For extracting available genres
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  movies
}) => {
  // Common genre fallbacks when no genre data is available
  const commonGenres = React.useMemo(() => [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
    'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ], []);

  // Extract unique genres from movies
  const availableGenres = React.useMemo(() => {
    const genreSet = new Set<string>();
    
    // Add genres from movies if available
    movies.forEach(movie => {
      if (movie.Genre && movie.Genre !== 'N/A') {
        movie.Genre.split(', ').forEach(genre => {
          genreSet.add(genre.trim());
        });
      }
    });
    
    // If no genres found from movies, use common genres as fallback
    if (genreSet.size === 0) {
      commonGenres.forEach(genre => genreSet.add(genre));
    }
    
    console.log('Available genres:', Array.from(genreSet));
    console.log('Movies with genre data:', movies.filter(m => m.Genre && m.Genre !== 'N/A').length);
    
    return Array.from(genreSet).sort();
  }, [movies, commonGenres]);

  // Get year range from movies
  const yearRange = React.useMemo(() => {
    const years = movies
      .map(movie => parseInt(movie.Year))
      .filter(year => !isNaN(year));
    
    return {
      min: Math.min(...years, 1900),
      max: Math.max(...years, new Date().getFullYear())
    };
  }, [movies]);

  // React hooks must be called before any early returns
  if (!isOpen) return null;

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    
    onFiltersChange({
      ...filters,
      genres: newGenres
    });
  };

  const handleYearRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      yearRange: { min, max }
    });
  };

  const handleRatingRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      ratingRange: { min, max }
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      genres: [],
      yearRange: { min: yearRange.min, max: yearRange.max },
      ratingRange: { min: 0, max: 10 }
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="filter-panel-overlay" onClick={handleBackdropClick}>
      <div className="filter-panel">
        <div className="filter-panel-header">
          <h3>Filter Movies</h3>
          <button className="filter-panel-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="filter-panel-content">
          {/* Genre Filter */}
          <div className="filter-section">
            <h4>Genres</h4>
            {availableGenres.length === 0 ? (
              <p className="no-genres-message">
                No genre data available. Try searching for movies to see genre options.
              </p>
            ) : (
              <div className="genre-grid">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    className={`genre-tag ${filters.genres.includes(genre) ? 'active' : ''}`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Range Filter */}
          <div className="filter-section">
            <h4>Release Year</h4>
            <div className="range-inputs">
              <div className="range-input-group">
                <label>From</label>
                <input
                  type="number"
                  min={yearRange.min}
                  max={yearRange.max}
                  value={filters.yearRange.min}
                  onChange={(e) => handleYearRangeChange(parseInt(e.target.value), filters.yearRange.max)}
                  className="range-input"
                />
              </div>
              <div className="range-separator">-</div>
              <div className="range-input-group">
                <label>To</label>
                <input
                  type="number"
                  min={yearRange.min}
                  max={yearRange.max}
                  value={filters.yearRange.max}
                  onChange={(e) => handleYearRangeChange(filters.yearRange.min, parseInt(e.target.value))}
                  className="range-input"
                />
              </div>
            </div>
            <div className="range-slider">
              <input
                type="range"
                min={yearRange.min}
                max={yearRange.max}
                value={filters.yearRange.min}
                onChange={(e) => handleYearRangeChange(parseInt(e.target.value), filters.yearRange.max)}
                className="slider slider-min"
              />
              <input
                type="range"
                min={yearRange.min}
                max={yearRange.max}
                value={filters.yearRange.max}
                onChange={(e) => handleYearRangeChange(filters.yearRange.min, parseInt(e.target.value))}
                className="slider slider-max"
              />
            </div>
          </div>

          {/* Rating Range Filter */}
          <div className="filter-section">
            <h4>IMDB Rating</h4>
            <div className="range-inputs">
              <div className="range-input-group">
                <label>Min</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingRange.min}
                  onChange={(e) => handleRatingRangeChange(parseFloat(e.target.value), filters.ratingRange.max)}
                  className="range-input"
                />
              </div>
              <div className="range-separator">-</div>
              <div className="range-input-group">
                <label>Max</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingRange.max}
                  onChange={(e) => handleRatingRangeChange(filters.ratingRange.min, parseFloat(e.target.value))}
                  className="range-input"
                />
              </div>
            </div>
            <div className="range-slider">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.min}
                onChange={(e) => handleRatingRangeChange(parseFloat(e.target.value), filters.ratingRange.max)}
                className="slider slider-min"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.ratingRange.max}
                onChange={(e) => handleRatingRangeChange(filters.ratingRange.min, parseFloat(e.target.value))}
                className="slider slider-max"
              />
            </div>
          </div>
        </div>

        <div className="filter-panel-footer">
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear All Filters
          </button>
          <button className="apply-filters-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 