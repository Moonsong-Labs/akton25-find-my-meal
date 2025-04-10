/**
 * ThemeRegistry Component
 * Created: 2024-04-10
 * Changes:
 * - Initial implementation of Material-UI theme provider
 */

'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
});

// Create a theme instance
const theme = createTheme({
  typography: {
    fontFamily: [
      geistSans.style.fontFamily,
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 