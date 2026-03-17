# Contract: GET /api/reports/facility-stats/:id

**Status**: Modified (topBookers field added)

## Request

```
GET /api/reports/facility-stats/:id?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

| Parameter  | Location | Type   | Required | Description                       |
|------------|----------|--------|----------|-----------------------------------|
| `id`       | path     | int    | yes      | Facility ID                       |
| `dateFrom` | query    | string | no       | Period start (ISO date). Defaults to first day of current month |
| `dateTo`   | query    | string | no       | Period end (ISO date). Defaults to today |

## Response — 200 OK

```json
{
  "payload": {
    "facilityId": 1,
    "facilityName": "Old Oak Forest Trail",
    "totalBookings": 42,
    "confirmed": 18,
    "pending": 6,
    "cancelled": 4,
    "completed": 14,
    "utilizationRate": 76,
    "dateFrom": "2026-03-01",
    "dateTo": "2026-03-18",
    "topBookers": [
      { "rank": 1, "userId": "abc123", "userName": "Marcus Arvidson", "companyName": "Nordic Ventures AB", "bookingCount": 8 },
      { "rank": 2, "userId": "def456", "userName": "Sarah Jenkins",   "companyName": "Fjord Systems AS",   "bookingCount": 5 }
    ]
  },
  "message": "Facility stats retrieved",
  "isOk": true
}
```

`topBookers` is ordered by `bookingCount` descending, max 10 entries. Ties broken alphabetically by `userName`.

## Response — 404 Not Found

```json
{ "payload": null, "message": "Facility not found", "isOk": false }
```

## Response — 400 Bad Request

```json
{ "payload": null, "message": "Invalid facility ID", "isOk": false }
```

## Removed Endpoints

The following endpoints are **removed** and will return 404:

- `GET /api/reports/usage`
- `GET /api/reports/financial`
- `GET /api/reports/damage`
