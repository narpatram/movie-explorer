import type { Movie, SearchResponse, SearchParams } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

if (!API_KEY) {
  throw new Error('VITE_OMDB_API_KEY is not set in environment variables');
}

export const getImageUrl = (poster: string): string => {
  if (!poster || poster === 'N/A') {
    return 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=🎬+No+Image';
  }
  return poster;
};

export const getPopularMovies = async (page: number = 1): Promise<SearchResponse> => {
  // OMDb doesn't have a "popular movies" endpoint, so we'll search for popular terms
  const popularSearchTerms = ['marvel', 'batman', 'star wars', 'disney', 'action'];
  const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
  
  return searchMovies({ query: randomTerm, page });
};

export const searchMovies = async ({ query, page = 1 }: SearchParams): Promise<SearchResponse> => {
  if (!query) {
    return getPopularMovies(page);
  }
  
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      return {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: data.Error || 'No movies found'
      };
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while searching for movies');
  }
};

export const getMovieDetails = async (imdbId: string): Promise<Movie> => {
  if (!imdbId) {
    throw new Error('Movie ID is required');
  }

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie details not found');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching movie details');
  }
}; 