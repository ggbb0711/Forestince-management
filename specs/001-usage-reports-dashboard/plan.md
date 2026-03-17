# Implementation Plan: Facility Usage, Dashboard & Reports

**Branch**: `001-usage-reports-dashboard` | **Date**: 2026-03-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-usage-reports-dashboard/spec.md`

## Summary

Build three interconnected features on top of the existing facility booking system: (1) a real-data dashboard with time-window filtering (last 24h / 7d / 28d, default 28d), (2) a facility usage tab showing per-facility booking statistics with date-range filtering, and (3) a reports section with Usage, Financial, and Damage report types. Architecture mirrors the existing codebase exactly — Express routes + Prisma services on the backend, React feature folders + hooks on the frontend. A shared `FilterBar` component, shared `Pagination` component, and a generic `useFilteredPagination` hook are introduced to eliminate duplication across the four new paginated/filtered views. Seed data is expanded to ~200 bookings to enable meaningful pagination and report visualization.

## Technical Context

**Language/Version**: TypeScript (server + client)
**Primary Dependencies**: Express 4, Prisma ORM (SQLite), React 19, React Router v6, TailwindCSS, Shadcn/ui, Sonner (toasts), Vite
**Storage**: SQLite via Prisma (local dev)
**Testing**: None — prototype with no test infrastructure
**Target Platform**: Web browser (desktop + mobile responsive)
**Project Type**: Full-stack web application (REST API + React SPA)
**Performance Goals**: Dashboard and report pages load within 3 seconds with 200+ bookings
**Constraints**: Prototype — no authentication, no real-time updates, no offline support
**Scale/Scope**: ~200 seed bookings, 5 facilities, 15 users, 5 companies

## Constitution Check

The project constitution file contains only a blank template — no project-specific principles are defined. No gates to evaluate.

Architectural directives from the user (treated as governing constraints):
- Same architecture as existing code ✅ — all new code follows established patterns
- Maximize component reuse ✅ — FilterBar and Pagination extracted as shared components
- Generic pagination hook ✅ — `useFilteredPagination` covers all paginated views
- Generic FilterBar ✅ — single component configurable for each use case

## Project Structure

### Documentation (this feature)

```text
specs/001-usage-reports-dashboard/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   ├── dashboard-endpoint.md
│   └── reports-endpoints.md
└── tasks.md             ← Phase 2 output (/speckit.tasks — not created here)
```

### Source Code

```text
forestince-server/
├── prisma/
│   └── seed.ts                            MODIFY — expand to ~200 bookings
└── src/
    ├── index.ts                           MODIFY — register /api/dashboard, /api/reports
    ├── routes/
    │   ├── bookings.ts                    existing
    │   ├── facilities.ts                  existing
    │   ├── dashboard.ts                   NEW
    │   └── reports.ts                     NEW
    ├── services/
    │   ├── bookingService.ts              existing
    │   ├── facilityService.ts             existing
    │   ├── dashboardService.ts            NEW
    │   └── reportService.ts               NEW
    └── types/
        ├── booking.ts                     existing
        ├── facility.ts                    existing
        ├── pagination.ts                  existing
        ├── response.ts                    existing
        ├── dashboard.ts                   NEW
        └── report.ts                      NEW

forestince-client/src/
├── app/
│   └── router.tsx                         MODIFY — add /reports route
├── components/
│   ├── Layout.tsx                         existing
│   ├── Sidebar.tsx                        MODIFY — activate Reports nav link
│   ├── FilterBar.tsx                      NEW — shared configurable filter bar
│   └── Pagination.tsx                     NEW — extracted shared pagination
├── hooks/
│   └── useFilteredPagination.ts           NEW — generic paginated data hook
├── features/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx              MODIFY — time window selector + real data
│   │   ├── api/
│   │   │   ├── getBookings.ts             existing
│   │   │   └── getDashboard.ts            NEW
│   │   ├── hooks/
│   │   │   ├── useBookings.ts             existing
│   │   │   └── useDashboard.ts            NEW
│   │   ├── types/
│   │   │   └── dashboard.ts               MODIFY — add DashboardWindow, DashboardStats, FacilityUsageStat
│   │   └── components/
│   │       ├── StatCard.tsx               existing (receives real data)
│   │       ├── BookingsPanel.tsx          existing
│   │       ├── FacilityUsagePanel.tsx     MODIFY — accept real FacilityUsageStat[]
│   │       └── CampusMapView.tsx          existing
│   ├── facilities/
│   │   ├── FacilityDetailPage.tsx         MODIFY — add Usage tab
│   │   ├── api/
│   │   │   └── getFacilityStats.ts        NEW
│   │   ├── hooks/
│   │   │   └── useFacilityStats.ts        NEW
│   │   └── components/
│   │       ├── FacilityBookingsTab/
│   │       │   ├── index.tsx              MODIFY — swap to shared FilterBar + Pagination
│   │       │   ├── FilterBar.tsx          REMOVE (replaced by shared component)
│   │       │   ├── Pagination.tsx         REMOVE (replaced by shared component)
│   │       │   ├── DesktopBookingsList.tsx  existing
│   │       │   ├── MobileBookingsList.tsx   existing
│   │       │   └── types.ts               existing
│   │       └── FacilityUsageTab/
│   │           └── index.tsx              NEW
│   └── reports/
│       ├── ReportsPage.tsx                NEW — tab host for all 3 report types
│       ├── api/
│       │   ├── getUsageReport.ts          NEW
│       │   ├── getFinancialReport.ts      NEW
│       │   └── getDamageReport.ts         NEW
│       ├── hooks/
│       │   ├── useUsageReport.ts          NEW
│       │   ├── useFinancialReport.ts      NEW
│       │   └── useDamageReport.ts         NEW
│       ├── types/
│       │   └── report.ts                  NEW
│       └── components/
│           ├── UsageReportTab.tsx         NEW
│           ├── FinancialReportTab.tsx     NEW
│           └── DamageReportTab.tsx        NEW
```

**Structure Decision**: Web application following Option 2 (backend + frontend). All new files follow the existing feature-folder convention on the client and the routes/services/types layering on the server.

## Complexity Tracking

No constitution violations — no justification table required.

---

## Design Decisions

### 1. Shared FilterBar (`components/FilterBar.tsx`)

A single component replaces the existing `FacilityBookingsTab/FilterBar.tsx` and covers all new filter bars (facility usage, reports). It is configured via props:

```
Props:
  showSearch?: boolean          — text search input
  showStatus?: boolean          — status dropdown
  showDateRange?: boolean       — dateFrom + dateTo inputs
  extraDropdowns?: Array<{      — any additional dropdowns
    key: string
    label: string
    placeholder: string
    value: string | undefined
    options: Array<{ value: string; label: string }>
  }>
  values: Record<string, string | undefined>
  onChange: (patch: Record<string, string | undefined>) => void
  onClear: () => void
  hasActiveFilters: boolean
```

Usage examples:
- FacilityBookingsTab: `showSearch + showStatus + showDateRange`
- FacilityUsageTab: `showDateRange` only
- UsageReport: `showDateRange` only
- FinancialReport: `showDateRange + extraDropdowns=[facility, groupBy]`
- DamageReport: `showDateRange` only

### 2. Shared Pagination (`components/Pagination.tsx`)

Extracted from `FacilityBookingsTab/Pagination.tsx` with identical interface. Used by FacilityBookingsTab, DamageReport, and any future paginated views.

```
Props:
  page: number
  totalPages: number
  onPageChange: (page: number) => void
```

### 3. Generic Hook (`hooks/useFilteredPagination.ts`)

Replaces the repeated data-fetching pattern across `useFacilityBookings`, `useDamageReport`:

```typescript
function useFilteredPagination<TData, TFilters>(
  fetchFn: (filters: TFilters) => Promise<{ data: TData[]; meta: PaginationMeta }>,
  filters: TFilters
): { data: TData[]; meta: PaginationMeta | null; loading: boolean; error: string | null }
```

`useFacilityBookings` is refactored to use this hook. `useDamageReport` uses it directly.

### 4. Dashboard Time Window

The dashboard passes a `window` query param (`24h` | `7d` | `28d`) to `GET /api/dashboard`. The server computes `startTime >= now - window` as the date boundary. The UI shows a 3-option toggle (default: `28d`). All stat counts and facility usage percentages are scoped to the selected window. `registeredUsers` and `totalFacilities` are static counts (not time-windowed, as they represent the total system state).

### 5. Facility Usage Percentage Calculation

For the selected time window, the server counts bookings per facility. The percentage is normalized:
```
pct = Math.round((facilityCount / maxCountAcrossFacilities) * 100)
```
The most-used facility is always 100%; others are relative. This is returned from the server, not computed client-side.

### 6. Damage Report Detection

Bookings are identified as damage records when their `notes` field starts with `"Damage:"` (case-sensitive). This is a `startsWith` filter applied in the Prisma query using `{ notes: { startsWith: 'Damage:' } }`.

### 7. Reports Page Structure

A single `/reports` route renders `ReportsPage.tsx` which uses the existing `Tabs` component (from Shadcn/ui, already in the project) to host UsageReportTab, FinancialReportTab, and DamageReportTab. This mirrors the FacilityDetailPage tab pattern.

### 8. Seed Data Expansion

The seed is expanded from 87 to ~200 bookings by:
- Adding bookings spread over -120 to +30 days (4 months of history)
- Distributing bookings non-uniformly across facilities to make usage reports visually interesting
- Increasing damage incident count to ~20 for a meaningful damage report list
- Ensuring enough bookings per facility (30-50 each) to trigger pagination
