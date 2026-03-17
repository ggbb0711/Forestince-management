import type { BookingFilters } from '../../types/facility'

interface FilterBarProps {
  filters: BookingFilters
  onFilterChange: (patch: Partial<BookingFilters>) => void
  onClear: () => void
}

export function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
  const hasActiveFilters = filters.status ?? filters.dateFrom ?? filters.dateTo ?? filters.search

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-[10px] font-bold text-fg-muted tracking-wide uppercase">Status</label>
        <select
          value={filters.status ?? ''}
          onChange={e => onFilterChange({ status: e.target.value || undefined })}
          className="border border-muted rounded-lg px-3 py-1.5 text-[13px] text-color-fg bg-white outline-none focus:border-brand"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-fg-muted tracking-wide uppercase">From</label>
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={e => onFilterChange({ dateFrom: e.target.value || undefined })}
          className="border border-muted rounded-lg px-3 py-1.5 text-[13px] text-color-fg bg-white outline-none focus:border-brand"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-fg-muted tracking-wide uppercase">To</label>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={e => onFilterChange({ dateTo: e.target.value || undefined })}
          className="border border-muted rounded-lg px-3 py-1.5 text-[13px] text-color-fg bg-white outline-none focus:border-brand"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
        <label className="text-[10px] font-bold text-fg-muted tracking-wide uppercase">Search</label>
        <input
          type="text"
          placeholder="Search by employee name..."
          value={filters.search ?? ''}
          onChange={e => onFilterChange({ search: e.target.value || undefined })}
          className="border border-muted rounded-lg px-3 py-1.5 text-[13px] text-color-fg bg-white outline-none focus:border-brand"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-[12px] font-medium text-fg-muted border border-muted rounded-lg bg-transparent hover:bg-surface transition-colors cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  )
}
