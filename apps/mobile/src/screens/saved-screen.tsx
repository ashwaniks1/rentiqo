import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "../theme";
import { ListingCard, EmptyState } from "../components";
import { useAppState } from "../state/app-state";

export function SavedScreen({ navigation }: { navigation?: any }) {
  const { savedHomes, refreshSavedHomes, loading, toggleSaveListing } = useAppState();

  useEffect(() => {
    refreshSavedHomes();
  }, []);

  if (loading && savedHomes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (savedHomes.length === 0) {
    return (
      <EmptyState
        icon="♡"
        title="No saved homes yet"
        message="Save listings you're interested in and they'll appear here"
        actionLabel="Discover homes"
        onAction={() => navigation?.navigate?.("Discover")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedHomes}
        keyExtractor={(item) => item.listingId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => navigation?.navigate?.("Discover", { screen: "ListingDetail", params: { listingId: item.listingId } })}
            saved
            onToggleSave={() => toggleSaveListing(item.listingId)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: spacing.lg },
});
