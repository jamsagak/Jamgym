import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  message: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
