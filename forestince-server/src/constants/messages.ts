interface MessageDef {
  message: string
  status: number
  isOk: boolean
}

export const API_MESSAGES = {
  FACILITIES: {
    LIST_OK:    { message: 'Facilities retrieved successfully', status: 200, isOk: true  },
    FOUND:      { message: 'Facility retrieved successfully', status: 200, isOk: true  },
    NOT_FOUND:  { message: 'Facility not found', status: 404, isOk: false },
    INVALID_ID: { message: 'Facility id must be a number', status: 400, isOk: false },
  },
  BOOKINGS: {
    LIST_OK:       { message: 'Bookings retrieved successfully', status: 200, isOk: true  },
    FOUND:         { message: 'Booking retrieved successfully', status: 200, isOk: true  },
    NOT_FOUND:     { message: 'Booking not found', status: 404, isOk: false },
    INVALID_QUERY: { message: 'Invalid query parameters', status: 400, isOk: false },
  },
  GENERAL: {
    INTERNAL_ERROR:        { message: 'Internal server error',      status: 500, isOk: false },
    RECORD_NOT_FOUND:      { message: 'Record not found',           status: 404, isOk: false },
    DB_CONSTRAINT_ERROR:   { message: 'Database constraint error',  status: 400, isOk: false },
    INVALID_DATA_PROVIDED: { message: 'Invalid data provided',      status: 400, isOk: false },
  },
}
