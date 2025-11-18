
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const NewRepoPage: React.FC = () => {
  const { user, createRepository } = useAppContext();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [initializeReadme, setInitializeReadme] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (repoName.trim() === '') {
        alert('Repository name is required.');
        return;
    }
    
    // Validate repository name (GitHub allows letters, numbers, hyphens, underscores, and periods)
    const validNamePattern = /^[a-zA-Z0-9._-]+$/;
    if (!validNamePattern.test(repoName)) {
        alert('Repository name can only contain letters, numbers, hyphens, underscores, and periods. No spaces allowed.');
        return;
    }
    
    try {
      await createRepository(repoName, description, isPrivate, initializeReadme);
      alert('Repository created successfully!');
      // Redirect to dashboard instead of individual repo
      window.location.hash = '#/';
    } catch (error) {
      console.error('Failed to create repository:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-2">Create a new repository</h1>
      <p className="text-gh-dark-text-secondary text-sm mb-8">
        A repository contains all project files, including the revision history.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Repository Name */}
        <div className="pb-6 border-b border-gh-dark-border">
          <label htmlFor="repo-name" className="block text-sm font-semibold text-gh-dark-text mb-2">
            Repository name <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gh-dark-text-secondary text-sm">{user?.username} /</span>
            <input
              type="text"
              id="repo-name"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
              pattern="[a-zA-Z0-9._-]+"
              placeholder=""
              className="flex-1 px-3 py-1.5 bg-gh-dark border border-gh-dark-border rounded-md text-gh-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <p className="text-xs text-gh-dark-text-secondary">
            Use letters, numbers, hyphens, underscores, or periods. No spaces.
          </p>
        </div>

        {/* Description */}
        <div className="pb-6 border-b border-gh-dark-border">
          <label htmlFor="description" className="block text-sm font-semibold text-gh-dark-text mb-2">
            Description <span className="text-gh-dark-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md text-gh-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          ></textarea>
        </div>

        {/* Visibility */}
        <div className="pb-6 border-b border-gh-dark-border space-y-3">
          <div className="flex items-start gap-3 p-3 border border-gh-dark-border rounded-md hover:border-gray-500 transition cursor-pointer" onClick={() => setIsPrivate(true)}>
            <input 
              id="private" 
              name="visibility" 
              type="radio" 
              checked={isPrivate} 
              onChange={() => setIsPrivate(true)} 
              className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gh-dark"
            />
            <div className="flex-1">
              <label htmlFor="private" className="block font-semibold text-gh-dark-text text-sm cursor-pointer">
                Private
              </label>
              <p className="text-gh-dark-text-secondary text-xs mt-0.5">
                You choose who can see and commit to this repository.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border border-gh-dark-border rounded-md hover:border-gray-500 transition cursor-pointer" onClick={() => setIsPrivate(false)}>
            <input 
              id="public" 
              name="visibility" 
              type="radio" 
              checked={!isPrivate} 
              onChange={() => setIsPrivate(false)} 
              className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gh-dark"
            />
            <div className="flex-1">
              <label htmlFor="public" className="block font-semibold text-gh-dark-text text-sm cursor-pointer">
                Public
              </label>
              <p className="text-gh-dark-text-secondary text-xs mt-0.5">
                Anyone on the internet can see this repository. You choose who can commit.
              </p>
            </div>
          </div>
        </div>

        {/* Initialize README */}
        <div className="pb-6 border-b border-gh-dark-border">
          <div className="flex items-start gap-3">
            <input
              id="readme"
              type="checkbox"
              checked={initializeReadme}
              onChange={(e) => setInitializeReadme(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gh-dark"
            />
            <div className="flex-1">
              <label htmlFor="readme" className="block font-semibold text-gh-dark-text text-sm cursor-pointer">
                Add a README file
              </label>
              <p className="text-gh-dark-text-secondary text-xs mt-0.5">
                This is where you can write a long description for your project.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition text-sm"
          >
            Create repository
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRepoPage;
