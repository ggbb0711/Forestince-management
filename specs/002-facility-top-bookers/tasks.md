# Tasks: Facility Top Bookers & Remove Reports Page

**Input**: Design documents from `/specs/002-facility-top-bookers/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks grouped by user story. US1 (Top Bookers) runs first since US2 server cleanup touches the same `report.ts` and `reportService.ts` files — do US1 additions first, then US2 removals. US2 client tasks are fully independent of US1 and can run in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new npm packages, no schema changes, no new directories. Existing monorepo structure used as-is.

- [X] T001 Read and verify current state of `forestince-server/src/types/report.ts`, `forestince-server/src/services/reportService.ts`, and `forestince-client/src/features/facilities/types/facility.ts` before making changes

---

## Phase 3: User Story 1 — Top Bookers on Facility Usage Tab (Priority: P1) 🎯 MVP

**Goal**: Add a ranked "Top Bookers" leaderboard to the facility Usage tab by extending the existing `getFacilityStats` endpoint with one additional `groupBy` query — no new routes, no new hooks.

**Independent Test**: Navigate to any facility detail page → click "Usage" tab → verify a ranked list of top bookers (rank badge, user name, company name, booking count) appears below the utilization rate card. Apply a date filter and confirm rankings update.

### Implementation for User Story 1

- [X] T00X [US1] Add `TopBooker` interface and `topBookers: TopBooker[]` field to `FacilityStatBreakdown` in `forestince-server/src/types/report.ts`
- [X] T00X [US1] Extend `getFacilityStats()` in `forestince-server/src/services/reportService.ts` to run `prisma.booking.groupBy({ by: ['userId'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 })` and `prisma.user.findMany({ where: { id: { in: userIds } }, include: { company: true } })` in the existing `Promise.all`, then assign ranks 1–N with alphabetical tiebreaking on `userName`
- [X] T00X [P] [US1] Add `TopBooker` interface and `topBookers: TopBooker[]` to `FacilityStatBreakdown` in `forestince-client/src/features/facilities/types/facility.ts`
- [X] T00X [P] [US1] Verify `forestince-client/src/features/facilities/api/getFacilityStats.ts` imports `FacilityStatBreakdown` from `../types/facility` (update import path if it currently references `reports/types/report`)
- [X] T00X [P] [US1] Verify `forestince-client/src/features/facilities/hooks/useFacilityStats.ts` imports `FacilityStatBreakdown` from `../types/facility` (update import path if it currently references `reports/types/report`)
- [X] T00X [US1] Add "Top Bookers" section to `forestince-client/src/features/facilities/components/FacilityUsageTab/index.tsx` — ranked list below the utilization rate card with rank badge (numbered circle), user name, company name, booking count; skeleton rows while `loading === true`; empty state message when `topBookers.length === 0`

**Checkpoint**: US1 fully functional — Top Bookers list appears on facility Usage tab, respects date filter, shows skeleton while loading, shows empty state when no bookings in period.

---

## Phase 4: User Story 2 — Remove Reports Page (Priority: P2)

**Goal**: Surgically delete all report-specific code on server and client, remove navigation entry, leave no dead code, broken imports, or orphaned routes.

**Independent Test**: Sidebar has no "Reports" link. Navigating to `/reports` shows Not Found page. `curl /api/reports/usage`, `/api/reports/financial`, `/api/reports/damage` each return 404. `/api/reports/facility-stats/:id` still returns 200. No console errors in the browser.

### Implementation for User Story 2

- [X] T00X [P] [US2] Remove `/usage`, `/financial`, `/damage` route handlers and their dead imports (`ReportGroupBy`, `VALID_GROUP_BY`, removed service functions) from `forestince-server/src/routes/reports.ts`, keeping only the `/facility-stats/:id` handler
- [X] T00X [P] [US2] Remove `getUsageReport`, `getFinancialReport`, `getDamageReport`, `getPeriodLabel` functions from `forestince-server/src/services/reportService.ts`, keeping `getFacilityStats`, `getDefaultDateRange`, `toISODateString`
- [X] T01X [P] [US2] Remove all report-only types (`UsageReportRow`, `UsageReportResponse`, `ReportGroupBy`, `FinancialReportRow`, `FinancialReportSummary`, `FinancialReportResponse`, `DamageReportRow`, `DamageReportResponse`) from `forestince-server/src/types/report.ts`, keeping `TopBooker` and `FacilityStatBreakdown`
- [X] T01X [P] [US2] Remove `REPORTS` key from `forestince-server/src/constants/messages.ts`, keeping `FACILITY_STATS`
- [X] T01X [P] [US2] Delete entire `forestince-client/src/features/reports/` directory (ReportsPage.tsx, all components, hooks, API functions, and types within it)
- [X] T01X [P] [US2] Delete `forestince-client/src/hooks/useFilteredPagination.ts`
- [X] T01X [P] [US2] Remove the `/reports` route entry from `forestince-client/src/app/router.tsx`
- [X] T01X [P] [US2] Remove the "Reports" navigation item from `forestince-client/src/components/Sidebar.tsx`
- [X] T01X [P] [US2] Remove the `/reports` route from the ROUTES array in `forestince-client/src/components/Breadcrumbs.tsx`

**Checkpoint**: Reports fully removed — no sidebar link, no client code, no server endpoints for usage/financial/damage. Facility-stats endpoint still works.

---

## Phase 5: Polish & Validation

**Purpose**: End-to-end correctness verification after both user stories complete.

- [X] T01X Run quickstart.md validation: confirm Top Bookers displays on Usage tab, date filter updates rankings, `/api/reports/facility-stats/:id` returns 200, and `/api/reports/usage|financial|damage` each return 404

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — starts immediately
- **US1 (Phase 3)**: Can start after T001
  - T002 → T003 sequential (server type must exist before service uses it)
  - T004, T005, T006 run in parallel with T002/T003 (different files — client side)
  - T007 depends on T003 (server must return `topBookers`), T004, T005, T006
- **US2 (Phase 4)**: T008–T016 are independent of US1 client tasks. T009 and T010 touch the same server files as T002/T003 — run US1 server tasks first to avoid conflicts
- **Polish (Phase 5)**: Depends on all Phase 3 + Phase 4 tasks complete

### User Story Dependencies

- **US1 (P1)**: No dependency on US2
- **US2 (P2)**: Client tasks (T012–T016) are fully independent of US1. Server tasks T009/T010 should run after T002/T003 to avoid editing conflicts on `report.ts` and `reportService.ts`

### Recommended Execution Order (Single Developer)

```
T001 → T002 → T003 → [T004, T005, T006 in parallel] → T007
                   → [T008–T016 in parallel]
                                                      → T017
```

---

## Parallel Examples

### User Story 1 — Client tasks after T002/T003

```bash
# Run these in parallel after T003 completes:
Task T004: Add TopBooker + topBookers field to forestince-client/src/features/facilities/types/facility.ts
Task T005: Verify imports in forestince-client/src/features/facilities/api/getFacilityStats.ts
Task T006: Verify imports in forestince-client/src/features/facilities/hooks/useFacilityStats.ts
```

### User Story 2 — All removal tasks

```bash
# All US2 tasks can run in parallel (after T002/T003 complete for server files):
Task T008: Remove dead routes from forestince-server/src/routes/reports.ts
Task T009: Remove dead functions from forestince-server/src/services/reportService.ts
Task T010: Remove dead types from forestince-server/src/types/report.ts
Task T011: Remove REPORTS from forestince-server/src/constants/messages.ts
Task T012: Delete forestince-client/src/features/reports/
Task T013: Delete forestince-client/src/hooks/useFilteredPagination.ts
Task T014: Remove /reports route from forestince-client/src/app/router.tsx
Task T015: Remove Reports nav item from forestince-client/src/components/Sidebar.tsx
Task T016: Remove /reports from forestince-client/src/components/Breadcrumbs.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: T001 (read existing state)
2. Complete Phase 3: T002 → T003 → T004/T005/T006 → T007
3. **STOP and VALIDATE**: Open facility Usage tab, verify Top Bookers list loads with correct ranks
4. Proceed to Phase 4 (reports removal) when US1 is stable

### Incremental Delivery

1. T001 → state verified
2. T002–T007 → Top Bookers working (MVP!)
3. T008–T016 → Reports cleanly removed
4. T017 → Full quickstart validation passes

---

## Notes

- No new npm packages, no Prisma schema migrations, no new directories
- T002 and T003 are sequential: server type must be defined before the service function uses it
- T007 must wait for T003 (endpoint must return `topBookers` field) and T004/T005/T006 (client types must be defined)
- T009 and T010 touch the same server files as T002/T003 — complete US1 server tasks first before running US2 server removals
- All US2 client tasks (T012–T016) are pure deletions/removals in separate files — fully parallelizable
- Total tasks: 17 (1 setup + 6 US1 + 9 US2 + 1 polish)
