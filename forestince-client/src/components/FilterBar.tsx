interface ExtraDropdown {
  key: string
  label: string
  placeholder: string
  value: string | undefined
  options: Array<{ value: string; label: string }>
}

interface FilterBarProps {
  showSearch?: boolean
  showStatus?: boolean
  showDateRange?: boolean
  extraDropdowns?: ExtraDropdown[]
  values: Record<string, string | undefined>
  onChange: (patch: Record<string, string | undefined>) => void
  onClear: () => void
  hasActiveFilters: boolean
}

const INPUT_CLASS = 'border border-muted rounded-lg px-3 py-1.5 text-[13px] text-color-fg bg-white outline-none focus:border-brand'
const LABEL_CLASS = 'text-[10px] font-bold text-fg-muted tracking-wide uppercase'

export function FilterBar({
  showSearch,
  showStatus,
  showDateRange,
  extraDropdowns,
  values,
  onChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-end">
      {showStatus && (
        <div className="flex flex-col gap-1 min-w-35">
          <label className={LABEL_CLASS}>Status</label>
          <select
            value={values.status ?? ''}
            onChange={e => onChange({ status: e.target.value || undefined })}
            className={INPUT_CLASS}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      {showDateRange && (
        <>
          <div className="flex flex-col gap-1">
            <label className={LABEL_CLASS}>From</label>
            <input
              type="date"
              value={values.dateFrom ?? ''}
              onChange={e => onChange({ dateFrom: e.target.value || undefined })}
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={LABEL_CLASS}>To</label>
            <input
              type="date"
              value={values.dateTo ?? ''}
              onChange={e => onChange({ dateTo: e.target.value || undefined })}
              className={INPUT_CLASS}
            />
          </div>
        </>
      )}

      {extraDropdowns?.map(dd => (
        <div key={dd.key} className="flex flex-col gap-1 min-w-35">
          <label className={LABEL_CLASS}>{dd.label}</label>
          <select
            value={dd.value ?? ''}
            onChange={e => onChange({ [dd.key]: e.target.value || undefined })}
            className={INPUT_CLASS}
          >
            <option value="">{dd.placeholder}</option>
            {dd.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      {showSearch && (
        <div className="flex flex-col gap-1 flex-1 min-w-40">
          <label className={LABEL_CLASS}>Search</label>
          <input
            type="text"
            placeholder="Search by employee name..."
            value={values.search ?? ''}
            onChange={e => onChange({ search: e.target.value || undefined })}
            className={INPUT_CLASS}
          />
        </div>
      )}

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
