import { NextRequest, NextResponse } from 'next/server';

// Soporta tanto el nombre nuevo (Next.js) como el viejo (Expo)
const API_KEY =
  process.env.RAPIDAPI_KEY ||
  process.env.NEXT_PUBLIC_RAPIDAPI_KEY ||
  process.env.EXPO_PUBLIC_RAPIDAPI_KEY ||
  '';

// SVG placeholder cuando la imagen falla
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#111827"/>
  <text x="150" y="140" text-anchor="middle" font-size="60">🏋️</text>
  <text x="150" y="190" text-anchor="middle" font-size="14" fill="#6B7280" font-family="sans-serif">Sin imagen</text>
</svg>`;

function placeholderResponse() {
  return new NextResponse(PLACEHOLDER_SVG, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) return placeholderResponse();

  // Solo permitir URLs de exercisedb
  const allowed =
    url.startsWith('https://v2.exercisedb.io/') ||
    url.startsWith('https://exercisedb.p.rapidapi.com/image') ||
    url.startsWith('https://static.exercisedb.dev/');
  if (!allowed) {
    console.warn('[imagen proxy] URL no permitida:', url);
    return placeholderResponse();
  }

  try {
    const headers: HeadersInit = {
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    };
    if (API_KEY) headers['X-RapidAPI-Key'] = API_KEY;

    console.log('[imagen proxy] Fetching:', url, '| API_KEY presente:', !!API_KEY);

    const res = await fetch(url, { headers });

    console.log('[imagen proxy] Status:', res.status, res.statusText);

    if (!res.ok) return placeholderResponse();

    const contentType = res.headers.get('content-type') ?? 'image/gif';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('[imagen proxy] Error:', err);
    return placeholderResponse();
  }
}
