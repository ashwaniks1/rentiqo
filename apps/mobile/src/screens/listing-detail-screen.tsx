import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from "react-native";
import { colors, typography, spacing, radii, shadows } from "../theme";
import { Button, EmptyState } from "../components";
import { useAppState } from "../state/app-state";

export function ListingDetailScreen({ route, navigation }: { route?: any; navigation?: any }) {
  const listingId = route?.params?.listingId;
  const { selectedListing, selectListing, loading, savedHomes, toggleSaveListing, contactAgent, requestTour } = useAppState();

  useEffect(() => {
    if (listingId) selectListing(listingId);
  }, [listingId]);

  const isSaved = savedHomes.some((l) => l.listingId === listingId);

  if (!selectedListing) {
    if (loading) {
      return <EmptyState icon="⏳" title="Loading listing..." />;
    }
    return <EmptyState icon="🏠" title="Listing not found" actionLabel="Go back" onAction={() => navigation?.goBack?.()} />;
  }

  const listing = selectedListing;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          {listing.mediaUrls && listing.mediaUrls.length > 0 ? (
            <Image source={{ uri: listing.mediaUrls[0] }} style={styles.heroImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>📷 No Photos Available</Text>
            </View>
          )}
          <Pressable style={styles.backButton} onPress={() => navigation?.goBack?.()} accessibilityLabel="Go back">
            <Text style={styles.backText}>←</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${listing.price.toLocaleString()}</Text>
            <View style={[styles.statusPill, { backgroundColor: listing.status === "active" ? colors.successLight : colors.warningLight }]}>
              <Text style={[styles.statusText, { color: listing.status === "active" ? colors.success : colors.warning }]}>
                {listing.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.specs}>
            {listing.beds} beds · {listing.baths} baths · {listing.city}, {listing.state}
          </Text>

          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this home</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          )}

          {listing.priceHistory && listing.priceHistory.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price History</Text>
              {listing.priceHistory.map((entry, idx) => (
                <View key={idx} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{new Date(entry.timestamp).toLocaleDateString()}</Text>
                  <Text style={styles.historyPrice}>${entry.price.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Button
          title={isSaved ? "♥ Saved" : "♡ Save"}
          onPress={() => toggleSaveListing(listing.listingId)}
          variant={isSaved ? "secondary" : "outline"}
          size="md"
          style={styles.actionButton}
        />
        <Button
          title="Contact Agent"
          onPress={() => contactAgent(listing.listingId)}
          variant="primary"
          size="md"
          style={styles.actionButtonPrimary}
        />
        <Button
          title="Tour"
          onPress={() => requestTour(listing.listingId)}
          variant="secondary"
          size="md"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  imageSection: { position: "relative", height: 260 },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { ...typography.bodyLarge, color: colors.textMuted },
  backButton: {
    position: "absolute",
    top: spacing.xxxl + spacing.lg,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  backText: { fontSize: 20, color: colors.textPrimary },
  body: { padding: spacing.xl },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { ...typography.display, color: colors.textPrimary },
  statusPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  statusText: { ...typography.captionBold },
  specs: { ...typography.bodyLarge, color: colors.textSecondary, marginTop: spacing.sm },
  section: { marginTop: spacing.xxl },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  description: { ...typography.bodyLarge, color: colors.textSecondary, lineHeight: 24 },
  historyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyDate: { ...typography.body, color: colors.textSecondary },
  historyPrice: { ...typography.bodyBold, color: colors.textPrimary },
  actionBar: {
    flexDirection: "row",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    gap: spacing.sm,
    ...shadows.lg,
  },
  actionButton: { flex: 1 },
  actionButtonPrimary: { flex: 2 },
});
