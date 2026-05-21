import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DiscoverScreen } from "../screens/discover-screen";
import { InboxScreen } from "../screens/inbox-screen";
import { ProfileScreen } from "../screens/profile-screen";
import { SavedScreen } from "../screens/saved-screen";

type TabKey = "discover" | "saved" | "inbox" | "profile";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "discover", label: "Discover" },
  { key: "saved", label: "Saved" },
  { key: "inbox", label: "Inbox" },
  { key: "profile", label: "Profile" }
];

function renderScreen(activeTab: TabKey) {
  switch (activeTab) {
    case "discover":
      return <DiscoverScreen />;
    case "saved":
      return <SavedScreen />;
    case "inbox":
      return <InboxScreen />;
    case "profile":
      return <ProfileScreen />;
    default:
      return <DiscoverScreen />;
  }
}

export function RootNavigator() {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen(activeTab)}</View>
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingVertical: 8,
          paddingHorizontal: 10,
          justifyContent: "space-between"
        }}
      >
        {tabs.map((tab) => (
          <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={{ padding: 8 }}>
            <Text style={{ color: activeTab === tab.key ? "#111827" : "#6b7280", fontWeight: "600" }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
