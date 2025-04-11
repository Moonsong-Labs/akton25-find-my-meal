import { NextRequest, NextResponse } from "next/server";

/**
 * Simple proxy server for demonstration purposes
 * This allows us to avoid CORS issues by proxying requests through our own server
 */
export async function GET(request: NextRequest) {
  // Get the URL to proxy from the query parameters
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    // Forward the request to the target URL
    const response = await fetch(url);

    // Get the response data
    const data = await response.json();

    // Return the proxied response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from the proxied URL" },
      { status: 500 }
    );
  }
}
