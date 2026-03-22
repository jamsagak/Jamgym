import { NextRequest, NextResponse } from 'next/server';

const API_KEY =
  process.env.RAPIDAPI_KEY ??
  process.env.NEXT_PUBLIC_RAPIDAPI_KEY ??
  '';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Falta el parámetro url', { status: 400 });
  }

  if (!url.startsWith('https://v2.exercisedb.io/')) {
    return new NextResponse('URL no permitida', { status: 403 });
  }

  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  });

  if (!res.ok) {
    return new NextResponse('Error al obtener imagen', { status: res.status });
  }

  const contentType = res.headers.get('content-type') ?? 'image/gif';
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
