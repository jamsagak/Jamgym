import type { Ejercicio } from '@/types/ejercicio';

const GITHUB_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';
const EXERCISES_URL = `${GITHUB_BASE}/dist/exercises.json`;
const IMAGES_BASE = `${GITHUB_BASE}/exercises`;

interface YuhonaExercise {
  id: string;
  name: string;
  level: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  force?: string | null;
  mechanic?: string | null;
}

function toEjercicio(e: YuhonaExercise): Ejercicio {
  return {
    id: e.id,
    name: e.name,
    bodyPart: e.category,
    target: e.primaryMuscles[0] ?? '',
    equipment: e.equipment,
    gifUrl: e.images[0] ? `${IMAGES_BASE}/${e.images[0]}` : '',
    instructions: e.instructions,
    secondaryMuscles: e.secondaryMuscles,
    difficulty: e.level,
    category: e.category,
  };
}

// Module-level cache — persists for the browser session
let cache: YuhonaExercise[] | null = null;

async function fetchAll(): Promise<YuhonaExercise[]> {
  if (cache) return cache;
  const res = await fetch(EXERCISES_URL);
  if (!res.ok) throw new Error('No se pudo cargar la base de ejercicios');
  cache = await res.json();
  return cache!;
}

export async function obtenerPartesCuerpo(): Promise<string[]> {
  const exercises = await fetchAll();
  const cats = [...new Set(exercises.map((e) => e.category))].sort();
  return cats;
}

export async function obtenerEjercicios(limit = 20, offset = 0): Promise<Ejercicio[]> {
  const exercises = await fetchAll();
  return exercises.slice(offset, offset + limit).map(toEjercicio);
}

export async function obtenerEjerciciosPorParte(
  parte: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const exercises = await fetchAll();
  const filtered = exercises.filter((e) => e.category.toLowerCase() === parte.toLowerCase());
  return filtered.slice(offset, offset + limit).map(toEjercicio);
}

export async function obtenerEjerciciosPorMusculo(
  musculo: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const exercises = await fetchAll();
  const filtered = exercises.filter(
    (e) =>
      e.primaryMuscles.some((m) => m.toLowerCase() === musculo.toLowerCase()) ||
      e.secondaryMuscles.some((m) => m.toLowerCase() === musculo.toLowerCase())
  );
  return filtered.slice(offset, offset + limit).map(toEjercicio);
}

export async function obtenerEjercicioPorId(id: string): Promise<Ejercicio> {
  const exercises = await fetchAll();
  const exercise = exercises.find((e) => e.id === id);
  if (!exercise) throw new Error(`Ejercicio "${id}" no encontrado`);
  return toEjercicio(exercise);
}

export async function buscarEjercicios(
  nombre: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const exercises = await fetchAll();
  const q = nombre.toLowerCase();
  const filtered = exercises.filter((e) => e.name.toLowerCase().includes(q));
  return filtered.slice(offset, offset + limit).map(toEjercicio);
}
