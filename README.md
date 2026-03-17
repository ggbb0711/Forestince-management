# Forestince Management

A facility booking management system — view facilities, track bookings, and analyse usage trends across a campus.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm

### 1. Server

```bash
cd forestince-server
npm install
cp .env.example .env
npx prisma db seed
npm run dev
```

Server runs at `http://localhost:3000` (configurable via `PORT` in `.env`).

### 2. Client

```bash
cd forestince-client
npm install
npm run dev
```

Client runs at `http://localhost:5173`. The API base URL defaults to `http://localhost:3000/api` and can be overridden via `VITE_API_URL`.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Server | Express 4, TypeScript, Prisma 5, SQLite |
| Validation | express-validator |
| Client | React 19, React Router v7, TypeScript |
| Styling | TailwindCSS 4, shadcn/ui primitives |
| Build | Vite 8 (with React Compiler) |
| Charts | Recharts |
| Toasts | Sonner |

---

## API Endpoints

All responses follow the envelope `{ payload, message, isOk }`.

| Route | Method | Description |
| --- | --- | --- |
| `/api/facilities` | GET | List all facilities |
| `/api/facilities/:id` | GET | Single facility |
| `/api/bookings` | GET | List bookings (filterable + paginated) |
| `/api/bookings/:id` | GET | Single booking with relations |
| `/api/dashboard` | GET | Summary stats (accepts `window`: `24h`, `7d`, `28d`) |
| `/api/reports/facility-stats/:id` | GET | Facility usage analytics (accepts `dateFrom`, `dateTo`) |
| `/health` | GET | Health check |

**Booking filters** (query params): `status`, `facilityId`, `dateFrom`, `dateTo`, `search`, `page`, `pageSize`.

---

## UI Implementation Approach

The UI is built with **React 19 + React Router v7 + TailwindCSS + shadcn/ui**, following a **feature-based folder structure** (`src/features/<feature>/{api, components, hooks, types}`) that keeps each concern co-located and prevents cross-feature coupling.

Key screens:

- **Dashboard** — summary stats, recent bookings panel with facility icons, and a facility utilisation overview. The window (24h / 7d / 28d) drives all figures on the page.
- **Facilities list** — cards with facility-specific icons and a quick utilisation indicator.
- **Facility detail** — two tabs:
  - *Bookings* — paginated, filterable table with responsive desktop/mobile layouts and a status badge colour system.
  - *Usage* — a Recharts `AreaChart` showing daily confirmed bookings over time, followed by a **Top Bookers** ranked list (users with highest booking counts for that facility).
- **Booking detail** — full booking record with related facility and user information.

Design decisions:

- **shadcn/ui** for accessible, unstyled-by-default primitives (Tabs, Badge, Progress) that are easy to theme with Tailwind.
- **Sonner** for non-blocking toast notifications.
- **Recharts** for the area chart — lightweight, composable, and SSR-safe.
- Skeleton loaders mirror the exact shape of the real content (chart placeholder, card skeletons) so the layout does not shift on load.
- **Breadcrumb navigation** via `use-react-router-breadcrumbs`, with dynamic segment labels passed through `location.state` on navigation.

---

## Architectural Decisions

### Backend

| Decision | Choice | Reason |
| --- | --- | --- |
| Runtime | Express 4 + TypeScript | Minimal overhead, familiar, good typing support |
| ORM | Prisma 5 + SQLite | Zero-config local DB, schema-as-code, type-safe queries |
| Validation | express-validator (all routes) | Declarative, sanitises + validates in one pass |
| Validated data access | `matchedData<T>(req)` | Pulls only validated/sanitised fields; no unsafe casts in route handlers |
| Shared middleware | `validateRequest` | Single middleware reads `validationResult` and returns a consistent error envelope |
| API response | `{ payload, message, isOk }` | Uniform shape across all routes; client can always check `isOk` regardless of status code |
| Error messages | `API_MESSAGES` constants | All status codes and messages in one place; no magic strings scattered across routes |
| Error handling | Global `errorHandler` middleware | Catches `AppError`, Prisma errors, and unexpected errors in one place |

Service layer pattern: each route file is thin (validates → calls service → returns response). Business logic lives exclusively in `src/services/`.

Stats are computed in a single `Promise.all` inside `reportService.getFacilityStats` — one round-trip to the database for all figures (total, confirmed, pending, cancelled, completed, top bookers via `groupBy`, daily usage via date-grouped `findMany`).

### Frontend

| Decision | Choice | Reason |
| --- | --- | --- |
| State | Server state only (fetch + custom hooks) | No global client state needed; each feature owns its own hook |
| Routing | React Router v7 (config in `router.tsx`) | Simple SPA with a shared layout wrapping all routes |
| Data fetching | Plain `fetch` wrapped in feature-level hooks | No external library dependency; straightforward for a read-heavy dashboard |
| Pagination | Server-side | Keeps payload small; the bookings endpoint accepts `page` + `pageSize` |
| Shared types | `src/lib/` (`bookingStatus.ts`, `paginationMeta.ts`) | Prevents duplication across features without creating barrel files |

---

## What I Prioritised

- **Correctness of the data layer** — proper validation/sanitisation through the full request lifecycle, no silent type coercions.
- **Consistent API envelope** — every response is `{ payload, message, isOk }` so the client can handle errors uniformly.
- **Readable feature structure** — co-located API, hooks, components, and types per feature make it easy to trace data from fetch to render.

## What I Intentionally Left Out

- **Authentication / authorisation** — no user session, all data is public. Adding auth would be the natural next step.
- **Write operations** — the API and UI are read-only. Creating, updating, or cancelling bookings is out of scope.
- **Tests** — unit and integration tests were not written in the interest of delivery speed. The express-validator setup and service layer separation make them straightforward to add.

---

## How I Used AI During Development

I used **Claude Code (claude-sonnet-4-6)** as a pair programmer throughout the build via the speckit workflow:

1. `/speckit.specify` — turned a plain-English feature description into a structured spec (user stories, acceptance criteria, data entities).
2. `/speckit.plan` — translated the spec into a technical plan with file structure, data model, and API contracts.
3. `/speckit.tasks` — broke the plan into an ordered, dependency-aware task list.
4. `/speckit.implement` — executed the tasks, writing or modifying files one at a time.

Outside the speckit workflow, I also used Claude for general boilerplate (seeder, API message constants), research on library APIs (Recharts options, Radix UI primitives), and exploring architectural trade-offs for a specific project context — which is faster and more targeted than a generic web search.

### Where AI Helped

- It dramatically reduced boilerplate time — scaffolding routes, types, and hooks that follow a consistent pattern.
- It works well as a targeted researcher: asking "what is the best approach for this specific situation" gives more relevant answers than a general search engine.
- It kept the implementation moving by knowing which pieces connected to which, especially across a full-stack TypeScript project where type changes ripple through multiple layers.

### Where AI Did Not Help (and How I Validated)

- Image-to-code translation, it still misses a lot of the design details and colours from the original mockup. I had to find most of the colour values and spacing manually by inspecting the reference image closely.
- Knowing when to stop, AI tends to over-engineer and add things that weren't asked for. I had to stay deliberate about the scope of each prompt and review output critically rather than accepting it wholesale.
- Project-specific context, the AI has no memory of earlier decisions unless I explicitly provide it. Maintaining consistent patterns across a multi-session project required keeping track of decisions myself and re-grounding it at the start of each session.

