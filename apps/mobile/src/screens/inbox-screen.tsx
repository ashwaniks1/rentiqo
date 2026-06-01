import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { EmptyState } from "../components";
import { useAppState } from "../state/app-state";

type LeadItem = {
  leadId: string;
  listingId: string;
  leadType: string;
  status: string;
  createdAt?: string;
};

function statusBadgeColor(status: string): string {
  switch (status) {
    case "new": return colors.primary;
    case "acknowledged": return colors.warning;
    case "in_progress": return colors.secondary;
    case "closed": return colors.gray400;
    default: return colors.gray500;
  }
}

function formatLeadType(type: string): string {
  return type === "tour_request" ? "Tour Request" : "Contact Request";
}

export function InboxScreen() {
  const { leads, refreshInbox, loading } = useAppState();

  useEffect(() => {
    refreshInbox();
  }, []);

  if (loading && leads.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon="📬"
        title="No messages yet"
        message="When you contact agents or request tours, updates will appear here"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={leads as LeadItem[]}
        keyExtractor={(item) => item.leadId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.leadType}>{formatLeadType(item.leadType)}</Text>
              <View style={[styles.badge, { backgroundColor: statusBadgeColor(item.status) }]}>
                <Text style={styles.badgeText}>{item.status.replace("_", " ")}</Text>
              </View>
            </View>
            <Text style={styles.listingRef}>Listing: {item.listingId}</Text>
            {item.createdAt && (
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leadType: { ...typography.bodyBold, color: colors.textPrimary },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.sm },
  badgeText: { ...typography.captionBold, color: colors.white, textTransform: "capitalize" },
  listingRef: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  date: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
