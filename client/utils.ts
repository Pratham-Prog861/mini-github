
import { FileNode } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const timeAgo = (timestamp: number): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
};

const countLanguages = (node: FileNode, counts: Record<string, number>) => {
  if (node.type === 'file') {
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        counts['JavaScript'] = (counts['JavaScript'] || 0) + 1;
        break;
      case 'ts':
      case 'tsx':
        counts['TypeScript'] = (counts['TypeScript'] || 0) + 1;
        break;
      case 'html':
        counts['HTML'] = (counts['HTML'] || 0) + 1;
        break;
      case 'css':
        counts['CSS'] = (counts['CSS'] || 0) + 1;
        break;
       case 'md':
        counts['Markdown'] = (counts['Markdown'] || 0) + 1;
        break;
    }
  } else if (node.children) {
    for (const child of node.children) {
      countLanguages(child, counts);
    }
  }
};

export const getFileLanguage = (node: FileNode): string => {
  if (node.type === 'file') {
     const ext = node.name.split('.').pop()?.toLowerCase();
     switch (ext) {
        case 'js': case 'jsx': return 'JavaScript';
        case 'ts': case 'tsx': return 'TypeScript';
        case 'html': return 'HTML';
        case 'css': return 'CSS';
        case 'md': return 'Markdown';
        default: return 'Text';
     }
  }

  const counts: Record<string, number> = {};
  countLanguages(node, counts);

  if (Object.keys(counts).length === 0) return 'Text';

  return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0];
};
