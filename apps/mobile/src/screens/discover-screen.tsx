import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useAppState } from "../state/app-state";

export function DiscoverScreen() {
  const {
    session,
    searchResults,
    selectedListing,
    savedHomes,
    loading,
    error,
    loginAsDemoBuyer,
    loadSearch,
    selectListing,
    toggleSaveListing,
    contactAgentForSelectedListing,
    requestTourForSelectedListing
  } = useAppState();

  useEffect(() => {
    if (session) {
      void loadSearch();
    }
  }, [session]);

  const selectedListingId = selectedListing?.listingId;
  const isSaved = selectedListingId ? savedHomes.some((home) => home.listingId === selectedListingId) : false;

  if (!session) {
    return (
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Discover</Text>
        <Text>Sign in to search listings, save homes, and contact agents.</Text>
        <Pressable
          onPress={() => void loginAsDemoBuyer()}
          style={{ backgroundColor: "#111827", padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Sign in as Demo Buyer</Text>
        </Pressable>
        {error ? <Text style={{ color: "#b91c1c" }}>Error: {error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Discover</Text>
      <Text>Signed in as {session.user.email}</Text>
      <Pressable onPress={() => void loadSearch()} style={{ borderWidth: 1, borderColor: "#d1d5db", padding: 10, borderRadius: 8 }}>
        <Text style={{ textAlign: "center" }}>Refresh Search Results</Text>
      </Pressable>
      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={{ color: "#b91c1c" }}>Error: {error}</Text> : null}
      {searchResults.length === 0 && !loading ? <Text>No listings found for this query.</Text> : null}
      {searchResults.map((listing) => (
        <Pressable
          key={listing.listingId}
          onPress={() => void selectListing(listing.listingId)}
          style={{
            borderWidth: 1,
            borderColor: selectedListingId === listing.listingId ? "#111827" : "#d1d5db",
            borderRadius: 8,
            padding: 10
          }}
        >
          <Text style={{ fontWeight: "600" }}>
            {listing.city}, {listing.state} - ${listing.price.toLocaleString()}
          </Text>
          <Text>
            {listing.beds} bd / {listing.baths} ba
          </Text>
        </Pressable>
      ))}
      {selectedListing ? (
        <View style={{ borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 12, gap: 8 }}>
          <Text style={{ fontWeight: "700" }}>Selected Listing: {selectedListing.listingId}</Text>
          <Text>{selectedListing.description ?? "No description available."}</Text>
          <Pressable
            style={{ backgroundColor: "#111827", padding: 12, borderRadius: 8 }}
            onPress={() => selectedListingId && void toggleSaveListing(selectedListingId)}
          >
            <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "600" }}>
              {isSaved ? "Remove from Saved" : "Save Home"}
            </Text>
          </Pressable>
          <Pressable
            style={{ backgroundColor: "#2563eb", padding: 12, borderRadius: 8 }}
            onPress={() => void contactAgentForSelectedListing()}
          >
            <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "600" }}>Contact Agent</Text>
          </Pressable>
          <Pressable
            style={{ backgroundColor: "#059669", padding: 12, borderRadius: 8 }}
            onPress={() => void requestTourForSelectedListing()}
          >
            <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "600" }}>Request Tour</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
