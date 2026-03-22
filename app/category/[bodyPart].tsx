import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { ErrorView } from '../../src/components/ErrorView';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Colors, Spacing } from '../../src/constants/theme';
import { useExercisesByBodyPart } from '../../src/hooks/useExercises';
import type { Exercise } from '../../src/types/exercise';

export default function CategoryScreen() {
  const { bodyPart } = useLocalSearchParams<{ bodyPart: string }>();
  const navigation = useNavigation();
  const decodedBodyPart = decodeURIComponent(bodyPart ?? '');

  useEffect(() => {
    navigation.setOptions({ title: decodedBodyPart });
  }, [decodedBodyPart]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useExercisesByBodyPart(decodedBodyPart);

  const exercises = data?.pages.flatMap((p) => p) ?? [];

  if (isLoading) return <LoadingSpinner message="Loading exercises..." />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      style={styles.container}
      renderItem={({ item }: { item: Exercise }) => <ExerciseCard exercise={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        <Text style={styles.count}>{exercises.length} exercises</Text>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={Colors.primary} style={styles.footer} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  count: { color: Colors.textMuted, fontSize: 13, marginBottom: Spacing.md },
  footer: { marginVertical: Spacing.lg },
});
