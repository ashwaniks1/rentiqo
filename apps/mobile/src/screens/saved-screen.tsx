import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state/app-state";

export function SavedScreen() {
  const { session, savedHomes, loading, error, refreshSavedHomes } = useAppState();

  useEffect(() => {
    if (session) {
      void refreshSavedHomes();
    }
  }, [session]);

  if (!session) {
    return (
      <View style={{ flex: 1, padding: 20, gap: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Saved</Text>
        <Text>Sign in to view saved homes.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Saved</Text>
      <Pressable
        onPress={() => void refreshSavedHomes()}
        style={{ borderWidth: 1, borderColor: "#d1d5db", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center" }}>Refresh Saved Homes</Text>
      </Pressable>
      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={{ color: "#b91c1c" }}>Error: {error}</Text> : null}
      {savedHomes.length === 0 ? (
        <Text>No saved homes yet.</Text>
      ) : (
        savedHomes.map((home) => (
          <Text key={home.listingId}>
            • {home.listingId} - {home.city}, {home.state}
          </Text>
        ))
      )}
    </View>
  );
}
