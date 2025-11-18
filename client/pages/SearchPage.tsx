
import React from 'react';
import { useAppContext } from '../context/AppContext';
import RepoCard from '../components/RepoCard';

const SearchPage: React.FC = () => {
  const { repositories } = useAppContext();
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const query = searchParams.get('q')?.toLowerCase() || '';

  const results = query ? repositories.filter(repo => 
    repo.name.toLowerCase().includes(query) || 
    repo.description.toLowerCase().includes(query)
  ) : [];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 border-b border-gh-dark-border pb-4">
        {results.length} repository results {query && `for "${query}"`}
      </h1>
      <div className="border border-gh-dark-border rounded-md">
        {results.length > 0 ? (
            results.map(repo => <RepoCard key={repo.id} repo={repo} />)
        ) : (
            <div className="p-8 text-center text-gh-dark-text-secondary">
                No repositories found. Try another search.
            </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
