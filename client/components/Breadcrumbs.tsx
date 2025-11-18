
import React from 'react';

interface BreadcrumbsProps {
  owner: string;
  repoName: string;
  path: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ owner, repoName, path }) => {
  const pathParts = path.split('/').filter(Boolean);

  const getPathHref = (index: number) => {
    const subPath = pathParts.slice(0, index + 1).join('/');
    return `#/${owner}/${repoName}/tree/main/${subPath}`;
  };

  return (
    <div className="text-xl mb-4 flex items-center flex-wrap">
      <a href={`#/${owner}/${repoName}`} className="font-semibold text-gh-blue hover:underline">
        {repoName}
      </a>
      {pathParts.length > 0 && <span className="mx-2 text-gh-dark-text-secondary">/</span>}
      {pathParts.map((part, index) => (
        <React.Fragment key={index}>
          {index < pathParts.length - 1 ? (
            <>
              <a href={getPathHref(index)} className="text-gh-blue hover:underline">
                {part}
              </a>
              <span className="mx-2 text-gh-dark-text-secondary">/</span>
            </>
          ) : (
            <span className="font-semibold">{part}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
