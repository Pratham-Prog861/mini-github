
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gh-dark-text-secondary">404</h1>
      <p className="text-2xl mt-4 text-gh-dark-text">Page Not Found</p>
      <p className="mt-2 text-gh-dark-text-secondary">The page you are looking for does not exist.</p>
      <a href="#" className="mt-6 inline-block bg-gh-blue text-white font-semibold px-6 py-2 rounded-md hover:opacity-90 transition">
        Go to Dashboard
      </a>
    </div>
  );
};

export default NotFoundPage;
