import { View, Text } from "react-native";
import { useAppState } from "../state/app-state";

export function SavedScreen() {
  const { savedHomes } = useAppState();

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Saved</Text>
      {savedHomes.length === 0 ? (
        <Text>No saved homes yet.</Text>
      ) : (
        savedHomes.map((homeId) => <Text key={homeId}>• {homeId}</Text>)
      )}
    </View>
  );
}
