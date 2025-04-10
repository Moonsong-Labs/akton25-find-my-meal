/**
 * Main Page Component
 * Created: 2024-04-10
 * Changes:
 * - Added InteractionFlow component
 * - Added state management for flow steps
 * - Added recommendations display
 * - Improved error handling and progress display
 * - Updated UI with modern design and animations
 * - Added RestaurantReport component
 */

'use client';

import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography, CircularProgress, Paper, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import InteractionFlow from '@/components/InteractionFlow';
import RestaurantReport from '@/components/RestaurantReport';
import { styled } from '@mui/material/styles';

interface FlowStep {
  actor: string;
  action: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  timestamp?: string;
  details?: string;
}

interface SearchResult {
  strategy: {
    location: string;
    radius: number;
    type: string;
    keyword?: string;
    open_now?: boolean;
    min_rating?: number;
    max_price?: number;
  };
  restaurants: Array<{
    name: string;
    place_id: string;
    rating: number;
    user_ratings_total: number;
    vicinity: string;
    formatted_address?: string;
    website?: string;
    formatted_phone_number?: string;
    opening_hours?: any;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  analysis: {
    matching_factors: string[];
    concerns: string[];
    score: number;
    recommendations?: string;
  };
}

const SearchContainer = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
}));

const SearchWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
});

const SearchIconWrapper = styled(Box)({
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  color: '#6B7280',
  display: 'flex',
  alignItems: 'center',
});

const StyledInput = styled('input')({
  width: '100%',
  padding: '14px 14px 14px 44px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#111827',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D1D5DB',
  borderRadius: '24px',
  outline: 'none',
  '&::placeholder': {
    color: '#6B7280',
  },
  '&:focus': {
    borderColor: '#9CA3AF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
});

const SearchButton = styled(Button)({
  position: 'absolute',
  right: '4px',
  top: '50%',
  transform: 'translateY(-50%)',
  minWidth: 'auto',
  padding: '8px 16px',
  backgroundColor: '#F3F4F6',
  color: '#374151',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#E5E7EB',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
});

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResult(null);
    setShowReport(false);
    
    // Initial steps
    setFlowSteps([
      {
        actor: 'User',
        action: 'Submitted search query',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString(),
        details: query
      },
      {
        actor: 'Kluster AI',
        action: 'Creating optimized Google Maps search prompt',
        status: 'in-progress',
        timestamp: new Date().toLocaleTimeString(),
        details: 'Converting natural language to structured Google Maps query'
      },
      {
        actor: 'Google Maps MCP',
        action: 'Searching for restaurants',
        status: 'pending',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        actor: 'LLaMA',
        action: 'Analyzing results',
        status: 'pending',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    try {
      const response = await fetch('/api/restaurants/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResult(data);

      // Update steps based on the response
      setFlowSteps(prev => prev.map(step => {
        switch (step.actor) {
          case 'Kluster AI':
            return {
              ...step,
              status: 'completed',
              details: 'Query processed for Google Maps search'
            };
          case 'Google Maps MCP':
            return {
              ...step,
              status: 'completed',
              details: `Found ${data.restaurants.length} restaurants matching your criteria`
            };
          case 'LLaMA':
            return {
              ...step,
              status: data.analysis?.recommendations ? 'completed' : 'error',
              details: data.analysis?.recommendations 
                ? 'Generated personalized recommendations' 
                : 'Could not generate recommendations'
            };
          default:
            return step;
        }
      }));

      // Show the report after a short delay
      setTimeout(() => setShowReport(true), 500);

    } catch (error) {
      // Update steps to show where the error occurred
      setFlowSteps(prev => prev.map(step => {
        if (step.status === 'in-progress' || step.status === 'pending') {
          return {
            ...step,
            status: 'error',
            details: error instanceof Error ? error.message : 'Failed to complete'
          };
        }
        return step;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#FFFFFF' }}>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ 
              fontWeight: 'bold', 
              mb: 4,
              color: '#111827',
              fontSize: '2.5rem',
            }}
          >
            Restaurant Finder
          </Typography>
        </motion.div>

        <SearchContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon sx={{ fontSize: 20 }} />
            </SearchIconWrapper>
            <StyledInput
              placeholder="What kind of food are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton
              onClick={handleSearch}
              disabled={isLoading || !query}
            >
              {isLoading ? (
                <CircularProgress size={16} sx={{ color: '#9CA3AF' }} />
              ) : (
                'Search'
              )}
            </SearchButton>
          </SearchWrapper>
        </SearchContainer>

        <AnimatePresence>
          {flowSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InteractionFlow steps={flowSteps} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReport && searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RestaurantReport
                restaurants={searchResult.restaurants}
                recommendations={searchResult.analysis.recommendations || ''}
                originalQuery={query}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
}
