# Quickstart: Create Booking Feature

**Branch**: `003-create-booking` | **Date**: 2026-03-24

## What This Feature Adds

- `POST /api/bookings` — create a booking (new endpoint)
- `GET /api/users?search=<name>` — employee autocomplete search (new endpoint)
- `GET /api/bookings` — timezone param validation added
- `/bookings/new` — new frontend page (standalone create booking form)
- "+ New Booking" button on facility detail page
- "+ Booking" button on dashboard linked to `/bookings/new`

---

## File Checklist

### Backend (`forestince-server/src/`)

| File | Action |
|------|--------|
| `routes/bookings.ts` | Add `POST /` route for create booking |
| `routes/users.ts` | **New** — `GET /` with `search` query param |
| `services/bookingService.ts` | Add `createBooking()` function |
| `services/userService.ts` | **New** — `searchUsers()` function |
| `types/booking.ts` | Add `CreateBookingInput` type |
| `types/user.ts` | **New** — `UserSearchResult` type |
| `constants/messages.ts` | Add `BOOKINGS.CREATED`, `BOOKINGS.INVALID_TIMEZONE`, `USERS.*` messages |
| `index.ts` | Register `usersRouter` at `/api/users` |

### Frontend (`forestince-client/src/`)

| File | Action |
|------|--------|
| `features/bookings/api/createBooking.ts` | **New** |
| `features/bookings/api/searchUsers.ts` | **New** |
| `features/bookings/hooks/useCreateBooking.ts` | **New** |
| `features/bookings/components/BookingForm.tsx` | **New** |
| `features/bookings/components/EmployeeAutocomplete.tsx` | **New** |
| `features/bookings/components/TimezoneSelector.tsx` | **New** |
| `features/bookings/types/booking.ts` | **New** |
| `features/bookings/CreateBookingPage.tsx` | **New** |
| `app/router.tsx` | Add `/bookings/new` route |
| `features/dashboard/components/BookingsPanel.tsx` | Wire "+ Booking" button to navigate to `/bookings/new` |
| `features/facilities/FacilityDetailPage.tsx` | Add "+ New Booking" button → `/bookings/new?facilityId=X` |

---

## Key Implementation Notes

### Timezone conversion (frontend)

The form shows date/time pickers in the user's **selected timezone** (from `TimezoneSelector`).
Before sending to the API, convert to UTC:

```typescript
// User picks "2026-04-01" + "09:00" in timezone "Asia/Bangkok" (UTC+7)
// → send "2026-04-01T02:00:00.000Z" to API
const localStr = `${date}T${time}:00`  // "2026-04-01T09:00:00"
const utc = new Date(
  new Date(localStr).toLocaleString('en-US', { timeZone: 'UTC' })
).toISOString()
// safer: use Intl to compute offset, then subtract
```

Recommended approach using offset calculation:
```typescript
function toUTC(dateStr: string, timeStr: string, timezone: string): string {
  const localDate = new Date(`${dateStr}T${timeStr}:00`)
  const utcDate = new Date(
    localDate.toLocaleString('en-US', { timeZone: 'UTC' })
  )
  const tzDate = new Date(
    localDate.toLocaleString('en-US', { timeZone: timezone })
  )
  const offset = utcDate.getTime() - tzDate.getTime()
  return new Date(localDate.getTime() + offset).toISOString()
}
```

### Timezone validation (backend)

```typescript
function isValidTimezone(tz: string): boolean {
  try {
    Intl.supportedValuesOf('timeZone')  // Node 18+
    return Intl.supportedValuesOf('timeZone').includes(tz)
  } catch {
    // Fallback for environments without Intl.supportedValuesOf
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz })
      return true
    } catch {
      return false
    }
  }
}
```

### Employee autocomplete (frontend)

- Debounce input by 300ms before triggering `searchUsers()`
- Show dropdown only when ≥ 2 characters typed
- Track selected employee as `{ id, name }` state
- Clear search input after selection
- Prevent duplicate selection (check against selected user's id)

### api.isOk pattern

All new API functions must follow:
```typescript
const res = await fetch(url, options)
const json = await res.json() as ApiResponse<T>
if (!json.isOk) throw new Error(json.message)
return json.payload
```

Do NOT short-circuit on `res.ok` before parsing JSON — the server always returns valid JSON even for error responses.

### Route registration order

The new `usersRouter` must be registered in `forestince-server/src/index.ts`:
```typescript
import usersRouter from './routes/users'
app.use('/api/users', usersRouter)
```
