# API Contracts: Create Booking Feature

**Branch**: `003-create-booking` | **Date**: 2026-03-24
**Base URL**: `/api`

All responses follow the envelope format:
```json
{ "payload": <T>, "message": "<string>", "isOk": <boolean> }
```

---

## New Endpoints

### POST /api/bookings — Create Booking

**Purpose**: Create a new booking for a facility, assigned to a single employee (user).

**Request**:
```
POST /api/bookings
Content-Type: application/json

{
  "facilityId": 1,
  "userId": "clxyz...",
  "startTime": "2026-04-01T02:00:00.000Z",
  "endTime": "2026-04-01T04:00:00.000Z",
  "timezone": "Asia/Bangkok",
  "notes": "Optional notes"
}
```

| Field        | Type   | Required | Validation                                                   |
|--------------|--------|----------|--------------------------------------------------------------|
| `facilityId` | number | Yes      | Integer ≥ 1; must exist in DB                                |
| `userId`     | string | Yes      | Non-empty string; must exist in DB                           |
| `startTime`  | string | Yes      | Valid ISO8601 datetime; must be in the future (UTC)          |
| `endTime`    | string | Yes      | Valid ISO8601 datetime; must be strictly after `startTime`   |
| `timezone`   | string | Yes      | Valid IANA timezone name (validated via `Intl`)              |
| `notes`      | string | No       | Optional string, max 500 chars                               |

**Responses**:

| Status | `isOk` | `message`                              | `payload`              |
|--------|--------|----------------------------------------|------------------------|
| 201    | true   | "Booking created successfully"         | Created booking object |
| 400    | false  | "Start time must be in the future"     | null                   |
| 400    | false  | "End time must be after start time"    | null                   |
| 400    | false  | "Invalid timezone"                     | null                   |
| 400    | false  | Validation error message               | null                   |
| 404    | false  | "Facility not found"                   | null                   |
| 404    | false  | "User not found"                       | null                   |
| 500    | false  | "Internal server error"                | null                   |

---

### GET /api/users — Employee Search

**Purpose**: Search employees (users) by name for the autocomplete field.

**Request**:
```
GET /api/users?search=<name>
```

| Param    | Type   | Required | Validation                   |
|----------|--------|----------|------------------------------|
| `search` | string | Yes      | Min 2 characters             |

**Responses**:

| Status | `isOk` | `message`                        | `payload`                      |
|--------|--------|----------------------------------|--------------------------------|
| 200    | true   | "Users retrieved successfully"   | `UserSearchResult[]` (max 10)  |
| 400    | false  | "Search query must be at least 2 characters" | null             |
| 500    | false  | "Internal server error"          | null                           |

**UserSearchResult**:
```json
{
  "id": "clxyz...",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "company": { "name": "Forestince Corp" }
}
```

---

## Modified Endpoints

### GET /api/bookings — List Bookings (timezone param added)

**Purpose**: Existing endpoint; `timezone` query param added for client-side display context. The server returns UTC datetimes unchanged — this param is informational and validated server-side.

**New optional param**:

| Param      | Type   | Required | Validation                                |
|------------|--------|----------|-------------------------------------------|
| `timezone` | string | No       | Valid IANA timezone name if provided      |

**Behaviour**: If `timezone` is provided and invalid, returns `400 { isOk: false, message: "Invalid timezone" }`. If valid or absent, proceeds as before.

**Note**: The frontend already formats datetimes using `Intl.DateTimeFormat` in the selected timezone. This server-side param provides validation parity.

---

## Frontend API Function Contracts

### `createBooking(data: CreateBookingInput): Promise<CreatedBooking>`

```typescript
interface CreateBookingInput {
  facilityId: number
  userId: string
  startTime: string   // ISO8601 UTC
  endTime: string     // ISO8601 UTC
  timezone: string    // IANA name
  notes?: string
}

interface CreatedBooking {
  id: string
  startTime: string
  endTime: string
  status: string
  facilityId: number
  userId: string
  notes: string | null
  createdAt: string
  updatedAt: string
}
```

**Error handling**: Parse `.json()` first, then check `json.isOk`. If `!json.isOk`, throw `new Error(json.message)`.

### `searchUsers(query: string): Promise<UserSearchResult[]>`

```typescript
interface UserSearchResult {
  id: string
  name: string
  email: string
  company: { name: string }
}
```

**Error handling**: Same `.json()` → `json.isOk` → `json.message` pattern.
