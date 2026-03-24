export const WORKING_HOURS = {
  startHour: 7, 
  endHour: 19,
} as const

export const MIN_BOOKING_DURATION_HOURS = 1

export function workingHoursMin(): string {
  return `${String(WORKING_HOURS.startHour).padStart(2, '0')}:00`
}

export function workingHoursMax(): string {
  return `${String(WORKING_HOURS.endHour).padStart(2, '0')}:00`
}
