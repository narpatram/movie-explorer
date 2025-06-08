export interface Rating {
  Source: string;
  Value: string;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Type: string;
  Plot?: string;
  imdbRating?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Released?: string;
  Rated?: string; // PG, PG-13, R, etc.
  Writer?: string;
  Language?: string;
  Country?: string;
  Ratings?: Rating[]; // Array of ratings from different sources
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface SearchParams {
  query?: string;
  page?: number;
}

export interface CustomCollection {
  id: string;
  name: string;
  description?: string;
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
} 