/**
 * Restaurant Search API Route
 * Created: 2024-04-10
 * Changes:
 * - Initial implementation of restaurant search endpoint
 * - Updated backend URL to use correct port
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    // Call the backend API
    const response = await fetch('http://localhost:8001/api/restaurants/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Backend API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in restaurant search:', error);
    return NextResponse.json(
      { error: 'Failed to search restaurants' },
      { status: 500 }
    );
  }
} 