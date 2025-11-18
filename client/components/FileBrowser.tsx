
import React from 'react';
import { FileNode, Commit } from '../types';
import { Icon } from './Icon';
import { timeAgo } from '../utils';

interface FileBrowserProps {
  files: FileNode;
  commits: Commit[];
  repoOwner: string;
  repoName: string;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ files, commits, repoOwner, repoName }) => {
  const sortedChildren = files.children?.sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  }) || [];

  const getLastCommitForPath = (path: string): Commit | undefined => {
    return commits.find(c => c.filesChanged.some(f => f.startsWith(path)));
  };

  return (
    <div className="border border-gh-dark-border rounded-md overflow-hidden">
      {/* Latest Commit Info */}
      {commits.length > 0 && (
        <div className="bg-gh-dark-secondary px-4 py-2.5 border-b border-gh-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img 
              src={commits[0]?.author.avatarUrl || "https://ui-avatars.com/api/?name=user"} 
              alt="avatar" 
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <span className="font-medium text-sm truncate">{commits[0]?.author.username || 'user'}</span>
            <a href="#" className="text-gh-dark-text text-sm hover:text-gh-blue hover:underline truncate">
              {commits[0]?.message || 'Initial commit'}
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs text-gh-dark-text-secondary flex-shrink-0 ml-4">
            <a href="#" className="hover:text-gh-blue hover:underline font-mono">
              {commits[0]?.shortSha || 'abc1234'}
            </a>
            <span>{timeAgo(commits[0]?.timestamp || Date.now())}</span>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="divide-y divide-gh-dark-border">
        {sortedChildren.length === 0 ? (
          <div className="px-4 py-8 text-center text-gh-dark-text-secondary">
            <p>No files yet</p>
          </div>
        ) : (
          sortedChildren.map(item => {
            const lastCommit = getLastCommitForPath(item.path);
            return (
              <div 
                key={item.id} 
                className="px-4 py-2 hover:bg-gh-dark-secondary/30 transition grid grid-cols-12 gap-4 items-center"
              >
                <div className="col-span-6 flex items-center gap-2 min-w-0">
                  <Icon 
                    name={item.type === 'folder' ? 'folder' : 'file'} 
                    className="text-gh-dark-text-secondary w-4 h-4 flex-shrink-0" 
                  />
                  <a 
                    href={`#/${repoOwner}/${repoName}/${item.type === 'folder' ? 'tree' : 'blob'}/main${item.path}`} 
                    className="text-gh-blue hover:underline text-sm font-medium truncate"
                  >
                    {item.name}
                  </a>
                </div>
                <div className="col-span-4 text-gh-dark-text-secondary text-xs truncate">
                  {lastCommit?.message || ''}
                </div>
                <div className="col-span-2 text-right text-gh-dark-text-secondary text-xs">
                  {timeAgo(item.lastModified)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FileBrowser;
