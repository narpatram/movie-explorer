import React, { useState } from 'react';
import './CreateCollectionModal.css';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (name: string, description?: string) => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreateList
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Collection name must be 50 characters or less');
      return;
    }

    onCreateList(name.trim(), description.trim() || undefined);
    
    // Reset form and close modal
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="create-list-modal-overlay" onClick={handleBackdropClick}>
      <div className="create-list-modal">
        <div className="create-list-modal-header">
          <h2>Create New Collection</h2>
          <button 
            className="create-list-modal-close" 
            onClick={handleClose}
            aria-label="Close create collection modal"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-list-form">
          <div className="form-group">
            <label htmlFor="collection-name">Collection Name *</label>
            <input
              id="collection-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Date Night Movies, Action Favorites"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="collection-description">Description (Optional)</label>
            <textarea
              id="collection-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your collection..."
              rows={3}
              maxLength={200}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal; 