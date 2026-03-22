import axios from 'axios';
import type { Exercise } from '../types/exercise';

// ExerciseDB API via RapidAPI
// Set EXPO_PUBLIC_RAPIDAPI_KEY in your .env file
const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY ?? '';
const BASE_URL = 'https://exercisedb.p.rapidapi.com';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
});

export async function fetchBodyPartList(): Promise<string[]> {
  const { data } = await client.get('/exercises/bodyPartList');
  return data;
}

export async function fetchTargetList(): Promise<string[]> {
  const { data } = await client.get('/exercises/targetList');
  return data;
}

export async function fetchEquipmentList(): Promise<string[]> {
  const { data } = await client.get('/exercises/equipmentList');
  return data;
}

export async function fetchExercises(limit = 20, offset = 0): Promise<Exercise[]> {
  const { data } = await client.get('/exercises', {
    params: { limit, offset },
  });
  return data;
}

export async function fetchExercisesByBodyPart(
  bodyPart: string,
  limit = 20,
  offset = 0
): Promise<Exercise[]> {
  const { data } = await client.get(`/exercises/bodyPart/${encodeURIComponent(bodyPart)}`, {
    params: { limit, offset },
  });
  return data;
}

export async function fetchExercisesByTarget(
  target: string,
  limit = 20,
  offset = 0
): Promise<Exercise[]> {
  const { data } = await client.get(`/exercises/target/${encodeURIComponent(target)}`, {
    params: { limit, offset },
  });
  return data;
}

export async function fetchExercisesByEquipment(
  equipment: string,
  limit = 20,
  offset = 0
): Promise<Exercise[]> {
  const { data } = await client.get(`/exercises/equipment/${encodeURIComponent(equipment)}`, {
    params: { limit, offset },
  });
  return data;
}

export async function fetchExerciseById(id: string): Promise<Exercise> {
  const { data } = await client.get(`/exercises/exercise/${id}`);
  return data;
}

export async function searchExercises(name: string, limit = 20, offset = 0): Promise<Exercise[]> {
  const { data } = await client.get('/exercises', {
    params: { name, limit, offset },
  });
  return data;
}
