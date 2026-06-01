import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "../theme";
import { useAppState } from "../state/app-state";
import { AuthScreen } from "../screens/auth-screen";
import { DiscoverScreen } from "../screens/discover-screen";
import { ListingDetailScreen } from "../screens/listing-detail-screen";
import { SavedScreen } from "../screens/saved-screen";
import { InboxScreen } from "../screens/inbox-screen";
import { ProfileScreen } from "../screens/profile-screen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverList" component={DiscoverScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: { ...typography.caption, marginBottom: 2 },
        tabBarStyle: { paddingTop: 4, height: 56 },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "Discover") iconName = "search-outline";
          else if (route.name === "Saved") iconName = "heart-outline";
          else if (route.name === "Inbox") iconName = "mail-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { session } = useAppState();

  return (
    <NavigationContainer>
      {session ? <MainTabs /> : <AuthScreen />}
    </NavigationContainer>
  );
}
