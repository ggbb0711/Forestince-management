# Quickstart: Facility Usage, Dashboard & Reports

**Branch**: `001-usage-reports-dashboard`

## Prerequisites

- Node.js 18+
- npm

## Running the Project

### 1. Server

```bash
cd forestince-server
npm install
npx prisma generate
npx ts-node prisma/seed.ts     # populate ~200 seed records
npm run dev                    # starts on http://localhost:3000
```

### 2. Client

```bash
cd forestince-client
npm install
npm run dev                    # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## New Routes (after implementation)

| URL | Description |
|-----|-------------|
| `/` | Dashboard with time-window selector (24h / 7d / 28d) |
| `/facilities` | Facility list |
| `/facilities/:id` | Facility detail — Bookings tab + Usage tab |
| `/reports` | Reports page — Usage / Financial / Damage tabs |

## New API Endpoints (after implementation)

| Endpoint | Description |
|----------|-------------|
| `GET /api/dashboard?window=28d` | Dashboard stats, facility usage, recent bookings |
| `GET /api/facilities/:id/stats` | Per-facility booking breakdown + utilization rate |
| `GET /api/reports/usage` | System-wide facility usage report |
| `GET /api/reports/financial` | Booking volume report by time period |
| `GET /api/reports/damage` | Paginated list of damage-noted bookings |

## Re-seeding

To reset and re-populate data:

```bash
cd forestince-server
npx ts-node prisma/seed.ts
```

The seed script deletes all existing records before inserting fresh data.

## Environment

The client reads the API base URL from `src/config/env.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
```

No `.env` file is required for local development.
