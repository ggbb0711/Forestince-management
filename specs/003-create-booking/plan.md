# Implementation Plan: Create Booking

**Branch**: `003-create-booking` | **Date**: 2026-03-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-create-booking/spec.md`

## Summary

Add a create booking form page at `/bookings/new` that lets users select a facility, pick a date and time range in a chosen timezone, search for an employee via autocomplete, and submit to create a booking record. The backend gains a `POST /api/bookings` endpoint with full validation (future date, end > start, valid timezone, facility + user existence) and a new `GET /api/users?search=` endpoint for employee autocomplete. Existing endpoints receive timezone parameter validation. Dashboard and facility detail pages each get a "+ Booking" navigation button wired to the new page.

## Technical Context

**Language/Version**: TypeScript (strict) — Node.js 18+ (server), browser-modern (client)
**Primary Dependencies**: Express 4, Prisma ORM (SQLite), React 19, React Router v6, TailwindCSS, Shadcn/ui, Sonner (toasts), Vite, express-validator
**Storage**: SQLite via Prisma — no schema migration required
**Testing**: `npm test` (project-level), `npm run lint`
**Target Platform**: Web — local development server (Express on :3000, Vite on :5173)
**Project Type**: Full-stack web application (REST API + SPA)
**Performance Goals**: Employee autocomplete results within 1 second; standard web page load expectations
**Constraints**: No DB migration; single employee per booking (existing schema); no auth changes; CORS locked to localhost:5173
**Scale/Scope**: Single facility management app, small-medium user base

## Constitution Check

The constitution file is a template with unfilled placeholders — no active principles are defined. No gate violations apply. All decisions follow the existing codebase conventions observed directly from the source.

## Project Structure

### Documentation (this feature)

```text
specs/003-create-booking/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api-contracts.md ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — not created here)
```

### Source Code

```text
forestince-server/src/
├── routes/
│   ├── bookings.ts          (modified — add POST /)
│   └── users.ts             (NEW)
├── services/
│   ├── bookingService.ts    (modified — add createBooking())
│   └── userService.ts       (NEW)
├── types/
│   ├── booking.ts           (modified — add CreateBookingInput)
│   └── user.ts              (NEW)
├── constants/
│   └── messages.ts          (modified — add BOOKINGS.CREATED, USERS.*)
└── index.ts                 (modified — register usersRouter)

forestince-client/src/
├── app/
│   └── router.tsx           (modified — add /bookings/new route)
├── features/
│   ├── bookings/            (NEW feature folder)
│   │   ├── api/
│   │   │   ├── createBooking.ts
│   │   │   └── searchUsers.ts
│   │   ├── components/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── EmployeeAutocomplete.tsx
│   │   │   └── TimezoneSelector.tsx
│   │   ├── hooks/
│   │   │   └── useCreateBooking.ts
│   │   ├── types/
│   │   │   └── booking.ts
│   │   └── CreateBookingPage.tsx
│   ├── dashboard/
│   │   └── components/
│   │       └── BookingsPanel.tsx    (modified — wire "+ Booking" button)
│   └── facilities/
│       └── FacilityDetailPage.tsx  (modified — add "+ New Booking" button)
```

**Structure Decision**: Web application layout (Option 2). Server is `forestince-server/`, client is `forestince-client/`. New feature follows the existing `features/{name}/{api,components,hooks,types,Page.tsx}` pattern established by `features/facilities/` and `features/dashboard/`.

---

## Phase 0: Research Summary

All unknowns resolved. See [research.md](research.md) for full findings.

| Topic | Decision |
|-------|----------|
| Timezone storage | UTC in DB; IANA name validated server-side via `Intl` |
| Timezone display | Frontend `Intl.DateTimeFormat` with user-selected timezone |
| Employee search | New `GET /api/users?search=` endpoint, Prisma `contains` on `name` |
| API response pattern | `.json()` first, then check `json.isOk`, throw `new Error(json.message)` |
| DB schema | No migration — existing Booking/User/Facility models sufficient |
| Route | `/bookings/new` standalone page; `facilityId` query param for pre-fill |

---

## Phase 1: Design

### Backend — Implementation Steps

#### Step B1: Add messages to `constants/messages.ts`
New message keys:
- `BOOKINGS.CREATED` — `{ message: 'Booking created successfully', status: 201, isOk: true }`
- `BOOKINGS.INVALID_TIMEZONE` — `{ message: 'Invalid timezone', status: 400, isOk: false }`
- `BOOKINGS.START_IN_PAST` — `{ message: 'Start time must be in the future', status: 400, isOk: false }`
- `BOOKINGS.END_BEFORE_START` — `{ message: 'End time must be after start time', status: 400, isOk: false }`
- `USERS.LIST_OK` — `{ message: 'Users retrieved successfully', status: 200, isOk: true }`
- `USERS.SEARCH_TOO_SHORT` — `{ message: 'Search query must be at least 2 characters', status: 400, isOk: false }`

#### Step B2: Add `CreateBookingInput` type to `types/booking.ts`
```typescript
export interface CreateBookingInput {
  facilityId: number
  userId: string
  startTime: Date
  endTime: Date
  timezone: string
  notes?: string
}
```

#### Step B3: Create `types/user.ts`
```typescript
export interface UserSearchResult {
  id: string
  name: string
  email: string
  company: { name: string }
}
```

#### Step B4: Add `createBooking()` to `services/bookingService.ts`
Logic:
1. Validate timezone via `Intl`
2. Validate `startTime > now (UTC)`
3. Validate `endTime > startTime`
4. Verify `facilityId` exists (Prisma findUnique)
5. Verify `userId` exists (Prisma findUnique)
6. `prisma.booking.create({ data: { facilityId, userId, startTime, endTime, notes, status: 'PENDING' } })`
7. Return created booking

#### Step B5: Create `services/userService.ts`
```typescript
export async function searchUsers(search: string): Promise<UserSearchResult[]>
```
- Prisma `findMany` on `User` where `name: { contains: search, mode: 'insensitive' }` (note: SQLite mode is `default`, not `insensitive` — use lowercase comparison or rely on SQLite case handling)
- Include `company: { select: { name: true } }`
- `take: 10`

#### Step B6: Add `POST /` to `routes/bookings.ts`
- Validators: `body('facilityId').isInt({ min: 1 })`, `body('userId').isString().notEmpty()`, `body('startTime').isISO8601().toDate()`, `body('endTime').isISO8601().toDate()`, `body('timezone').isString().notEmpty()`, `body('notes').optional().isString().isLength({ max: 500 })`
- After `validateRequest`: call `createBooking()`
- Return `201` with `BOOKINGS.CREATED` message

#### Step B7: Add `GET /api/bookings` timezone validation
In the existing `validateBookingQuery` array, add:
```typescript
query('timezone').optional().isString()
```
Then in the handler, if `timezone` is present and invalid, return `BOOKINGS.INVALID_TIMEZONE`.

#### Step B8: Create `routes/users.ts`
- `GET /` with `query('search').isString().isLength({ min: 2 })` validation
- Call `searchUsers(search)`
- Return `200` with `USERS.LIST_OK`

#### Step B9: Register `usersRouter` in `index.ts`
```typescript
import usersRouter from './routes/users'
app.use('/api/users', usersRouter)
```

---

### Frontend — Implementation Steps

#### Step F1: Create `features/bookings/types/booking.ts`
Types for `CreateBookingInput` (client form state), `CreatedBooking` (API response payload), `UserSearchResult`.

#### Step F2: Create `features/bookings/api/searchUsers.ts`
```typescript
async function searchUsers(query: string): Promise<UserSearchResult[]>
```
- `fetch(`${API_URL}/users?search=${encodeURIComponent(query)}`)`
- `.json()` → check `json.isOk` → throw `new Error(json.message)` if false
- Return `json.payload`

#### Step F3: Create `features/bookings/api/createBooking.ts`
```typescript
async function createBooking(data: CreateBookingInput): Promise<CreatedBooking>
```
- `fetch(url, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })`
- `.json()` → check `json.isOk` → throw `new Error(json.message)` if false
- Return `json.payload`

#### Step F4: Create `features/bookings/components/TimezoneSelector.tsx`
- Dropdown populated with `Intl.supportedValuesOf('timeZone')` (or a curated subset)
- Defaults to `Intl.DateTimeFormat().resolvedOptions().timeZone` (user's browser timezone)
- Props: `value: string`, `onChange: (tz: string) => void`

#### Step F5: Create `features/bookings/components/EmployeeAutocomplete.tsx`
- Text input with 300ms debounce
- Shows dropdown of `UserSearchResult[]` when ≥ 2 chars
- On selection: calls `onSelect(user)`, clears input
- Shows "No employees found" when results empty
- Prevents re-adding already-selected user (receives `selectedUserId` prop to check)
- Props: `onSelect: (user: UserSearchResult) => void`, `selectedUserId?: string`

#### Step F6: Create `features/bookings/components/BookingForm.tsx`
Form state:
- `facilityId: number | ''`
- `date: string` (YYYY-MM-DD)
- `startTime: string` (HH:MM)
- `endTime: string` (HH:MM)
- `timezone: string`
- `selectedUser: UserSearchResult | null`
- `notes: string`

Validation (client-side before submit):
- `facilityId` required
- `date` required; constructed datetime must be >= now in selected timezone
- `startTime` and `endTime` required; end > start
- `selectedUser` required

On submit: convert `date + startTime` and `date + endTime` to UTC ISO8601 strings using the timezone offset, then call `createBooking()`.

On success: `toast.success('Booking created')`, navigate to `/facilities/${facilityId}/bookings/${createdBooking.id}`.

On error: `toast.error('Failed to create booking', { description: err.message })`.

Props: `defaultFacilityId?: number` (from query param)

#### Step F7: Create `features/bookings/hooks/useCreateBooking.ts`
```typescript
function useCreateBooking(): {
  submit: (data: CreateBookingInput) => Promise<void>
  loading: boolean
}
```
Wraps `createBooking()` API call with loading state.

#### Step F8: Create `features/bookings/CreateBookingPage.tsx`
- Reads `facilityId` from `useSearchParams()`
- Renders `<Breadcrumbs />` + heading + `<BookingForm defaultFacilityId={...} />`
- Loads facilities list for the facility selector using existing `getFacilities()` + `useFacilities()` hook

#### Step F9: Register route in `app/router.tsx`
```typescript
import { CreateBookingPage } from '../features/bookings/CreateBookingPage'
// in router children:
{ path: '/bookings/new', element: <CreateBookingPage /> }
```

#### Step F10: Wire dashboard "+ Booking" button in `BookingsPanel.tsx`
Both `MobileBookingsPanel` and `DesktopBookingsPanel` have `<Button variant="primary"><IconPlus /> Booking</Button>`.
Add `onClick={() => navigate('/bookings/new')}` to both.

#### Step F11: Add "+ New Booking" button to `FacilityDetailPage.tsx`
After the facility name heading, add:
```tsx
<Button variant="primary" onClick={() => navigate(`/bookings/new?facilityId=${facilityId}`)}>
  <IconPlus /> New Booking
</Button>
```

---

## Complexity Tracking

No complexity violations. All decisions use the minimum necessary complexity:
- No new abstractions beyond the existing feature folder pattern
- No DB migration
- No new external packages
- No auth or role changes
