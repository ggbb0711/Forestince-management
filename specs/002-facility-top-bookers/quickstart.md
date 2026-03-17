# Quickstart: Facility Top Bookers & Remove Reports Page

## Prerequisites

```bash
cd forestince-server && npm install
cd forestince-client && npm install
```

## Start

```bash
# Terminal 1 — server (port 3003)
cd forestince-server && npm run dev

# Terminal 2 — client (port 5173)
cd forestince-client && npm run dev
```

## Verify Top Bookers (US1)

1. Open http://localhost:5173
2. Click **Facilities** in the sidebar
3. Click any facility
4. Click the **Usage** tab
5. Verify:
   - Stat cards (Total / Confirmed / Pending / Cancelled / Completed) load
   - Utilization rate progress bar shows
   - **Top Bookers** section appears below with a ranked list of users
   - Each row shows rank badge, user name, company, booking count
   - Skeleton rows appear briefly while loading

6. Apply a date filter (e.g., last 30 days):
   - Verify top bookers update to reflect only that period
   - Verify empty state message when date range has no bookings

## Verify Reports Removed (US2)

1. Confirm the **Reports** link is absent from the sidebar
2. Navigate to http://localhost:5173/reports — should show Not Found page
3. In a terminal, confirm the backend endpoints are gone:

```bash
curl http://localhost:3003/api/reports/usage     # → 404
curl http://localhost:3003/api/reports/financial  # → 404
curl http://localhost:3003/api/reports/damage     # → 404
curl http://localhost:3003/api/reports/facility-stats/1  # → 200 (kept)
```

## Verify No Dead Code

- `forestince-client/src/features/reports/` directory should not exist
- `forestince-client/src/hooks/useFilteredPagination.ts` should not exist
- `forestince-server/src/types/report.ts` should contain only `TopBooker` and `FacilityStatBreakdown`
- `forestince-server/src/services/reportService.ts` should contain only `getFacilityStats`
