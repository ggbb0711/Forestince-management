# Feature Specification: Facility Top Bookers & Remove Reports Page

**Feature Branch**: `002-facility-top-bookers`
**Created**: 2026-03-18
**Status**: Draft
**Input**: User description: "I want to update the usage page in facility to check Top Bookers. A ranked list of users who book this facility most, with booking counts. Also remove the report page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Top Bookers on Facility Usage Tab (Priority: P1)

A staff member navigating to a specific facility's detail page clicks the "Usage" tab to understand how that facility is being used. Below the existing utilization stats, they now see a ranked leaderboard of users who have booked this facility the most, showing each person's name, their company, and total booking count. The list respects the same date range filter already on the tab — narrowing the date range immediately updates the rankings.

This helps staff quickly identify high-frequency customers, spot unusual concentration of use by a single user or company, and understand demand patterns over time.

**Why this priority**: This is the core new feature. It directly adds actionable insight to an existing screen without requiring any new pages or navigation changes. Highest business value.

**Independent Test**: Navigate to any facility's detail page → click "Usage" tab → verify a ranked list of users with booking counts appears below the utilization stats. Confirm count accuracy by cross-referencing with the Bookings tab.

**Acceptance Scenarios**:

1. **Given** a facility with multiple bookings by different users, **When** the user opens the Usage tab, **Then** a ranked list of top bookers is displayed, ordered from most to fewest bookings, showing name, company, and count.
2. **Given** the top bookers list is visible, **When** the user applies a date range filter, **Then** the rankings update to reflect only bookings within that period.
3. **Given** a facility with no bookings in the selected period, **When** the user views the Usage tab, **Then** an empty state message is shown in place of the top bookers list.
4. **Given** a facility with fewer than 10 unique bookers, **When** the user views the top bookers list, **Then** all users are shown (no artificial truncation below actual count).
5. **Given** a facility with more than 10 unique bookers, **When** the user views the top bookers list, **Then** only the top 10 are shown.

---

### User Story 2 - Remove Reports Page (Priority: P2)

The Reports page (Usage, Financial, Damage tabs) and its sidebar navigation entry are removed from the application. Staff navigating the app no longer see a "Reports" link in the sidebar. Any direct visit to the `/reports` URL shows the standard Not Found page.

**Why this priority**: Simplifies the application scope. The reports functionality is being descoped in favour of per-facility insights directly on the facility detail page.

**Independent Test**: Verify the sidebar has no "Reports" link. Navigate directly to `/reports` and confirm a Not Found page is shown. Confirm no console errors or broken links remain.

**Acceptance Scenarios**:

1. **Given** a user is on any page, **When** they look at the sidebar navigation, **Then** no "Reports" link is visible.
2. **Given** a user navigates directly to `/reports`, **When** the page loads, **Then** a Not Found page is displayed.
3. **Given** the Reports page has been removed, **When** the rest of the application is used, **Then** no broken links, missing imports, or console errors related to the removed page appear.
4. **Given** the backend reports endpoints have been removed, **When** a request is made to `/api/reports/usage`, `/api/reports/financial`, or `/api/reports/damage`, **Then** a 404 response is returned.

---

### Edge Cases

- What happens when all bookings in the period are by a single user? → That user appears alone at rank #1 with 100% of the bookings.
- What if two users have identical booking counts? → Both are shown; alphabetical order by name is used as a tiebreaker.
- What if the date range filter returns 0 bookings? → Empty state message shown; no list rendered.
- What if a user's account no longer exists (orphaned booking)? → Those bookings are excluded from the top bookers list gracefully, without errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The facility usage tab MUST display a "Top Bookers" section showing users ranked by booking count for that facility.
- **FR-002**: Each entry in the top bookers list MUST show the user's full name, their company name, and total booking count.
- **FR-003**: The top bookers list MUST be filtered by the same date range controls already present on the usage tab.
- **FR-004**: The top bookers list MUST show at most 10 users, ranked from highest to lowest booking count.
- **FR-005**: Users with equal booking counts MUST be ordered alphabetically by name.
- **FR-006**: When no bookings exist for the facility in the selected period, an empty state message MUST be shown in place of the list.
- **FR-007**: The Reports page (all three tabs: Usage, Financial, Damage) MUST be removed from the application.
- **FR-008**: The Reports navigation link in the sidebar MUST be removed.
- **FR-009**: All client-side code, routes, and assets associated exclusively with the removed Reports page MUST be deleted (components, hooks, API functions, type definitions).
- **FR-010**: All server-side code associated exclusively with the Reports feature MUST be deleted — including the reports route file, the report service, and all report-specific type definitions.
- **FR-011**: The reports route registration in the server entry point MUST be removed so the `/api/reports/*` endpoints no longer exist.

### Key Entities

- **Top Booker Entry**: A user paired with their booking frequency — user name, company name, booking count for the facility in the selected period, and rank position.
- **Facility Usage Tab**: Existing tab on the facility detail page; extended to include the Top Bookers section below the utilization stats card.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The top bookers list loads and displays within 2 seconds of opening the Usage tab or changing the date filter.
- **SC-002**: Booking counts shown for each user are 100% accurate when cross-checked against the Bookings tab for the same facility and date range.
- **SC-003**: The date range filter updates the top bookers rankings without requiring a page reload.
- **SC-004**: The Reports page is inaccessible via sidebar navigation and direct URL after removal.
- **SC-005**: No broken links, import errors, or orphaned navigation items remain after the Reports page is removed.
- **SC-006**: All `/api/reports/*` server endpoints return 404 after removal, confirming no backend report code is still registered.

## Assumptions

- Top bookers are ranked by total booking count regardless of booking status (all statuses counted). If only confirmed/completed bookings should count, that would be a separate clarification.
- The top 10 limit is a reasonable default for a leaderboard view; this can be adjusted during implementation without impacting the spec.
- Removing the Reports page means full deletion of all associated files on both client and server — components, hooks, API functions, types, route files, and service files — not just hiding them.
- The server's facility stats endpoint (`/api/reports/facility-stats/:id`) is kept because it is consumed by the new Top Bookers feature on the facility usage tab; only the usage, financial, and damage report endpoints are removed.
- The sidebar already has a conditionally-rendered Reports link; removing it does not affect any other navigation items.
