
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import NewRepoPage from './pages/NewRepoPage';
import RepoPage from './pages/RepoPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAppContext();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gh-dark flex items-center justify-center">
        <div className="text-gh-dark-text">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    const path = route.replace(/^#/, '').split('?')[0];

    if (path === '' || path === '/') {
      return <DashboardPage />;
    }
    if (path === '/new') {
      return <NewRepoPage />;
    }
    if (path === '/notifications') {
      return <NotificationsPage />;
    }
    if (path === '/search') {
      return <SearchPage />;
    }
    if (path === '/user') {
      return <ProfilePage />;
    }
    if (path === '/settings') {
      return <SettingsPage />;
    }

    const repoMatch = path.match(/^\/([^/]+)\/([^/]+)(.*)/);
    if (repoMatch) {
      const [, owner, repoName, rest] = repoMatch;
      // Decode URL-encoded characters (like %20 for spaces)
      const decodedOwner = decodeURIComponent(owner);
      const decodedRepoName = decodeURIComponent(repoName);
      return <RepoPage owner={decodedOwner} repoName={decodedRepoName} path={rest || '/'} />;
    }
    
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gh-dark text-black dark:text-gh-dark-text font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
