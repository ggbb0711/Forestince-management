import { Breadcrumbs } from '../../components/Breadcrumbs'
import { BookingForm } from './components/BookingForm'

export function CreateBookingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4 lg:p-5">
        <Breadcrumbs />
        <div className="mb-5">
          <h1 className="text-[18px] font-extrabold text-color-fg">New Booking</h1>
          <p className="text-[12px] text-fg-muted mt-0.5">Fill in the details below to create a booking</p>
        </div>
        <BookingForm />
      </div>
    </div>
  )
}
