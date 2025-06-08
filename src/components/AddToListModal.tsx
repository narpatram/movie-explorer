import React, { useState } from 'react';
import type { Movie, CustomCollection } from '../types/movie';
import './AddToListModal.css';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  lists: CustomCollection[];
  onAddToList: (listId: string, movie: Movie) => void;
  onCreateNewList: () => void;
  isMovieInList: (listId: string, movieId: string) => boolean;
}

const AddToListModal: React.FC<AddToListModalProps> = ({
  isOpen,
  onClose,
  movie,
  lists,
  onAddToList,
  onCreateNewList,
  isMovieInList
}) => {
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());

  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleListToggle = (listId: string) => {
    const newSelected = new Set(selectedLists);
    if (newSelected.has(listId)) {
      newSelected.delete(listId);
    } else {
      newSelected.add(listId);
    }
    setSelectedLists(newSelected);
  };

  const handleAddToSelected = () => {
    selectedLists.forEach(listId => {
      if (!isMovieInList(listId, movie.imdbID)) {
        onAddToList(listId, movie);
      }
    });
    setSelectedLists(new Set());
    onClose();
  };

  const handleCreateAndAdd = () => {
    onCreateNewList();
    onClose();
  };

  const availableLists = lists.filter(list => !isMovieInList(list.id, movie.imdbID));
  const movieInLists = lists.filter(list => isMovieInList(list.id, movie.imdbID));

  return (
    <div className="add-to-list-modal-overlay" onClick={handleBackdropClick}>
      <div className="add-to-list-modal">
        <div className="add-to-list-modal-header">
          <h2>Add to Collection</h2>
          <button 
            className="add-to-list-modal-close" 
            onClick={onClose}
            aria-label="Close add to collection modal"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="add-to-list-modal-content">
          <div className="movie-info">
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDEwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI3NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPvCfjqw8L3RleHQ+Cjwvc3ZnPg=='}
              alt={movie.Title}
              className="movie-poster-small"
            />
            <div className="movie-details">
              <h3 className="movie-title">{movie.Title}</h3>
              <p className="movie-year">{movie.Year}</p>
            </div>
          </div>

          {availableLists.length > 0 ? (
            <div className="lists-section">
              <h4>Select Collections:</h4>
              <div className="lists-list">
                {availableLists.map(list => (
                  <label key={list.id} className="list-option">
                    <input
                      type="checkbox"
                      checked={selectedLists.has(list.id)}
                      onChange={() => handleListToggle(list.id)}
                    />
                    <div className="list-info">
                      <span className="list-name">{list.name}</span>
                      {list.description && (
                        <span className="list-description">{list.description}</span>
                      )}
                      <span className="list-count">
                        {list.movies.length} movie{list.movies.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-available-lists">
              <p>This movie is already in all your collections, or you don't have any collections yet.</p>
            </div>
          )}

          {movieInLists.length > 0 && (
            <div className="already-in-lists">
              <h4>Already in these collections:</h4>
              <div className="existing-lists">
                {movieInLists.map(list => (
                  <span key={list.id} className="existing-list-tag">
                    {list.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button 
              className="create-new-list-btn"
              onClick={handleCreateAndAdd}
            >
              + Create New Collection
            </button>
            
            {selectedLists.size > 0 && (
              <button 
                className="add-to-selected-btn"
                onClick={handleAddToSelected}
              >
                Add to {selectedLists.size} collection{selectedLists.size !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal; 