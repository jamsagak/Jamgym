export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  secondaryMuscles: string[];
}

export type BodyPart =
  | 'back'
  | 'cardio'
  | 'chest'
  | 'lower arms'
  | 'lower legs'
  | 'neck'
  | 'shoulders'
  | 'upper arms'
  | 'upper legs'
  | 'waist';

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  bodyParts: BodyPart[];
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  exercises: string[]; // exercise ids
}
