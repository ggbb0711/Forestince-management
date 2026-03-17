import type { PaginationMeta } from '../lib/paginationMeta'

interface PaginationProps {
  meta: PaginationMeta
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ meta, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <span className="text-[12px] text-fg-muted">
        Page {meta.page} of {meta.totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={meta.page <= 1}
          onClick={onPrev}
          className="px-3 py-1.5 text-[12px] font-medium border border-muted rounded-lg bg-white text-color-fg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
        >
          Prev
        </button>
        <button
          disabled={meta.page >= meta.totalPages}
          onClick={onNext}
          className="px-3 py-1.5 text-[12px] font-medium border border-muted rounded-lg bg-white text-color-fg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}
