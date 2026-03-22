export interface Ejercicio {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  secondaryMuscles: string[];
  // New fields returned by updated ExerciseDB API
  category?: string;
  description?: string;
  difficulty?: string;
}
