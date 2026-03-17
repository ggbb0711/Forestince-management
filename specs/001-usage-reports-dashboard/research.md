# Research: Facility Usage, Dashboard & Reports

**Branch**: `001-usage-reports-dashboard` | **Date**: 2026-03-18

## Decision Log

### 1. Dashboard Time Window Parameter

**Decision**: Query param `?window=24h|7d|28d` on `GET /api/dashboard`. Default: `28d`.

**Rationale**: Simple enum param avoids complex date parsing on the client. The server translates to an absolute cutoff date (`now - N hours/days`). Three options cover the primary use cases (day, week, month). `28d` as default gives a useful "last month" view without implying a calendar month boundary.

**Alternatives considered**:
- Free-form `?dateFrom=&dateTo=`: More flexible but overkill for a dashboard toggle. Reports already use free-form date ranges.
- Named periods (this_month, last_week): Calendar-aligned periods add timezone complexity — not needed for a prototype.

---

### 2. Facility Usage Percentage Calculation

**Decision**: `pct = Math.round((facilityCount / maxCountAcrossFacilities) * 100)`. Server-computed. Most-used facility = 100%.

**Rationale**: No capacity data exists (no available-hours-per-day field on Facility), so absolute utilization (booked hours / available hours) is not possible. Relative normalization produces visually meaningful 0–100 values that still rank facilities by comparative demand.

**Alternatives considered**:
- Hardcode a max capacity (e.g., 30 bookings/month = 100%): Arbitrary and breaks when booking volume grows.
- Return raw counts only, compute pct client-side: Would work but makes the server response less self-contained. Server-side is consistent with the existing pattern of returning computed values.
- Count only CONFIRMED + COMPLETED: Decided to count all statuses (including PENDING/CANCELLED) for a true picture of demand, not just successful occupancy.

---

### 3. Damage Report Detection

**Decision**: Filter bookings where `notes LIKE 'Damage:%'` (Prisma: `{ notes: { startsWith: 'Damage:' } }`). No schema changes.

**Rationale**: The spec (Q2: A) confirmed damage is tracked via booking notes. Using a `"Damage:"` prefix convention requires zero schema changes and zero migration. The seed data already populates damage notes in this format.

**Alternatives considered**:
- Case-insensitive match: SQLite's LIKE is case-insensitive by default for ASCII; startsWith in Prisma uses LIKE under the hood. Acceptable for a prototype.
- New `isDamage: Boolean` field: Cleaner long-term but requires migration and is out of scope per the spec decision.

---

### 4. Financial Report Grouping

**Decision**: `?groupBy=daily|weekly|monthly`. Server aggregates booking counts per time bucket using JavaScript date manipulation on the result set (not SQL GROUP BY, for SQLite compatibility).

**Rationale**: SQLite has limited date function support. Fetching all bookings in the period and grouping in JavaScript is simpler and works reliably across all environments. For 200 bookings this is trivially fast.

**Period label format**:
- `daily`: `"2026-03-18"` (ISO date string)
- `weekly`: `"2026-W12"` (ISO week notation)
- `monthly`: `"2026-03"` (YYYY-MM)

**Alternatives considered**:
- SQL GROUP BY with strftime: Works in SQLite but less portable and harder to test. Given prototype scale, JS grouping is preferred.
- Return raw bookings and group on the client: Violates the pattern of server-side aggregation for report endpoints.

---

### 5. Shared FilterBar Design

**Decision**: Single `FilterBar` component with prop-based field visibility and an `extraDropdowns` array for additional dropdowns.

**Rationale**: All filter bars in the app share the same visual structure (horizontal row, date inputs, search, dropdowns, clear button). A single component with feature flags avoids duplicating the layout and styling. The `extraDropdowns` prop handles the Financial Report's facility and groupBy selectors without special-casing.

**Alternatives considered**:
- Separate FilterBar per feature: Simpler per-feature but causes divergence over time (the exact problem this addresses).
- Fully generic schema-driven (field definitions array): Overly abstract for a prototype with 4 use cases.

---

### 6. Generic `useFilteredPagination` Hook

**Decision**: Generic hook `useFilteredPagination<TData, TFilters>(fetchFn, filters)` using React 19's `useTransition`.

**Rationale**: The existing `useFacilityBookings` hook has a clear, reusable pattern that is duplicated in `useDamageReport`. Extracting it as a typed generic eliminates the duplication and ensures consistent loading/error behavior across all paginated views.

**Alternatives considered**:
- TanStack Query (React Query): Better caching and devtools, but adds a new dependency to the project. Not warranted for a prototype.
- Keep per-feature hooks without a generic: Would work but violates the user's explicit requirement to maximize reuse.

---

### 7. Reports Page Navigation

**Decision**: Single `/reports` route with tab-based navigation inside `ReportsPage.tsx`. Uses existing `Tabs` component from Shadcn/ui.

**Rationale**: Mirrors the FacilityDetailPage tab pattern already in the codebase. Three report types (Usage, Financial, Damage) are contextually related — a single page with tabs keeps them discoverable. The Reports link in Sidebar already exists (just not wired up).

**Alternatives considered**:
- Separate routes `/reports/usage`, `/reports/financial`, `/reports/damage`: More navigable but adds three routes for what is conceptually one page.
- Single scrollable page with all three reports: Poor UX — reports have different filters and can be long.

---

### 8. Facility Usage Tab

**Decision**: Add a second "Usage" tab to `FacilityDetailPage` alongside the existing "Bookings" tab. New `GET /api/facilities/:id/stats?dateFrom=&dateTo=` endpoint returns per-facility booking counts and status breakdown.

**Rationale**: The facility detail page already has a tab structure with the "Bookings" tab. Adding a "Usage" tab is the natural place for per-facility statistics — consistent with the existing UX pattern.

**Alternatives considered**:
- Add usage stats inline in the Bookings tab: Mixes two concerns; harder to filter independently.
- Reuse the usage report endpoint filtered by facilityId: The reports endpoint is aggregated by time bucket, not suited for per-facility status breakdown. A dedicated stats endpoint is cleaner.

---

### 9. Seed Data Expansion

**Decision**: Expand from 87 to ~200 bookings by adding more historical data (-90 to -120 days), increasing bookings per facility (30–50 each), and adding ~20 damage-noted bookings.

**Rationale**: 87 bookings spread across 5 facilities gives ~17 per facility — barely two pages. ~200 bookings gives ~40 per facility — four pages at pageSize=10, enough to validate pagination. More history gives the Financial Report meaningful monthly groupings. More damage notes gives the Damage Report a useful list.

**Alternatives considered**:
- Programmatic generation with loops: Cleaner code but harder to read/debug. Explicit entries are more transparent for a seed file.
