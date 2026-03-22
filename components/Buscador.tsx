'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  placeholder?: string;
  valorInicial?: string;
  onBuscar?: (q: string) => void;
  autoNavegar?: boolean;
}

export function Buscador({ placeholder = 'Buscar ejercicio...', valorInicial = '', onBuscar, autoNavegar = false }: Props) {
  const [valor, setValor] = useState(valorInicial);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValor(valorInicial);
  }, [valorInicial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValor(v);
    if (onBuscar) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onBuscar(v), 400);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (autoNavegar && valor.trim()) {
      router.push(`/ejercicios?buscar=${encodeURIComponent(valor.trim())}`);
    } else if (onBuscar) {
      onBuscar(valor);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={valor}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
        />
        {valor && (
          <button
            type="button"
            onClick={() => { setValor(''); onBuscar?.(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
