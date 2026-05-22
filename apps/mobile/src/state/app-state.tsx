import type { ListingDetail, ListingSummary } from "@rentiqo/contracts";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as apiClient from "../api/client";

type SessionUser = {
  userId: string;
  email: string;
  role: "consumer" | "agent" | "admin";
};

type AppState = {
  session: { accessToken: string; refreshToken: string; user: SessionUser } | null;
  searchResults: ListingSummary[];
  selectedListing: ListingDetail | null;
  savedHomes: ListingSummary[];
  leads: Array<{ leadId: string; leadType: string; status: string; listingId: string }>;
  loading: boolean;
  error: string | null;
  loginAsDemoBuyer: () => Promise<void>;
  logout: () => void;
  loadSearch: () => Promise<void>;
  selectListing: (listingId: string) => Promise<void>;
  refreshSavedHomes: () => Promise<void>;
  toggleSaveListing: (listingId: string) => Promise<void>;
  contactAgentForSelectedListing: () => Promise<void>;
  requestTourForSelectedListing: () => Promise<void>;
  refreshInbox: () => Promise<void>;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppState["session"]>(null);
  const [searchResults, setSearchResults] = useState<ListingSummary[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(null);
  const [savedHomes, setSavedHomes] = useState<ListingSummary[]>([]);
  const [leads, setLeads] = useState<AppState["leads"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (work: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await work();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoBuyer = async () => {
    await execute(async () => {
      const sessionPayload = await apiClient.login("buyer@rentiqo.dev", "password123");
      setSession({
        accessToken: sessionPayload.accessToken,
        refreshToken: sessionPayload.refreshToken,
        user: sessionPayload.user
      });
    });
  };

  const loadSearch = async () => {
    if (!session) {
      return;
    }
    await execute(async () => {
      const result = await apiClient.searchListings(session.accessToken, { query: "Austin", filters: { minBeds: 2 } });
      setSearchResults(result.items);
      if (result.items[0]) {
        const detail = await apiClient.getListingDetail(session.accessToken, result.items[0].listingId);
        setSelectedListing(detail);
      }
    });
  };

  const selectListing = async (listingId: string) => {
    if (!session) {
      return;
    }
    await execute(async () => {
      const detail = await apiClient.getListingDetail(session.accessToken, listingId);
      setSelectedListing(detail);
    });
  };

  const refreshSavedHomes = async () => {
    if (!session) {
      return;
    }
    await execute(async () => {
      const result = await apiClient.listSavedHomes(session.accessToken);
      setSavedHomes(result.items);
    });
  };

  const toggleSaveListing = async (listingId: string) => {
    if (!session) {
      return;
    }
    await execute(async () => {
      const alreadySaved = savedHomes.some((home) => home.listingId === listingId);
      if (alreadySaved) {
        await apiClient.removeSavedHome(session.accessToken, listingId);
      } else {
        await apiClient.saveHome(session.accessToken, listingId);
      }
      const refreshed = await apiClient.listSavedHomes(session.accessToken);
      setSavedHomes(refreshed.items);
    });
  };

  const contactAgentForSelectedListing = async () => {
    if (!session || !selectedListing) {
      return;
    }
    await execute(async () => {
      await apiClient.contactAgent(session.accessToken, selectedListing.listingId, "Interested in this property.");
      const inbox = await apiClient.listInboxLeads(session.accessToken);
      setLeads(inbox.items);
    });
  };

  const requestTourForSelectedListing = async () => {
    if (!session || !selectedListing) {
      return;
    }
    await execute(async () => {
      await apiClient.requestTour(session.accessToken, selectedListing.listingId, ["Saturday 10:00-12:00"]);
      const inbox = await apiClient.listInboxLeads(session.accessToken);
      setLeads(inbox.items);
    });
  };

  const refreshInbox = async () => {
    if (!session) {
      return;
    }
    await execute(async () => {
      const inbox = await apiClient.listInboxLeads(session.accessToken);
      setLeads(inbox.items);
    });
  };

  const logout = () => {
    setSession(null);
    setSearchResults([]);
    setSelectedListing(null);
    setSavedHomes([]);
    setLeads([]);
    setError(null);
  };

  const value = useMemo(
    () => ({
      session,
      searchResults,
      selectedListing,
      savedHomes,
      leads,
      loading,
      error,
      loginAsDemoBuyer,
      logout,
      loadSearch,
      selectListing,
      refreshSavedHomes,
      toggleSaveListing,
      contactAgentForSelectedListing,
      requestTourForSelectedListing,
      refreshInbox
    }),
    [session, searchResults, selectedListing, savedHomes, leads, loading, error]
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
