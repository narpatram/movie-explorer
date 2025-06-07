import { useState, useMemo } from 'react';
import type { Movie } from '../types/movie';
import type { FilterOptions } from '../components/FilterPanel';

export const useFilters = (movies: Movie[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: { min: 1900, max: new Date().getFullYear() },
    ratingRange: { min: 0, max: 10 }
  });

  // Filter movies based on current filter settings
  const filteredMovies = useMemo(() => {
    if (!movies.length) return movies;

    return movies.filter(movie => {
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
    });
  }, [movies, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.genres.length > 0 ||
      filters.yearRange.min > 1900 ||
      filters.yearRange.max < new Date().getFullYear() ||
      filters.ratingRange.min > 0 ||
      filters.ratingRange.max < 10
    );
  }, [filters]);

  // Reset all filters to default values
  const resetFilters = () => {
    setFilters({
      genres: [],
      yearRange: { min: 1900, max: new Date().getFullYear() },
      ratingRange: { min: 0, max: 10 }
    });
  };

  // Get available genres from current movies
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach(movie => {
      if (movie.Genre && movie.Genre !== 'N/A') {
        movie.Genre.split(', ').forEach(genre => {
          genreSet.add(genre.trim());
        });
      }
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // Get year range from current movies
  const availableYearRange = useMemo(() => {
    const years = movies
      .map(movie => parseInt(movie.Year))
      .filter(year => !isNaN(year));
    
    return {
      min: Math.min(...years, 1900),
      max: Math.max(...years, new Date().getFullYear())
    };
  }, [movies]);

  return {
    filters,
    setFilters,
    filteredMovies,
    hasActiveFilters,
    resetFilters,
    availableGenres,
    availableYearRange
  };
}; 