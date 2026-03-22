'use client';

import { use, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { obtenerEjercicioPorId, obtenerEjerciciosPorMusculo } from '@/lib/api';
import { EjercicioCard } from '@/components/EjercicioCard';
import { Spinner } from '@/components/Spinner';
import { ErrorMsg } from '@/components/ErrorMsg';
import { traducirParte, traducirMusculo, traducirEquipamiento } from '@/lib/traducciones';
import { esFavorito, toggleFavorito } from '@/lib/favoritos';

function gifProxy(url: string): string {
  if (!url) return '';
  return `/api/imagen?url=${encodeURIComponent(url)}`;
}

export default function DetalleEjercicio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [favorito, setFavorito] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: ejercicio, isLoading, isError, refetch } = useQuery({
    queryKey: ['ejercicio', id],
    queryFn: () => obtenerEjercicioPorId(id),
  });

  const { data: similares } = useQuery({
    queryKey: ['similares', ejercicio?.target],
    queryFn: () => obtenerEjerciciosPorMusculo(ejercicio!.target, 6, 0),
    enabled: !!ejercicio?.target,
  });

  useEffect(() => {
    if (ejercicio) setFavorito(esFavorito(ejercicio.id));
  }, [ejercicio]);

  if (isLoading) return <Spinner texto="Cargando ejercicio..." />;
  if (isError || !ejercicio) return <ErrorMsg onReintentar={refetch} />;

  const similaresFiltered = (similares ?? []).filter((e) => e.id !== id).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/ejercicios" className="hover:text-primary transition-colors">Ejercicios</Link>
        <span>/</span>
        <span className="text-secondary capitalize truncate">{ejercicio.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* GIF */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden aspect-square flex items-center justify-center gif-container">
          {!imgError ? (
            <img
              src={gifProxy(ejercicio.gifUrl)}
              alt={ejercicio.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-7xl">🏋️</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-white capitalize leading-tight">
              {ejercicio.name}
            </h1>
            <button
              onClick={() => setFavorito(toggleFavorito(ejercicio.id))}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
              aria-label="Favorito"
            >
              <span className="text-xl">{favorito ? '❤️' : '🤍'}</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Tag label={traducirParte(ejercicio.bodyPart)} color="primary" />
            <Tag label={traducirMusculo(ejercicio.target)} color="secondary" />
            <Tag label={traducirEquipamiento(ejercicio.equipment)} color="muted" />
          </div>

          {/* Músculos secundarios */}
          {ejercicio.secondaryMuscles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Músculos secundarios
              </h3>
              <div className="flex flex-wrap gap-2">
                {ejercicio.secondaryMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-secondary border border-border capitalize"
                  >
                    {traducirMusculo(m)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <StatBox titulo="Grupo muscular" valor={traducirParte(ejercicio.bodyPart)} />
            <StatBox titulo="Objetivo" valor={traducirMusculo(ejercicio.target)} />
            <StatBox titulo="Equipamiento" valor={traducirEquipamiento(ejercicio.equipment)} />
            <StatBox titulo="Pasos" valor={`${ejercicio.instructions.length} pasos`} />
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      {ejercicio.instructions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Cómo realizar el ejercicio</h2>
          <div className="flex flex-col gap-4">
            {ejercicio.instructions.map((paso, i) => (
              <div key={i} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-secondary text-sm leading-relaxed pt-0.5">{paso}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similares */}
      {similaresFiltered.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-6">
            Ejercicios similares — {traducirMusculo(ejercicio.target)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {similaresFiltered.map((ej) => (
              <EjercicioCard key={ej.id} ejercicio={ej} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Tag({ label, color }: { label: string; color: 'primary' | 'secondary' | 'muted' }) {
  const styles = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-white/5 text-secondary border-white/10',
    muted: 'bg-white/5 text-muted border-border',
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${styles[color]}`}>
      {label}
    </span>
  );
}

function StatBox({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="p-3 bg-card border border-border rounded-xl">
      <p className="text-xs text-muted mb-1">{titulo}</p>
      <p className="text-sm font-semibold text-white capitalize">{valor}</p>
    </div>
  );
}
