/**
 * RestaurantReport Component
 * A standalone, beautifully formatted report of restaurant recommendations
 * Created: 2024-04-10
 * Changes:
 * - Improved expert analysis formatting
 * - Added highlights section
 * - Better visual hierarchy
 */

import React from 'react';
import { Paper, Box, Typography, Rating, Chip, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Restaurant, LocationOn, Phone, Language, Schedule, Star, TrendingUp, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
}));

const RestaurantCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
}));

interface Restaurant {
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: any;
}

interface RestaurantReportProps {
  restaurants: Restaurant[];
  recommendations: string;
  originalQuery: string;
}

const formatRecommendations = (recommendations: string) => {
  // Split the text into sections based on common patterns
  const sections = recommendations.split(/\n\n+/);
  
  // Extract key highlights and tips
  const highlights = sections
    .filter(s => s.includes('recommend') || s.includes('suggest') || s.includes('perfect'))
    .map(s => s.replace(/^[•\-\d.]+\s*/, '').trim())
    .slice(0, 3);

  const tips = sections
    .filter(s => s.includes('tip') || s.includes('note') || s.includes('consider'))
    .map(s => s.replace(/^[•\-\d.]+\s*/, '').trim())
    .slice(0, 2);

  return { highlights, tips };
};

const RestaurantReport: React.FC<RestaurantReportProps> = ({
  restaurants,
  recommendations,
  originalQuery,
}) => {
  const { highlights, tips } = formatRecommendations(recommendations);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <StyledPaper elevation={3}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h4" gutterBottom component="h2" sx={{ mb: 3 }}>
          Expert Recommendations
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Based on your search: "{originalQuery}"
        </Typography>

        {/* Expert Analysis Section */}
        <Box sx={{ mb: 4 }}>
          {highlights.map((highlight, index) => (
            <HighlightBox key={index} component={motion.div} whileHover={{ x: 8 }}>
              <TrendingUp color="primary" />
              <Typography variant="body1">
                {highlight}
              </Typography>
            </HighlightBox>
          ))}
          
          {tips.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#4B5563', fontWeight: 600 }}>
                Pro Tips
              </Typography>
              {tips.map((tip, index) => (
                <HighlightBox 
                  key={index} 
                  component={motion.div} 
                  whileHover={{ x: 8 }}
                  sx={{ 
                    backgroundColor: 'rgba(249, 250, 251, 0.8)',
                    borderStyle: 'dashed',
                  }}
                >
                  <Warning color="action" sx={{ color: '#9CA3AF' }} />
                  <Typography variant="body2" color="text.secondary">
                    {tip}
                  </Typography>
                </HighlightBox>
              ))}
            </Box>
          )}
        </Box>

        {/* Top Recommendations Section */}
        <Typography variant="h6" gutterBottom sx={{ 
          borderBottom: '2px solid #E5E7EB',
          paddingBottom: 1,
          marginBottom: 3,
        }}>
          Top Picks for You
        </Typography>

        {restaurants.slice(0, 3).map((restaurant, index) => (
          <RestaurantCard
            key={index}
            variants={cardVariants}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {restaurant.name}
                </Typography>
                <DetailRow>
                  <Star color="primary" />
                  <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({restaurant.user_ratings_total} reviews)
                  </Typography>
                </DetailRow>
              </Box>
              <Chip
                label={`#${index + 1}`}
                color="primary"
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: index === 0 ? '#4F46E5' : '#E5E7EB',
                  color: index === 0 ? '#FFFFFF' : '#374151',
                }}
              />
            </Box>

            <DetailRow>
              <LocationOn color="action" />
              <Typography variant="body1">{restaurant.vicinity}</Typography>
            </DetailRow>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {restaurant.formatted_phone_number && (
                <Button
                  startIcon={<Phone />}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                  href={`tel:${restaurant.formatted_phone_number}`}
                >
                  Call
                </Button>
              )}
              {restaurant.website && (
                <Button
                  startIcon={<Language />}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </Button>
              )}
              {restaurant.opening_hours && (
                <Chip
                  icon={<Schedule />}
                  label={restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  color={restaurant.opening_hours.open_now ? 'success' : 'default'}
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
          </RestaurantCard>
        ))}
      </motion.div>
    </StyledPaper>
  );
};

export default RestaurantReport; 