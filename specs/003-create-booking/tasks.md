# Tasks: Create Booking

**Input**: Design documents from `/specs/003-create-booking/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.
Tasks use paths relative to repo root: `forestince-server/` (backend) and `forestince-client/` (frontend).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story label (US1, US2, US3)

---

## Phase 1: Setup (Feature Folder)

**Purpose**: Create the new `features/bookings/` folder structure on the frontend. No new packages required — all dependencies already exist.

- [x] T001 Create the feature folder skeleton: `forestince-client/src/features/bookings/api/`, `forestince-client/src/features/bookings/components/`, `forestince-client/src/features/bookings/hooks/`, `forestince-client/src/features/bookings/types/` (empty dirs or `.gitkeep` files)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and API message constants that ALL user stories depend on. Must be complete before any user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Add backend message constants for bookings (CREATED, INVALID_TIMEZONE, START_IN_PAST, END_BEFORE_START) and users (LIST_OK, SEARCH_TOO_SHORT) in `forestince-server/src/constants/messages.ts`
- [x] T003 [P] Add `CreateBookingInput` interface to `forestince-server/src/types/booking.ts` (fields: facilityId, userId, startTime, endTime, timezone, notes?)
- [x] T004 [P] Create `forestince-server/src/types/user.ts` with `UserSearchResult` interface (id, name, email, company: { name })
- [x] T005 [P] Create `forestince-client/src/features/bookings/types/booking.ts` with client-side types: `CreateBookingInput`, `CreatedBooking`, `UserSearchResult`

**Checkpoint**: All types and messages defined — user story implementation can now begin in parallel (US2 and US3 can start simultaneously)

---

## Phase 3: User Story 2 — Employee Autocomplete (Priority: P2)

**Goal**: Backend employee search endpoint + frontend autocomplete component, independently usable.

**Independent Test**: Type 2+ characters into the `EmployeeAutocomplete` component → dropdown appears with matching user names from `GET /api/users?search=`. Selecting a user adds them to the parent's state. No booking form required to test this.

### Implementation for User Story 2

- [x] T006 [P] [US2] Create `forestince-server/src/services/userService.ts` — implement `searchUsers(search: string): Promise<UserSearchResult[]>` using Prisma `findMany` on `User` where `name contains search`, `include: { company: { select: { name: true } } }`, `take: 10`
- [x] T007 [P] [US2] Create `forestince-client/src/features/bookings/api/searchUsers.ts` — `fetch(\`${API_URL}/users?search=\${encodeURIComponent(query)}\`)`, `.json()` first, check `json.isOk`, throw `new Error(json.message)` if false, return `json.payload`
- [x] T008 [US2] Create `forestince-server/src/routes/users.ts` — `GET /` route with `query('search').isString().isLength({ min: 2 })` validation via `express-validator`, call `searchUsers()`, return `200` with `USERS.LIST_OK` message (depends on T006, T004, T002)
- [x] T009 [US2] Register `usersRouter` at `/api/users` in `forestince-server/src/index.ts` — add `import usersRouter from './routes/users'` and `app.use('/api/users', usersRouter)` (depends on T008)
- [x] T010 [US2] Create `forestince-client/src/features/bookings/components/EmployeeAutocomplete.tsx` — debounced input (300ms), triggers `searchUsers()` after 2+ chars, renders dropdown of results, calls `onSelect(user)` on click, shows "No employees found" when empty, prevents duplicate selection via `selectedUserId` prop (depends on T007, T005)

**Checkpoint**: `GET /api/users?search=alice` returns matching users; `EmployeeAutocomplete` renders suggestions and fires `onSelect`

---

## Phase 4: User Story 3 — Date & Time Validation (Priority: P2)

**Goal**: Timezone selector component and date/time validation logic. Can be built and tested independently of the full booking form.

**Independent Test**: Render `TimezoneSelector` — it shows browser's detected timezone and allows changing it. Enter a past date/time combination → validation error shown. Enter end time before start time → validation error shown. Enter valid future date/time → no errors. All testable without a submit button.

### Implementation for User Story 3

- [x] T011 [P] [US3] Add timezone query param validation to `GET /api/bookings` in `forestince-server/src/routes/bookings.ts` — add `query('timezone').optional().isString()` to `validateBookingQuery`; in the handler, if `timezone` is present, validate via `Intl.supportedValuesOf('timeZone').includes(tz)` (fallback: `new Intl.DateTimeFormat(undefined, { timeZone: tz })`), return `400` with `BOOKINGS.INVALID_TIMEZONE` if invalid
- [x] T012 [US3] Create `forestince-client/src/features/bookings/components/TimezoneSelector.tsx` — dropdown populated with `Intl.supportedValuesOf('timeZone')`, defaults to `Intl.DateTimeFormat().resolvedOptions().timeZone`, props: `value: string, onChange: (tz: string) => void`

**Checkpoint**: `GET /api/bookings?timezone=Invalid%2FZone` returns `400 { isOk: false }`; `TimezoneSelector` renders and emits timezone changes

---

## Phase 5: User Story 1 — Full Create Booking Flow (Priority: P1) 🎯 MVP

**Goal**: Complete booking creation — `POST /api/bookings` endpoint + `CreateBookingPage` at `/bookings/new` integrating the autocomplete (US2) and date validation (US3) into a submittable form, plus navigation entry points from dashboard and facility detail.

**Independent Test**: Navigate to `/bookings/new` → select a facility → select a valid future date, start time, and end time → search for and select an employee via autocomplete → click Submit → booking appears confirmed (toast + redirect to booking detail). Also testable via `POST /api/bookings` directly with a valid payload.

### Implementation for User Story 1

- [x] T013 [P] [US1] Add `createBooking(input: CreateBookingInput): Promise<BookingWithRelations>` to `forestince-server/src/services/bookingService.ts` — validate timezone (Intl), validate `startTime > now`, validate `endTime > startTime`, verify facilityId exists, verify userId exists, `prisma.booking.create(...)`, return created record with facility+user includes (depends on T003, T002)
- [x] T014 [P] [US1] Create `forestince-client/src/features/bookings/api/createBooking.ts` — `fetch(API_URL + '/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })`, `.json()` first, check `json.isOk`, throw `new Error(json.message)` if false, return `json.payload` (depends on T005)
- [x] T015 [US1] Add `POST /` route to `forestince-server/src/routes/bookings.ts` — validators: `body('facilityId').isInt({ min: 1 })`, `body('userId').isString().notEmpty()`, `body('startTime').isISO8601().toDate()`, `body('endTime').isISO8601().toDate()`, `body('timezone').isString().notEmpty()`, `body('notes').optional().isString().isLength({ max: 500 })`; after `validateRequest` call `createBooking()`; return `201` with `BOOKINGS.CREATED` (depends on T013, T002, T003)
- [x] T016 [US1] Create `forestince-client/src/features/bookings/hooks/useCreateBooking.ts` — wraps `createBooking()` API call with `loading: boolean` state; on success calls `onSuccess(booking)` callback; on error calls `toast.error('Failed to create booking', { description: err.message })` (depends on T014)
- [x] T017 [US1] Create `forestince-client/src/features/bookings/components/BookingForm.tsx` — form state: `facilityId`, `date` (YYYY-MM-DD), `startTime` (HH:MM), `endTime` (HH:MM), `timezone`, `selectedUser`; renders: facility `<select>` (loaded from `getFacilities()`), date `<input type="date">`, start/end `<input type="time">`, `<TimezoneSelector>`, `<EmployeeAutocomplete>`; client-side validation before submit (all required fields, future date+time in timezone, end > start, user selected); on valid submit converts local times to UTC ISO8601 using timezone offset calculation, calls `useCreateBooking`; pre-fills facilityId from `defaultFacilityId` prop (depends on T010, T012, T016, T005)
- [x] T018 [US1] Create `forestince-client/src/features/bookings/CreateBookingPage.tsx` — reads `facilityId` from `useSearchParams()` as optional pre-fill; renders `<Breadcrumbs />`, heading "New Booking", `<BookingForm defaultFacilityId={...} />`; on booking success `navigate(\`/facilities/\${booking.facilityId}/bookings/\${booking.id}\`)` (depends on T017)
- [x] T019 [US1] Register `/bookings/new` route in `forestince-client/src/app/router.tsx` — add `import { CreateBookingPage } from '../features/bookings/CreateBookingPage'` and `{ path: '/bookings/new', element: <CreateBookingPage /> }` inside the Layout children (depends on T018)
- [x] T020 [P] [US1] Wire "+ Booking" button on dashboard to navigate to `/bookings/new` in `forestince-client/src/features/dashboard/components/BookingsPanel.tsx` — add `onClick={() => navigate('/bookings/new')}` to both the mobile and desktop `<Button variant="primary"><IconPlus /> Booking</Button>` elements (depends on T019)
- [x] T021 [P] [US1] Add "+ New Booking" button to facility detail page in `forestince-client/src/features/facilities/FacilityDetailPage.tsx` — add `<Button variant="primary" onClick={() => navigate(\`/bookings/new?facilityId=\${facilityId}\`)}><IconPlus /> New Booking</Button>` below the facility name heading (depends on T019)

**Checkpoint**: Full end-to-end flow works — navigate from dashboard or facility detail → fill form → submit → booking created (201) → redirected to booking detail page

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and consistency checks across all stories.

- [x] T022 [P] Verify all new frontend API functions (`createBooking.ts`, `searchUsers.ts`) use the `.json()` → `json.isOk` → `throw new Error(json.message)` pattern — no `res.ok` short-circuits before parsing
- [x] T023 [P] Verify `EmployeeAutocomplete` correctly prevents duplicate employee selection when the same user is already selected
- [x] T024 Run `npm run lint` in both `forestince-server/` and `forestince-client/` and fix any errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US2 (Phase 3)**: Can start after Phase 2; no dependency on US3
- **US3 (Phase 4)**: Can start after Phase 2; no dependency on US2 — **run in parallel with Phase 3**
- **US1 (Phase 5)**: Depends on US2 (T010 EmployeeAutocomplete) and US3 (T012 TimezoneSelector) being complete
- **Polish (Phase 6)**: Depends on all story phases complete

### User Story Dependencies

- **US2 (Phase 3)**: Independently implementable after Phase 2
- **US3 (Phase 4)**: Independently implementable after Phase 2 — parallel with US2
- **US1 (Phase 5)**: Requires US2 (T010) and US3 (T012) components; adds the glue (form, page, route, navigation)

### Within Each Phase

- Tasks marked `[P]` in the same phase can run in parallel
- `T008` (users route) depends on `T006` (userService) — sequential
- `T009` (register router) depends on `T008` — sequential
- `T010` (EmployeeAutocomplete) depends on `T007` (searchUsers API) — sequential
- `T015` (POST route) depends on `T013` (createBooking service) — sequential
- `T017` (BookingForm) depends on `T010`, `T012`, `T016` — sequential
- `T018` (CreateBookingPage) depends on `T017` — sequential
- `T019` (router) depends on `T018` — sequential
- `T020`, `T021` depend on `T019` but touch different files → can run in parallel with each other

---

## Parallel Execution Examples

### Phase 2 (all parallel)
```
T002 (messages) ‖ T003 (BE types/booking) ‖ T004 (BE types/user) ‖ T005 (FE types)
```

### Phase 3 + Phase 4 (parallel between phases)
```
Phase 3:                        Phase 4:
T006 (userService)          ‖   T011 (timezone validation on GET)
T007 (searchUsers API)      ‖   T012 (TimezoneSelector component)
T008 → T009 (users route)
T010 (EmployeeAutocomplete)
```

### Phase 5 (partial parallel at start)
```
T013 (createBooking service) ‖ T014 (createBooking API)
T015 (POST route) → ...
T016 (useCreateBooking hook) → T017 (BookingForm) → T018 (Page) → T019 (router)
                                                                  → T020 ‖ T021
```

---

## Implementation Strategy

### MVP First (User Story 1 Only — requires US2+US3 components)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational types + messages
3. Complete Phase 3: US2 (employee autocomplete) — backend + component
4. Complete Phase 4: US3 (timezone + date validation) — in parallel with Phase 3
5. Complete Phase 5: US1 (full booking form, page, route, navigation)
6. **STOP and VALIDATE**: Create a booking end-to-end from dashboard → form → submit → detail page
7. Demo / deploy

### Incremental Delivery

1. Phase 1+2 → Foundation ready
2. Phase 3 → Employee autocomplete works (searchable, selectable) — demo-able component
3. Phase 4 → Date/timezone validation works — demo-able component
4. Phase 5 → Full create booking page live with navigation entry points — **MVP shipped**
5. Phase 6 → Lint clean, pattern consistency verified

---

## Notes

- `[P]` tasks = different files, no shared dependencies, safe to run in parallel
- `[Story]` label maps each task to a user story for traceability
- US2 and US3 are independently completable before US1 integration
- The `json.isOk` pattern must be consistent across all new API functions — verified in T022
- No new npm packages required; no DB migration required
- Commit after each checkpoint (end of each phase) for clean rollback points
