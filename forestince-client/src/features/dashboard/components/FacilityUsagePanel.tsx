import { cn } from '../../../lib/utils'
import { ArrowGraphRiseUpIcon } from '../../../assets/icons/ArrowGraphRiseUpIcon'
import { Progress } from '../../../components/ui/progress'
import type { FacilityUsageItem } from '../types/dashboard'

function UsageBar({ name, pct }: FacilityUsageItem) {
  const indicatorColor = 'bg-brand'

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-fg-muted font-medium">{name}</span>
        <span className="text-xs font-bold text-color-fg font-mono">{pct}%</span>
      </div>
      <Progress value={pct} indicatorClassName={cn(indicatorColor)} />
    </div>
  )
}

interface FacilityUsagePanelProps {
  items: FacilityUsageItem[]
}

export function FacilityUsagePanel({ items }: FacilityUsagePanelProps) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-color-fg mb-3.5">Facility Usage</h3>
      {items.map(f => <UsageBar key={f.name} {...f} />)}
      <div className="mt-2.5 pt-2.5 border-t border-surface">
        <div className="text-[10px] text-fg-muted font-semibold tracking-[0.5px] mb-1.5 uppercase">
          Most Popular This Week
        </div>
        <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
          <ArrowGraphRiseUpIcon width={14} height={14} /> Old Oak Forest Trail
        </div>
      </div>
    </div>
  )
}
