"use client";

import { SearchStrategy as SearchStrategyType } from '@/types/restaurant';

interface SearchStrategyProps {
  strategy: SearchStrategyType;
}

export function SearchStrategy({ strategy }: SearchStrategyProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold text-blue-900">Search Strategy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">📍</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Location</p>
              <p className="text-sm text-gray-600">{strategy.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">🔍</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Search Radius</p>
              <p className="text-sm text-gray-600">{strategy.radius} meters</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">🍽️</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Type</p>
              <p className="text-sm text-gray-600">{strategy.type}</p>
            </div>
          </div>
          {strategy.keyword && (
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">🔑</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Keyword</p>
                <p className="text-sm text-gray-600">{strategy.keyword}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {strategy.open_now && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Open Now
          </span>
        )}
        {strategy.min_rating && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Min Rating: {strategy.min_rating}+
          </span>
        )}
        {strategy.max_price && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Max Price: {strategy.max_price}
          </span>
        )}
      </div>
    </div>
  );
} 