import { View, Text } from "react-native";

export function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Profile</Text>
      <Text>Account settings, notifications, and affordability tools scaffolding.</Text>
    </View>
  );
}
