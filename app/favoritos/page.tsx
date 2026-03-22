'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { obtenerEjercicioPorId } from '@/lib/api';
import { EjercicioCard } from '@/components/EjercicioCard';
import { Spinner } from '@/components/Spinner';
import { obtenerFavoritos } from '@/lib/favoritos';

function EjercicioFavorito({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ejercicio', id],
    queryFn: () => obtenerEjercicioPorId(id),
  });

  if (isLoading) return (
    <div className="aspect-square bg-card border border-border rounded-xl animate-pulse" />
  );
  if (!data) return null;
  return <EjercicioCard ejercicio={data} />;
}

export default function Favoritos() {
  const [ids, setIds] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setIds(obtenerFavoritos());
    setCargando(false);
  }, []);

  if (cargando) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Mis favoritos</h1>
        <p className="text-muted text-sm">
          {ids.length > 0
            ? `${ids.length} ejercicio${ids.length !== 1 ? 's' : ''} guardado${ids.length !== 1 ? 's' : ''}`
            : 'Aún no tienes favoritos'}
        </p>
      </div>

      {ids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-6xl">🤍</span>
          <h2 className="text-xl font-semibold text-white">Sin favoritos todavía</h2>
          <p className="text-muted max-w-xs">
            Explora ejercicios y toca el corazón para guardarlos aquí.
          </p>
          <Link
            href="/ejercicios"
            className="mt-2 px-6 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Explorar ejercicios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ids.map((id) => (
            <EjercicioFavorito key={id} id={id} />
          ))}
        </div>
      )}
    </div>
  );
}
