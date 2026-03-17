import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import type { StatItem } from '../types/dashboard'

export type StatCardProps = StatItem & { icon: ReactNode }

function changeBadgeClass(change: string, highlight: boolean): string {
  if (change.startsWith('+')) return highlight ? 'text-cancelled bg-cancelled-bg' : 'text-good bg-good-bg'
  if (change.startsWith('-')) return highlight ? 'text-good bg-good-bg' : 'text-cancelled bg-cancelled-bg'
  return 'text-pending bg-pending-bg'
}

export function StatCard({ label, value, change, highlight, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 relative overflow-hidden shadow-sm">
      {change && (
        <span className={cn(
          'absolute top-3 right-3 text-[10px] font-bold px-1.75 py-0.5 rounded-full font-mono',
          changeBadgeClass(change, highlight)
        )}>
          {change}
        </span>
      )}
      <div className="mb-1.5">{icon}</div>
      <div className="text-[11px] text-fg-muted mb-0.5 font-medium">{label}</div>
      <div className="text-2xl font-extrabold font-mono tracking-tight">{value}</div>
    </div>
  )
}
