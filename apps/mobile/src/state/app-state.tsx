import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AppState = {
  savedHomes: string[];
  saveHome: (listingId: string) => void;
  removeHome: (listingId: string) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [savedHomes, setSavedHomes] = useState<string[]>([]);

  const saveHome = (listingId: string) => {
    setSavedHomes((previous) => (previous.includes(listingId) ? previous : [...previous, listingId]));
  };

  const removeHome = (listingId: string) => {
    setSavedHomes((previous) => previous.filter((homeId) => homeId !== listingId));
  };

  const value = useMemo(
    () => ({
      savedHomes,
      saveHome,
      removeHome
    }),
    [savedHomes]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
