import Link from 'next/link';
import { CategoriaCard } from '@/components/CategoriaCard';
import { Buscador } from '@/components/Buscador';

const PARTES = [
  'back', 'cardio', 'chest', 'lower arms', 'lower legs',
  'neck', 'shoulders', 'upper arms', 'upper legs', 'waist',
];

export default function Inicio() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            🏋️ Más de 1300 ejercicios
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Tu guía completa de{' '}
            <span className="text-primary">ejercicios</span>
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Encuentra ejercicios por músculo, equipo o nombre. Con instrucciones paso a paso y animaciones.
          </p>

          {/* Buscador */}
          <div className="max-w-xl mx-auto mb-8">
            <Buscador
              placeholder="Buscar ejercicio en español o inglés..."
              autoNavegar
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ejercicios"
              className="px-8 py-3.5 bg-primary text-dark font-bold rounded-xl hover:bg-primary-hover transition-colors glow-primary"
            >
              Ver todos los ejercicios
            </Link>
            <Link
              href="/favoritos"
              className="px-8 py-3.5 border border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors"
            >
              Mis favoritos
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Buscar por grupo muscular
          </h2>
          <p className="text-muted">Selecciona un músculo para ver ejercicios específicos</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PARTES.map((parte) => (
            <CategoriaCard key={parte} parte={parte} />
          ))}
        </div>
      </section>
    </>
  );
}
