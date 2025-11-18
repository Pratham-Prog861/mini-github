import React, { useState } from 'react';
import { fileAPI } from '../services/api';

interface FileUploadProps {
  username: string;
  reponame: string;
  onUploadComplete: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ username, reponame, onUploadComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = async () => {
    if (!fileName || !fileContent) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await fileAPI.upload(username, reponame, '/', fileName, fileContent);
      alert('File uploaded successfully!');
      setIsOpen(false);
      setFileName('');
      setFileContent('');
      onUploadComplete();
    } catch (error: any) {
      alert(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gh-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        Upload File
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gh-dark-secondary border border-gh-dark-border rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gh-dark-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gh-blue file:text-white hover:file:bg-blue-600"
            />
          </div>

          {fileName && (
            <div>
              <label className="block text-sm font-medium mb-2">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md"
              />
            </div>
          )}

          {fileContent && (
            <div>
              <label className="block text-sm font-medium mb-2">Content Preview</label>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 bg-gh-dark border border-gh-dark-border rounded-md font-mono text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading || !fileName}
            className="bg-gh-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setFileName('');
              setFileContent('');
            }}
            className="bg-gh-dark-secondary border border-gh-dark-border px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
