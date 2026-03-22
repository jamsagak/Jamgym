import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchBodyPartList,
  fetchExercises,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchExercisesByTarget,
  fetchExerciseById,
  searchExercises,
  fetchTargetList,
  fetchEquipmentList,
} from '../api/exercisedb';

export function useBodyPartList() {
  return useQuery({ queryKey: ['bodyPartList'], queryFn: fetchBodyPartList, staleTime: Infinity });
}

export function useTargetList() {
  return useQuery({ queryKey: ['targetList'], queryFn: fetchTargetList, staleTime: Infinity });
}

export function useEquipmentList() {
  return useQuery({ queryKey: ['equipmentList'], queryFn: fetchEquipmentList, staleTime: Infinity });
}

export function useExercisesByBodyPart(bodyPart: string) {
  return useInfiniteQuery({
    queryKey: ['exercises', 'bodyPart', bodyPart],
    queryFn: ({ pageParam = 0 }) => fetchExercisesByBodyPart(bodyPart, 20, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
    enabled: !!bodyPart,
  });
}

export function useExercisesByTarget(target: string) {
  return useInfiniteQuery({
    queryKey: ['exercises', 'target', target],
    queryFn: ({ pageParam = 0 }) => fetchExercisesByTarget(target, 20, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
    enabled: !!target,
  });
}

export function useExercisesByEquipment(equipment: string) {
  return useInfiniteQuery({
    queryKey: ['exercises', 'equipment', equipment],
    queryFn: ({ pageParam = 0 }) => fetchExercisesByEquipment(equipment, 20, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
    enabled: !!equipment,
  });
}

export function useExerciseById(id: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => fetchExerciseById(id),
    enabled: !!id,
  });
}

export function useSearchExercises(query: string) {
  return useInfiniteQuery({
    queryKey: ['exercises', 'search', query],
    queryFn: ({ pageParam = 0 }) => searchExercises(query, 20, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
    enabled: query.length >= 2,
  });
}

export function useFeaturedExercises() {
  return useQuery({
    queryKey: ['exercises', 'featured'],
    queryFn: () => fetchExercises(10, 0),
    staleTime: 1000 * 60 * 10,
  });
}
