import { cn } from '../../../lib/utils'
import { ArrowGraphRiseUpIcon } from '../../../assets/icons/ArrowGraphRiseUpIcon'
import { Progress } from '../../../components/ui/progress'
import { Skeleton } from '../../../components/ui/skeleton'
import type { FacilityUsageStat } from '../types/dashboard'

function UsageBar({ facilityName, pct }: FacilityUsageStat) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-fg-muted font-medium">{facilityName}</span>
        <span className="text-xs font-bold text-color-fg font-mono">{pct}%</span>
      </div>
      <Progress value={pct} indicatorClassName={cn('bg-brand')} />
    </div>
  )
}

interface FacilityUsagePanelProps {
  items: FacilityUsageStat[]
  loading?: boolean
}

export function FacilityUsagePanel({ items, loading }: FacilityUsagePanelProps) {
  const topFacility = items[0]?.facilityName

  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-color-fg mb-3.5">Facility Usage</h3>

      {loading && Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-7" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}

      {!loading && items.length === 0 && (
        <div className="text-fg-muted text-xs py-2">No data for this period.</div>
      )}

      {!loading && items.map(f => <UsageBar key={f.facilityId} {...f} />)}

      {topFacility && (
        <div className="mt-2.5 pt-2.5 border-t border-surface">
          <div className="text-[10px] text-fg-muted font-semibold tracking-[0.5px] mb-1.5 uppercase">
            Most Popular This Period
          </div>
          <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
            <ArrowGraphRiseUpIcon width={14} height={14} /> {topFacility}
          </div>
        </div>
      )}
    </div>
  )
}
