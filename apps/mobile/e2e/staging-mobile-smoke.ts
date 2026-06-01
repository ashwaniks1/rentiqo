import assert from "node:assert/strict";

const apiBaseUrl = process.env.E2E_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:18080";
process.env.EXPO_PUBLIC_API_BASE_URL = apiBaseUrl;

async function run() {
  const apiClient = await import("../src/api/client.ts");
  const session = await apiClient.loginUser("buyer@rentiqo.dev", "password123") as { accessToken: string };
  assert.equal(Boolean(session.accessToken), true, "login must return access token");

  const search = await apiClient.searchListings(session.accessToken, "Austin", { minBeds: 2 }) as { items: Array<{ listingId: string }> };
  assert.equal(search.items.length > 0, true, "search must return at least one listing");

  const listingId = search.items[0]?.listingId;
  assert.equal(Boolean(listingId), true, "search result must include listing id");

  const detail = await apiClient.getListingDetail(session.accessToken, listingId as string) as { listingId: string };
  assert.equal(detail.listingId, listingId, "listing detail id should match selected listing");

  await apiClient.saveHome(session.accessToken, listingId as string);
  const savedHomes = await apiClient.listSavedHomes(session.accessToken) as { items: Array<{ listingId: string }> };
  assert.equal(
    savedHomes.items.some((item: { listingId: string }) => item.listingId === listingId),
    true,
    "saved homes should include selected listing"
  );

  const inboxBefore = await apiClient.listInboxLeads(session.accessToken) as { items: unknown[] };
  const contactLead = await apiClient.contactAgent(session.accessToken, listingId as string, "Staging smoke contact request") as { leadId?: string };
  const tourLead = await apiClient.requestTour(session.accessToken, listingId as string, ["Saturday 10:00-12:00"]) as { tourRequestId?: string; leadId?: string };

  assert.equal(Boolean(contactLead.leadId), true, "contact flow should return lead id");
  assert.equal(Boolean(tourLead.tourRequestId || tourLead.leadId), true, "tour flow should return tour/lead id");

  const inboxAfter = await apiClient.listInboxLeads(session.accessToken) as { items: unknown[] };
  assert.equal(
    inboxAfter.items.length >= inboxBefore.items.length + 2,
    true,
    "inbox should contain new leads for contact and tour flows"
  );

  await apiClient.removeSavedHome(session.accessToken, listingId as string);

  process.stdout.write(
    JSON.stringify(
      {
        check: "staging-mobile-smoke",
        apiBaseUrl,
        listingId,
        inboxBefore: inboxBefore.items.length,
        inboxAfter: inboxAfter.items.length
      },
      null,
      2
    ) + "\n"
  );
}

run().catch((error) => {
  process.stderr.write(`staging-mobile-smoke failed: ${String(error)}\n`);
  process.exitCode = 1;
});
