export interface FacilityWithCount {
  id: string
  name: string
  facilityIcon: string
  createdAt: Date
  updatedAt: Date
  _count: { bookings: number }
}
