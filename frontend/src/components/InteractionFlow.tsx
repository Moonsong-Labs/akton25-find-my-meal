/**
 * InteractionFlow Component
 * Shows the flow of information between different actors in the system
 * Created: 2024-04-10
 * Changes:
 * - Added animations with Framer Motion
 * - Updated styling for a more modern look
 * - Added progress indicators and icons
 */

import React from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, StepContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Search, Psychology, Map, Analytics } from '@mui/icons-material';

interface FlowStep {
  actor: string;
  action: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  timestamp?: string;
  details?: string;
}

interface InteractionFlowProps {
  steps: FlowStep[];
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
}));

const ActorBox = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transform: 'translateX(8px)',
  },
}));

const StatusIndicator = styled(Box)<{ status: string }>(({ theme, status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  marginRight: theme.spacing(1),
  backgroundColor: 
    status === 'completed' ? theme.palette.success.main :
    status === 'in-progress' ? theme.palette.info.main :
    status === 'error' ? theme.palette.error.main :
    theme.palette.grey[400],
  transition: 'all 0.3s ease',
}));

const getStepIcon = (actor: string) => {
  switch (actor) {
    case 'User':
      return <Search />;
    case 'Kluster AI':
      return <Psychology />;
    case 'Google Maps MCP':
      return <Map />;
    case 'LLaMA':
      return <Analytics />;
    default:
      return null;
  }
};

const InteractionFlow: React.FC<InteractionFlowProps> = ({ steps }) => {
  return (
    <StyledPaper elevation={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Search Progress
        </Typography>
        <Stepper orientation="vertical">
          {steps.map((step, index) => (
            <Step
              key={index}
              active={step.status === 'in-progress'}
              completed={step.status === 'completed'}
            >
              <StepLabel
                icon={
                  step.status === 'in-progress' ? (
                    <CircularProgress size={24} />
                  ) : (
                    getStepIcon(step.actor)
                  )
                }
              >
                <ActorBox
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <StatusIndicator status={step.status} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {step.actor}
                    </Typography>
                    {step.status === 'in-progress' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Typography variant="caption" color="primary">
                          Processing...
                        </Typography>
                      </motion.div>
                    )}
                  </Box>
                </ActorBox>
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {step.action}
                  </Typography>
                  {step.details && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        backgroundColor: (theme) => theme.palette.grey[50],
                        p: 1,
                        borderRadius: 1,
                        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                      }}
                    >
                      {step.details}
                    </Typography>
                  )}
                  {step.timestamp && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {step.timestamp}
                    </Typography>
                  )}
                </motion.div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </motion.div>
    </StyledPaper>
  );
};

export default InteractionFlow; 