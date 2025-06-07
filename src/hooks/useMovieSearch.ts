import { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie } from '../types/movie';
import { searchMovies, getPopularMovies } from '../services/movieApi';

interface UseMovieSearchReturn {
  searchResults: Movie[];
  trendingMovies: Movie[];
  displayMovies: Movie[];
  isLoading: boolean;
  isSearching: boolean;
  isLoadingMore: boolean;
  hasMoreResults: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAllResults: boolean;
  handleSeeAllResults: () => void;
  loadMoreResults: () => void;
  totalResults: number;
}

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [trendingPage, setTrendingPage] = useState(1);
  
  // Keep track of current search to prevent race conditions
  const currentSearchRef = useRef<string>('');
  const lastSearchTermRef = useRef<string>('');

  // Debounce search term with shorter delay for more dynamic feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset showAllResults when search term changes, but don't clear results immediately
  useEffect(() => {
    if (searchTerm !== lastSearchTermRef.current) {
      setShowAllResults(false);
      setCurrentPage(1);
      lastSearchTermRef.current = searchTerm;
    }
  }, [searchTerm]);

  const fetchTrendingMovies = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      const response = await getPopularMovies(page);
      if (response.Response === 'True') {
        const newMovies = response.Search || [];
        if (append) {
          setTrendingMovies(prev => [...prev, ...newMovies]);
        } else {
          setTrendingMovies(newMovies);
        }
      }
    } catch (err) {
      console.error('Error fetching trending movies:', err);
    }
  }, []);

  const fetchSearchResults = useCallback(async (query: string, page: number = 1, append: boolean = false) => {
    if (!query) {
      setSearchResults([]);
      setTotalResults(0);
      setHasMoreResults(false);
      setError(null);
      return;
    }

    // Update current search reference
    currentSearchRef.current = query;

    try {
      if (page === 1) {
        setIsSearching(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }
      
      const response = await searchMovies({ query, page });
      
      // Double-check if this is still the current search
      if (query !== currentSearchRef.current) {
        return; // Ignore outdated responses
      }
      
      if (response.Response === 'False') {
        if (page === 1) {
          setError(response.Error || 'No movies found');
          setSearchResults([]);
          setTotalResults(0);
          setHasMoreResults(false);
        }
      } else {
        const newMovies = response.Search || [];
        const total = parseInt(response.totalResults || '0');
        
        if (append && page > 1) {
          setSearchResults(prev => [...prev, ...newMovies]);
        } else {
          setSearchResults(newMovies);
        }
        
        setTotalResults(total);
        // OMDb API returns max 10 results per page
        setHasMoreResults(page * 10 < total);
      }
    } catch (err) {
      if (query === currentSearchRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        if (page === 1) {
          setSearchResults([]);
          setTotalResults(0);
          setHasMoreResults(false);
        }
      }
    } finally {
      if (query === currentSearchRef.current) {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  // Load more search results
  const loadMoreResults = useCallback(() => {
    if (debouncedSearchTerm && hasMoreResults && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchSearchResults(debouncedSearchTerm, nextPage, true);
    }
  }, [debouncedSearchTerm, hasMoreResults, isLoadingMore, currentPage, fetchSearchResults]);

  // Load more trending movies
  const loadMoreTrendingMovies = useCallback(() => {
    if (!isLoadingMore) {
      const nextPage = trendingPage + 1;
      setTrendingPage(nextPage);
      setIsLoadingMore(true);
      fetchTrendingMovies(nextPage, true).finally(() => setIsLoadingMore(false));
    }
  }, [trendingPage, isLoadingMore, fetchTrendingMovies]);

  // Fetch trending movies on initial load
  useEffect(() => {
    fetchTrendingMovies().finally(() => setIsLoading(false));
  }, [fetchTrendingMovies]);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchResults(debouncedSearchTerm, 1, false);
    } else {
      // Only clear when debounced term is empty, not on every keystroke
      setSearchResults([]);
      setIsSearching(false);
      setError(null);
      setTotalResults(0);
      setHasMoreResults(false);
      currentSearchRef.current = '';
    }
  }, [debouncedSearchTerm, fetchSearchResults]);

  // Update display movies based on current state
  useEffect(() => {
    if (!searchTerm) {
      // No search term: show trending movies
      setDisplayMovies(trendingMovies);
    } else if (showAllResults) {
      // Show all search results when user clicks "See all results"
      setDisplayMovies(searchResults);
    } else {
      // Just searching: show trending movies in background (will be dimmed)
      setDisplayMovies(trendingMovies);
    }
  }, [searchTerm, searchResults, trendingMovies, showAllResults]);

  const handleSeeAllResults = useCallback(() => {
    setShowAllResults(true);
  }, []);

  return {
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
    totalResults,
  };
}; 