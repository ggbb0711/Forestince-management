# Tasks: Facility Usage, Dashboard & Reports

**Input**: Design documents from `/specs/001-usage-reports-dashboard/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Not requested — prototype with no test infrastructure.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Expand seed data and define shared server-side types before implementation begins.

- [X] T001 Expand `forestince-server/prisma/seed.ts` to ~200 bookings — add more historical entries spanning 4 months back, increase per-facility booking count to 30–50, and add ~20 damage-noted bookings (notes starting with `"Damage:"`)
- [X] T002 [P] Create `forestince-server/src/types/dashboard.ts` — define `DashboardWindow`, `DashboardStats`, `FacilityUsageStat`, `DashboardSummary` as per data-model.md
- [X] T003 [P] Create `forestince-server/src/types/report.ts` — define `FacilityStatBreakdown`, `UsageReportRow`, `UsageReportResponse`, `FinancialReportRow`, `FinancialReportSummary`, `FinancialReportResponse`, `DamageReportRow`, `DamageReportResponse` as per data-model.md

**Checkpoint**: Seed expanded; type definitions ready for service implementation.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared client components and hooks that multiple user stories depend on. Also refactors the existing FacilityBookingsTab to use the new shared pieces.

**⚠️ CRITICAL**: US2–US5 depend on these shared components. US1 (Dashboard) can begin after Phase 1.

- [X] T004 [P] Create `forestince-client/src/components/FilterBar.tsx` — generic shared filter bar component with props: `showSearch`, `showStatus`, `showDateRange`, `extraDropdowns` (array of `{ key, label, placeholder, value, options }`), `values`, `onChange`, `onClear`, `hasActiveFilters`. Mirrors the visual style of the existing `FacilityBookingsTab/FilterBar.tsx`
- [X] T005 [P] Create `forestince-client/src/components/Pagination.tsx` — generic shared pagination component extracted from `forestince-client/src/features/facilities/components/FacilityBookingsTab/Pagination.tsx`. Props: `page`, `totalPages`, `onPageChange`. Identical interface; only moved to shared location
- [X] T006 Create `forestince-client/src/hooks/useFilteredPagination.ts` — generic hook `useFilteredPagination<TData, TFilters>(fetchFn, filters)` following the same React 19 `useTransition` + `useEffect` pattern as `useFacilityBookings.ts`. Returns `{ data, meta, loading, error }`
- [X] T007 Refactor `forestince-client/src/features/facilities/components/FacilityBookingsTab/index.tsx` — replace imports of local `FilterBar` and `Pagination` with the new shared `components/FilterBar.tsx` and `components/Pagination.tsx`. Behavior unchanged. (Depends on T004, T005)
- [X] T008 Delete `forestince-client/src/features/facilities/components/FacilityBookingsTab/FilterBar.tsx` — no longer needed; replaced by shared component (Depends on T007)
- [X] T009 Delete `forestince-client/src/features/facilities/components/FacilityBookingsTab/Pagination.tsx` — no longer needed; replaced by shared component (Depends on T007)

**Checkpoint**: Shared components ready; FacilityBookingsTab still works using the new shared pieces.

---

## Phase 3: User Story 1 — Live Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: Replace all hardcoded dashboard data with real data from a new `/api/dashboard` endpoint. Add a time-window toggle (last 24h / 7d / 28d, default 28d) so all stats update for the selected period.

**Independent Test**: Open the dashboard. Verify all 4 stat cards show real counts (not hardcoded). Toggle between 24h, 7d, and 28d — confirm all stats and facility usage percentages update each time. Confirm no hardcoded numbers remain in `FacilityUsagePanel`.

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement `getDashboardSummary(window: DashboardWindow)` in `forestince-server/src/services/dashboardService.ts` — parallel-count all stats using `Promise.all`, group facility booking counts using Prisma `groupBy`, normalize pct as `round((count / maxCount) * 100)`, fetch 5 most recent bookings. See `contracts/dashboard-endpoint.md` for full response shape. (Depends on T002)
- [X] T011 [P] [US1] Update `forestince-client/src/features/dashboard/types/dashboard.ts` — add `DashboardWindow = '24h' | '7d' | '28d'`, `DashboardStats`, `FacilityUsageStat`, `DashboardSummary` types; keep existing `Booking`, `StatItem`, `FacilityUsageItem`
- [X] T012 [US1] Create `forestince-server/src/routes/dashboard.ts` — `GET /` route that reads `?window` param (validates: `24h|7d|28d`, defaults `28d`), calls `getDashboardSummary`, returns `ApiResponse<DashboardSummary>`. Follow the pattern in `routes/bookings.ts`. (Depends on T010)
- [X] T013 [US1] Register dashboard route in `forestince-server/src/index.ts` — add `app.use('/api/dashboard', dashboardRouter)` following the existing pattern. (Depends on T012)
- [X] T014 [P] [US1] Create `forestince-client/src/features/dashboard/api/getDashboard.ts` — `getDashboard(window: DashboardWindow): Promise<DashboardSummary>` following the `getFacilityBookings.ts` fetch pattern with `ApiResponse` unwrapping. (Depends on T011)
- [X] T015 [US1] Create `forestince-client/src/features/dashboard/hooks/useDashboard.ts` — `useDashboard(window: DashboardWindow)` hook following `useFacilityBookings.ts` pattern (useTransition + useEffect + toast on error). Returns `{ summary, loading, error }`. (Depends on T014)
- [X] T016 [US1] Update `forestince-client/src/features/dashboard/components/FacilityUsagePanel.tsx` — accept `items: FacilityUsageStat[]` and `loading: boolean` props; render real data, show skeletons while loading, show empty state when no items. Remove all hardcoded data. (Depends on T011)
- [X] T017 [US1] Update `forestince-client/src/features/dashboard/DashboardPage.tsx` — add state for selected window (default `28d`), add 3-button toggle (Last 24h / Last 7 days / Last 28 days), call `useDashboard(window)`, pass real `stats` to `StatCard` components and real `facilityUsage` to `FacilityUsagePanel`. Remove all hardcoded StatItem and FacilityUsageItem values. (Depends on T015, T016)

**Checkpoint**: Dashboard shows real data for all time windows. All hardcoded values are gone.

---

## Phase 4: User Story 2 — Facility Usage View (Priority: P2)

**Goal**: Add a "Usage" tab to the Facility Detail page showing booking count, status breakdown, and utilization rate for the selected facility, filterable by date range.

**Independent Test**: Navigate to any facility detail page. Click the "Usage" tab. Verify total bookings, confirmed/pending/cancelled/completed counts, and utilization rate are displayed. Apply a date range filter and confirm the numbers change accordingly. Verify empty state when no data matches the filter.

### Implementation for User Story 2

- [X] T018 [P] [US2] Implement `getFacilityStats(id, dateFrom?, dateTo?)` in `forestince-server/src/services/facilityService.ts` — use parallel `Promise.all` to count bookings by each status for the facility in the date range, compute `utilizationRate = round((confirmed + completed) / total * 100)`. Return `FacilityStatBreakdown`. (Depends on T003)
- [X] T019 [US2] Add `GET /:id/stats` endpoint to `forestince-server/src/routes/facilities.ts` — validate `id` as integer, accept optional `dateFrom` and `dateTo` query params, call `getFacilityStats`, return `ApiResponse<FacilityStatBreakdown>`. Return 404 if facility not found. (Depends on T018)
- [X] T020 [P] [US2] Create `forestince-client/src/features/facilities/api/getFacilityStats.ts` — `getFacilityStats(facilityId, dateFrom?, dateTo?): Promise<FacilityStatBreakdown>` following the existing API fetch pattern. (Depends on T003)
- [X] T021 [US2] Create `forestince-client/src/features/facilities/hooks/useFacilityStats.ts` — `useFacilityStats(facilityId, dateFrom?, dateTo?)` hook returning `{ stats, loading, error }` using the useTransition + useEffect pattern. (Depends on T020)
- [X] T022 [US2] Create `forestince-client/src/features/facilities/components/FacilityUsageTab/index.tsx` — date range filter (using shared `FilterBar` with `showDateRange` only), stat cards for total/confirmed/pending/cancelled/completed/utilizationRate, skeleton loading states, empty state when no data. (Depends on T021, T004)
- [X] T023 [US2] Add "Usage" tab to `forestince-client/src/features/facilities/FacilityDetailPage.tsx` — add `<Tab value="usage">Usage</Tab>` and `<TabsContent value="usage"><FacilityUsageTab facilityId={...} /></TabsContent>` alongside the existing Bookings tab. (Depends on T022)

**Checkpoint**: Facility detail page has a working Usage tab with real data and date filtering.

---

## Phase 5: User Story 3 — Usage Report (Priority: P3)

**Goal**: Add a `/reports` page accessible from the sidebar with a "Usage" report tab showing all facilities ranked by booking volume, with date range filtering.

**Independent Test**: Click "Reports" in the sidebar. Verify the page opens on the Usage tab. Confirm a ranked list of all facilities with booking counts and utilization rates is shown for the default period (current month). Apply a date range filter and confirm results update. Verify empty state when no data matches.

### Implementation for User Story 3

- [X] T024 [P] [US3] Implement `getUsageReport(dateFrom?, dateTo?)` in `forestince-server/src/services/reportService.ts` (create file) — fetch booking counts per facility using Prisma `groupBy` or per-facility count queries, compute `utilizationRate`, sort by `totalBookings desc`, return `UsageReportResponse`. Default date range to current month if params absent. (Depends on T003)
- [X] T025 [P] [US3] Create `forestince-client/src/features/reports/types/report.ts` — define `UsageReportRow`, `UsageReportResponse`, `FinancialReportRow`, `FinancialReportSummary`, `FinancialReportResponse`, `DamageReportRow`, `DamageReportResponse` matching `forestince-server/src/types/report.ts`
- [X] T026 [US3] Create `forestince-server/src/routes/reports.ts` — `GET /usage` route that reads optional `dateFrom` and `dateTo`, calls `getUsageReport`, returns `ApiResponse<UsageReportResponse>`. (Depends on T024)
- [X] T027 [US3] Register reports route in `forestince-server/src/index.ts` — add `app.use('/api/reports', reportsRouter)`. (Depends on T026)
- [X] T028 [P] [US3] Create `forestince-client/src/features/reports/api/getUsageReport.ts` — `getUsageReport(dateFrom?, dateTo?): Promise<UsageReportResponse>` following existing fetch pattern. (Depends on T025)
- [X] T029 [US3] Create `forestince-client/src/features/reports/hooks/useUsageReport.ts` — `useUsageReport(dateFrom?, dateTo?)` returning `{ report, loading, error }` using useTransition pattern. (Depends on T028)
- [X] T030 [US3] Create `forestince-client/src/features/reports/components/UsageReportTab.tsx` — date range filter (shared `FilterBar` with `showDateRange`), table/list of facilities sorted by usage with columns: Facility Name, Total Bookings, Confirmed, Pending, Cancelled, Completed, Utilization Rate. Skeleton loading, empty state. (Depends on T029, T004)
- [X] T031 [US3] Create `forestince-client/src/features/reports/ReportsPage.tsx` — page container using existing `Tabs` component (Shadcn/ui) with "Usage" as the first tab, rendering `UsageReportTab`. Matches layout pattern of `FacilityDetailPage`. (Depends on T030)
- [X] T032 [US3] Add `/reports` route to `forestince-client/src/app/router.tsx` — add `{ path: '/reports', element: <Layout><ReportsPage /></Layout> }` following the existing route pattern. (Depends on T031)
- [X] T033 [US3] Activate Reports nav link in `forestince-client/src/components/Sidebar.tsx` — change the Reports nav item from a non-functional link to `<NavLink to="/reports">`. (Depends on T032)

**Checkpoint**: `/reports` page is accessible from sidebar and shows a working Usage report.

---

## Phase 6: User Story 4 — Financial Report (Priority: P4)

**Goal**: Add a "Financial" tab to the Reports page showing booking volume over time (daily/weekly/monthly), filterable by date range and facility.

**Independent Test**: Navigate to `/reports`, click "Financial" tab. Verify booking counts per time period are shown for the default grouping (monthly, current month). Switch groupBy between daily/weekly/monthly — confirm aggregation updates. Filter by a specific facility — confirm only that facility's data appears.

### Implementation for User Story 4

- [X] T034 [P] [US4] Implement `getFinancialReport(dateFrom?, dateTo?, groupBy?, facilityId?)` in `forestince-server/src/services/reportService.ts` — fetch all matching bookings in the period, group by time period in JavaScript (format labels as YYYY-MM-DD / YYYY-W## / YYYY-MM), compute per-bucket status counts and summary totals. Return `FinancialReportResponse`. (Depends on T024, T003)
- [X] T035 [US4] Add `GET /financial` route to `forestince-server/src/routes/reports.ts` — validate `groupBy` is one of `daily|weekly|monthly` (default `monthly`), validate optional `facilityId` as integer, call `getFinancialReport`, return `ApiResponse<FinancialReportResponse>`. (Depends on T034, T026)
- [X] T036 [P] [US4] Create `forestince-client/src/features/reports/api/getFinancialReport.ts` — `getFinancialReport(params: { dateFrom?, dateTo?, groupBy?, facilityId? }): Promise<FinancialReportResponse>` following existing fetch pattern. (Depends on T025)
- [X] T037 [US4] Create `forestince-client/src/features/reports/hooks/useFinancialReport.ts` — `useFinancialReport(params)` returning `{ report, loading, error }` using useTransition pattern. (Depends on T036)
- [X] T038 [US4] Create `forestince-client/src/features/reports/components/FinancialReportTab.tsx` — shared `FilterBar` with `showDateRange` + `extraDropdowns` for GroupBy (Daily/Weekly/Monthly) and Facility (All/each facility). Summary stat cards (total, confirmed, cancelled). Table of time-period rows with status columns. Skeleton loading, empty state. (Depends on T037, T004)
- [X] T039 [US4] Add "Financial" tab to `forestince-client/src/features/reports/ReportsPage.tsx` — add `<Tab value="financial">Financial</Tab>` and `<TabsContent value="financial"><FinancialReportTab /></TabsContent>`. (Depends on T038, T031)

**Checkpoint**: Reports page has a working Financial tab with groupBy and facility filtering.

---

## Phase 7: User Story 5 — Damage Report (Priority: P5)

**Goal**: Add a "Damage" tab to the Reports page listing all bookings with notes starting with `"Damage:"`, paginated, filterable by date range.

**Independent Test**: Navigate to `/reports`, click "Damage" tab. Verify all damage-noted bookings are listed (facility name, booking date, user name, damage description). Apply a date range filter. Navigate through pages using Pagination. Verify empty state when no damage records exist in the selected period.

### Implementation for User Story 5

- [X] T040 [P] [US5] Implement `getDamageReport(dateFrom?, dateTo?, page?, pageSize?)` in `forestince-server/src/services/reportService.ts` — filter bookings with `{ notes: { startsWith: 'Damage:' } }` combined with optional date range, apply pagination (skip/take), return `DamageReportResponse` with `meta`. (Depends on T024, T003)
- [X] T041 [US5] Add `GET /damage` route to `forestince-server/src/routes/reports.ts` — accept optional `dateFrom`, `dateTo`, `page`, `pageSize` params, call `getDamageReport`, return `ApiResponse<DamageReportResponse>`. (Depends on T040, T026)
- [X] T042 [P] [US5] Create `forestince-client/src/features/reports/api/getDamageReport.ts` — `getDamageReport(params: { dateFrom?, dateTo?, page?, pageSize? }): Promise<DamageReportResponse>` following existing fetch pattern. (Depends on T025)
- [X] T043 [US5] Create `forestince-client/src/features/reports/hooks/useDamageReport.ts` — use the shared `useFilteredPagination<DamageReportRow, DamageFilters>(getDamageReport, filters)` hook. Returns `{ data, meta, loading, error }`. (Depends on T042, T006)
- [X] T044 [US5] Create `forestince-client/src/features/reports/components/DamageReportTab.tsx` — shared `FilterBar` with `showDateRange` only, table with columns: Facility, Booking Date, User, Damage Description. Shared `Pagination` below the table. Skeleton loading, empty state. (Depends on T043, T004, T005)
- [X] T045 [US5] Add "Damage" tab to `forestince-client/src/features/reports/ReportsPage.tsx` — add `<Tab value="damage">Damage</Tab>` and `<TabsContent value="damage"><DamageReportTab /></TabsContent>`. (Depends on T044, T039)

**Checkpoint**: Reports page has all three tabs working. Damage tab paginates correctly using the shared Pagination component.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, empty states, and responsive behaviour across all new views.

- [X] T046 [P] Verify and fix all empty states — dashboard (no bookings in window), FacilityUsageTab (no data in date range), all three report tabs (no data). Every empty state must show a clear message, not a blank screen.
- [X] T047 [P] Verify responsive layout on all new pages — Reports page tabs must be usable on mobile, FacilityUsageTab stat cards must wrap correctly, FilterBar must not overflow on small screens.
- [X] T048 Validate all spec acceptance scenarios from `spec.md` — step through each Given/When/Then for US1–US5 and confirm each passes with the live running app.
- [X] T049 Re-run seed and validate `quickstart.md` — run `npx ts-node prisma/seed.ts`, start both server and client, confirm all five features work end-to-end with the freshly seeded 200-booking dataset.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — must complete before US2–US5
- **Phase 3 (US1)**: Depends on Phase 1 only — can start while Phase 2 runs in parallel
- **Phase 4 (US2)**: Depends on Phase 2 (needs shared FilterBar)
- **Phase 5 (US3)**: Depends on Phase 2 (needs shared FilterBar); creates reports infrastructure used by US4 and US5
- **Phase 6 (US4)**: Depends on Phase 5 (adds to reportService.ts and ReportsPage)
- **Phase 7 (US5)**: Depends on Phase 5 + Phase 2 (needs useFilteredPagination from T006)
- **Phase 8 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1. Fully independent.
- **US2 (P2)**: Depends on Phase 2 (shared FilterBar T004).
- **US3 (P3)**: Depends on Phase 2 (shared FilterBar T004). Creates `ReportsPage` and `reports.ts` route used by US4 and US5.
- **US4 (P4)**: Depends on US3 (adds to `reportService.ts` and `ReportsPage.tsx`).
- **US5 (P5)**: Depends on US3 (adds to `reportService.ts` and `ReportsPage.tsx`) + Phase 2 (useFilteredPagination T006).

### Parallel Opportunities Within Stories

**Phase 1**: T002 and T003 run in parallel (different files).

**Phase 3 (US1)**: T010 (server service) and T011 (client types) run in parallel. T014 (API fn) can start as soon as T011 is done.

**Phase 4 (US2)**: T018 (server endpoint) and T020 (client API fn) run in parallel (different layers, different files).

**Phase 5 (US3)**: T024 (server service) and T025 (client types) run in parallel. T028 (client API fn) can start as soon as T025 is done.

**Phase 6 (US4)**: T034 (server) and T036 (client API fn) run in parallel.

**Phase 7 (US5)**: T040 (server) and T042 (client API fn) run in parallel.

**Phase 8**: T046 and T047 run in parallel.

---

## Parallel Example: User Story 1 (Dashboard)

```
# After Phase 1 completes, these two start simultaneously:
T010: Implement getDashboardSummary in forestince-server/src/services/dashboardService.ts
T011: Update dashboard types in forestince-client/src/features/dashboard/types/dashboard.ts

# After T010 completes:
T012: Create routes/dashboard.ts  →  T013: Register in index.ts

# After T011 completes:
T014: Create getDashboard.ts  →  T015: Create useDashboard.ts hook

# After T015 + T016 both complete:
T017: Update DashboardPage.tsx (final integration)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1**: Expand seed data + create type files
2. Complete **Phase 3 (US1)**: Dashboard with real data and time window toggle
3. **STOP and VALIDATE**: Open dashboard, toggle all three time windows, confirm all stats are real
4. Demo-ready at this point

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation + shared components ready
2. Phase 3 (US1) → Real dashboard ← **MVP Demo Point**
3. Phase 4 (US2) → Facility usage tab ← **Demo Point**
4. Phase 5 (US3) → Reports page + Usage report ← **Demo Point**
5. Phase 6 (US4) → Financial report added ← **Demo Point**
6. Phase 7 (US5) → Damage report added ← **Demo Point**
7. Phase 8 → Polish + final validation

### Parallel Team Strategy

With two developers after Phase 1 + Phase 2:
- **Dev A**: US1 (Dashboard) → US2 (Facility Usage Tab)
- **Dev B**: US3 (Usage Report) → US4 (Financial Report) → US5 (Damage Report)

---

## Notes

- [P] tasks use different files with no unmet dependencies — safe to parallelize
- Each user story phase is independently completable and testable before moving on
- Server and client tasks within a story can be worked on simultaneously by different people
- The shared `FilterBar`, `Pagination`, and `useFilteredPagination` in Phase 2 are the key reuse investments — take care to match the existing visual and behavioral patterns
- `reportService.ts` is extended across US3–US5; ensure each addition is a new exported function, not a modification of an existing one
- Commit after each phase checkpoint to preserve independent, working increments
