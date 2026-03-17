export interface FacilityWithCount {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  _count: { bookings: number }
}
