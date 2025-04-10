"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          What are you looking for?
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Japanese food near Mendoza and Av. Cramer, Belgrano"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Button
              type="submit"
              variant="primary"
              disabled={!query.trim()}
              className="ml-2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <p>Try searching with:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Type of cuisine (e.g., Italian, Japanese)</li>
          <li>Location (e.g., near a specific address or neighborhood)</li>
          <li>Additional preferences (e.g., open now, with outdoor seating)</li>
        </ul>
      </div>
    </form>
  );
} 