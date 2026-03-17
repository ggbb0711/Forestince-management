import { cn } from '../../../lib/utils'
import type { StatItem } from '../types/dashboard'
import { CalendarIcon } from '../../../assets/icons/CalendarIcon'
import { MindGearIcon } from '../../../assets/icons/MindGearIcon'
import { RegisteredUsersIcon } from '../../../assets/icons/RegisteredUsersIcon'
import { PendingRequestIcon } from '../../../assets/icons/PendingRequestIcon'
import type { JSX } from 'react'

const ICON_MAP: Record<string, () => JSX.Element> = {
  'Total Bookings': () => <CalendarIcon width={22} height={22} />,
  'Active Facilities': () => <MindGearIcon width={22} height={22} />,
  'Registered Users': () => <RegisteredUsersIcon width={22} height={22} />,
  'Pending Requests': () => <PendingRequestIcon width={22} height={22} />,
}

export function StatCard({ label, value, change, highlight }: StatItem) {
  const IconComp = ICON_MAP[label]
  return (
    <div className="bg-white rounded-2xl px-4 py-4 relative overflow-hidden shadow-sm">
      {change && (
        <span className={cn(
          'absolute top-3 right-3 text-[10px] font-bold px-1.75 py-0.5 rounded-full font-mono',
          highlight
            ? 'text-pending bg-pending-bg'
            : 'text-brand bg-good-bg'
        )}>
          {change}
        </span>
      )}
      <div className="mb-1.5">
        {IconComp ? <IconComp /> : null}
      </div>
      <div className="text-[11px] text-fg-muted mb-0.5 font-medium">{label}</div>
      <div className={cn(
        'text-2xl font-extrabold font-mono tracking-tight',
        highlight ? 'text-pending' : 'text-color-fg'
      )}>
        {value}
      </div>
    </div>
  )
}
