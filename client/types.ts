export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  pinnedRepoIds: string[];
  followers?: number;
  following?: number;
  location?: string;
  timezone?: string;
}

export type FileType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  path: string;
  content?: string;
  children?: FileNode[];
  lastModified: number;
}

export interface Commit {
  id: string;
  shortSha: string;
  author: User;
  message: string;
  timestamp: number;
  filesChanged: string[];
}

export interface Repository {
  id: string;
  name: string;
  owner: User;
  description: string;
  isPrivate: boolean;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  license?: string;
  createdAt: number;
  updatedAt: number;
  files: FileNode; // Root directory
  commits: Commit[];
}

export type Theme = "light" | "dark";

export interface Notification {
  id: string;
  type: "star" | "fork" | "issue";
  repoName: string;
  actor: {
    username: string;
    avatarUrl: string;
  };
  title: string;
  timestamp: number;
  read: boolean;
}
