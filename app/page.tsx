'use client';

import { useEffect, useState } from 'react';
import CharacterUpload from './components/CharacterUpload';
import CharacterCard from './components/CharacterCard';
import { Character, FileUploadResponse } from './types/character';

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      const data = await response.json();
      console.log('Fetched characters:', data); // Debug log
      if (Array.isArray(data)) {
        setCharacters(data);
        setError(null);
      } else {
        console.error('Invalid data format:', data);
        setCharacters([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]);
      setError('Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleUploadSuccess = (response: FileUploadResponse) => {
    fetchCharacters();
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCharacters(characters.filter(char => char.id !== id));
      } else {
        alert('Failed to delete character');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      alert('Error deleting character');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Character AI Interface
        </h1>

        <div className="mb-8">
          <CharacterUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading characters...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No characters added yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Upload character files to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={handleDeleteCharacter}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
