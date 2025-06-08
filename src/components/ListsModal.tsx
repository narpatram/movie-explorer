import React, { useState } from 'react';
import type { CustomCollection, Movie } from '../types/movie';
import MovieGrid from './MovieGrid';
import CreateCollectionModal from './CreateCollectionModal';
import './ListsModal.css';

interface ListsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: CustomCollection[];
  onCreateList: (name: string, description?: string) => void;
  onDeleteList: (id: string) => void;
  onUpdateList: (id: string, data: Partial<CustomCollection>) => void;
  onRemoveMovieFromList: (listId: string, movieId: string) => void;
  onMovieClick?: (imdbId: string) => void;
  isFavorite?: (imdbId: string) => boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const ListsModal: React.FC<ListsModalProps> = ({
  isOpen,
  onClose,
  lists,
  onCreateList,
  onDeleteList,
  onUpdateList,
  onRemoveMovieFromList,
  onMovieClick,
  isFavorite,
  onToggleFavorite
}) => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  if (!isOpen) return null;

  const selectedList = selectedListId ? lists.find(l => l.id === selectedListId) : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateList = (name: string, description?: string) => {
    onCreateList(name, description);
    setIsCreateModalOpen(false);
  };

  const handleEditList = (list: CustomCollection) => {
    setEditingListId(list.id);
    setEditingName(list.name);
    setEditingDescription(list.description || '');
  };

  const handleSaveEdit = () => {
    if (editingListId) {
      onUpdateList(editingListId, {
        name: editingName,
        description: editingDescription
      });
      setEditingListId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditingName('');
    setEditingDescription('');
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      onDeleteList(listId);
      if (selectedListId === listId) {
        setSelectedListId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="lists-modal-overlay" onClick={handleBackdropClick}>
        <div className="lists-modal">
          <div className="lists-modal-header">
            <h2>{selectedList ? selectedList.name : 'My Movie Collections'}</h2>
            <button className="lists-modal-close" onClick={onClose} aria-label="Close collections">
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="lists-modal-content">
            {!selectedList ? (
              // Lists overview
              <div className="lists-overview">
                <div className="lists-header">
                  <button 
                    className="create-list-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    + Create New Collection
                  </button>
                </div>

                {lists.length === 0 ? (
                  <div className="empty-lists">
                    <div className="empty-icon">📝</div>
                    <h3>No Collections Yet</h3>
                    <p>Create your first custom movie collection to organize your favorites!</p>
                    <button 
                      className="create-first-list-btn"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Create Your First Collection
                    </button>
                  </div>
                ) : (
                  <div className="lists-grid">
                    {lists.map(list => (
                      <div key={list.id} className="list-card">
                        {editingListId === list.id ? (
                          <div className="list-edit-form">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="list-name-input"
                              placeholder="Collection name"
                            />
                            <textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              className="list-description-input"
                              placeholder="Description (optional)"
                              rows={2}
                            />
                            <div className="list-edit-actions">
                              <button className="save-btn" onClick={handleSaveEdit}>
                                Save
                              </button>
                              <button className="cancel-btn" onClick={handleCancelEdit}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="list-info" onClick={() => setSelectedListId(list.id)}>
                              <h3 className="list-name">{list.name}</h3>
                              {list.description && (
                                <p className="list-description">{list.description}</p>
                              )}
                              <div className="list-meta">
                                <span className="movie-count">
                                  {list.movies.length} movie{list.movies.length !== 1 ? 's' : ''}
                                </span>
                                <span className="list-date">
                                  Created {formatDate(list.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="list-actions">
                              <button 
                                className="edit-list-btn"
                                onClick={() => handleEditList(list)}
                                aria-label={`Edit ${list.name}`}
                              >
                                ✏️
                              </button>
                              <button 
                                className="delete-list-btn"
                                onClick={() => handleDeleteList(list.id)}
                                aria-label={`Delete ${list.name}`}
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Selected list view
              <div className="list-detail">
                <div className="list-detail-header">
                  <button 
                    className="back-btn"
                    onClick={() => setSelectedListId(null)}
                  >
                    ← Back to Collections
                  </button>
                  <div className="list-detail-info">
                    {selectedList.description && (
                      <p className="list-detail-description">{selectedList.description}</p>
                    )}
                    <p className="list-detail-meta">
                      {selectedList.movies.length} movie{selectedList.movies.length !== 1 ? 's' : ''} • 
                      Created {formatDate(selectedList.createdAt)}
                      {selectedList.updatedAt !== selectedList.createdAt && 
                        ` • Updated ${formatDate(selectedList.updatedAt)}`
                      }
                    </p>
                  </div>
                </div>

                {selectedList.movies.length === 0 ? (
                  <div className="empty-list">
                    <div className="empty-icon">🎬</div>
                    <h3>No Movies Yet</h3>
                    <p>Start adding movies to this collection from the main movie grid!</p>
                  </div>
                ) : (
                  <MovieGrid
                    movies={selectedList.movies}
                    isLoading={false}
                    isLoadingMore={false}
                    hasMoreResults={false}
                    error={null}
                    onLoadMore={() => {}}
                    showLoadMoreButton={false}
                    onMovieClick={onMovieClick}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                    customActions={(movie) => (
                      <button
                        className="remove-from-list-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveMovieFromList(selectedList.id, movie.imdbID);
                        }}
                        aria-label={`Remove ${movie.Title} from ${selectedList.name}`}
                      >
                        Remove from Collection
                      </button>
                    )}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateList={handleCreateList}
      />
    </>
  );
};

export default ListsModal; 