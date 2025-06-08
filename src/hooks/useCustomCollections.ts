import { useState, useEffect, useCallback } from 'react';
import type { Movie, CustomCollection, CreateCollectionData } from '../types/movie';

interface UseCustomCollectionsReturn {
  collections: CustomCollection[];
  isLoading: boolean;
  createCollection: (data: CreateCollectionData) => CustomCollection;
  updateCollection: (id: string, data: Partial<CustomCollection>) => void;
  deleteCollection: (id: string) => void;
  addMovieToCollection: (collectionId: string, movie: Movie) => void;
  removeMovieFromCollection: (collectionId: string, movieId: string) => void;
  getCollectionById: (id: string) => CustomCollection | undefined;
  isMovieInCollection: (collectionId: string, movieId: string) => boolean;
  getMovieCollectionMemberships: (movieId: string) => CustomCollection[];
}

const COLLECTIONS_STORAGE_KEY = 'movie-custom-collections';

export const useCustomCollections = (): UseCustomCollectionsReturn => {
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load collections from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (stored) {
        const storedCollections: CustomCollection[] = JSON.parse(stored);
        setCollections(storedCollections);
      }
    } catch (error) {
      // Fallback to empty collections if localStorage read fails
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save collections to localStorage whenever collections change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
      } catch (error) {
        // Silently handle localStorage save errors
        // User data will still work in current session
      }
    }
  }, [collections, isLoading]);

  const createCollection = useCallback((data: CreateCollectionData): CustomCollection => {
    const newCollection: CustomCollection = {
      id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description,
      movies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  }, []);

  const updateCollection = useCallback((id: string, data: Partial<CustomCollection>) => {
    setCollections(prev => prev.map(collection => 
      collection.id === id 
        ? { ...collection, ...data, updatedAt: new Date().toISOString() }
        : collection
    ));
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  }, []);

  const addMovieToCollection = useCallback((collectionId: string, movie: Movie) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId) {
        // Check if movie is already in the collection
        const isAlreadyInCollection = collection.movies.some(m => m.imdbID === movie.imdbID);
        if (!isAlreadyInCollection) {
          return {
            ...collection,
            movies: [...collection.movies, movie],
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return collection;
    }));
  }, []);

  const removeMovieFromCollection = useCallback((collectionId: string, movieId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? {
            ...collection,
            movies: collection.movies.filter(movie => movie.imdbID !== movieId),
            updatedAt: new Date().toISOString(),
          }
        : collection
    ));
  }, []);

  const getCollectionById = useCallback((id: string): CustomCollection | undefined => {
    return collections.find(collection => collection.id === id);
  }, [collections]);

  const isMovieInCollection = useCallback((collectionId: string, movieId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.movies.some(movie => movie.imdbID === movieId) : false;
  }, [collections]);

  const getMovieCollectionMemberships = useCallback((movieId: string): CustomCollection[] => {
    return collections.filter(collection => 
      collection.movies.some(movie => movie.imdbID === movieId)
    );
  }, [collections]);

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    addMovieToCollection,
    removeMovieFromCollection,
    getCollectionById,
    isMovieInCollection,
    getMovieCollectionMemberships,
  };
}; 