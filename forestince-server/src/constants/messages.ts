export const API_MESSAGES = {
  FACILITIES: {
    LIST_OK: { message: 'Facilities retrieved successfully', status: 200, isOk: true  },
    FOUND: { message: 'Facility retrieved successfully', status: 200, isOk: true  },
    NOT_FOUND: { message: 'Facility not found', status: 404, isOk: false },
    INVALID_ID: { message: 'Facility id must be a number', status: 400, isOk: false },
  },
  BOOKINGS: {
    LIST_OK: { message: 'Bookings retrieved successfully', status: 200, isOk: true  },
    FOUND: { message: 'Booking retrieved successfully', status: 200, isOk: true  },
    CREATED: { message: 'Booking created successfully', status: 201, isOk: true },
    NOT_FOUND: { message: 'Booking not found', status: 404, isOk: false },
    INVALID_QUERY: { message: 'Invalid query parameters', status: 400, isOk: false },
    START_IN_PAST: { message: 'Start time must be in the future', status: 400, isOk: false },
    END_BEFORE_START: { message: 'End time must be after start time', status: 400, isOk: false },
    OUTSIDE_WORKING_HOURS: { message: 'Booking times must be within working hours (7AM–7PM)', status: 400, isOk: false },
    MIN_DURATION: { message: 'Booking must be at least 1 hour long', status: 400, isOk: false },
    OVERLAPPING_TIME: { message: 'This time slot overlaps with an existing booking for this facility', status: 409, isOk: false },
    FACILITY_NOT_FOUND: { message: 'Facility not found', status: 404, isOk: false },
    USER_NOT_FOUND: { message: 'User not found', status: 404, isOk: false },
  },
  USERS: {
    LIST_OK: { message: 'Users retrieved successfully', status: 200, isOk: true },
    SEARCH_TOO_SHORT: { message: 'Search query must be at least 2 characters', status: 400, isOk: false },
  },
  DASHBOARD: {
    OK: { message: 'Dashboard data retrieved successfully', status: 200, isOk: true  },
    INVALID_WINDOW: { message: 'Window must be one of: 24h, 7d, 28d',  status: 400, isOk: false },
  },
  FACILITY_STATS: {
    OK: { message: 'Facility stats retrieved successfully', status: 200, isOk: true  },
    NOT_FOUND: { message: 'Facility not found', status: 404, isOk: false },
    INVALID_ID: { message: 'Facility id must be a number', status: 400, isOk: false },
  },
  GENERAL: {
    INTERNAL_ERROR: { message: 'Internal server error', status: 500, isOk: false },
    RECORD_NOT_FOUND: { message: 'Record not found', status: 404, isOk: false },
    DB_CONSTRAINT_ERROR: { message: 'Database constraint error', status: 400, isOk: false },
    INVALID_DATA_PROVIDED: { message: 'Invalid data provided', status: 400, isOk: false },
  },
}
