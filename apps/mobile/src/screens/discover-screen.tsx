import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import type { ListingSummary } from "@rentiqo/contracts";
import { colors, typography, spacing, radii } from "../theme";
import { ListingCard, EmptyState } from "../components";
import { useAppState } from "../state/app-state";

const FILTER_CHIPS = ["All", "Single Family", "Condo", "Townhouse"] as const;
type FilterChip = typeof FILTER_CHIPS[number];

const chipToPropertyType: Record<FilterChip, string | null> = {
  "All": null,
  "Single Family": "single_family",
  "Condo": "condo",
  "Townhouse": "townhouse",
};

export function DiscoverScreen({ navigation }: { navigation?: any }) {
  const { searchResults, loadSearch, loading, savedHomes, toggleSaveListing } = useAppState();
  const [query, setQuery] = useState("Austin");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");

  useEffect(() => {
    loadSearch(query, activeFilter === "All" ? undefined : chipToPropertyType[activeFilter] ?? undefined);
  }, []);

  function handleSearch() {
    loadSearch(query, activeFilter === "All" ? undefined : chipToPropertyType[activeFilter] ?? undefined);
  }

  function handleFilterPress(chip: FilterChip) {
    setActiveFilter(chip);
    loadSearch(query, chip === "All" ? undefined : chipToPropertyType[chip] ?? undefined);
  }

  function handleListingPress(listing: ListingSummary) {
    if (navigation?.navigate) {
      navigation.navigate("ListingDetail", { listingId: listing.listingId });
    }
  }

  const savedIds = new Set(savedHomes.map((l) => l.listingId));

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search by city or state..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          accessibilityLabel="Search location"
        />
        <Pressable onPress={handleSearch} style={styles.searchButton} accessibilityLabel="Search">
          <Text style={styles.searchButtonText}>🔍</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTER_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            onPress={() => handleFilterPress(chip)}
            style={[styles.chip, activeFilter === chip && styles.chipActive]}
            accessibilityRole="button"
          >
            <Text style={[styles.chipText, activeFilter === chip && styles.chipTextActive]}>{chip}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching listings...</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <EmptyState
          icon="🏠"
          title="No listings found"
          message="Try adjusting your search or filters"
          actionLabel="Clear filters"
          onAction={() => { setActiveFilter("All"); setQuery(""); loadSearch(""); }}
        />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.listingId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => handleListingPress(item)}
              saved={savedIds.has(item.listingId)}
              onToggleSave={() => toggleSaveListing(item.listingId)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  searchRow: { flexDirection: "row", padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: { fontSize: 18 },
  filterRow: { flexDirection: "row", paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
  listContent: { padding: spacing.lg },
});
