import { StatusBadge } from '../../../components/StatusBadge'
import { formatDateTime } from '../../../lib/formatDateTime'
import type { FacilityBooking } from '../types/facility'

function computeDuration(startTime: string, endTime: string): string {
  const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  
  return `${hours}h ${minutes}m`
}

interface FieldProps {
  label: string
  value: React.ReactNode
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] font-bold text-fg-muted tracking-[0.6px] uppercase">{label}</dt>
      <dd className="text-[13px] text-color-fg font-medium">{value}</dd>
    </div>
  )
}

interface BookingDetailViewProps {
  booking: FacilityBooking
}

export function BookingDetailView({ booking }: BookingDetailViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6">
      <h2 className="text-[15px] font-extrabold text-color-fg mb-5">Booking Details</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <Field label="Facility" value={booking.facility.name} />
        <Field label="Status" value={<StatusBadge status={booking.status} />} />
        <Field label="Start Time" value={formatDateTime(booking.startTime)} />
        <Field label="End Time" value={formatDateTime(booking.endTime)} />
        <Field label="Duration" value={computeDuration(booking.startTime, booking.endTime)} />
        <Field label="Employee" value={booking.user.name} />
        <Field label="Email" value={booking.user.email} />
        <Field label="Company" value={booking.user.companyName} />
        <Field label="Notes" value={booking.notes ?? <span className="text-fg-muted italic">None</span>} />
        <Field label="Created" value={formatDateTime(booking.createdAt)} />
        <Field label="Updated" value={formatDateTime(booking.updatedAt)} />
      </dl>
    </div>
  )
}
