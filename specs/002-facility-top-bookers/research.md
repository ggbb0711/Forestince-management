# Research: Facility Top Bookers & Remove Reports Page

## Decision 1: Where to add the top bookers query

**Decision**: Extend the existing `getFacilityStats()` service function to also run a `prisma.booking.groupBy({ by: ['userId'] })` query in the same `Promise.all` call.

**Rationale**: The facility usage tab already calls `getFacilityStats` to load all its data in one fetch. Adding the top-bookers count to the same request keeps the client simple (one hook, one fetch, one loading state) and avoids a second round-trip. The groupBy query is lightweight — it returns at most a handful of rows per facility.

**Alternatives considered**:
- Separate endpoint `GET /api/reports/facility-stats/:id/top-bookers` — rejected; unnecessary second network call for data that logically belongs with the same usage context.
- Client-side aggregation over the booking list — rejected; the booking list is paginated and would not reflect all bookings.

---

## Decision 2: Where to place `TopBooker` and updated `FacilityStatBreakdown` types on the client

**Decision**: Move `FacilityStatBreakdown` (extended with `topBookers`) and the new `TopBooker` type into `forestince-client/src/features/facilities/types/facility.ts`. Update all imports accordingly.

**Rationale**: These types describe facility-specific statistics. When the `reports/` feature directory is deleted, the types must live somewhere; `facility.ts` is the canonical home for facility-related client types and is already imported by the relevant hooks and API functions.

**Alternatives considered**:
- Keep a partial `reports/types/report.ts` with only the facility types — rejected; a `reports/` directory with no report feature is confusing.
- Create a new `facilityStats.ts` type file — unnecessary file proliferation for two types.

---

## Decision 3: What to delete vs. what to keep in `reportService.ts` and `reports.ts`

**Decision**: Keep the `reports.ts` route file and `reportService.ts` service file but surgically remove only the usage/financial/damage functions and routes. Keep `getFacilityStats` and its helpers (`getDefaultDateRange`, `toISODateString`).

**Rationale**: The facility-stats endpoint (`GET /api/reports/facility-stats/:id`) is actively used by the usage tab. Deleting the whole files would require re-creating or moving them. Surgical removal is cleaner.

**What is removed from server**:
- Routes: `GET /usage`, `GET /financial`, `GET /damage`
- Service functions: `getUsageReport`, `getFinancialReport`, `getDamageReport`, `getPeriodLabel`
- Types: `UsageReportRow`, `UsageReportResponse`, `ReportGroupBy`, `FinancialReportRow`, `FinancialReportSummary`, `FinancialReportResponse`, `DamageReportRow`, `DamageReportResponse`
- Constants: `API_MESSAGES.REPORTS` (keep `API_MESSAGES.FACILITY_STATS`)

---

## Decision 4: `useFilteredPagination` hook

**Decision**: Delete `forestince-client/src/hooks/useFilteredPagination.ts`. It was only used by `useDamageReport.ts`, which is also being deleted.

**Rationale**: Dead code. The hook is not used anywhere else in the codebase after the reports feature is removed.

---

## Decision 5: Top bookers display in FacilityUsageTab

**Decision**: Render the top bookers as a ranked list below the utilization rate card. Each row shows rank badge, user name, company name, and booking count. Match the visual style of existing table rows (similar to `DesktopBookingsList`). Show at most 10 entries. Empty state if no bookings exist in the period.

**Rationale**: Consistent with existing list patterns in the app. No new dependencies required. Skeleton loading follows the same Skeleton component approach used throughout the app.
