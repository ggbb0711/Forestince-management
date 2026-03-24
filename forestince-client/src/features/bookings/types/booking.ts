export interface UserSearchResult {
  id: string
  name: string
  email: string
  company: { name: string }
}

export interface CreateBookingInput {
  facilityId: number
  userId: string
  startTime: string 
  endTime: string   
  notes?: string
}

export interface CreatedBooking {
  id: string
  startTime: string
  endTime: string
  status: string
  facilityId: number
  userId: string
  notes: string | null
  createdAt: string
  updatedAt: string
}
