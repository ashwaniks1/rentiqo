import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state/app-state";

const SAMPLE_LISTING_ID = "demo-listing-1001";

export function DiscoverScreen() {
  const { savedHomes, saveHome, removeHome } = useAppState();
  const isSaved = savedHomes.includes(SAMPLE_LISTING_ID);

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Discover</Text>
      <Text>Map/list integration and filters will be connected in implementation sprints.</Text>
      <Text>Demo Listing: {SAMPLE_LISTING_ID}</Text>
      <Pressable
        style={{
          backgroundColor: "#111827",
          padding: 12,
          borderRadius: 8
        }}
        onPress={() => (isSaved ? removeHome(SAMPLE_LISTING_ID) : saveHome(SAMPLE_LISTING_ID))}
      >
        <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "600" }}>
          {isSaved ? "Remove from Saved" : "Save Home"}
        </Text>
      </Pressable>
    </View>
  );
}
