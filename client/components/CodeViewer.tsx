
import React from 'react';

interface CodeViewerProps {
  code: string;
  language: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, language }) => {

  const highlight = (code: string, lang: string) => {
    let highlightedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    switch (lang.toLowerCase()) {
      case 'js':
      case 'javascript':
      case 'ts':
      case 'typescript':
        // keywords
        highlightedCode = highlightedCode.replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|super)\b/g, '<span class="text-pink-400">$1</span>');
        // strings
        highlightedCode = highlightedCode.replace(/('|"|`)(.*?)(\1)/g, '<span class="text-green-400">$1$2$3</span>');
        // comments
        highlightedCode = highlightedCode.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
        // numbers
        highlightedCode = highlightedCode.replace(/\b(\d+)\b/g, '<span class="text-indigo-400">$1</span>');
        break;
      case 'css':
        // selectors
        highlightedCode = highlightedCode.replace(/(^|[\s{,])([\w.#-:]+)\s*\{/g, '$1<span class="text-yellow-400">$2</span> {');
        // properties
        highlightedCode = highlightedCode.replace(/([a-zA-Z-]+)(:)/g, '<span class="text-blue-400">$1</span>$2');
        // units
        highlightedCode = highlightedCode.replace(/(\d+)(px|em|rem|%|vh|vw)/g, '<span class="text-indigo-400">$1$2</span>');
        break;
      case 'html':
         // tags
         highlightedCode = highlightedCode.replace(/(&lt;\/?)([a-zA-Z0-9]+)/g, '$1<span class="text-pink-400">$2</span>');
         // attributes
         highlightedCode = highlightedCode.replace(/(\s[a-zA-Z-]+)=/g, ' <span class="text-blue-400">$1</span>=');
         // attribute values
         highlightedCode = highlightedCode.replace(/(".*?")/g, '<span class="text-green-400">$1</span>');
        break;
      default:
        break;
    }
    return highlightedCode;
  };

  const highlightedHTML = highlight(code, language);
  const lines = code.split('\n');

  return (
    <div className="border border-gh-dark-border rounded-md overflow-hidden">
        <div className="flex bg-gh-dark-secondary border-b border-gh-dark-border p-2 text-sm">
            <span>{lines.length} lines</span>
        </div>
        <div className="p-4 text-sm bg-gh-dark-secondary/50 font-mono overflow-x-auto">
            <div className="flex">
                <div className="text-right pr-4 text-gh-dark-text-secondary select-none">
                    {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <pre><code dangerouslySetInnerHTML={{ __html: highlightedHTML }} /></pre>
            </div>
        </div>
    </div>
  );
};

export default CodeViewer;
