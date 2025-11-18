
import React from 'react';
import { Repository, Commit } from '../types';
import { Icon } from '../components/Icon';
import { timeAgo } from '../utils';

interface RepoCommitsPageProps {
  repo: Repository;
}

const CommitItem: React.FC<{ commit: Commit; isLast: boolean }> = ({ commit, isLast }) => (
  <div className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gh-dark-secondary/30 transition ${!isLast ? 'border-b border-gh-light-border dark:border-gh-dark-border' : ''}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gh-light-text dark:text-gh-dark-text mb-2">
          {commit.message}
        </p>
        <div className="flex items-center gap-2 text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
          <img 
            src={commit.author.avatarUrl} 
            alt={commit.author.username} 
            className="w-5 h-5 rounded-full"
          />
          <span className="font-medium text-gh-light-text dark:text-gh-dark-text">{commit.author.username}</span>
          <span>committed {timeAgo(commit.timestamp)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a 
          href="#" 
          className="font-mono text-xs text-gh-blue dark:text-gh-blue-dark hover:underline"
        >
          {commit.shortSha}
        </a>
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition">
          <Icon name="code" className="w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
        </button>
      </div>
    </div>
  </div>
);

const RepoCommitsPage: React.FC<RepoCommitsPageProps> = ({ repo }) => {
  // Group commits by date
  const groupedCommits: { [key: string]: Commit[] } = {};
  
  repo.commits.forEach(commit => {
    const date = new Date(commit.timestamp);
    const dateKey = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    if (!groupedCommits[dateKey]) {
      groupedCommits[dateKey] = [];
    }
    groupedCommits[dateKey].push(commit);
  });

  return (
    <div>
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-md text-sm font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
            <Icon name="branch" className="w-4 h-4" />
            main
            <Icon name="chevron-down" className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-md text-xs font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
            <Icon name="people" className="w-3.5 h-3.5" />
            All users
            <Icon name="chevron-down" className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-md text-xs font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
            <Icon name="clock" className="w-3.5 h-3.5" />
            All time
            <Icon name="chevron-down" className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Commits list */}
      {repo.commits.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedCommits).map(([date, commits]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2">
                <Icon name="commit" className="w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
                <h3 className="text-sm font-semibold text-gh-light-text dark:text-gh-dark-text">
                  Commits on {date}
                </h3>
              </div>
              
              {/* Commits for this date */}
              <div className="border border-gh-light-border dark:border-gh-dark-border rounded-md bg-white dark:bg-gh-dark overflow-hidden">
                {commits.map((commit, index) => (
                  <CommitItem 
                    key={commit.id} 
                    commit={commit} 
                    isLast={index === commits.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gh-light-border dark:border-gh-dark-border rounded-md p-12 text-center bg-white dark:bg-gh-dark">
          <Icon name="commit" className="w-12 h-12 mx-auto mb-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary opacity-50" />
          <p className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary font-semibold mb-1">
            No commits yet
          </p>
          <p className="text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
            Commits will appear here once you start making changes.
          </p>
        </div>
      )}
    </div>
  );
};

export default RepoCommitsPage;
