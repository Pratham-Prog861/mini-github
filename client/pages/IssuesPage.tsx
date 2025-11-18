import React, { useState } from 'react';
import { Repository } from '../types';
import { Icon } from '../components/Icon';
import { timeAgo } from '../utils';

interface Issue {
  id: string;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'closed';
  createdAt: number;
  comments: number;
  labels?: string[];
}

interface IssuesPageProps {
  repo: Repository;
}

const IssuesPage: React.FC<IssuesPageProps> = ({ repo }) => {
  const [issues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const openIssues = issues.filter(i => i.state === 'open');
  const closedIssues = issues.filter(i => i.state === 'closed');
  const displayIssues = activeTab === 'open' ? openIssues : closedIssues;

  return (
    <div>
      {/* Search and Actions Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="is:issue is:open"
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
          New issue
        </button>
      </div>

      {/* Issues List */}
      <div className="border border-gh-dark-border rounded-md overflow-hidden">
        {/* Tabs Header */}
        <div className="bg-gh-dark-secondary px-4 py-2 border-b border-gh-dark-border flex items-center gap-6">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-2 text-sm font-medium ${
              activeTab === 'open' ? 'text-white' : 'text-gh-dark-text-secondary hover:text-white'
            }`}
          >
            <Icon name="info" className="w-4 h-4" />
            <span>{openIssues.length} Open</span>
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex items-center gap-2 text-sm font-medium ${
              activeTab === 'closed' ? 'text-white' : 'text-gh-dark-text-secondary hover:text-white'
            }`}
          >
            <Icon name="check" className="w-4 h-4" />
            <span>{closedIssues.length} Closed</span>
          </button>
        </div>

        {/* Issues List or Empty State */}
        {displayIssues.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gh-dark-secondary mb-4">
              <Icon name="info" className="w-12 h-12 text-gh-dark-text-secondary" />
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
            {displayIssues.map(issue => (
              <div
                key={issue.id}
                className="px-4 py-3 hover:bg-gh-dark-secondary/30 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {issue.state === 'open' ? (
                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                        <Icon name="info" className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <Icon name="check" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <a href="#" className="font-semibold text-gh-dark-text hover:text-gh-blue text-sm">
                        {issue.title}
                      </a>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {issue.labels.map((label, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-blue-300"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gh-dark-text-secondary mt-1">
                      #{issue.number} opened {timeAgo(issue.createdAt)} by {issue.author}
                    </div>
                  </div>
                  {issue.comments > 0 && (
                    <div className="flex items-center gap-1.5 text-gh-dark-text-secondary flex-shrink-0">
                      <Icon name="comment" className="w-4 h-4" />
                      <span className="text-xs font-medium">{issue.comments}</span>
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

export default IssuesPage;
