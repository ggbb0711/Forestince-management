import { Button } from './ui/button'
import { IconSearch } from '../assets/icons/IconSearch'
import { IconBell } from '../assets/icons/IconBell'
import { IconMenu } from '../assets/icons/IconMenu'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[9px] border border-gray-200 cursor-pointer text-fg-muted shrink-0 bg-transparent hover:bg-gray-50 transition-colors"
      >
        <IconMenu />
      </button>

      <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 bg-white border border-muted min-w-0">
        <span className="text-gray-400 shrink-0"><IconSearch /></span>
        <input
          placeholder="Search facilities, users, or bookings..."
          className="border-0 bg-transparent outline-none text-[13px] text-fg-muted w-full min-w-0 placeholder:text-gray-400"
        />
      </div>

      <Button variant="secondary" size="default" className="hidden sm:inline-flex shrink-0 whitespace-nowrap">
        View Reports
      </Button>

      <button className="relative flex items-center justify-center w-9 h-9 cursor-pointer text-fg-muted border-0 bg-transparent shrink-0">
        <IconBell />
        <span className="absolute top-1.5 right-1.5 w-1.75 h-1.75 rounded-full bg-orange-600 border-2 border-white" />
      </button>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:block text-right">
          <div className="font-bold text-xs text-color-fg">Elena Wood</div>
          <div className="text-[10px] text-fg-muted">Super Admin</div>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-linear-to-br from-green-200 to-btn flex items-center justify-center text-white font-extrabold text-sm">
          E
        </div>
      </div>
    </div>
  )
}
