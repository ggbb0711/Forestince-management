# Contract: Reports Endpoints

**Base Route**: `GET /api/reports/...`
**Service**: `reportService`

All report endpoints default to the current calendar month when no date filters are provided.

---

## 1. Usage Report

### Route
`GET /api/reports/usage`

### Query Parameters

| Parameter | Type   | Required | Default        | Description                               |
|-----------|--------|----------|----------------|-------------------------------------------|
| `dateFrom`| string | No       | Start of month | ISO date string (YYYY-MM-DD), inclusive   |
| `dateTo`  | string | No       | Today          | ISO date string (YYYY-MM-DD), inclusive   |

### Example Requests
```
GET /api/reports/usage
GET /api/reports/usage?dateFrom=2026-01-01&dateTo=2026-03-31
```

### Response (200)
```json
{
  "payload": {
    "data": [
      {
        "facilityId": 1,
        "facilityName": "Birch Meditation Hut",
        "totalBookings": 22,
        "confirmed": 10,
        "pending": 4,
        "cancelled": 3,
        "completed": 5,
        "utilizationRate": 68
      },
      {
        "facilityId": 4,
        "facilityName": "Zen Garden Deck",
        "totalBookings": 18,
        "confirmed": 8,
        "pending": 2,
        "cancelled": 2,
        "completed": 6,
        "utilizationRate": 78
      }
    ],
    "period": {
      "dateFrom": "2026-03-01",
      "dateTo": "2026-03-18"
    }
  },
  "message": "Usage report retrieved successfully",
  "isOk": true
}
```

**Notes**:
- Results are sorted by `totalBookings` descending (most-used first)
- `utilizationRate = round((confirmed + completed) / totalBookings * 100)`, or 0 if no bookings
- All facilities are included even if they have 0 bookings in the period

---

## 2. Financial Report

### Route
`GET /api/reports/financial`

### Query Parameters

| Parameter   | Type   | Required | Default        | Values                      | Description                            |
|-------------|--------|----------|----------------|-----------------------------|----------------------------------------|
| `dateFrom`  | string | No       | Start of month | ISO date string (YYYY-MM-DD)| Start of period, inclusive             |
| `dateTo`    | string | No       | Today          | ISO date string (YYYY-MM-DD)| End of period, inclusive               |
| `groupBy`   | string | No       | `monthly`      | `daily`, `weekly`, `monthly`| Time aggregation unit                  |
| `facilityId`| number | No       | (all)          | Integer                     | Filter to a single facility            |

### Example Requests
```
GET /api/reports/financial
GET /api/reports/financial?dateFrom=2026-01-01&dateTo=2026-03-31&groupBy=weekly
GET /api/reports/financial?groupBy=daily&facilityId=1
```

### Response (200)
```json
{
  "payload": {
    "data": [
      {
        "period": "2026-01",
        "totalBookings": 28,
        "confirmed": 12,
        "pending": 6,
        "cancelled": 4,
        "completed": 6
      },
      {
        "period": "2026-02",
        "totalBookings": 35,
        "confirmed": 15,
        "pending": 8,
        "cancelled": 3,
        "completed": 9
      },
      {
        "period": "2026-03",
        "totalBookings": 24,
        "confirmed": 10,
        "pending": 7,
        "cancelled": 2,
        "completed": 5
      }
    ],
    "summary": {
      "totalBookings": 87,
      "confirmed": 37,
      "pending": 21,
      "cancelled": 9,
      "completed": 20
    },
    "period": {
      "dateFrom": "2026-01-01",
      "dateTo": "2026-03-18",
      "groupBy": "monthly"
    }
  },
  "message": "Financial report retrieved successfully",
  "isOk": true
}
```

**Period label format by groupBy**:
- `daily`: `"2026-03-18"` (YYYY-MM-DD)
- `weekly`: `"2026-W12"` (ISO week, year-W##)
- `monthly`: `"2026-03"` (YYYY-MM)

**Notes**:
- Server fetches all matching bookings, then groups in JavaScript
- Results are sorted chronologically by `period`
- `summary` is the sum across all `data` rows in the response

### Errors

| Status | Condition |
|--------|-----------|
| 400 | `groupBy` is not `daily`, `weekly`, or `monthly` |
| 400 | `facilityId` is not a valid integer |

---

## 3. Damage Report

### Route
`GET /api/reports/damage`

### Query Parameters

| Parameter  | Type   | Required | Default        | Description                             |
|------------|--------|----------|----------------|-----------------------------------------|
| `dateFrom` | string | No       | Start of month | ISO date string (YYYY-MM-DD), inclusive |
| `dateTo`   | string | No       | Today          | ISO date string (YYYY-MM-DD), inclusive |
| `page`     | number | No       | `1`            | Page number (1-indexed)                 |
| `pageSize` | number | No       | `10`           | Results per page (max 50)               |

### Example Requests
```
GET /api/reports/damage
GET /api/reports/damage?dateFrom=2026-01-01&dateTo=2026-03-31
GET /api/reports/damage?page=2&pageSize=10
```

### Response (200)
```json
{
  "payload": {
    "data": [
      {
        "bookingId": "clxxx",
        "facilityId": 1,
        "facilityName": "Birch Meditation Hut",
        "userId": "clyyy",
        "userName": "Sigrid Thoresen",
        "bookingDate": "2026-03-06T10:00:00.000Z",
        "notes": "Damage: wooden railing at entrance scratched"
      }
    ],
    "meta": {
      "total": 20,
      "page": 1,
      "pageSize": 10,
      "totalPages": 2
    }
  },
  "message": "Damage report retrieved successfully",
  "isOk": true
}
```

**Detection rule**: `notes` field starts with the exact string `"Damage:"` (case-sensitive).

**Notes**:
- Results are sorted by `startTime` descending (most recent first)
- Pagination follows the same `meta` structure as `GET /api/bookings`

---

## 4. Facility Stats (for Facility Usage Tab)

### Route
`GET /api/facilities/:id/stats`

### Path Parameters

| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `id`      | number | Yes      | Facility ID       |

### Query Parameters

| Parameter  | Type   | Required | Default        | Description                             |
|------------|--------|----------|----------------|-----------------------------------------|
| `dateFrom` | string | No       | Start of month | ISO date string (YYYY-MM-DD), inclusive |
| `dateTo`   | string | No       | Today          | ISO date string (YYYY-MM-DD), inclusive |

### Example Requests
```
GET /api/facilities/1/stats
GET /api/facilities/1/stats?dateFrom=2026-01-01&dateTo=2026-03-31
```

### Response (200)
```json
{
  "payload": {
    "facilityId": 1,
    "facilityName": "Birch Meditation Hut",
    "totalBookings": 22,
    "confirmed": 10,
    "pending": 4,
    "cancelled": 3,
    "completed": 5,
    "utilizationRate": 68,
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-18"
  },
  "message": "Facility stats retrieved successfully",
  "isOk": true
}
```

### Errors

| Status | Condition |
|--------|-----------|
| 400 | `id` is not a valid positive integer |
| 404 | Facility not found |
