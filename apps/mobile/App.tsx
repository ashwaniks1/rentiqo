import { SafeAreaView, StatusBar } from "react-native";
import { AppStateProvider } from "./src/state/app-state";
import { RootNavigator } from "./src/navigation/root-navigator";

export default function App() {
  return (
    <AppStateProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaView>
    </AppStateProvider>
  );
}
