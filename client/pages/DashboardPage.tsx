
import React from 'react';
import { useAppContext } from '../context/AppContext';
import RepoCard from '../components/RepoCard';
import { Icon } from '../components/Icon';

const DashboardPage: React.FC = () => {
  const { repositories } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Repositories</h1>
        <a
          href="#/new"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition flex items-center gap-2 text-sm"
        >
          <Icon name="repo" className="w-4 h-4" />
          New
        </a>
      </div>
      <div className="border border-gh-dark-border rounded-md divide-y divide-gh-dark-border">
        {repositories.length > 0 ? (
          repositories.map(repo => <RepoCard key={repo.id} repo={repo} />)
        ) : (
          <div className="p-12 text-center text-gh-dark-text-secondary">
            <Icon name="repo" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-semibold mb-2 text-gh-dark-text">No repositories found</h2>
            <p className="text-sm mb-4">Get started by creating a new repository.</p>
            <a
              href="#/new"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition text-sm"
            >
              <Icon name="repo" className="w-4 h-4" />
              Create repository
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
