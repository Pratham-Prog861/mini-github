
import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    let html = text;

    // Headers
    html = html.replace(/^###### (.*$)/gim, '<h6 class="text-lg font-semibold mb-2">$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5 class="text-xl font-semibold mb-2">$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-semibold mb-4">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-3xl font-semibold mb-4 border-b border-gh-dark-border pb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-4xl font-semibold mb-4 border-b border-gh-dark-border pb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-5xl font-semibold mb-4 border-b border-gh-dark-border pb-2">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-gh-blue hover:underline">$1</a>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gh-dark-secondary p-4 rounded-md my-4"><code class="font-mono text-sm">$1</code></pre>');
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gh-dark-secondary px-1.5 py-1 rounded-md font-mono text-sm">$1</code>');

    // Unordered lists
    html = html.replace(/^\s*\n\*/g, '<ul>\n*');
    html = html.replace(/^(\*.+)\s*\n([^*])/g, '$1\n</ul>\n$2');
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

    // Paragraphs
    html = html.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');

    return html;
  };

  return (
    <div className="prose prose-invert max-w-none p-6 border border-gh-dark-border rounded-md"
         dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
  );
};

export default MarkdownViewer;
