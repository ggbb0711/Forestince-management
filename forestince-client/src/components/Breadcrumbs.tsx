import useBreadcrumbs from 'use-react-router-breadcrumbs'
import type { BreadcrumbMatch } from 'use-react-router-breadcrumbs'
import { Link, useLocation } from 'react-router-dom'

function FacilityBreadcrumb({ match }: { match: BreadcrumbMatch<'facilityId'> }) {
  const location = useLocation()
  const state = location.state as { facilityName?: string } | null
  return <>{state?.facilityName ?? match.params.facilityId}</>
}

function BookingBreadcrumb({ match }: { match: BreadcrumbMatch<'bookingId'> }) {
  const location = useLocation()
  const state = location.state as { bookingLabel?: string } | null
  return <>{state?.bookingLabel ?? match.params.bookingId}</>
}

const ROUTES = [
  { path: '/', breadcrumb: 'Dashboard' },
  { path: '/facilities', breadcrumb: 'Facilities' },
  { path: '/facilities/:facilityId', breadcrumb: FacilityBreadcrumb },
  { path: '/facilities/:facilityId/bookings/:bookingId', breadcrumb: BookingBreadcrumb },
  { path: '/facilities/new', breadcrumb: 'New Booking' },
]

export function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs(ROUTES, { disableDefaults: true })

  return (
    <nav className="flex items-center gap-1 text-[12px] mb-4">
      {breadcrumbs.map(({ match, breadcrumb }, index) => {
        const isLast = index === breadcrumbs.length - 1
        return (
          <span key={match.pathname} className="flex items-center gap-1">
            {index > 0 && <span className="text-fg-muted">/</span>}
            {isLast ? (
              <span className="text-color-fg font-semibold">{breadcrumb}</span>
            ) : (
              <Link
                to={match.pathname}
                className="text-fg-muted hover:text-color-fg no-underline transition-colors"
              >
                {breadcrumb}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
