import { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieDetail from './components/MovieDetail';
import FavoritesModal from './components/FavoritesModal';
import FilterPanel from './components/FilterPanel';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useFavorites } from './hooks/useFavorites';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useFilters } from './hooks/useFilters';
import './App.css';

function App() {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const { 
    searchResults,
    trendingMovies,
    displayMovies,
    isLoading, 
    isSearching,
    isLoadingMore,
    hasMoreResults,
    error, 
    searchTerm, 
    setSearchTerm,
    showAllResults,
    handleSeeAllResults,
    loadMoreResults,
    totalResults
  } = useMovieSearch();

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesCount
  } = useFavorites();

  // Use filters hook on the current display movies
  const {
    filters,
    setFilters,
    filteredMovies,
    hasActiveFilters,
    resetFilters
  } = useFilters(displayMovies);

  // Enable infinite scroll when showing all results
  useInfiniteScroll({
    hasMore: hasMoreResults,
    isLoading: isLoadingMore,
    onLoadMore: loadMoreResults,
    threshold: 300
  });

  const handleMovieClick = (imdbId: string) => {
    setSelectedMovieId(imdbId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  const getSectionTitle = () => {
    if (!searchTerm) {
      return hasActiveFilters ? "Filtered Movies" : "Popular Movies";
    } else if (showAllResults) {
      return hasActiveFilters ? "Filtered Search Results" : "Search Results";
    }
    return hasActiveFilters ? "Filtered Movies" : "Popular Movies";
  };

  const getSectionSubtitle = () => {
    const baseMovieCount = displayMovies.length;
    const filteredCount = filteredMovies.length;
    
    if (!searchTerm) {
      if (hasActiveFilters) {
        return `Showing ${filteredCount} of ${baseMovieCount} trending movies`;
      }
      return "Trending movies right now";
    } else if (showAllResults) {
      const resultCount = searchResults.length;
      const totalCount = totalResults;
      if (hasActiveFilters) {
        return `Showing ${filteredCount} of ${resultCount} filtered results for "${searchTerm}"`;
      }
      return `Showing ${resultCount} of ${totalCount} movies for "${searchTerm}"`;
    }
    
    if (hasActiveFilters) {
      return `Showing ${filteredCount} of ${baseMovieCount} trending movies`;
    }
    return "Trending movies right now";
  };

  const shouldShowSection = () => {
    // Show section when we have display movies, favorites, or when loading/error states apply
    return displayMovies.length > 0 || favorites.length > 0 || isLoading || error;
  };

  const getDisplayMovies = () => {
    // Use filtered movies if filters are active, otherwise use display movies from hook
    return hasActiveFilters ? filteredMovies : displayMovies;
  };

  const getLoadingState = () => {
    // Show loading when initially loading trending movies or when no display movies
    return isLoading && displayMovies.length === 0;
  };

  const getErrorState = () => {
    // Show error when there's an error and no display movies
    return error && displayMovies.length === 0 ? error : null;
  };

  const handleFavoritesClick = () => {
    setIsFavoritesModalOpen(true);
  };

  const handleFilterClick = () => {
    setIsFilterPanelOpen(true);
  };

  const handleTitleClick = () => {
    // Return to home page and clear filters
    setSearchTerm('');
    setIsFavoritesModalOpen(false);
    setIsModalOpen(false);
    setSelectedMovieId(null);
    setIsFilterPanelOpen(false);
    resetFilters();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTitleClick();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Count selected genres
    if (filters.genres.length > 0) {
      count += filters.genres.length;
    }
    
    // Check if year range is different from default (assuming default is full range)
    const currentYear = new Date().getFullYear();
    if (filters.yearRange.min > 1900 || filters.yearRange.max < currentYear) {
      count += 1;
    }
    
    // Check if rating range is different from default (0-10)
    if (filters.ratingRange.min > 0 || filters.ratingRange.max < 10) {
      count += 1;
    }
    
    return count;
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="app-header" role="banner">
        <div className="header-content">
          <div className="header-left">
            <h1 
              className="app-title" 
              onClick={handleTitleClick} 
              onKeyDown={handleTitleKeyDown}
              tabIndex={0} 
              role="button" 
              aria-label="Go to home page"
            >
              <span aria-hidden="true">🎬</span> Movie Explorer
            </h1>
          </div>
          
          <div className="header-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchResults={searchResults}
              isLoading={isSearching}
              onSeeAllResults={handleSeeAllResults}
              showAllResults={showAllResults}
              totalResults={totalResults}
              onMovieClick={handleMovieClick}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>
          
          <div className="header-right">
            <button 
              className={`filter-btn ${hasActiveFilters ? 'active' : ''}`} 
              onClick={handleFilterClick}
              aria-label={`Open filters ${hasActiveFilters ? `(${getActiveFiltersCount()} active)` : ''}`}
              aria-expanded={isFilterPanelOpen}
              aria-haspopup="dialog"
            >
              <TuneIcon className="filter-icon" aria-hidden="true" />
              <span className="filter-text">Filters</span>
              {hasActiveFilters && (
                <span className="filter-count" aria-label={`${getActiveFiltersCount()} active filters`}>
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            <button 
              className="favorites-btn" 
              onClick={handleFavoritesClick}
              aria-label={`Open favorites (${favoritesCount} saved)`}
              aria-expanded={isFavoritesModalOpen}
              aria-haspopup="dialog"
            >
              <span className="favorites-icon" aria-hidden="true">❤️</span>
              <span className="favorites-text">Favorites</span>
              <span className="favorites-count" aria-label={`${favoritesCount} favorites`}>
                {favoritesCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="app-main" role="main" aria-label="Movie content" id="main-content">
        <div className={`content-section ${searchTerm && !showAllResults ? 'dimmed' : ''}`}>
          {shouldShowSection() && (
            <>
              <div className="section-header">
                <h2 id="main-heading">{getSectionTitle()}</h2>
                <p id="section-description">{getSectionSubtitle()}</p>
                {hasActiveFilters && (
                  <button 
                    className="clear-filters-btn" 
                    onClick={resetFilters}
                    aria-label="Clear all active filters"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              <MovieGrid 
                movies={getDisplayMovies()}
                isLoading={getLoadingState()}
                isLoadingMore={isLoadingMore}
                hasMoreResults={hasMoreResults && showAllResults}
                error={getErrorState()}
                onLoadMore={loadMoreResults}
                showLoadMoreButton={false} // We're using automatic infinite scroll
                onMovieClick={handleMovieClick}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
              
              {/* Show trending section divider when showing search results */}
              {showAllResults && searchResults.length > 0 && trendingMovies.length > 0 && (
                <>
                  <div className="section-divider">
                    <div className="divider-line"></div>
                    <span className="divider-text">Also trending</span>
                    <div className="divider-line"></div>
                  </div>
                  
                  <MovieGrid 
                    movies={hasActiveFilters ? trendingMovies.filter(movie => {
                      // Apply same filters to trending movies
                      // Genre filter
                      if (filters.genres.length > 0) {
                        const movieGenres = movie.Genre && movie.Genre !== 'N/A' 
                          ? movie.Genre.split(', ').map(g => g.trim())
                          : [];
                        
                        const hasMatchingGenre = filters.genres.some(filterGenre =>
                          movieGenres.some(movieGenre => 
                            movieGenre.toLowerCase().includes(filterGenre.toLowerCase())
                          )
                        );
                        
                        if (!hasMatchingGenre) return false;
                      }

                      // Year filter
                      const movieYear = parseInt(movie.Year);
                      if (!isNaN(movieYear)) {
                        if (movieYear < filters.yearRange.min || movieYear > filters.yearRange.max) {
                          return false;
                        }
                      }

                      // Rating filter
                      if (movie.imdbRating && movie.imdbRating !== 'N/A') {
                        const movieRating = parseFloat(movie.imdbRating);
                        if (!isNaN(movieRating)) {
                          if (movieRating < filters.ratingRange.min || movieRating > filters.ratingRange.max) {
                            return false;
                          }
                        }
                      }

                      return true;
                    }) : trendingMovies}
                    isLoading={false}
                    isLoadingMore={false}
                    hasMoreResults={false}
                    error={null}
                    onLoadMore={() => {}}
                    showLoadMoreButton={false}
                    onMovieClick={handleMovieClick}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>
          Powered by{' '}
          <a 
            href="http://www.omdbapi.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="OMDb API - Opens in new tab"
          >
            OMDb API (IMDB Data)
          </a>
        </p>
      </footer>

      <MovieDetail
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imdbId={selectedMovieId}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onMovieClick={handleMovieClick}
        onToggleFavorite={toggleFavorite}
      />

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        movies={displayMovies}
      />
    </div>
  );
}

export default App;
