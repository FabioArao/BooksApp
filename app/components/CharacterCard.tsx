'use client';

import { useState } from 'react';
import { Character, CharacterResponse } from '../types/character';

interface CharacterCardProps {
  character: Character;
  onDelete?: (id: string) => void;
}

export default function CharacterCard({ character, onDelete }: CharacterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/characters/${character.id}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      // Refresh character data or handle response
      setPrompt('');
    } catch (error) {
      alert('Error getting response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{character.name}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:text-primary/80 mt-1"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(character.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mb-4 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Personality</h4>
            <p className="text-sm text-gray-600">{character.personality || 'No personality defined'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Background</h4>
            <p className="text-sm text-gray-600">{character.background || 'No background defined'}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">Responses</h4>
        <div className="space-y-2">
          {character.responses.map((response) => (
            <div key={response.id} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">{response.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {new Date(response.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
