import React, { useState } from 'react';
import { Icon } from './Icon';

interface DeleteRepoModalProps {
  repoName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteRepoModal: React.FC<DeleteRepoModalProps> = ({ repoName, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (inputValue === repoName) {
      setIsDeleting(true);
      try {
        await onConfirm();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Icon name="trash" className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gh-light-text dark:text-gh-dark-text mb-1">
              Delete repository
            </h2>
            <p className="text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
              This action cannot be undone. This will permanently delete the repository.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
          <p className="text-sm text-red-800 dark:text-red-400">
            <strong>Warning:</strong> This will delete all files, commits, and data associated with this repository.
          </p>
        </div>

        {/* Confirmation Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gh-light-text dark:text-gh-dark-text mb-2">
            To confirm, type "<span className="font-mono font-semibold">{repoName}</span>" in the box below:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={repoName}
            className="w-full px-3 py-2 bg-white dark:bg-gh-dark border border-gh-light-border dark:border-gh-dark-border rounded-md text-sm text-gh-light-text dark:text-gh-dark-text placeholder-gh-light-text-secondary dark:placeholder-gh-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-md text-sm font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={inputValue !== repoName || isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete this repository'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRepoModal;
