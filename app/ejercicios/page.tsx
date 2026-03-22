'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { obtenerEjercicios, buscarEjercicios, obtenerEjerciciosPorParte } from '@/lib/api';
import { EjercicioCard } from '@/components/EjercicioCard';
import { Buscador } from '@/components/Buscador';
import { Spinner } from '@/components/Spinner';
import { ErrorMsg } from '@/components/ErrorMsg';
import { traducirParte, partesDelCuerpo } from '@/lib/traducciones';

const LIMITE = 20;
const PARTES = Object.keys(partesDelCuerpo);

export default function Ejercicios() {
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get('buscar') ?? '');
  const [parte, setParte] = useState('');
  const [pagina, setPagina] = useState(0);

  // Resetear página al cambiar filtros
  useEffect(() => { setPagina(0); }, [busqueda, parte]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ejercicios', busqueda, parte, pagina],
    queryFn: () => {
      const offset = pagina * LIMITE;
      if (busqueda.trim()) return buscarEjercicios(busqueda.trim(), LIMITE, offset);
      if (parte) return obtenerEjerciciosPorParte(parte, LIMITE, offset);
      return obtenerEjercicios(LIMITE, offset);
    },
  });

  const ejercicios = data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Ejercicios</h1>
        <p className="text-muted text-sm">Explora nuestra biblioteca de ejercicios</p>
      </div>

      {/* Buscador + filtro */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <Buscador
            placeholder="Buscar ejercicio..."
            valorInicial={busqueda}
            onBuscar={(q) => { setBusqueda(q); setParte(''); }}
          />
        </div>
        <select
          value={parte}
          onChange={(e) => { setParte(e.target.value); setBusqueda(''); }}
          className="bg-card border border-border text-sm text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary min-w-[200px]"
        >
          <option value="">Todos los músculos</option>
          {PARTES.map((p) => (
            <option key={p} value={p}>{traducirParte(p)}</option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {isLoading && <Spinner texto="Cargando ejercicios..." />}
      {isError && <ErrorMsg mensaje="No se pudieron cargar los ejercicios." onReintentar={refetch} />}

      {!isLoading && !isError && (
        <>
          {ejercicios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-secondary">No se encontraron ejercicios</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ejercicios.map((ej) => (
                <EjercicioCard key={ej.id} ejercicio={ej} />
              ))}
            </div>
          )}

          {/* Paginación */}
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
