'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { traducirParte, traducirEquipamiento } from '@/lib/traducciones';
import { esFavorito, toggleFavorito } from '@/lib/favoritos';
import type { Ejercicio } from '@/types/ejercicio';

interface Props {
  ejercicio: Ejercicio;
}

function gifProxy(url: string): string {
  if (!url) return '';
  return `/api/imagen?url=${encodeURIComponent(url)}`;
}

export function EjercicioCard({ ejercicio }: Props) {
  const [favorito, setFavorito] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setFavorito(esFavorito(ejercicio.id));
  }, [ejercicio.id]);

  function handleFavorito(e: React.MouseEvent) {
    e.preventDefault();
    const nuevo = toggleFavorito(ejercicio.id);
    setFavorito(nuevo);
  }

  return (
    <Link
      href={`/ejercicio/${ejercicio.id}`}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:bg-hover transition-all duration-200"
    >
      {/* GIF */}
      <div className="relative aspect-square bg-dark gif-container">
        {!imgError ? (
          <img
            src={gifProxy(ejercicio.gifUrl)}
            alt={ejercicio.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏋️
          </div>
        )}

        {/* Botón favorito */}
        <button
          onClick={handleFavorito}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
          aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <span className="text-sm">{favorito ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white capitalize leading-snug line-clamp-2 mb-2">
          {ejercicio.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {traducirParte(ejercicio.bodyPart)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted border border-border capitalize">
            {traducirEquipamiento(ejercicio.equipment)}
          </span>
        </div>
      </div>
    </Link>
  );
}
