import Link from 'next/link';
import { traducirParte, iconosPorParte } from '@/lib/traducciones';

interface Props {
  parte: string;
}

const gradientes: Record<string, string> = {
  back: 'from-blue-900/40 to-blue-800/10',
  cardio: 'from-red-900/40 to-red-800/10',
  chest: 'from-orange-900/40 to-orange-800/10',
  'lower arms': 'from-yellow-900/40 to-yellow-800/10',
  'lower legs': 'from-green-900/40 to-green-800/10',
  neck: 'from-purple-900/40 to-purple-800/10',
  shoulders: 'from-cyan-900/40 to-cyan-800/10',
  'upper arms': 'from-pink-900/40 to-pink-800/10',
  'upper legs': 'from-indigo-900/40 to-indigo-800/10',
  waist: 'from-teal-900/40 to-teal-800/10',
};

export function CategoriaCard({ parte }: Props) {
  const icono = iconosPorParte[parte] ?? '💪';
  const gradiente = gradientes[parte] ?? 'from-primary/10 to-transparent';

  return (
    <Link
      href={`/categoria/${encodeURIComponent(parte)}`}
      className={`group relative bg-gradient-to-br ${gradiente} border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:border-primary/50 hover:scale-105 transition-all duration-200 cursor-pointer`}
    >
      <span className="text-4xl">{icono}</span>
      <span className="text-sm font-semibold text-white text-center capitalize">
        {traducirParte(parte)}
      </span>
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-b-xl" />
    </Link>
  );
}
