import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ListingSummary } from "@rentiqo/contracts";
import { colors, typography, spacing, radii, shadows } from "../theme";

type Props = {
  listing: ListingSummary;
  onPress: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
};

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  return `$${(price / 1_000).toFixed(0)}K`;
}

function statusColor(status: string): string {
  switch (status) {
    case "active": return colors.success;
    case "pending": return colors.warning;
    case "sold": return colors.error;
    default: return colors.gray500;
  }
}

export function ListingCard({ listing, onPress, saved, onToggleSave }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>🏠</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(listing.status) }]}>
          <Text style={styles.statusText}>{listing.status.toUpperCase()}</Text>
        </View>
        {onToggleSave && (
          <Pressable onPress={onToggleSave} style={styles.saveButton} accessibilityLabel={saved ? "Unsave" : "Save"}>
            <Text style={styles.saveIcon}>{saved ? "♥" : "♡"}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <Text style={styles.details}>
          {listing.beds} bd · {listing.baths} ba
          {listing.propertyType ? ` · ${listing.propertyType.replace("_", " ")}` : ""}
        </Text>
        <Text style={styles.location}>{listing.city}, {listing.state}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  pressed: { opacity: 0.92 },
  imageContainer: { position: "relative", height: 180 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { ...typography.caption, color: colors.textMuted },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  statusText: { ...typography.captionBold, color: colors.white },
  saveButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveIcon: { fontSize: 18, color: colors.error },
  content: { padding: spacing.md },
  price: { ...typography.h2, color: colors.textPrimary },
  details: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  location: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
