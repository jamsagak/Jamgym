import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyPartCard } from '../../src/components/BodyPartCard';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Colors, Spacing } from '../../src/constants/theme';
import { useBodyPartList, useFeaturedExercises } from '../../src/hooks/useExercises';

export default function HomeScreen() {
  const router = useRouter();
  const { data: bodyParts, isLoading: loadingParts } = useBodyPartList();
  const { data: featured, isLoading: loadingFeatured } = useFeaturedExercises();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero banner */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.heroTitle}>Your Gym Companion 💪</Text>
        <Text style={styles.heroSubtitle}>
          Discover exercises, build routines,{'\n'}and crush your goals.
        </Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/workouts')}>
          <Text style={styles.heroBtnText}>Get a Workout Plan →</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Body parts */}
      <Text style={styles.sectionTitle}>Browse by Muscle Group</Text>
      {loadingParts ? (
        <View style={styles.loader}>
          <LoadingSpinner message="Loading categories..." />
        </View>
      ) : (
        <View style={styles.grid}>
          {bodyParts?.map((bp) => <BodyPartCard key={bp} bodyPart={bp} />)}
        </View>
      )}

      {/* Featured exercises */}
      <Text style={styles.sectionTitle}>Featured Exercises</Text>
      {loadingFeatured ? (
        <View style={styles.loader}>
          <LoadingSpinner message="Loading exercises..." />
        </View>
      ) : (
        <View>
          {featured?.map((ex) => <ExerciseCard key={ex.id} exercise={ex} />)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  hero: {
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 22,
  },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  loader: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
