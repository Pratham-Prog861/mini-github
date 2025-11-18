
import React from 'react';
import { Repository, FileNode } from '../types';
import FileBrowser from '../components/FileBrowser';
import Breadcrumbs from '../components/Breadcrumbs';
import CodeViewer from '../components/CodeViewer';
import MarkdownViewer from '../components/MarkdownViewer';
import { getFileLanguage } from '../utils';

interface RepoCodePageProps {
  repo: Repository;
  path: string;
}

const findNodeByPath = (root: FileNode, path: string): FileNode | null => {
  if (path === '/' || path === '') return root;
  const parts = path.split('/').filter(Boolean);
  let currentNode: FileNode | undefined = root;

  for (const part of parts) {
    currentNode = currentNode?.children?.find(child => child.name === part);
    if (!currentNode) return null;
  }
  return currentNode || null;
};

const RepoCodePage: React.FC<RepoCodePageProps> = ({ repo, path }) => {
  const currentNode = findNodeByPath(repo.files, path);
  
  if (!currentNode) {
    return <div className="text-center p-8">404 - File or directory not found at path: {path}</div>;
  }

  const readmeFile = currentNode.type === 'folder' 
    ? currentNode.children?.find(f => f.name.toLowerCase() === 'readme.md') 
    : null;

  return (
    <div>
      <Breadcrumbs owner={repo.owner.username} repoName={repo.name} path={path} />
      
      {currentNode.type === 'folder' && (
        <div className="space-y-6">
          <FileBrowser files={currentNode} commits={repo.commits} repoOwner={repo.owner.username} repoName={repo.name} />
          {readmeFile && readmeFile.content && (
            <MarkdownViewer content={readmeFile.content} />
          )}
        </div>
      )}

      {currentNode.type === 'file' && (
        <div>
          {path.toLowerCase().endsWith('.md') ? (
            <MarkdownViewer content={currentNode.content || ''} />
          ) : (
            <CodeViewer code={currentNode.content || ''} language={getFileLanguage(currentNode)} />
          )}
        </div>
      )}
    </div>
  );
};

export default RepoCodePage;
