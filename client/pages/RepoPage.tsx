
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Icon } from '../components/Icon';
import NotFoundPage from './NotFoundPage';
import RepoCodePage from './RepoCodePage';
import RepoCommitsPage from './RepoCommitsPage';
import IssuesPage from './IssuesPage';
import PullRequestsPage from './PullRequestsPage';
import FileUpload from '../components/FileUpload';
import DeleteRepoModal from '../components/DeleteRepoModal';
import DeleteRepoModal from '../components/DeleteRepoModal';

interface RepoPageProps {
  owner: string;
  repoName: string;
  path: string;
}

const RepoPage: React.FC<RepoPageProps> = ({ owner, repoName, path }) => {
  const { getRepository, user, pinRepository, unpinRepository, fetchRepositories, deleteRepository } = useAppContext();
  const [repo, setRepo] = useState(getRepository(owner, repoName));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(!repo);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadRepo = async () => {
      try {
        await fetchRepositories();
        const fetchedRepo = getRepository(owner, repoName);
        setRepo(fetchedRepo);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load repository:', error);
        setLoading(false);
      }
    };
    
    if (!repo) {
      loadRepo();
    }
  }, [owner, repoName, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gh-dark-text">Loading repository...</div>
      </div>
    );
  }

  if (!repo) {
    return <NotFoundPage />;
  }

  const isPinned = user?.pinnedRepoIds.includes(repo.id) || false;
  const isOwner = user?.username === owner;

  const handlePinToggle = () => {
    if (isPinned) {
      unpinRepository(repo.id);
    } else {
      pinRepository(repo.id);
    }
  };
  
  const TABS = [
      { name: 'Code', icon: 'code', href: `#/${owner}/${repoName}`},
      { name: 'Issues', icon: 'info', href: `#/${owner}/${repoName}/issues`, count: 0 },
      { name: 'Pull Requests', icon: 'fork', href: `#/${owner}/${repoName}/pulls`, count: 0 },
      { name: 'Commits', icon: 'commit', href: `#/${owner}/${repoName}/commits/main`},
  ];

  let activeTab = 'Code';
  let pageContent = <RepoCodePage repo={repo} path={path} />;

  if (path.startsWith('/commits')) {
    activeTab = 'Commits';
    pageContent = <RepoCommitsPage repo={repo} />;
  } else if (path.startsWith('/issues')) {
    activeTab = 'Issues';
    pageContent = <IssuesPage repo={repo} />;
  } else if (path.startsWith('/pulls')) {
    activeTab = 'Pull Requests';
    pageContent = <PullRequestsPage repo={repo} />;
  } else if(path.startsWith('/blob') || path.startsWith('/tree') || path === '/'){
    activeTab = 'Code';
    const filePath = path.replace(/^\/(blob|tree)\/main/, '') || '/';
    pageContent = <RepoCodePage repo={repo} path={filePath} />;
  }


  return (
    <div>
      {/* Repository Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon name="repo" className="w-4 h-4 text-gh-dark-text-secondary"/>
          <a href={`#/${owner}`} className="text-gh-blue hover:underline text-sm">{owner}</a>
          <span className="text-gh-dark-text-secondary">/</span>
          <a href={`#/${owner}/${repoName}`} className="font-semibold text-gh-blue hover:underline text-xl">{repoName}</a>
          {repo.isPrivate && (
            <span className="text-xs font-medium border border-gh-dark-border rounded-md px-2 py-0.5 text-gh-dark-text-secondary ml-2">
              Private
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isOwner && (
            <>
              <FileUpload 
                username={owner} 
                reponame={repoName} 
                onUploadComplete={async () => {
                  await fetchRepositories();
                  const updatedRepo = getRepository(owner, repoName);
                  setRepo(updatedRepo);
                  setRefreshKey(prev => prev + 1);
                }} 
              />
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition"
              >
                <Icon name="trash" className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
          <button onClick={handlePinToggle} className="flex items-center gap-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-700 transition">
            <Icon name="pin" className="w-3.5 h-3.5" />
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button className="flex items-center gap-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-700 transition">
            <Icon name="eye" className="w-3.5 h-3.5" />
            Watch
            <span className="ml-1 bg-gray-700 rounded-full px-1.5 py-0.5 text-xs font-semibold">{repo.watchers}</span>
          </button>
          <button className="flex items-center gap-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-700 transition">
            <Icon name="fork" className="w-3.5 h-3.5" />
            Fork
            <span className="ml-1 bg-gray-700 rounded-full px-1.5 py-0.5 text-xs font-semibold">{repo.forks}</span>
          </button>
          <button className="flex items-center gap-1.5 bg-gh-dark-secondary border border-gh-dark-border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-700 transition">
            <Icon name="star" className="w-3.5 h-3.5" />
            Star
            <span className="ml-1 bg-gray-700 rounded-full px-1.5 py-0.5 text-xs font-semibold">{repo.stars}</span>
          </button>
          {isOwner && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 border border-red-700 rounded-md px-3 py-1.5 text-xs font-medium text-white transition"
            >
              <Icon name="trash" className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteRepoModal
          repoName={repoName}
          repoOwner={owner}
          onConfirm={async () => {
            await deleteRepository(owner, repoName);
            window.location.hash = '#/';
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gh-dark-border mb-0">
        <nav className="-mb-px flex space-x-4">
          {TABS.map(tab => (
            <a 
              key={tab.name} 
              href={tab.href} 
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.name 
                  ? 'border-orange-500 text-white' 
                  : 'border-transparent text-gh-dark-text-secondary hover:text-white hover:border-gray-600'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4"/>
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className="bg-gray-700 text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {tab.count}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* Page Content */}
      <div className="mt-6">
        {pageContent}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteRepoModal
          repoName={repoName}
          onConfirm={async () => {
            try {
              await deleteRepository(owner, repoName);
              setShowDeleteModal(false);
              window.location.hash = '#/';
            } catch (error: any) {
              alert(error.message || 'Failed to delete repository');
            }
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default RepoPage;
