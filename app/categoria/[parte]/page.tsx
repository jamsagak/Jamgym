'use client';

import { useState } from 'react';
import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerEjerciciosPorParte } from '@/lib/api';
import { EjercicioCard } from '@/components/EjercicioCard';
import { Spinner } from '@/components/Spinner';
import { ErrorMsg } from '@/components/ErrorMsg';
import { traducirParte, iconosPorParte } from '@/lib/traducciones';

const LIMITE = 20;

export default function CategoriaParte({ params }: { params: Promise<{ parte: string }> }) {
  const { parte } = use(params);
  const parteDecodificada = decodeURIComponent(parte);
  const [pagina, setPagina] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['categoria', parteDecodificada, pagina],
    queryFn: () => obtenerEjerciciosPorParte(parteDecodificada, LIMITE, pagina * LIMITE),
  });

  const ejercicios = data ?? [];
  const icono = iconosPorParte[parteDecodificada] ?? '💪';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Cabecera */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{icono}</span>
          <h1 className="text-3xl font-bold text-white capitalize">
            {traducirParte(parteDecodificada)}
          </h1>
        </div>
        <p className="text-muted text-sm pl-14">
          Ejercicios para {traducirParte(parteDecodificada).toLowerCase()}
        </p>
      </div>

      {isLoading && <Spinner texto="Cargando ejercicios..." />}
      {isError && <ErrorMsg onReintentar={refetch} />}

      {!isLoading && !isError && (
        <>
          {ejercicios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-secondary">No hay ejercicios en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ejercicios.map((ej) => (
                <EjercicioCard key={ej.id} ejercicio={ej} />
              ))}
            </div>
          )}

          {ejercicios.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-secondary hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-muted text-sm">Página {pagina + 1}</span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={ejercicios.length < LIMITE}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-secondary hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
