import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { WORKOUT_PLANS } from '../../src/constants/workoutPlans';
import { BodyPartColors, Colors, LevelColors, Radius, Spacing } from '../../src/constants/theme';
import type { WorkoutPlan } from '../../src/types/exercise';

const LEVEL_ICONS = { beginner: '🌱', intermediate: '🔥', advanced: '⚡' };

export default function WorkoutsScreen() {
  const router = useRouter();

  const beginnerPlans = WORKOUT_PLANS.filter((p) => p.level === 'beginner');
  const intermediatePlans = WORKOUT_PLANS.filter((p) => p.level === 'intermediate');
  const advancedPlans = WORKOUT_PLANS.filter((p) => p.level === 'advanced');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header tip */}
      <View style={styles.tip}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          Choose a workout plan and tap any exercise to see detailed instructions and GIFs.
        </Text>
      </View>

      <PlanSection title="🌱 Beginner" plans={beginnerPlans} router={router} />
      <PlanSection title="🔥 Intermediate" plans={intermediatePlans} router={router} />
      <PlanSection title="⚡ Advanced" plans={advancedPlans} router={router} />
    </ScrollView>
  );
}

function PlanSection({ title, plans, router }: { title: string; plans: WorkoutPlan[]; router: ReturnType<typeof useRouter> }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {plans.map((plan) => (
        <WorkoutPlanCard key={plan.id} plan={plan} router={router} />
      ))}
    </View>
  );
}

function WorkoutPlanCard({ plan, router }: { plan: WorkoutPlan; router: ReturnType<typeof useRouter> }) {
  const levelColor = LevelColors[plan.level];
  const primaryBodyPart = plan.bodyParts[0];
  const gradientColor = BodyPartColors[primaryBodyPart] ?? Colors.primary;

  return (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() => router.push(`/category/${encodeURIComponent(plan.bodyParts[0])}`)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[gradientColor + '22', 'transparent']}
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.planTop}>
        <View style={styles.planNameRow}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '33' }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>
              {LEVEL_ICONS[plan.level]} {plan.level}
            </Text>
          </View>
        </View>
        <Text style={styles.planDesc}>{plan.description}</Text>
      </View>

      <View style={styles.planMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⏱️</Text>
          <Text style={styles.metaText}>{plan.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>🎯</Text>
          <Text style={styles.metaText}>{plan.bodyParts.length} muscle groups</Text>
        </View>
      </View>

      <View style={styles.bodyPartTags}>
        {plan.bodyParts.map((bp) => (
          <View
            key={bp}
            style={[
              styles.bpTag,
              { backgroundColor: (BodyPartColors[bp] ?? Colors.primary) + '33' },
            ]}
          >
            <Text style={styles.bpTagText}>{bp}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => router.push(`/category/${encodeURIComponent(plan.bodyParts[0])}`)}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.startBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.startBtnText}>View Exercises →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  tip: {
    backgroundColor: Colors.accent + '22',
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.accent + '44',
  },
  tipIcon: { fontSize: 18 },
  tipText: { color: Colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 20 },
  section: { gap: Spacing.md },
  sectionTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  planTop: { gap: Spacing.xs },
  planNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planName: { color: Colors.text, fontSize: 18, fontWeight: '700', flex: 1 },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  levelText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  planDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 20 },
  planMeta: { flexDirection: 'row', gap: Spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  metaIcon: { fontSize: 14 },
  metaText: { color: Colors.textSecondary, fontSize: 13 },
  bodyPartTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  bpTag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  bpTagText: { color: Colors.text, fontSize: 11, textTransform: 'capitalize' },
  startBtn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.xs },
  startBtnGradient: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
