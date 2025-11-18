
import React, { useState } from 'react';
import { Repository } from '../types';
import { Icon } from './Icon';
import { timeAgo } from '../utils';
import { useAppContext } from '../context/AppContext';

interface RepoCardProps {
  repo: Repository;
}

const LanguageDot: React.FC<{ language: string }> = ({ language }) => {
    const colors: { [key: string]: string } = {
        'JavaScript': 'bg-yellow-400',
        'TypeScript': 'bg-blue-500',
        'HTML': 'bg-orange-600',
        'CSS': 'bg-purple-600',
        'Markdown': 'bg-gray-400'
    };
    const color = colors[language] || 'bg-gray-500';
    return <span className={`w-3 h-3 rounded-full inline-block ${color}`}></span>;
};

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const { toggleStarRepo, starredRepos } = useAppContext();
  const isStarred = starredRepos.includes(repo.id);

  const handleStar = () => {
    toggleStarRepo(repo.id);
  };

  return (
    <div className="p-6 hover:bg-gh-dark-secondary/30 transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="repo" className="text-gh-dark-text-secondary w-4 h-4 flex-shrink-0" />
            <a href={`#/${repo.owner.username}/${repo.name}`} className="text-gh-blue hover:underline font-semibold text-base truncate">
              {repo.owner.username} / {repo.name}
            </a>
            {repo.isPrivate && (
              <span className="text-xs font-medium border border-gh-dark-border rounded-md px-2 py-0.5 text-gh-dark-text-secondary flex-shrink-0">
                Private
              </span>
            )}
          </div>
          
          {repo.description && (
            <p className="text-sm text-gh-dark-text-secondary mb-3 line-clamp-2">{repo.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gh-dark-text-secondary flex-wrap">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <LanguageDot language={repo.language} />
                <span>{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Icon name="star" className="w-3.5 h-3.5" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="fork" className="w-3.5 h-3.5" />
              <span>{repo.forks}</span>
            </div>
            <span>Updated {timeAgo(repo.updatedAt)}</span>
          </div>
        </div>
        
        <button 
          onClick={() => toggleStarRepo(repo.id)}
          className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-xs font-medium transition flex-shrink-0 ${
            isStarred 
              ? 'bg-yellow-500/10 border-yellow-600 text-yellow-500 hover:bg-yellow-500/20' 
              : 'bg-gh-dark-secondary border-gh-dark-border hover:bg-gray-700'
          }`}
        >
          <Icon name="star" className="w-3.5 h-3.5" />
          {isStarred ? 'Starred' : 'Star'}
        </button>
      </div>
    </div>
  );
};

export default RepoCard;
