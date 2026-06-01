import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { Button } from "../components";
import { useAppState } from "../state/app-state";

export function ProfileScreen() {
  const { session, logout } = useAppState();

  if (!session) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{session.user.email[0]?.toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{session.user.email}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{session.user.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{session.user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{session.user.role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Notifications</Text>
          <Text style={styles.infoValue}>
            {session.user.preferences?.notifications?.push ? "Push ✓" : "Push ✗"}
            {"  "}
            {session.user.preferences?.notifications?.email ? "Email ✓" : "Email ✗"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Sign Out" onPress={logout} variant="danger" fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: spacing.xl },
  avatarSection: { alignItems: "center", paddingVertical: spacing.xxxl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...typography.display, color: colors.white },
  email: { ...typography.bodyLarge, color: colors.textPrimary, marginTop: spacing.md },
  rolePill: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight + "20",
  },
  roleText: { ...typography.captionBold, color: colors.primary, textTransform: "capitalize" },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { ...typography.body, color: colors.textSecondary },
  infoValue: { ...typography.bodyBold, color: colors.textPrimary },
  footer: { marginTop: "auto", paddingTop: spacing.xxl },
});
