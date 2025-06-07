import type { Movie, SearchResponse, SearchParams } from '../types/movie';

const API_KEY = "9b626394";
const BASE_URL = 'https://www.omdbapi.com/';

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
  
  console.log('Getting popular movies with term:', randomTerm);
  return searchMovies({ query: randomTerm, page });
};

export const searchMovies = async ({ query, page = 1 }: SearchParams): Promise<SearchResponse> => {
  if (!query) {
    return getPopularMovies(page);
  }
  
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
  console.log('Making API call to:', url);
  
  const response = await fetch(url);
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log('API Response:', data);
  
  if (data.Response === 'False') {
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: data.Error || 'No movies found'
    };
  }
  
  return data;
};

export const getMovieDetails = async (imdbId: string): Promise<Movie> => {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`;
  console.log('Fetching movie details for:', imdbId);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Movie Details API Error:', errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Movie Details Response:', data);
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie details not found');
  }
  
  return data;
}; 