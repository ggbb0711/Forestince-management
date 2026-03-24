# Research: Create Booking Feature

**Branch**: `003-create-booking` | **Date**: 2026-03-24

## 1. Timezone Handling

**Decision**: Store all datetimes as UTC in the database; accept and return ISO8601 UTC strings over the API. The frontend sends pre-converted UTC values when creating a booking. The backend validates the IANA timezone string using Node.js `Intl` API.

**Rationale**:
- The existing DB (SQLite + Prisma) already stores `startTime`/`endTime` as `DateTime` (UTC).
- No DB migration needed — the schema already supports this.
- Validation via `Intl.supportedValuesOf('timeZone').includes(tz)` works in Node 18+ without extra packages.
- Frontend uses the `Intl.DateTimeFormat` API (built-in) to format UTC timestamps in the user's selected timezone.

**Alternatives considered**:
- Store with offset: rejected — offsets change with DST; IANA names are stable.
- Use a timezone library (e.g., `date-fns-tz`): possible enhancement, not required for MVP.

---

## 2. Employee Search (Autocomplete)

**Decision**: New endpoint `GET /api/users?search=<name>` returns a list of users whose name contains the search string. Minimum 2 characters required before triggering a search.

**Rationale**:
- The `User` model already exists in the Prisma schema with a `name` field and Prisma `contains` filter.
- The existing `users` are the "employees" in this system (they book facilities and belong to companies).
- No schema migration needed.
- Debounced fetch on the frontend (300ms) prevents excessive requests.

**Alternatives considered**:
- Full-text search index: overkill for the current SQLite setup.
- Returning all users client-side and filtering: rejected — unbounded list size.

---

## 3. API Response Pattern (json.isOk check)

**Decision**: All API functions `.json()` the response first, then check `json.isOk`. If `!json.isOk`, throw `new Error(json.message)`. This replaces the inconsistent pattern of checking `res.ok` before `.json()`.

**Rationale**:
- User explicitly requires checking `json.isOk` and `json.message` after parsing.
- The server always returns `{ payload, message, isOk }` even for error responses (4xx), so `.json()` is always safe.
- This produces user-friendly error messages from the API instead of generic HTTP status text.

**Pattern**:
```typescript
const res = await fetch(url, options)
const json = await res.json() as ApiResponse<T>
if (!json.isOk) throw new Error(json.message)
return json.payload
```

---

## 4. DB Schema — Single Employee Per Booking

**Decision**: Keep the existing Prisma schema unchanged. One booking maps to one `userId`. The "employee" selection in the form adds one user per booking submission.

**Rationale**:
- The existing `Booking` model has `userId String` (one-to-one with User).
- Adding many-to-many requires a schema migration and is out of scope per the spec.
- The UX allows the user to search and select one employee; the form creates one booking record.

**Alternatives considered**:
- `BookingEmployee` join table for many-to-many: valid future enhancement, deferred.

---

## 5. Create Booking Route Structure

**Decision**: Single page at `/bookings/new`. It accepts an optional `facilityId` query param for pre-filling the facility selector. Accessible via "+ Booking" on dashboard and via a button added to the facility detail page.

**Rationale**:
- Consistent with the existing route pattern.
- Decoupled from the facility route tree — avoids nesting issues.
- The facility detail page adds a "+ New Booking" button that navigates to `/bookings/new?facilityId=X`.

---

## 6. Timezone Validation on Backend

**Decision**: Validate the `timezone` parameter on both `POST /api/bookings` (body) and `GET /api/bookings` (query) using `Intl.supportedValuesOf('timeZone')`. Return `400` with `isOk: false` if the timezone is unrecognized.

**Rationale**:
- Prevents storing bookings with invalid timezone context.
- `Intl.supportedValuesOf` is available in Node 18+ without any extra package.

---

## 7. Frontend Feature Structure

**Decision**: New `features/bookings/` folder following the existing feature architecture pattern:

```
features/bookings/
├── api/
│   ├── createBooking.ts
│   └── searchUsers.ts
├── components/
│   ├── BookingForm.tsx
│   ├── EmployeeAutocomplete.tsx
│   └── TimezoneSelector.tsx
├── hooks/
│   └── useCreateBooking.ts
├── types/
│   └── booking.ts
└── CreateBookingPage.tsx
```

**Rationale**: Mirrors the `features/facilities/` and `features/dashboard/` structure exactly.
