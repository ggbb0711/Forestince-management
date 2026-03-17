# Feature Specification: Facility Usage, Dashboard & Reports

**Feature Branch**: `001-usage-reports-dashboard`
**Created**: 2026-03-17
**Status**: Draft
**Input**: User description: "Okay I'm building a system for booking facilities, it only a prototype, I have already done a lot of work, now I need you to complete: viewing facility usage, update the dashboard by creating a new endpoint on the backend, and viewing reports such as financial, usage, or damage reports usecase"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Dashboard Overview (Priority: P1)

A facility administrator opens the dashboard and sees accurate statistics scoped to a selected time window: last 24 hours, last 7 days, or last 28 days (defaulting to last 28 days). The stats show total bookings, active facilities, registered users, pending requests, and real facility usage percentages — all filtered to the chosen period.

**Why this priority**: The dashboard is the first thing users see. Scoped time windows make the statistics actionable and meaningful for day-to-day management rather than showing all-time totals.

**Independent Test**: Can be fully tested by opening the dashboard, verifying the default view shows last 28 days data, switching between time windows, and confirming all stats update to match bookings within the newly selected period.

**Acceptance Scenarios**:

1. **Given** the dashboard loads, **When** no time window is selected, **Then** it defaults to displaying statistics for the last 28 days.
2. **Given** a time window is selected (last 24 hours / last 7 days / last 28 days), **When** the selection changes, **Then** all stat cards and facility usage percentages update to reflect only data within that window.
3. **Given** no bookings exist within the selected window, **When** the dashboard loads, **Then** all counts display as zero without errors or broken UI.
4. **Given** the selected window is "last 24 hours", **When** the dashboard loads, **Then** only bookings with a start time in the past 24 hours are counted.

---

### User Story 2 - Facility Usage View (Priority: P2)

A facility manager navigates to a specific facility and views its usage data: how many times it has been booked, the breakdown by booking status (confirmed, pending, cancelled, completed), and an overall utilization rate over a selectable time period.

**Why this priority**: Understanding individual facility performance helps managers identify high-demand resources and make informed operational decisions about scheduling and availability.

**Independent Test**: Can be fully tested by navigating to a facility detail view, verifying the displayed usage statistics match the underlying booking records, and confirming date range filtering adjusts the results correctly.

**Acceptance Scenarios**:

1. **Given** a facility has bookings, **When** the manager opens the facility's usage view, **Then** total booking count, status breakdown, and utilization rate are displayed.
2. **Given** a date filter is applied, **When** the manager selects a date range, **Then** usage statistics update to reflect only bookings within that period.
3. **Given** a facility has no bookings, **When** the manager views the facility usage, **Then** the system shows zeros alongside a clear "no bookings" empty state message.

---

### User Story 3 - Usage Report (Priority: P3)

A manager accesses the reports section and views a system-wide usage report showing which facilities are most and least used, total booking counts per facility, and status distribution — all filterable by date range.

**Why this priority**: System-wide usage reports give managers a bird's-eye view for resource planning and identifying bottlenecks across all facilities.

**Independent Test**: Can be fully tested by viewing the usage report and verifying the aggregated figures match the raw booking records for each facility in the selected time period.

**Acceptance Scenarios**:

1. **Given** bookings exist across multiple facilities, **When** the manager views the usage report, **Then** a list of facilities with booking counts and utilization rates is displayed.
2. **Given** a date range filter is applied, **When** the manager selects a period, **Then** the report reflects only bookings within that range.
3. **Given** no date filter is set, **When** the manager opens the report, **Then** it defaults to showing the current month's data.
4. **Given** the manager wants to compare facilities, **When** viewing the report, **Then** facilities can be sorted by usage count (highest to lowest).

---

### User Story 4 - Financial Report (Priority: P4)

A manager views a financial report showing booking activity trends — total bookings by status (confirmed, cancelled, pending, completed) aggregated by a selectable time grouping (daily, weekly, or monthly), optionally filtered by facility.

**Why this priority**: Booking trend reports help managers understand demand patterns and identify periods of low or high activity for planning purposes.

**Independent Test**: Can be fully tested by viewing the financial report and verifying that booking counts per time period match the booking records for the selected grouping and date range.

**Acceptance Scenarios**:

1. **Given** bookings exist over multiple time periods, **When** the manager views the financial report, **Then** booking counts broken down by status are shown per time unit (day/week/month).
2. **Given** a time grouping is selected, **When** the manager switches between daily, weekly, and monthly views, **Then** the aggregation updates accordingly.
3. **Given** a facility filter is applied, **When** viewing the report, **Then** only bookings for the selected facility are included.

---

### User Story 5 - Damage Report (Priority: P5)

A manager views a damage report listing incidents associated with bookings — showing the affected facility, the booking date, and a description of the damage — to support maintenance tracking and accountability.

**Why this priority**: Damage tracking is essential for facility maintenance scheduling and holding users accountable for property damage.

**Independent Test**: Can be tested by recording damage incidents against bookings and verifying they appear correctly in the damage report with the right facility, date, and description.

**Acceptance Scenarios**:

1. **Given** damage incidents have been recorded, **When** the manager views the damage report, **Then** all incidents are listed with facility name, booking date, and damage description.
2. **Given** no damage incidents exist, **When** the manager opens the damage report, **Then** an empty state with a clear "no damage records" message is shown.
3. **Given** a date range filter is applied, **When** viewing the report, **Then** only incidents within that period are shown.
4. **Given** a booking's notes field contains a damage description (starting with "Damage:"), **When** the manager views the damage report, **Then** that booking appears as a damage incident with the facility name, date, and the notes content as the description.

---

### Edge Cases

- What happens when a facility has no bookings — are usage stats shown as zero or is the facility hidden from reports?
- How does the system handle large datasets (500+ bookings) in reports without performance degradation?
- What if a date range filter returns no matching results — is an empty state clearly shown rather than a blank or broken screen?
- How are facilities that have been deactivated handled — are their historical bookings still counted in reports?
- What if a booking spans midnight — which day does it count toward in daily aggregations?

## Requirements *(mandatory)*

### Functional Requirements

**Dashboard**

- **FR-001**: System MUST provide a dedicated data endpoint that returns aggregated dashboard statistics scoped to a time window parameter: total booking count, active facility count, registered user count, pending request count, and per-facility usage percentages.
- **FR-001a**: The dashboard time window MUST support three options — last 24 hours, last 7 days, and last 28 days — with last 28 days as the default.
- **FR-002**: The dashboard MUST display real facility usage percentages sourced from actual booking data within the selected time window, replacing all hardcoded values.
- **FR-003**: The dashboard MUST display the most recent bookings (up to 5).

**Facility Usage View**

- **FR-004**: System MUST display usage statistics for each individual facility, including total booking count, booking status breakdown, and utilization rate.
- **FR-005**: Facility usage statistics MUST be filterable by a user-selected date range.
- **FR-006**: System MUST display a clear empty state when a facility has no bookings in the selected period.

**Reports**

- **FR-007**: System MUST provide a reports section accessible from the main navigation.
- **FR-008**: The reports section MUST offer three report types: Usage Report, Financial Report, and Damage Report.
- **FR-009**: All report types MUST support date range filtering.
- **FR-010**: Usage Report MUST display booking counts and utilization rate per facility, with results sortable by usage volume.
- **FR-011**: Financial Report MUST display booking volume aggregated by a selectable time grouping (daily, weekly, or monthly) with a breakdown by booking status.
- **FR-012**: Financial Report MUST be filterable by facility.
- **FR-013**: Damage Report MUST list damage incidents with facility name, booking date, and damage description.
- **FR-014**: All reports MUST default to the current month's data when no date filter is set.
- **FR-015**: All reports MUST display a clear empty state when no data matches the selected filters.

### Key Entities

- **Booking**: A reservation of a facility by a user with a time range and status (PENDING, CONFIRMED, CANCELLED, COMPLETED). The primary data source for all reports and usage calculations.
- **Facility**: A bookable space. The grouping dimension for facility-level usage and report breakdowns.
- **User**: The individual who created a booking. Relevant for attribution in damage reports.
- **DashboardSummary**: An aggregated snapshot of system-wide statistics (total bookings, active facilities, user count, pending requests, per-facility usage rates) served from a single data endpoint.
- **UsageReport**: Aggregated booking counts and utilization rates grouped by facility for a given time period.
- **FinancialReport**: Booking volume aggregated by time unit (day/week/month) with status breakdown, optionally scoped to a specific facility.
- **DamageReport**: A list of damage incidents linked to bookings, including facility, date, and description.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The dashboard displays all real statistics within 3 seconds of initial load and within 1 second when switching time windows, on a standard connection.
- **SC-002**: Dashboard stat cards show values that exactly match the actual booking and facility counts in the system (zero discrepancy).
- **SC-003**: Facility usage percentages on the dashboard reflect real booking occupancy — hardcoded values are fully eliminated.
- **SC-004**: A manager can navigate to any report type and view filtered results within 3 clicks from the main page.
- **SC-005**: All reports correctly apply date range filters — no records outside the selected period appear in results.
- **SC-006**: Reports remain responsive with a dataset of at least 500 bookings.
- **SC-007**: Empty states are clearly shown for all views with no data — no blank screens or broken layouts.
- **SC-008**: Facility usage view accurately reflects booking status breakdowns — confirmed percentages match the sum of individual status counts.

## Assumptions

- The prototype does not require user authentication or role-based access control — all features are accessible to any user.
- "Financial report" in this prototype refers to booking volume and status trends rather than monetary revenue, since no pricing data exists in the current data model.
- Facility utilization rate is calculated as: (number of confirmed or completed bookings in period) / (total possible booking slots in period) × 100%.
- Reports default to the current calendar month when no date filter is applied.
- The dashboard summary endpoint accepts a time window parameter (last 24 hours / last 7 days / last 28 days) and is re-fetched when the user changes the selection; real-time live updates (e.g., WebSockets) are out of scope for this prototype.
- Damage incidents are identified by bookings whose notes field begins with "Damage:" — no new data fields or entities are required.
- All facilities (including those with zero bookings) appear in usage reports showing zero counts rather than being hidden.
