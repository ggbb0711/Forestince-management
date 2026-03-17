# Data Model: Facility Usage, Dashboard & Reports

**Branch**: `001-usage-reports-dashboard` | **Date**: 2026-03-18

## Existing Persisted Entities (No Schema Changes)

The Prisma schema is unchanged. All new features use aggregations over the existing tables.

### Booking
```
id          String    @id @default(cuid())
startTime   DateTime
endTime     DateTime
status      BookingStatus   (PENDING | CONFIRMED | CANCELLED | COMPLETED)
notes       String?
facilityId  Int
userId      String
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
```

**Damage convention**: A booking is a damage record when `notes` starts with `"Damage:"`.

### Facility
```
id        Int     @id @default(autoincrement())
name      String  @unique
createdAt DateTime
updatedAt DateTime
bookings  Booking[]
```

### User
```
id        String  @id @default(cuid())
name      String
email     String  @unique
companyId String
company   Company
bookings  Booking[]
```

### Company
```
id   String @id @default(cuid())
name String @unique
```

---

## New Virtual Entities (Server-Computed, Not Stored)

These are TypeScript types representing aggregated response shapes.

### DashboardWindow
```typescript
type DashboardWindow = '24h' | '7d' | '28d'
```

### DashboardStats
```typescript
interface DashboardStats {
  totalBookings: number       // all bookings with startTime >= windowStart
  pendingRequests: number     // PENDING bookings in window
  activeBookings: number      // CONFIRMED bookings in window
  completedBookings: number   // COMPLETED bookings in window
  cancelledBookings: number   // CANCELLED bookings in window
  totalFacilities: number     // count of all facilities (not windowed)
  registeredUsers: number     // count of all users (not windowed)
}
```

### FacilityUsageStat
```typescript
interface FacilityUsageStat {
  facilityId: number
  facilityName: string
  bookingCount: number   // all-status bookings in window
  pct: number            // normalized: (count / maxCount) * 100, rounded
}
```

### DashboardSummary
```typescript
interface DashboardSummary {
  stats: DashboardStats
  facilityUsage: FacilityUsageStat[]
  recentBookings: BookingWithRelations[]   // most recent 5
}
```

### FacilityStatBreakdown
```typescript
interface FacilityStatBreakdown {
  facilityId: number
  facilityName: string
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  completed: number
  utilizationRate: number   // (confirmed + completed) / totalBookings * 100, or 0
  dateFrom: string          // ISO date string, actual window used
  dateTo: string
}
```

### UsageReportRow
```typescript
interface UsageReportRow {
  facilityId: number
  facilityName: string
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  completed: number
  utilizationRate: number   // (confirmed + completed) / totalBookings * 100
}

interface UsageReportResponse {
  data: UsageReportRow[]
  period: { dateFrom: string; dateTo: string }
}
```

### FinancialReportRow
```typescript
interface FinancialReportRow {
  period: string       // "2026-03-18" | "2026-W12" | "2026-03"
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  completed: number
}

interface FinancialReportSummary {
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  completed: number
}

interface FinancialReportResponse {
  data: FinancialReportRow[]
  summary: FinancialReportSummary
  period: { dateFrom: string; dateTo: string; groupBy: 'daily' | 'weekly' | 'monthly' }
}
```

### DamageReportRow
```typescript
interface DamageReportRow {
  bookingId: string
  facilityId: number
  facilityName: string
  userId: string
  userName: string
  bookingDate: string    // ISO date string of startTime
  notes: string          // full notes field (starts with "Damage:")
}

interface DamageReportResponse {
  data: DamageReportRow[]
  meta: PaginationMeta
}
```

---

## State Transitions

### BookingStatus (existing, unchanged)
```
PENDING → CONFIRMED → COMPLETED
PENDING → CANCELLED
CONFIRMED → CANCELLED
```

---

## Validation Rules

### Dashboard endpoint
- `window`: must be one of `24h`, `7d`, `28d`; defaults to `28d` if absent

### Reports endpoints
- `dateFrom` / `dateTo`: optional ISO date strings; server defaults to current month if both absent
- `groupBy`: must be `daily`, `weekly`, or `monthly`; defaults to `monthly`
- `facilityId`: optional integer; if provided must be an existing facility ID
- `page` / `pageSize`: integers ≥ 1; pageSize defaults to 10, max 50

### Damage report filter
- Prisma: `{ notes: { startsWith: 'Damage:' } }`
- Combined with date range if provided: `AND startTime >= dateFrom AND startTime <= dateTo`
