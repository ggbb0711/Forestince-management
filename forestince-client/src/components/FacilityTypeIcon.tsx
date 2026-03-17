import { HutIcon } from '../assets/icons/HutIcon'
import { SwimmingIcon } from '../assets/icons/SwimmingIcon'
import { HikingIcon } from '../assets/icons/HikingIcon'
import { ZenIcon } from '../assets/icons/ZenIcon'
import { MindGearIcon } from '../assets/icons/MindGearIcon'
import type { JSX, SVGProps } from 'react'

const FACILITY_ICONS: Record<number, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  1: (props) => <SwimmingIcon {...props} />,
  2: (props) => <ZenIcon {...props} />,
  3: (props) => <HutIcon {...props} />,
  4: (props) => <MindGearIcon {...props} />,
  5: (props) => <HikingIcon {...props} />,
}

interface FacilityTypeIconProps {
  id: number
  size?: number
  color?: string
}

export function FacilityTypeIcon({ id, size = 14, color = '#2e7d32' }: FacilityTypeIconProps) {
  const Icon = FACILITY_ICONS[id] ?? MindGearIcon
  return <Icon width={size} height={size} color={color} />
}
