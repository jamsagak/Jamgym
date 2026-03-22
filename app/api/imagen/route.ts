import { NextRequest, NextResponse } from 'next/server';

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

const ALLOWED_ORIGINS = [
  'https://static.exercisedb.dev/',
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) return placeholderResponse();

  if (!ALLOWED_ORIGINS.some((o) => url.startsWith(o))) {
    return placeholderResponse();
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return placeholderResponse();

    const contentType = res.headers.get('content-type') ?? 'image/gif';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return placeholderResponse();
  }
}
