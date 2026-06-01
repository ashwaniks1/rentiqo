import React from "react";
import { StatusBar } from "react-native";
import { AppStateProvider } from "./src/state/app-state";
import { RootNavigator } from "./src/navigation/root-navigator";

export default function App() {
  return (
    <AppStateProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <RootNavigator />
    </AppStateProvider>
  );
}
