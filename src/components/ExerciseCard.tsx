import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '../constants/theme';
import type { Exercise } from '../types/exercise';

interface Props {
  exercise: Exercise;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export function ExerciseCard({ exercise, onFavoritePress, isFavorite }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: exercise.gifUrl }} style={styles.gif} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {exercise.name}
        </Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.bodyPart}</Text>
          </View>
          <View style={[styles.tag, styles.tagSecondary]}>
            <Text style={styles.tagText}>{exercise.target}</Text>
          </View>
        </View>
        <Text style={styles.equipment}>🏋️ {exercise.equipment}</Text>
      </View>
      {onFavoritePress && (
        <TouchableOpacity style={styles.favBtn} onPress={onFavoritePress} hitSlop={8}>
          <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gif: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surface,
  },
  info: {
    flex: 1,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tags: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.primary + '33',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  tagSecondary: {
    backgroundColor: Colors.accent + '33',
  },
  tagText: {
    color: Colors.text,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  equipment: {
    color: Colors.textMuted,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  favBtn: {
    padding: Spacing.sm,
  },
  favIcon: {
    fontSize: 20,
  },
});
