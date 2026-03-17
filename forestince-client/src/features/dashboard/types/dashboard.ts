export interface Booking {
  id: string
  startTime: string
  facility: { id: number; name: string }
  user: { id: string; name: string; company: { name: string } }
  status: string
  notes: string | null
}

export interface StatItem {
  label: string
  value: string
  change: string | null
  highlight: boolean
}

export interface FacilityUsageItem {
  name: string
  pct: number
}
