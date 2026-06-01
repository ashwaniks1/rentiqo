import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../theme";
import { Button } from "./Button";

type Props = {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxxl },
  icon: { fontSize: 48, marginBottom: spacing.lg },
  title: { ...typography.h3, color: colors.textPrimary, textAlign: "center" },
  message: { ...typography.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm },
  button: { marginTop: spacing.lg },
});
