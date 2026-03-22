export const partesDelCuerpo: Record<string, string> = {
  back: 'Espalda',
  cardio: 'Cardio',
  chest: 'Pecho',
  'lower arms': 'Antebrazos',
  'lower legs': 'Pantorrillas',
  neck: 'Cuello',
  shoulders: 'Hombros',
  'upper arms': 'Bíceps/Tríceps',
  'upper legs': 'Piernas',
  waist: 'Abdomen',
};

export const equipamiento: Record<string, string> = {
  barbell: 'Barra',
  'body weight': 'Peso corporal',
  band: 'Banda elástica',
  cable: 'Cable',
  dumbbell: 'Mancuerna',
  'ez barbell': 'Barra EZ',
  'hammer': 'Martillo',
  'kettlebell': 'Pesa rusa',
  machine: 'Máquina',
  'medicine ball': 'Pelota medicinal',
  'resistance band': 'Banda de resistencia',
  roller: 'Rodillo',
  rope: 'Cuerda',
  'smith machine': 'Máquina Smith',
  'stability ball': 'Pelota de estabilidad',
  'suspension': 'Suspensión',
  trap: 'Trampa',
  wheel: 'Rueda',
  other: 'Otro',
};

export const musculos: Record<string, string> = {
  abductors: 'Abductores',
  abs: 'Abdominales',
  adductors: 'Aductores',
  biceps: 'Bíceps',
  calves: 'Pantorrillas',
  'cardiovascular system': 'Sistema cardiovascular',
  delts: 'Deltoides',
  forearms: 'Antebrazos',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  'hip flexors': 'Flexores de cadera',
  'knees': 'Rodillas',
  'lats': 'Dorsales',
  levator: 'Elevador',
  'lower back': 'Zona lumbar',
  'pectorals': 'Pectorales',
  quads: 'Cuádriceps',
  'serratus anterior': 'Serrato anterior',
  'spine': 'Columna',
  'traps': 'Trapecio',
  'triceps': 'Tríceps',
  'upper back': 'Espalda alta',
};

export const iconosPorParte: Record<string, string> = {
  back: '🔙',
  cardio: '🏃',
  chest: '💪',
  'lower arms': '🦾',
  'lower legs': '🦵',
  neck: '🦒',
  shoulders: '🏋️',
  'upper arms': '💪',
  'upper legs': '🦿',
  waist: '⚡',
};

export function traducirParte(parte: string): string {
  return partesDelCuerpo[parte.toLowerCase()] ?? parte;
}

export function traducirEquipamiento(eq: string): string {
  return equipamiento[eq.toLowerCase()] ?? eq;
}

export function traducirMusculo(musculo: string): string {
  return musculos[musculo.toLowerCase()] ?? musculo;
}
