# Mobile API Integration Matrix

| Mobile area | API endpoint(s) | Integration status |
| --- | --- | --- |
| Health and environment sanity | `GET /v1/health` | Scaffolded backend route available |
| Search results | `POST /v1/search/listings` | Backend route scaffolded, real search integration pending |
| Listing detail | `GET /v1/listings/{listingId}` | Backend route scaffolded with placeholder payload |
| User auth | `/v1/auth/*` | Not implemented |
| Saved homes | `/v1/saved-homes*` | Not implemented |
| Saved searches and alerts | `/v1/saved-searches*` | Not implemented |
| Contact and tours | `/v1/listings/{listingId}/contact-agent`, `/tour-requests` | Not implemented |
| Inbox lead history | `GET /v1/me/leads` | Not implemented |

## Integration priorities

1. Identity + session APIs
2. Search and listing detail with real data
3. Save and alerts workflows
4. Contact and tour conversion actions
