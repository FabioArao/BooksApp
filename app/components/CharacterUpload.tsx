'use client';

import { useState } from 'react';
import { FileUploadResponse } from '../types/character';

interface CharacterUploadProps {
  onUploadSuccess: (response: FileUploadResponse) => void;
}

export default function CharacterUpload({ onUploadSuccess }: CharacterUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [characterName, setCharacterName] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (!formData.get('personality') || !formData.get('background')) {
      alert('Please select both personality and background files');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        body: formData,
      });
      
      const data: FileUploadResponse = await response.json();
      if (data.success) {
        onUploadSuccess(data);
        form.reset();
        setCharacterName('');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Add New Character</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Character Name
          </label>
          <input
            type="text"
            name="name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personality File
          </label>
          <input
            type="file"
            name="personality"
            accept=".txt"
            className="input-file"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background File
          </label>
          <input
            type="file"
            name="background"
            accept=".txt"
            className="input-file"
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Character Files'}
        </button>
      </form>
    </div>
  );
}
