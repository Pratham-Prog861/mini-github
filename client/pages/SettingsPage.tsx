import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { user, theme, setTheme } = useAppContext();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved! (This is a demo)');
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="border border-gh-dark-border rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gh-dark border border-gh-dark-border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gh-dark border border-gh-dark-border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border border-gh-dark-border rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="bg-gh-dark border border-gh-dark-border rounded-md px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gh-green text-white px-4 py-2 rounded-md font-semibold"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
