
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { timeAgo } from '../utils';

const ProfilePage: React.FC = () => {
  const { user, repositories, starredRepos, toggleStarRepo } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'repositories' | 'stars'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const pinnedRepos = repositories.filter(repo => user?.pinnedRepoIds.includes(repo.id));
  const userRepos = repositories.filter(repo => repo.owner.username === user?.username);
  const starredRepositories = repositories.filter(repo => starredRepos.includes(repo.id));
  
  const filteredRepos = userRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      {/* Left Sidebar - Profile Info */}
      <div className="lg:w-80 w-full flex-shrink-0">
        <div className="sticky top-4">
          {/* Avatar */}
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="rounded-full w-full border border-gh-light-border dark:border-gh-dark-border"
            />
            <button className="absolute bottom-2 right-2 p-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Icon name="camera" className="w-4 h-4" />
            </button>
          </div>

          {/* Name and Username */}
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-gh-light-text dark:text-gh-dark-text">{user.name}</h1>
            <p className="text-xl text-gh-light-text-secondary dark:text-gh-dark-text-secondary">{user.username}</p>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full mt-4 px-4 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border border-gh-light-border dark:border-gh-dark-border rounded-md text-sm font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Edit profile
          </button>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-sm text-gh-light-text dark:text-gh-dark-text">{user.bio}</p>
          )}

          {/* Followers - Only show if user has followers/following data */}
          {(user.followers || user.following) && (
            <div className="mt-4 flex items-center gap-1 text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
              <Icon name="people" className="w-4 h-4" />
              {user.followers !== undefined && (
                <>
                  <a href="#" className="hover:text-gh-blue dark:hover:text-gh-blue-dark">
                    <span className="font-semibold text-gh-light-text dark:text-gh-dark-text">{user.followers}</span> followers
                  </a>
                  <span>·</span>
                </>
              )}
              {user.following !== undefined && (
                <a href="#" className="hover:text-gh-blue dark:hover:text-gh-blue-dark">
                  <span className="font-semibold text-gh-light-text dark:text-gh-dark-text">{user.following}</span> following
                </a>
              )}
            </div>
          )}

          {/* Location - Only show if user has location */}
          {user.location && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gh-light-text dark:text-gh-dark-text">
              <Icon name="location" className="w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
              <span>{user.location}</span>
            </div>
          )}

          {/* Time - Only show if user has timezone */}
          {user.timezone && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gh-light-text dark:text-gh-dark-text">
              <Icon name="clock" className="w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
              <span>{new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: user.timezone 
              })} ({user.timezone})</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0">
        {/* Navigation Tabs */}
        <div className="border-b border-gh-dark-border dark:border-gh-dark-border border-gh-light-border mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 border-b-2 text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-gh-light-text dark:text-white'
                  : 'border-transparent text-gh-light-text-secondary dark:text-gh-dark-text-secondary hover:text-gh-light-text dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('repositories')}
              className={`px-4 py-3 border-b-2 text-sm font-medium transition ${
                activeTab === 'repositories'
                  ? 'border-orange-500 text-gh-light-text dark:text-white'
                  : 'border-transparent text-gh-light-text-secondary dark:text-gh-dark-text-secondary hover:text-gh-light-text dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              Repositories
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                {userRepos.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stars')}
              className={`px-4 py-3 border-b-2 text-sm font-medium transition ${
                activeTab === 'stars'
                  ? 'border-orange-500 text-gh-light-text dark:text-white'
                  : 'border-transparent text-gh-light-text-secondary dark:text-gh-dark-text-secondary hover:text-gh-light-text dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              Stars
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                {starredRepositories.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div>
            {/* Pinned Repositories Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-normal">Pinned</h2>
                {pinnedRepos.length > 0 && (
                  <button className="text-xs text-gh-dark-text-secondary hover:text-gh-blue">
                    Customize your pins
                  </button>
                )}
              </div>

              {pinnedRepos.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pinnedRepos.map(repo => (
                    <div 
                      key={repo.id} 
                      className="border border-gh-light-border dark:border-gh-dark-border rounded-md p-4 bg-white dark:bg-gh-dark hover:bg-gray-50 dark:hover:bg-gh-dark-secondary/30 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Icon name="repo" className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary w-4 h-4 flex-shrink-0" />
                          <a 
                            href={`#/${repo.owner.username}/${repo.name}`} 
                            className="font-semibold text-gh-blue dark:text-gh-blue-dark hover:underline text-sm truncate"
                          >
                            {repo.name}
                          </a>
                        </div>
                        <span className="text-xs border border-gh-light-border dark:border-gh-dark-border rounded-full px-2 py-0.5 text-gh-light-text-secondary dark:text-gh-dark-text-secondary flex-shrink-0 ml-2">
                          {repo.isPrivate ? 'Private' : 'Public'}
                        </span>
                      </div>
                      
                      {repo.description && (
                        <p className="text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary mb-3 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
                        {repo.language && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Icon name="star" className="w-3 h-3" />
                          <span>{repo.stars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="fork" className="w-3 h-3" />
                          <span>{repo.forks}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gh-light-border dark:border-gh-dark-border rounded-md p-12 text-center bg-white dark:bg-gh-dark">
                  <p className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary text-sm">No pinned repositories.</p>
                  <p className="text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary mt-1">
                    You can pin repositories from their page.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'repositories' ? (
          <div>
            {/* Repository Search and Filters */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Find a repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 pl-9 bg-white dark:bg-gh-dark border-gh-light-border dark:border-gh-dark-border border rounded-md text-sm text-gh-light-text dark:text-gh-dark-text placeholder-gh-light-text-secondary dark:placeholder-gh-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border border rounded-md text-xs font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
                Type
                <Icon name="chevron-down" className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border border rounded-md text-xs font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
                Language
                <Icon name="chevron-down" className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border border rounded-md text-xs font-medium text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700">
                Sort
                <Icon name="chevron-down" className="w-3 h-3" />
              </button>
              <a
                href="#/new"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gh-green dark:bg-gh-green-dark hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-md text-sm font-medium"
              >
                <Icon name="repo" className="w-4 h-4" />
                New
              </a>
            </div>

            {/* Repository List */}
            <div className="divide-y divide-gh-light-border dark:divide-gh-dark-border border border-gh-light-border dark:border-gh-dark-border rounded-md bg-white dark:bg-gh-dark">
              {filteredRepos.length > 0 ? (
                filteredRepos.map(repo => (
                  <div key={repo.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gh-dark-secondary/30 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="repo" className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary w-4 h-4 flex-shrink-0" />
                          <a 
                            href={`#/${repo.owner.username}/${repo.name}`} 
                            className="font-semibold text-gh-blue dark:text-gh-blue-dark hover:underline text-base"
                          >
                            {repo.name}
                          </a>
                          <span className="text-xs border border-gh-light-border dark:border-gh-dark-border rounded-full px-2 py-0.5 text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
                            {repo.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary mb-3">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
                          {repo.language && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Icon name="star" className="w-3 h-3" />
                            <span>{repo.stars}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="fork" className="w-3 h-3" />
                            <span>{repo.forks}</span>
                          </div>
                          <span>Updated {timeAgo(repo.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleStarRepo(repo.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 border rounded-md text-xs font-medium ml-4 transition ${
                          starredRepos.includes(repo.id)
                            ? 'bg-yellow-500/10 border-yellow-600 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20'
                            : 'bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border text-gh-light-text dark:text-gh-dark-text hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon name="star" className="w-3 h-3" />
                        {starredRepos.includes(repo.id) ? 'Starred' : 'Star'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary">No repositories found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Stars Tab - Starred Repositories */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Find a starred repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 pl-9 bg-white dark:bg-gh-dark border-gh-light-border dark:border-gh-dark-border rounded-md text-sm text-gh-light-text dark:text-gh-dark-text placeholder-gh-light-text-secondary dark:placeholder-gh-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-light-secondary dark:bg-gh-dark-secondary border-gh-light-border dark:border-gh-dark-border border rounded-md text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                Sort
                <Icon name="chevron-down" className="w-3 h-3" />
              </button>
            </div>

            {/* Starred Repository List */}
            <div className="divide-y divide-gh-light-border dark:divide-gh-dark-border border border-gh-light-border dark:border-gh-dark-border rounded-md bg-white dark:bg-gh-dark">
              {starredRepositories.length > 0 ? (
                starredRepositories.map(repo => (
                  <div key={repo.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gh-dark-secondary/30 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="repo" className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary w-4 h-4 flex-shrink-0" />
                          <a 
                            href={`#/${repo.owner.username}/${repo.name}`} 
                            className="font-semibold text-gh-blue dark:text-gh-blue-dark hover:underline text-base"
                          >
                            {repo.owner.username} / {repo.name}
                          </a>
                          <span className="text-xs border border-gh-light-border dark:border-gh-dark-border rounded-full px-2 py-0.5 text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
                            {repo.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary mb-3">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gh-light-text-secondary dark:text-gh-dark-text-secondary">
                          {repo.language && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Icon name="star" className="w-3 h-3" />
                            <span>{repo.stars}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="fork" className="w-3 h-3" />
                            <span>{repo.forks}</span>
                          </div>
                          <span>Updated {timeAgo(repo.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleStarRepo(repo.id)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-600 text-yellow-600 dark:text-yellow-500 rounded-md text-xs font-medium hover:bg-yellow-500/20 ml-4"
                      >
                        <Icon name="star" className="w-3 h-3" />
                        Starred
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Icon name="star" className="w-12 h-12 mx-auto mb-4 text-gh-light-text-secondary dark:text-gh-dark-text-secondary opacity-50" />
                  <p className="text-gh-light-text-secondary dark:text-gh-dark-text-secondary font-semibold mb-1">No starred repositories yet</p>
                  <p className="text-sm text-gh-light-text-secondary dark:text-gh-dark-text-secondary">Star repositories to see them here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
