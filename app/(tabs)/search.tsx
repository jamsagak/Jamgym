import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState, useCallback } from 'react';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { Colors, Radius, Spacing } from '../../src/constants/theme';
import { useSearchExercises, useEquipmentList, useTargetList } from '../../src/hooks/useExercises';
import type { Exercise } from '../../src/types/exercise';

const QUICK_FILTERS = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs', 'cardio'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const searchQuery = activeFilter || query;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchExercises(searchQuery);

  const exercises = data?.pages.flatMap((p) => p) ?? [];

  const handleFilterPress = useCallback((filter: string) => {
    setActiveFilter((prev) => (prev === filter ? '' : filter));
    setQuery('');
  }, []);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setActiveFilter('');
          }}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Quick filters */}
      <FlatList
        data={QUICK_FILTERS}
        horizontal
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
            onPress={() => handleFilterPress(item)}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Results */}
      {searchQuery.length < 2 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={styles.emptyTitle}>Find your exercise</Text>
          <Text style={styles.emptyText}>
            Search by name or tap a quick filter above
          </Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: Exercise }) => <ExerciseCard exercise={item} />}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            isLoading ? null : (
              <Text style={styles.resultCount}>
                {exercises.length} result{exercises.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
            )
          }
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator color={Colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🤷</Text>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyText}>Try a different search term</Text>
              </View>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.lg }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 18, marginRight: Spacing.sm },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: Spacing.sm + 2,
  },
  filtersRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  filterTextActive: { color: '#fff' },
  list: { padding: Spacing.md, paddingTop: 0 },
  resultCount: { color: Colors.textMuted, fontSize: 13, marginBottom: Spacing.md },
  loader: { marginTop: Spacing.xxl },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { color: Colors.text, fontSize: 20, fontWeight: '700' },
  emptyText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center' },
});
