import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { FacilitiesPage } from '../features/facilities/FacilitiesPage'
import { FacilityDetailPage } from '../features/facilities/FacilityDetailPage'
import { BookingDetailPage } from '../features/facilities/BookingDetailPage'
import { CreateBookingPage } from '../features/bookings/CreateBookingPage'
import { NotFoundPage } from './routes/not-found'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/facilities', element: <FacilitiesPage /> },
      { path: '/facilities/:facilityId', element: <FacilityDetailPage /> },
      { path: '/facilities/:facilityId/bookings/:bookingId', element: <BookingDetailPage /> },
      { path: '/facilities/new', element: <CreateBookingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
