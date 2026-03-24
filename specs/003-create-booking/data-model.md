# Data Model: Create Booking Feature

**Branch**: `003-create-booking` | **Date**: 2026-03-24

## Existing Entities (No Schema Migration Required)

The feature uses all existing Prisma models unchanged.

### Booking

```
Booking {
  id         String   (CUID, PK)
  startTime  DateTime (UTC, required)
  endTime    DateTime (UTC, required)
  status     String   default "PENDING"   -- PENDING | CONFIRMED | CANCELLED | COMPLETED
  notes      String?
  facilityId Int      (FK → Facility.id)
  userId     String   (FK → User.id)
  createdAt  DateTime
  updatedAt  DateTime
}
```

**Validation rules (backend)**:
- `startTime` must be a valid ISO8601 datetime
- `endTime` must be a valid ISO8601 datetime
- `startTime` must be in the future (relative to UTC now at time of request)
- `endTime` must be strictly after `startTime`
- `facilityId` must reference an existing Facility
- `userId` must reference an existing User
- `timezone` in request body must be a valid IANA timezone name

### User (Employee)

```
User {
  id        String   (CUID, PK)
  name      String
  email     String   (unique)
  companyId String   (FK → Company.id)
  createdAt DateTime
  updatedAt DateTime
}
```

**Search behaviour**: `name` field, case-insensitive `contains` filter. Minimum 2 characters to trigger search. Returns up to 10 results.

### Facility

```
Facility {
  id        Int      (PK, autoincrement)
  name      String   (unique)
  createdAt DateTime
  updatedAt DateTime
}
```

Used for the facility selector dropdown on the create booking form. Loaded once on page mount.

---

## New API Inputs / Outputs

### Create Booking Request Body

```typescript
{
  facilityId: number       // required
  userId: string           // required — selected employee's User.id
  startTime: string        // required — ISO8601 UTC (e.g. "2026-04-01T09:00:00.000Z")
  endTime: string          // required — ISO8601 UTC
  timezone: string         // required — IANA name (e.g. "Asia/Bangkok") for validation context
  notes?: string           // optional free text
}
```

### Create Booking Response Payload

```typescript
// ApiResponse<CreatedBooking>
{
  payload: {
    id: string
    startTime: string     // ISO8601 UTC
    endTime: string       // ISO8601 UTC
    status: "PENDING"
    facilityId: number
    userId: string
    notes: string | null
    createdAt: string
    updatedAt: string
  }
  message: string         // e.g. "Booking created successfully"
  isOk: boolean
}
```

### User Search Response Payload

```typescript
// ApiResponse<UserSearchResult[]>
{
  payload: Array<{
    id: string
    name: string
    email: string
    company: { name: string }
  }>
  message: string
  isOk: boolean
}
```

---

## State Transitions

```
[CREATE] → PENDING
PENDING  → CONFIRMED | CANCELLED
CONFIRMED → COMPLETED | CANCELLED
```

Creation always starts with `PENDING`. Status changes are out of scope for this feature.

---

## Timezone Handling

- All datetimes stored as UTC in the database.
- The `timezone` field in the create request is used **only for validation** (confirming the user's intended timezone context) and is **not persisted**.
- The frontend converts the user's local date/time inputs to UTC before sending.
- The frontend reads the user's selected timezone from the `TimezoneSelector` component and passes it as a query param to GET endpoints for display formatting.
- Display formatting uses `Intl.DateTimeFormat` with the selected timezone — no server-side conversion needed.
