import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ErrorView } from '../../src/components/ErrorView';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { BodyPartColors, Colors, Radius, Spacing } from '../../src/constants/theme';
import { useExerciseById, useExercisesByTarget } from '../../src/hooks/useExercises';
import { useFavorites } from '../../src/hooks/useFavorites';
import { ExerciseCard } from '../../src/components/ExerciseCard';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: exercise, isLoading, isError, refetch } = useExerciseById(id ?? '');
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: similarData } = useExercisesByTarget(exercise?.target ?? '');
  const similar = similarData?.pages.flatMap((p) => p).filter((e) => e.id !== id).slice(0, 5) ?? [];

  if (isLoading) return <LoadingSpinner message="Loading exercise..." />;
  if (isError || !exercise) return <ErrorView onRetry={refetch} />;

  const accentColor = BodyPartColors[exercise.bodyPart] ?? Colors.primary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* GIF */}
      <View style={styles.gifContainer}>
        <Image source={{ uri: exercise.gifUrl }} style={styles.gif} resizeMode="contain" />
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(exercise.id)}
        >
          <Text style={styles.favIcon}>{isFavorite(exercise.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Name + tags */}
      <Text style={styles.name}>{exercise.name}</Text>
      <View style={styles.tags}>
        <Tag label={exercise.bodyPart} color={accentColor} />
        <Tag label={exercise.target} color={Colors.primary} />
        <Tag label={exercise.equipment} color={Colors.accent} />
      </View>

      {/* Muscles */}
      <Section title="Secondary Muscles">
        {exercise.secondaryMuscles.length > 0 ? (
          <View style={styles.muscleList}>
            {exercise.secondaryMuscles.map((m) => (
              <View key={m} style={styles.muscleChip}>
                <Text style={styles.muscleText}>{m}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>None listed</Text>
        )}
      </Section>

      {/* Instructions */}
      <Section title="How to perform">
        {exercise.instructions.length > 0 ? (
          exercise.instructions.map((step, i) => (
            <View key={i} style={styles.step}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.stepNum}
              >
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </LinearGradient>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>No instructions available</Text>
        )}
      </Section>

      {/* Similar exercises */}
      {similar.length > 0 && (
        <Section title={`Similar Exercises (${exercise.target})`}>
          {similar.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </Section>
      )}
    </ScrollView>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '33', borderColor: color + '66' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  gifContainer: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    position: 'relative',
  },
  gif: { width: 280, height: 280 },
  favBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.full,
    padding: Spacing.sm,
  },
  favIcon: { fontSize: 24 },
  name: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'capitalize',
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
  },
  tagText: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  section: {
    margin: Spacing.md,
    marginBottom: 0,
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  muscleList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  muscleChip: {
    backgroundColor: Colors.card,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  muscleText: { color: Colors.textSecondary, fontSize: 13, textTransform: 'capitalize' },
  step: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  stepText: { color: Colors.textSecondary, fontSize: 14, flex: 1, lineHeight: 22 },
  muted: { color: Colors.textMuted, fontSize: 14 },
});
