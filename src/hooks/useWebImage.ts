import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY ?? '';

// In-memory cache: original URL -> blob URL (web only)
const blobCache = new Map<string, string>();

/**
 * On web, ExerciseDB image URLs require API key headers that <img> tags
 * cannot send. This hook fetches the image via JS with the proper headers
 * and returns a blob URL the Image component can use directly.
 *
 * On native, returns the original URL unchanged.
 */
export function useWebImage(originalUri: string): string | null {
  const [blobUri, setBlobUri] = useState<string | null>(() => {
    if (Platform.OS !== 'web') return originalUri;
    return blobCache.get(originalUri) ?? null;
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || !originalUri) return;

    if (blobCache.has(originalUri)) {
      setBlobUri(blobCache.get(originalUri)!);
      return;
    }

    let cancelled = false;

    fetch(originalUri, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        blobCache.set(originalUri, url);
        setBlobUri(url);
      })
      .catch(() => {
        if (!cancelled) setBlobUri(null);
      });

    return () => {
      cancelled = true;
    };
  }, [originalUri]);

  return blobUri;
}
