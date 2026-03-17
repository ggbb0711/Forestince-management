# Data Model: Facility Top Bookers & Remove Reports Page

> No schema changes. All new data is derived from the existing `Booking`, `User`, and `Company` tables via aggregation queries.

---

## New / Modified Types

### TopBooker (new)

Represents a user's booking frequency for a specific facility and period.

| Field         | Type     | Description                                     |
|---------------|----------|-------------------------------------------------|
| `userId`      | `string` | User identifier                                 |
| `userName`    | `string` | User's full name                                |
| `companyName` | `string` | User's company name                             |
| `bookingCount`| `number` | Number of bookings for this facility and period |
| `rank`        | `number` | Position in the leaderboard (1 = most bookings) |

Constraints:
- Maximum 10 entries returned
- Ties broken alphabetically by `userName`
- All booking statuses counted (CONFIRMED, PENDING, COMPLETED, CANCELLED)

---

### FacilityStatBreakdown (extended)

Existing type extended with the `topBookers` array.

| Field            | Type           | Change    | Description                          |
|------------------|----------------|-----------|--------------------------------------|
| `facilityId`     | `number`       | existing  | Facility identifier                  |
| `facilityName`   | `string`       | existing  | Facility name                        |
| `totalBookings`  | `number`       | existing  | Total bookings in period             |
| `confirmed`      | `number`       | existing  | Count of CONFIRMED bookings          |
| `pending`        | `number`       | existing  | Count of PENDING bookings            |
| `cancelled`      | `number`       | existing  | Count of CANCELLED bookings          |
| `completed`      | `number`       | existing  | Count of COMPLETED bookings          |
| `utilizationRate`| `number`       | existing  | `(confirmed + completed) / total × 100` |
| `dateFrom`       | `string`       | existing  | Period start (ISO date)              |
| `dateTo`         | `string`       | existing  | Period end (ISO date)                |
| `topBookers`     | `TopBooker[]`  | **new**   | Ranked list of top users (max 10)    |

---

## Types Being Deleted

The following types are removed from both server and client (no longer needed after reports page removal):

- `UsageReportRow`, `UsageReportResponse`
- `ReportGroupBy`
- `FinancialReportRow`, `FinancialReportSummary`, `FinancialReportResponse`
- `DamageReportRow`, `DamageReportResponse`

---

## Query: Top Bookers

```
prisma.booking.groupBy({
  by: ['userId'],
  where: { facilityId, startTime: { gte: from, lte: to } },
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
  take: 10,
})
```

After the groupBy, a single `user.findMany({ where: { id: { in: userIds } }, include: { company: true } })` resolves names and companies.
