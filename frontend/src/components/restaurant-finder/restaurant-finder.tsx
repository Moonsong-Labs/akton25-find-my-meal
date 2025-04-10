"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchState, SearchResult, Restaurant } from '@/types/restaurant';
import { searchRestaurants } from '@/lib/api/restaurant';
import { SearchStrategy } from './search-strategy';
import { SearchResults } from './search-results';
import { SearchInput } from './search-input';
import { LoadingSpinner } from './loading-spinner';

export function RestaurantFinder() {
  const [state, setState] = useState<SearchState>({
    query: '',
    isSearching: false,
    currentStep: 'input',
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, query, isSearching: true, currentStep: 'strategy' }));
    
    try {
      const results = await searchRestaurants(query);
      setState(prev => ({
        ...prev,
        isSearching: false,
        currentStep: 'results',
        results,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSearching: false,
        currentStep: 'error',
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const handleReset = () => {
    setState({
      query: '',
      isSearching: false,
      currentStep: 'input',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find the perfect restaurant using AI-powered search
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {state.currentStep === 'input' && (
            <SearchInput onSearch={handleSearch} />
          )}

          {state.currentStep === 'strategy' && (
            <div className="space-y-4">
              <LoadingSpinner message="Analyzing your request..." />
            </div>
          )}

          {state.currentStep === 'searching' && (
            <div className="space-y-4">
              <LoadingSpinner message="Searching for restaurants..." />
            </div>
          )}

          {state.currentStep === 'results' && state.results && (
            <div className="space-y-6">
              <SearchStrategy strategy={state.results.strategy} />
              <SearchResults results={state.results} />
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  Start New Search
                </Button>
              </div>
            </div>
          )}

          {state.currentStep === 'error' && (
            <div className="text-center space-y-4">
              <div className="text-red-600">
                {state.error}
              </div>
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 