import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state/app-state";

export function ProfileScreen() {
  const { session, error, loginAsDemoBuyer, logout } = useAppState();

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Profile</Text>
      {session ? (
        <>
          <Text>User: {session.user.email}</Text>
          <Text>Role: {session.user.role}</Text>
          <Pressable onPress={logout} style={{ backgroundColor: "#111827", padding: 12, borderRadius: 8 }}>
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Sign Out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text>Sign in to manage preferences and tools.</Text>
          <Pressable
            onPress={() => void loginAsDemoBuyer()}
            style={{ backgroundColor: "#111827", padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Sign in as Demo Buyer</Text>
          </Pressable>
        </>
      )}
      {error ? <Text style={{ color: "#b91c1c" }}>Error: {error}</Text> : null}
    </View>
  );
}
