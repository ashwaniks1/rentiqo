import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state/app-state";

export function InboxScreen() {
  const { session, leads, loading, error, refreshInbox } = useAppState();

  useEffect(() => {
    if (session) {
      void refreshInbox();
    }
  }, [session]);

  if (!session) {
    return (
      <View style={{ flex: 1, padding: 20, gap: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Inbox</Text>
        <Text>Sign in to view contact and tour updates.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Inbox</Text>
      <Pressable
        onPress={() => void refreshInbox()}
        style={{ borderWidth: 1, borderColor: "#d1d5db", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center" }}>Refresh Inbox</Text>
      </Pressable>
      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={{ color: "#b91c1c" }}>Error: {error}</Text> : null}
      {leads.length === 0 ? (
        <Text>No lead updates yet.</Text>
      ) : (
        leads.map((lead) => (
          <Text key={lead.leadId}>
            • {lead.leadType} for {lead.listingId} ({lead.status})
          </Text>
        ))
      )}
    </View>
  );
}
