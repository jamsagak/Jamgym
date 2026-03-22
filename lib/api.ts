import axios from 'axios';
import type { Ejercicio } from '@/types/ejercicio';

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY ?? '';
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
});

// ExerciseDB API no longer returns gifUrl. Use yuhonas/free-exercise-db on GitHub
// as fallback image source. IDs are constructed from exercise names (Title_Case).
function toYuhonaId(name: string): string {
  return name
    .replace(/\//g, '_')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('-')
    )
    .join('_');
}

const GITHUB_IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizarEjercicio(e: any): Ejercicio {
  const id = e.exerciseId || e.id;
  const gifUrl =
    e.gifUrl ||
    e.imageUrl ||
    `${GITHUB_IMAGE_BASE}/${toYuhonaId(e.name)}/0.jpg`;

  return {
    id,
    name: e.name,
    bodyPart: Array.isArray(e.bodyParts) ? e.bodyParts[0] : e.bodyPart,
    target: Array.isArray(e.targetMuscles) ? e.targetMuscles[0] : e.target,
    equipment: Array.isArray(e.equipments) ? e.equipments[0] : e.equipment,
    gifUrl,
    instructions: e.instructions || [],
    secondaryMuscles: e.secondaryMuscles || [],
    category: e.category,
    description: e.description,
    difficulty: e.difficulty,
  };
}

export async function obtenerPartesCuerpo(): Promise<string[]> {
  const { data } = await client.get('/exercises/bodyPartList');
  return data;
}

export async function obtenerEjercicios(limit = 20, offset = 0): Promise<Ejercicio[]> {
  const { data } = await client.get('/exercises', { params: { limit, offset } });
  return data.map(normalizarEjercicio);
}

export async function obtenerEjerciciosPorParte(
  parte: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get(`/exercises/bodyPart/${encodeURIComponent(parte)}`, {
    params: { limit, offset },
  });
  return data.map(normalizarEjercicio);
}

export async function obtenerEjerciciosPorMusculo(
  musculo: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get(`/exercises/target/${encodeURIComponent(musculo)}`, {
    params: { limit, offset },
  });
  return data.map(normalizarEjercicio);
}

export async function obtenerEjercicioPorId(id: string): Promise<Ejercicio> {
  const { data } = await client.get(`/exercises/exercise/${id}`);
  return normalizarEjercicio(data);
}

export async function buscarEjercicios(
  nombre: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get('/exercises', {
    params: { name: nombre, limit, offset },
  });
  return data.map(normalizarEjercicio);
}
