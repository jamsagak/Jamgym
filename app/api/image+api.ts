import { ExpoRequest, ExpoResponse } from 'expo-router/server';

const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY ?? '';

export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new ExpoResponse('Missing url parameter', { status: 400 });
  }

  // Only proxy exercisedb images
  if (!imageUrl.startsWith('https://v2.exercisedb.io/')) {
    return new ExpoResponse('Invalid image url', { status: 403 });
  }

  const response = await fetch(imageUrl, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  });

  if (!response.ok) {
    return new ExpoResponse('Failed to fetch image', { status: response.status });
  }

  const contentType = response.headers.get('content-type') ?? 'image/gif';
  const buffer = await response.arrayBuffer();

  return new ExpoResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
