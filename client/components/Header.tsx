
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Icon } from './Icon';

const Header: React.FC = () => {
  const { theme, setTheme, user, logout } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchQuery('');
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="bg-gh-dark-secondary text-white p-4 flex items-center justify-between border-b border-gh-dark-border">
      <div className="flex items-center space-x-4">
        <a href="#" className="flex items-center space-x-2 text-white">
          <Icon name="github" className="h-8 w-8" />
          <span className="font-semibold hidden sm:inline">Mini GitHub</span>
        </a>
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or jump to..."
            className="bg-gh-dark border border-gh-dark-border rounded-md px-3 py-1.5 w-80 focus:outline-none focus:ring-2 focus:ring-gh-blue transition-all"
          />
        </form>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-700">
          {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>
        <a href="#/notifications" className="p-1 rounded-full hover:bg-gray-700 hidden md:block">
           <Icon name="bell" />
        </a>
        {user && (
          <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(prev => !prev)} className="block focus:outline-none">
                  <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
              </button>
              {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gh-dark-secondary border border-gh-dark-border rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-gh-dark-border">
                          <p className="text-sm text-gh-dark-text">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                      </div>
                      <a href="#/user" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gh-dark-text hover:bg-gh-blue hover:text-white">Your profile</a>
                      <a href="#/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gh-dark-text hover:bg-gh-blue hover:text-white">Settings</a>
                      <div className="border-t border-gh-dark-border my-1"></div>
                      <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gh-dark-text hover:bg-gh-blue hover:text-white">Sign out</button>
                  </div>
              )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
