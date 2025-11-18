
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Repository, User, Theme, Commit, FileNode, Notification } from '../types';
import { generateId, getFileLanguage } from '../utils';
import { repoAPI, userAPI, notificationAPI, authAPI, fileAPI } from '../services/api';

interface AppContextType {
  repositories: Repository[];
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  isAuthenticated: boolean;
  loading: boolean;
  starredRepos: string[];
  setTheme: (theme: Theme) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createRepository: (name: string, description: string, isPrivate: boolean, initializeReadme: boolean) => Promise<void>;
  deleteRepository: (owner: string, repoName: string) => Promise<void>;
  getRepository: (owner: string, name: string) => Repository | undefined;
  createFile: (repoId: string, path: string, filename: string, content: string) => void;
  starRepository: (owner: string, repoName: string, starred: boolean) => Promise<void>;
  toggleStarRepo: (repoId: string) => void;
  pinRepository: (repoId: string) => void;
  unpinRepository: (repoId: string) => void;
  fetchRepositories: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starredRepos, setStarredRepos] = useState<string[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedTheme = localStorage.getItem('gitcraft_theme') as Theme;
      
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }

      if (token) {
        try {
          const userData = await userAPI.getProfile();
          setUser({
            id: userData.id || userData._id,
            username: userData.username,
            name: userData.username,
            avatarUrl: userData.avatar || `https://ui-avatars.com/api/?name=${userData.username}`,
            bio: userData.bio || '',
            pinnedRepoIds: [],
          });
          setIsAuthenticated(true);
          await fetchRepositories();
          await fetchNotifications();
        } catch (error) {
          console.error('Auth failed:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
     try {
        localStorage.setItem('gitcraft_theme', newTheme);
      } catch (error) {
        console.error("Failed to save theme to local storage", error);
      }
  };
   
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);


  const addCommit = (repo: Repository, message: string, filesChanged: string[]): Repository => {
    const newCommit: Commit = {
        id: generateId(),
        shortSha: generateId().substring(0, 7),
        author: user,
        message,
        timestamp: Date.now(),
        filesChanged,
    };
    return { ...repo, commits: [newCommit, ...repo.commits], updatedAt: Date.now() };
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('auth_token', response.token);
    setUser({
      id: response.user.id,
      username: response.user.username,
      name: response.user.username,
      avatarUrl: `https://ui-avatars.com/api/?name=${response.user.username}`,
      bio: '',
      pinnedRepoIds: [],
    });
    setIsAuthenticated(true);
    await fetchRepositories();
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authAPI.register(username, email, password);
    localStorage.setItem('auth_token', response.token);
    setUser({
      id: response.user.id,
      username: response.user.username,
      name: response.user.username,
      avatarUrl: `https://ui-avatars.com/api/?name=${response.user.username}`,
      bio: '',
      pinnedRepoIds: [],
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setRepositories([]);
    setNotifications([]);
  };

  const fetchRepositories = async () => {
    try {
      const repos = await repoAPI.list();
      const mappedRepos = await Promise.all(repos.map(async (repo: any) => {
        // Fetch files for each repository
        let repoFiles: FileNode = { 
          id: generateId(), 
          name: 'root', 
          type: 'folder' as const, 
          path: '/', 
          children: [], 
          lastModified: Date.now() 
        };

        try {
          const files = await fileAPI.list(repo.owner.username, repo.name);
          console.log(`Fetched ${files.length} files for ${repo.name}:`, files);
          repoFiles.children = files.map((file: any) => ({
            id: file._id,
            name: file.name,
            type: 'file' as const,
            path: file.path === '/' ? `/${file.name}` : `${file.path}/${file.name}`,
            content: file.content,
            lastModified: new Date(file.updatedAt || file.createdAt).getTime(),
          }));
        } catch (error) {
          console.error(`Failed to fetch files for ${repo.name}:`, error);
        }

        return {
          id: repo._id,
          name: repo.name,
          owner: {
            id: repo.owner._id,
            username: repo.owner.username,
            name: repo.owner.username,
            avatarUrl: repo.owner.avatar || `https://ui-avatars.com/api/?name=${repo.owner.username}`,
            bio: repo.owner.bio || '',
            pinnedRepoIds: [],
          },
          description: repo.description || '',
          isPrivate: repo.isPrivate,
          stars: repo.stars?.length || 0,
          forks: repo.forks?.length || 0,
          watchers: 0,
          language: repo.language || '',
          createdAt: new Date(repo.createdAt).getTime(),
          updatedAt: new Date(repo.updatedAt).getTime(),
          files: repoFiles,
          commits: [],
        };
      }));
      setRepositories(mappedRepos);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notifs = await notificationAPI.list();
      const mappedNotifs = notifs.map((n: any) => ({
        id: n._id,
        type: n.type,
        repoName: n.repository?.name || '',
        actor: {
          username: n.sender?.username || '',
          avatarUrl: n.sender?.avatar || `https://ui-avatars.com/api/?name=${n.sender?.username}`,
        },
        title: `${n.type} notification`,
        timestamp: new Date(n.createdAt).getTime(),
        read: n.read,
      }));
      setNotifications(mappedNotifs);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const createRepository = async (name: string, description: string, isPrivate: boolean, initializeReadme: boolean) => {
    try {
      const newRepo = await repoAPI.create(name, description, isPrivate);
      await fetchRepositories();
    } catch (error: any) {
      alert(error.message || 'Failed to create repository');
      throw error;
    }
  };

  const deleteRepository = async (owner: string, repoName: string) => {
    try {
      await repoAPI.delete(owner, repoName);
      
      // Remove from repositories
      setRepositories(prev => prev.filter(repo => 
        !(repo.owner.username === owner && repo.name === repoName)
      ));
      
      // Remove from starred repos if starred
      const repoToDelete = repositories.find(r => r.owner.username === owner && r.name === repoName);
      if (repoToDelete) {
        setStarredRepos(prev => prev.filter(id => id !== repoToDelete.id));
        
        // Remove from pinned repos if pinned
        if (user?.pinnedRepoIds.includes(repoToDelete.id)) {
          setUser(prevUser => prevUser ? {
            ...prevUser,
            pinnedRepoIds: prevUser.pinnedRepoIds.filter(id => id !== repoToDelete.id)
          } : null);
        }
      }
    } catch (error) {
      console.error('Failed to delete repository:', error);
      throw error;
    }
  };

  const getRepository = useCallback((owner: string, name: string) => {
    return repositories.find(repo => repo.owner.username === owner && repo.name === name);
  }, [repositories]);

  const starRepository = async (owner: string, repoName: string, starred: boolean) => {
    try {
      if (starred) {
        await repoAPI.star(owner, repoName);
      } else {
        await repoAPI.unstar(owner, repoName);
      }
      await fetchRepositories();
    } catch (error) {
      console.error('Failed to star/unstar repository:', error);
    }
  };
  
  const createFile = (repoId: string, path: string, filename: string, content: string) => {
    setRepositories(prev => prev.map(repo => {
        if (repo.id !== repoId) return repo;

        const newFile: FileNode = {
            id: generateId(),
            name: filename,
            type: 'file',
            path: `${path === '/' ? '' : path}/${filename}`,
            content,
            lastModified: Date.now(),
        };

        const updatedFiles = { ...repo.files, children: [...(repo.files.children || []), newFile] };
        
        const updatedRepo = addCommit(repo, `Create ${filename}`, [newFile.path]);
        updatedRepo.files = updatedFiles;
        updatedRepo.language = getFileLanguage(updatedRepo.files);

        return updatedRepo;
    }));
  };

  const pinRepository = (repoId: string) => {
    setUser(prevUser => {
        if (prevUser.pinnedRepoIds.includes(repoId) || prevUser.pinnedRepoIds.length >= 6) {
            return prevUser;
        }
        return { ...prevUser, pinnedRepoIds: [...prevUser.pinnedRepoIds, repoId] };
    });
  };

  const unpinRepository = (repoId: string) => {
      setUser(prevUser => ({
          ...prevUser,
          pinnedRepoIds: prevUser.pinnedRepoIds.filter(id => id !== repoId),
      }));
  };

  const toggleStarLocal = (repoId: string) => {
    setStarredRepos(prev => {
      if (prev.includes(repoId)) {
        return prev.filter(id => id !== repoId);
      } else {
        return [...prev, repoId];
      }
    });
  };

  const toggleStarRepo = (repoId: string) => {
    setStarredRepos(prev => {
      if (prev.includes(repoId)) {
        return prev.filter(id => id !== repoId);
      } else {
        return [...prev, repoId];
      }
    });
  };

  return (
    <AppContext.Provider value={{ 
      repositories, 
      user, 
      theme, 
      notifications, 
      isAuthenticated,
      loading,
      starredRepos,
      setTheme, 
      login,
      register,
      logout,
      createRepository, 
      deleteRepository, 
      getRepository, 
      createFile, 
      starRepository,
      toggleStarRepo,
      pinRepository, 
      unpinRepository,
      fetchRepositories,
      fetchNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
