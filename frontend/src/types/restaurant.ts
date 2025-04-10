// Types for the restaurant finder application

export interface Restaurant {
  name: string;
  place_id: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  formatted_address?: string;
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  distance?: number;
}

export interface SearchStrategy {
  location: string;
  radius: number;
  type: string;
  keyword?: string;
  open_now?: boolean;
  min_rating?: number;
  max_price?: number;
}

export interface SearchResult {
  strategy: SearchStrategy;
  restaurants: Restaurant[];
  analysis: {
    matching_factors: string[];
    concerns: string[];
    score: number;
  };
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  currentStep: 'input' | 'strategy' | 'searching' | 'results' | 'error';
  strategy?: SearchStrategy;
  results?: SearchResult;
  error?: string;
} 