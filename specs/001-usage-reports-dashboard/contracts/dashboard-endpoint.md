# Contract: Dashboard Endpoint

**Route**: `GET /api/dashboard`
**Service**: `dashboardService.getDashboardSummary(window)`

---

## Request

### Query Parameters

| Parameter | Type   | Required | Default | Values            | Description                          |
|-----------|--------|----------|---------|-------------------|--------------------------------------|
| `window`  | string | No       | `28d`   | `24h`, `7d`, `28d` | Time window for stats and usage data |

### Example Requests

```
GET /api/dashboard
GET /api/dashboard?window=7d
GET /api/dashboard?window=24h
```

---

## Response

### Success (200)

```json
{
  "payload": {
    "stats": {
      "totalBookings": 42,
      "pendingRequests": 8,
      "activeBookings": 20,
      "completedBookings": 12,
      "cancelledBookings": 2,
      "totalFacilities": 5,
      "registeredUsers": 15
    },
    "facilityUsage": [
      { "facilityId": 1, "facilityName": "Birch Meditation Hut",  "bookingCount": 18, "pct": 100 },
      { "facilityId": 4, "facilityName": "Zen Garden Deck",       "bookingCount": 14, "pct": 78  },
      { "facilityId": 2, "facilityName": "Crystal Spring Bath",   "bookingCount": 12, "pct": 67  },
      { "facilityId": 3, "facilityName": "Old Oak Forest Trail",  "bookingCount": 10, "pct": 56  },
      { "facilityId": 5, "facilityName": "Silent Retreat Pod",    "bookingCount": 9,  "pct": 50  }
    ],
    "recentBookings": [
      {
        "id": "clxxx",
        "startTime": "2026-03-19T09:00:00.000Z",
        "endTime": "2026-03-19T10:00:00.000Z",
        "status": "CONFIRMED",
        "notes": "Morning meditation session",
        "facilityId": 1,
        "userId": "clyyy",
        "facility": { "id": 1, "name": "Birch Meditation Hut" },
        "user": {
          "id": "clyyy",
          "name": "Marcus Arvidson",
          "email": "marcus.arvidson@nordic.se",
          "company": { "name": "Nordic Ventures AB" }
        }
      }
    ]
  },
  "message": "Dashboard data retrieved successfully",
  "isOk": true
}
```

### Field Notes

| Field | Scope | Description |
|-------|-------|-------------|
| `stats.totalBookings` | Time-windowed | All bookings with `startTime >= windowStart` |
| `stats.pendingRequests` | Time-windowed | Bookings with `status = PENDING` in window |
| `stats.activeBookings` | Time-windowed | Bookings with `status = CONFIRMED` in window |
| `stats.completedBookings` | Time-windowed | Bookings with `status = COMPLETED` in window |
| `stats.cancelledBookings` | Time-windowed | Bookings with `status = CANCELLED` in window |
| `stats.totalFacilities` | System-wide | Total facility count (not time-windowed) |
| `stats.registeredUsers` | System-wide | Total user count (not time-windowed) |
| `facilityUsage[].pct` | Time-windowed | `round((count / maxCount) * 100)` — most-used = 100 |
| `recentBookings` | Time-windowed | Up to 5 most recent bookings by `startTime desc` |

### Errors

| Status | Condition |
|--------|-----------|
| 400 | `window` param is not one of `24h`, `7d`, `28d` |
| 500 | Database error |

---

## Service Implementation Notes

```typescript
// Window to milliseconds:
const windowMs = { '24h': 86400000, '7d': 604800000, '28d': 2419200000 }
const windowStart = new Date(Date.now() - windowMs[window])

// Stats: parallel queries for each status count
const [totalBookings, pendingRequests, activeBookings, completedBookings, cancelledBookings,
       totalFacilities, registeredUsers] = await Promise.all([
  prisma.booking.count({ where: { startTime: { gte: windowStart } } }),
  prisma.booking.count({ where: { status: 'PENDING', startTime: { gte: windowStart } } }),
  prisma.booking.count({ where: { status: 'CONFIRMED', startTime: { gte: windowStart } } }),
  prisma.booking.count({ where: { status: 'COMPLETED', startTime: { gte: windowStart } } }),
  prisma.booking.count({ where: { status: 'CANCELLED', startTime: { gte: windowStart } } }),
  prisma.facility.count(),
  prisma.user.count(),
])

// Facility usage: group booking count per facility in window
// Use groupBy on facilityId, then join with facility names
```
