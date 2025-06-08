import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types/movie';

interface UseFavoritesReturn {
  favorites: Movie[];
  favoriteIds: Set<string>;
  isFavorite: (imdbId: string) => boolean;
  toggleFavorite: (movie: Movie) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FAVORITES_STORAGE_KEY = 'movie-favorites';

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const storedFavorites: Movie[] = JSON.parse(stored);
        setFavorites(storedFavorites);
        setFavoriteIds(new Set(storedFavorites.map(movie => movie.imdbID)));
      }
    } catch (error) {
      // Fallback to empty favorites if localStorage read fails
      setFavorites([]);
      setFavoriteIds(new Set());
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      // Silently handle localStorage save errors
      // User data will still work in current session
    }
  }, [favorites]);

  const isFavorite = useCallback((imdbId: string): boolean => {
    return favoriteIds.has(imdbId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((movie: Movie) => {
    const movieId = movie.imdbID;
    
    if (favoriteIds.has(movieId)) {
      // Remove from favorites
      setFavorites(prev => prev.filter(fav => fav.imdbID !== movieId));
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    } else {
      // Add to favorites
      setFavorites(prev => [...prev, movie]);
      setFavoriteIds(prev => new Set([...prev, movieId]));
    }
  }, [favoriteIds]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setFavoriteIds(new Set());
  }, []);

  return {
    favorites,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}; 