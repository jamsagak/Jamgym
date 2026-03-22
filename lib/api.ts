import axios from 'axios';
import type { Ejercicio } from '@/types/ejercicio';

// ExerciseDB Open Source — free, no API key required
// Repo: https://github.com/ExerciseDB/exercisedb-api
const BASE_URL = 'https://exercisedb-api.vercel.app/api/v1';

const client = axios.create({ baseURL: BASE_URL });

// New API uses: exerciseId (hash), bodyParts[], targetMuscles[], equipments[], gifUrl (CDN)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizarEjercicio(e: any): Ejercicio {
  return {
    id: e.exerciseId || e.id,
    name: e.name,
    bodyPart: Array.isArray(e.bodyParts) ? e.bodyParts[0] : (e.bodyPart ?? ''),
    target: Array.isArray(e.targetMuscles) ? e.targetMuscles[0] : (e.target ?? ''),
    equipment: Array.isArray(e.equipments) ? e.equipments[0] : (e.equipment ?? ''),
    gifUrl: e.gifUrl || '',
    instructions: e.instructions || [],
    secondaryMuscles: e.secondaryMuscles || [],
    category: e.category,
    description: e.description,
    difficulty: e.difficulty,
  };
}

// Handles both flat array responses and { data: { exercises: [...] } } wrapped responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractList(data: any): any[] {
  return (
    data?.data?.exercises ??
    data?.exercises ??
    (Array.isArray(data) ? data : [])
  );
}

export async function obtenerPartesCuerpo(): Promise<string[]> {
  const { data } = await client.get('/exercises/bodyParts');
  return data?.data?.bodyParts ?? data?.bodyParts ?? (Array.isArray(data) ? data : []);
}

export async function obtenerEjercicios(limit = 20, offset = 0): Promise<Ejercicio[]> {
  const { data } = await client.get('/exercises', { params: { limit, offset } });
  return extractList(data).map(normalizarEjercicio);
}

export async function obtenerEjerciciosPorParte(
  parte: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get(`/exercises/bodyPart/${encodeURIComponent(parte)}`, {
    params: { limit, offset },
  });
  return extractList(data).map(normalizarEjercicio);
}

export async function obtenerEjerciciosPorMusculo(
  musculo: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get(`/exercises/target/${encodeURIComponent(musculo)}`, {
    params: { limit, offset },
  });
  return extractList(data).map(normalizarEjercicio);
}

export async function obtenerEjercicioPorId(id: string): Promise<Ejercicio> {
  const { data } = await client.get(`/exercises/${id}`);
  const exercise = data?.data?.exercise ?? data?.exercise ?? data;
  return normalizarEjercicio(exercise);
}

export async function buscarEjercicios(
  nombre: string,
  limit = 20,
  offset = 0
): Promise<Ejercicio[]> {
  const { data } = await client.get('/exercises', {
    params: { name: nombre, limit, offset },
  });
  return extractList(data).map(normalizarEjercicio);
}
