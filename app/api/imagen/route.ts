import { NextRequest, NextResponse } from 'next/server';

const API_KEY =
  process.env.RAPIDAPI_KEY ||
  process.env.NEXT_PUBLIC_RAPIDAPI_KEY ||
  process.env.EXPO_PUBLIC_RAPIDAPI_KEY ||
  '';

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

const EXERCISEDB_ORIGINS = [
  'https://v2.exercisedb.io/',
  'https://exercisedb.p.rapidapi.com/image',
  'https://static.exercisedb.dev/',
];
const GITHUB_ORIGIN = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) return placeholderResponse();

  const isExerciseDB = EXERCISEDB_ORIGINS.some((o) => url.startsWith(o));
  const isGitHub = url.startsWith(GITHUB_ORIGIN);

  if (!isExerciseDB && !isGitHub) {
    console.warn('[imagen proxy] URL no permitida:', url);
    return placeholderResponse();
  }

  try {
    // Solo enviar headers de RapidAPI para exercisedb, no para GitHub
    const headers: HeadersInit = {};
    if (isExerciseDB) {
      headers['X-RapidAPI-Host'] = 'exercisedb.p.rapidapi.com';
      if (API_KEY) headers['X-RapidAPI-Key'] = API_KEY;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) return placeholderResponse();

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
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
