import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { DashboardIcon } from '../assets/icons/DashboardIcon'
import { FacilityNavIcon } from '../assets/icons/FacilityNavIcon'
import { RuleIcon } from '../assets/icons/RuleIcon'
import { GeosoonLayerIcon } from '../assets/icons/GeosoonLayerIcon'
import { UsersIcon } from '../assets/icons/UsersIcon'
import { ReportsIcon } from '../assets/icons/ReportsIcon'
import { GearIcon } from '../assets/icons/GearIcon'
import { IconX } from '../assets/icons/IconX'
import { ForestineIcon } from '../assets/icons/ForestineIcon'
import type { JSX, SVGProps } from 'react'

type NavItem = {
  label: string
  path: string
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', Icon: DashboardIcon },
  { label: 'Facilities', path: '/facilities', Icon: FacilityNavIcon },
  { label: 'Booking Rules', path: '/booking-rules', Icon: RuleIcon },
  { label: 'GeooSON Layers', path: '/geojson-layers', Icon: GeosoonLayerIcon },
  { label: 'Users', path: '/users', Icon: UsersIcon },
  { label: 'Reports', path: '/reports', Icon: ReportsIcon },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-[10px] bg-linear-to-br from-green-600 to-green-900 flex items-center justify-center">
            <ForestineIcon width={18} height={15} color="white" />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight">Forestince</div>
            <div className="text-brand text-[9px] font-medium opacity-80">Nature Campus Admin</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-fg-muted p-1 rounded hover:text-brand transition-colors"
          >
            <IconX />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2.5">
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={label}
              to={path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-2.5 w-full px-3 py-2.5 mb-0.5 rounded-[5px] text-[13px] no-underline transition-all duration-150 ',
                isActive
                  ? 'bg-brand-muted border-r-4 border-r-brand text-brand font-bold'
                  : 'text-fg-muted font-medium hover:text-brand hover:bg-brand-muted'
              )}
            >
              <Icon color={isActive ? '#208D26' : '#CBD5E1'} width={18} height={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2.5 pb-2.5">
        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-transparent border-0 rounded-[10px] text-fg-muted cursor-pointer text-[13px] font-medium text-left hover:text-brand hover:bg-brand-muted transition-colors">
          <GearIcon width={18} height={18} color="#CBD5E1" /> Settings
        </button>
      </div>
    </>
  )
}
