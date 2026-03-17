import { Link, useLocation } from 'react-router-dom'

export function NotFoundPage() {
  const location = useLocation()
  return (
    <div className="flex-1 overflow-auto flex items-center justify-center p-10 font-sans">
      <div className="text-center max-w-100">
        <div className="text-[64px] font-extrabold text-btn leading-none mb-2">404</div>
        <h1 className="text-[22px] font-extrabold text-color-fg mb-3">Page Not Found</h1>
        <p className="text-[13px] text-fg-muted mb-1.5">
          This section hasn't been built yet.
        </p>
        <p className="text-xs text-fg-muted mb-7 font-mono bg-surface px-3 py-1.5 rounded-lg inline-block">
          {location.pathname}
        </p>
        <br />
        <Link
          to="/"
          className="inline-block bg-btn text-white no-underline px-6 py-2.5 rounded-[10px] text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
