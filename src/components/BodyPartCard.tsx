import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyPartColors, BodyPartIcons, Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  bodyPart: string;
}

export function BodyPartCard({ bodyPart }: Props) {
  const router = useRouter();
  const color = BodyPartColors[bodyPart] ?? Colors.primary;
  const icon = BodyPartIcons[bodyPart] ?? '💪';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/category/${encodeURIComponent(bodyPart)}`)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[color + 'CC', color + '44']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label} numberOfLines={2}>
          {bodyPart}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  gradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 110,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
