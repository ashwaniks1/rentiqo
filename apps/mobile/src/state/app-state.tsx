import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ListingDetail, ListingSummary } from "@rentiqo/contracts";
import * as api from "../api/client";

type UserSession = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    role: string;
    preferences: {
      notifications: { push: boolean; email: boolean };
      search: Record<string, unknown>;
    };
  };
};

type Lead = {
  leadId: string;
  listingId: string;
  leadType: string;
  status: string;
  createdAt?: string;
};

type AppStateValue = {
  session: UserSession | null;
  searchResults: ListingSummary[];
  selectedListing: ListingDetail | null;
  savedHomes: ListingSummary[];
  leads: Lead[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadSearch: (query?: string, propertyType?: string) => Promise<void>;
  selectListing: (listingId: string) => Promise<void>;
  refreshSavedHomes: () => Promise<void>;
  toggleSaveListing: (listingId: string) => Promise<void>;
  contactAgent: (listingId: string) => Promise<void>;
  requestTour: (listingId: string) => Promise<void>;
  refreshInbox: () => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [searchResults, setSearchResults] = useState<ListingSummary[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(null);
  const [savedHomes, setSavedHomes] = useState<ListingSummary[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(() => session?.accessToken ?? "", [session]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.loginUser(email, password);
      setSession(result as UserSession);
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.registerUser(email, password);
      setSession(result as UserSession);
    } catch (e: any) {
      setError(e?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setSearchResults([]);
    setSelectedListing(null);
    setSavedHomes([]);
    setLeads([]);
    setError(null);
  }, []);

  const loadSearch = useCallback(async (query?: string, propertyType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, unknown> = { minBeds: 1 };
      if (propertyType) filters.propertyTypes = [propertyType];
      const result = await api.searchListings(getToken(), query ?? "", filters);
      setSearchResults((result as { items: ListingSummary[] }).items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const selectListing = useCallback(async (listingId: string) => {
    setLoading(true);
    try {
      const result = await api.getListingDetail(getToken(), listingId);
      setSelectedListing(result as ListingDetail);
    } catch {
      setSelectedListing(null);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const refreshSavedHomes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const result = await api.listSavedHomes(getToken());
      setSavedHomes((result as { items: ListingSummary[] }).items ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [session, getToken]);

  const toggleSaveListing = useCallback(async (listingId: string) => {
    if (!session) return;
    const isSaved = savedHomes.some((l) => l.listingId === listingId);
    try {
      if (isSaved) {
        await api.removeSavedHome(getToken(), listingId);
        setSavedHomes((prev) => prev.filter((l) => l.listingId !== listingId));
      } else {
        await api.saveHome(getToken(), listingId);
        await refreshSavedHomes();
      }
    } catch {
      /* ignore */
    }
  }, [session, savedHomes, getToken, refreshSavedHomes]);

  const contactAgent = useCallback(async (listingId: string) => {
    if (!session) return;
    try {
      await api.contactAgent(getToken(), listingId, "Interested in this property.");
      await refreshInboxInternal();
    } catch {
      /* ignore */
    }
  }, [session, getToken]);

  const requestTour = useCallback(async (listingId: string) => {
    if (!session) return;
    try {
      await api.requestTour(getToken(), listingId, ["Saturday 10:00-12:00"]);
      await refreshInboxInternal();
    } catch {
      /* ignore */
    }
  }, [session, getToken]);

  async function refreshInboxInternal() {
    if (!session) return;
    try {
      const result = await api.listInboxLeads(getToken());
      setLeads((result as { items: Lead[] }).items ?? []);
    } catch {
      /* ignore */
    }
  }

  const refreshInbox = useCallback(async () => {
    setLoading(true);
    await refreshInboxInternal();
    setLoading(false);
  }, [session, getToken]);

  const value = useMemo<AppStateValue>(() => ({
    session,
    searchResults,
    selectedListing,
    savedHomes,
    leads,
    loading,
    error,
    login,
    register,
    logout,
    loadSearch,
    selectListing,
    refreshSavedHomes,
    toggleSaveListing,
    contactAgent,
    requestTour,
    refreshInbox,
  }), [session, searchResults, selectedListing, savedHomes, leads, loading, error, login, register, logout, loadSearch, selectListing, refreshSavedHomes, toggleSaveListing, contactAgent, requestTour, refreshInbox]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
