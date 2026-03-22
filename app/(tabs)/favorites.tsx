import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Colors, Spacing } from '../../src/constants/theme';
import { useFavorites } from '../../src/hooks/useFavorites';
import { fetchExerciseById } from '../../src/api/exercisedb';
import type { Exercise } from '../../src/types/exercise';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();
  const ids = [...favorites];

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['favorites', ids.join(',')],
    queryFn: () => Promise.all(ids.map((id) => fetchExerciseById(id))),
    enabled: ids.length > 0,
  });

  if (loading || isLoading) return <LoadingSpinner message="Loading favorites..." />;

  if (ids.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Tap the heart icon on any exercise to save it here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      style={styles.container}
      renderItem={({ item }: { item: Exercise }) => (
        <ExerciseCard
          exercise={item}
          isFavorite={isFavorite(item.id)}
          onFavoritePress={() => toggleFavorite(item.id)}
        />
      )}
      ListHeaderComponent={
        <Text style={styles.count}>{ids.length} saved exercise{ids.length !== 1 ? 's' : ''}</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  count: { color: Colors.textMuted, fontSize: 13, marginBottom: Spacing.md },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  emptyText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center' },
});
