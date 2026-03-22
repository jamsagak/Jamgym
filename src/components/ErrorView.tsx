import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ message = 'Something went wrong', onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Try Again</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.hint}>Make sure your RapidAPI key is set in .env</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  icon: { fontSize: 48 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  message: { color: Colors.textMuted, fontSize: 14, textAlign: 'center' },
  hint: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: Spacing.sm },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  btnText: { color: Colors.text, fontWeight: '700', fontSize: 15 },
});
