import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login, register } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      window.location.hash = '#/';
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gh-dark">
      <div className="max-w-md w-full space-y-8 p-8 bg-gh-dark-secondary rounded-lg border border-gh-dark-border">
        <div>
          <h2 className="text-center text-3xl font-bold text-gh-dark-text">
            {isLogin ? 'Sign in to Mini GitHub' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gh-dark-text">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md text-gh-dark-text focus:outline-none focus:ring-2 focus:ring-gh-blue"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gh-dark-text">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md text-gh-dark-text focus:outline-none focus:ring-2 focus:ring-gh-blue"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gh-dark-text">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md text-gh-dark-text focus:outline-none focus:ring-2 focus:ring-gh-blue"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gh-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gh-green"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gh-blue hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
