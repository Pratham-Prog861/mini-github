import React, { useState } from 'react';
import { Repository } from '../types';
import { Icon } from '../components/Icon';
import { timeAgo } from '../utils';

interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: number;
  comments: number;
}

interface PullRequestsPageProps {
  repo: Repository;
}

const PullRequestsPage: React.FC<PullRequestsPageProps> = ({ repo }) => {
  const [pullRequests] = useState<PullRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const openPRs = pullRequests.filter(pr => pr.state === 'open');
  const closedPRs = pullRequests.filter(pr => pr.state !== 'open');
  const displayPRs = activeTab === 'open' ? openPRs : closedPRs;

  return (
    <div>
      {/* Search and Actions Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="is:pr is:open"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 pl-9 bg-gh-dark border border-gh-dark-border rounded-md text-sm text-gh-dark-text placeholder-gh-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-dark-text-secondary" />
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md text-xs font-medium hover:bg-gray-700 transition">
          <Icon name="tag" className="w-3.5 h-3.5" />
          Labels
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md text-xs font-medium hover:bg-gray-700 transition">
          <Icon name="milestone" className="w-3.5 h-3.5" />
          Milestones
        </button>
        <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition">
          New pull request
        </button>
      </div>

      {/* Pull Requests List */}
      <div className="border border-gh-dark-border rounded-md overflow-hidden">
        {/* Tabs Header */}
        <div className="bg-gh-dark-secondary px-4 py-2 border-b border-gh-dark-border flex items-center gap-6">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-2 text-sm font-medium ${
              activeTab === 'open' ? 'text-white' : 'text-gh-dark-text-secondary hover:text-white'
            }`}
          >
            <Icon name="fork" className="w-4 h-4" />
            <span>{openPRs.length} Open</span>
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex items-center gap-2 text-sm font-medium ${
              activeTab === 'closed' ? 'text-white' : 'text-gh-dark-text-secondary hover:text-white'
            }`}
          >
            <Icon name="check" className="w-4 h-4" />
            <span>{closedPRs.length} Closed</span>
          </button>
        </div>

        {/* Pull Requests List or Empty State */}
        {displayPRs.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gh-dark-secondary mb-4">
              <Icon name="fork" className="w-12 h-12 text-gh-dark-text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-gh-dark-text mb-2">
              No results
            </h3>
            <p className="text-sm text-gh-dark-text-secondary mb-6">
              Try adjusting your search filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gh-dark-border">
            {displayPRs.map(pr => (
              <div
                key={pr.id}
                className="px-4 py-3 hover:bg-gh-dark-secondary/30 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {pr.state === 'open' ? (
                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                        <Icon name="fork" className="w-3 h-3 text-white" />
                      </div>
                    ) : pr.state === 'merged' ? (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <Icon name="check" className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                        <Icon name="close" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href="#" className="font-semibold text-gh-dark-text hover:text-gh-blue text-sm">
                      {pr.title}
                    </a>
                    <div className="text-xs text-gh-dark-text-secondary mt-1">
                      #{pr.number} opened {timeAgo(pr.createdAt)} by {pr.author}
                    </div>
                  </div>
                  {pr.comments > 0 && (
                    <div className="flex items-center gap-1.5 text-gh-dark-text-secondary flex-shrink-0">
                      <Icon name="comment" className="w-4 h-4" />
                      <span className="text-xs font-medium">{pr.comments}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestsPage;
