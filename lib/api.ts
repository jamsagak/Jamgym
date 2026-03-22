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

// The ExerciseDB API no longer returns gifUrl in exercise objects.
// Images are still hosted at v2.exercisedb.io/image/{id}.
function normalizarEjercicio(e: Ejercicio): Ejercicio {
  return {
    ...e,
    gifUrl: e.gifUrl || `https://exercisedb.p.rapidapi.com/image?exerciseId=${e.id}`,
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
