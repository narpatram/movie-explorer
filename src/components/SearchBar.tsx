import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Movie } from '../types/movie';
import SearchDropdown from './SearchDropdown';
import './SearchBar.css';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchResults: Movie[];
  isLoading?: boolean;
  onSeeAllResults: () => void;
  showAllResults: boolean;
  totalResults?: number;
  onMovieClick?: (imdbId: string) => void;
  isFavorite?: (imdbId: string) => boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange,
  searchResults,
  isLoading = false,
  onSeeAllResults,
  showAllResults,
  totalResults = 0,
  onMovieClick,
  isFavorite,
  onToggleFavorite
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show dropdown when there's a search term and not showing all results
  useEffect(() => {
    setIsDropdownVisible(Boolean(searchTerm && !showAllResults));
  }, [searchTerm, showAllResults]);

  // Close dropdown when clicking outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Only close if clicking completely outside the search bar
      if (searchBarRef.current && !searchBarRef.current.contains(target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
  }, [onSearchChange]);

  const handleSeeAllResults = useCallback(() => {
    setIsDropdownVisible(false);
    onSeeAllResults();
  }, [onSeeAllResults]);

  const handleCloseDropdown = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  const handleMovieClick = useCallback((imdbId: string) => {
    setIsDropdownVisible(false);
    onSearchChange(''); // Clear the search term to return to home screen
    if (onMovieClick) {
      onMovieClick(imdbId);
    }
  }, [onMovieClick, onSearchChange]);

  return (
    <div className="search-bar" ref={searchBarRef}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {isLoading && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <SearchDropdown
        movies={searchResults}
        searchTerm={searchTerm}
        isLoading={isLoading}
        isVisible={isDropdownVisible}
        onSeeAllResults={handleSeeAllResults}
        onClose={handleCloseDropdown}
        totalResults={totalResults}
        onMovieClick={handleMovieClick}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default SearchBar; 