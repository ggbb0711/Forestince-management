import { HutIcon } from '../assets/icons/HutIcon'
import { SwimmingIcon } from '../assets/icons/SwimmingIcon'
import { HikingIcon } from '../assets/icons/HikingIcon'
import { ZenIcon } from '../assets/icons/ZenIcon'
import { MindGearIcon } from '../assets/icons/MindGearIcon'
import type { JSX, SVGProps } from 'react'

export const FACILITY_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  MEDITATION: (props) => <HutIcon {...props} />,
  SPRING:     (props) => <SwimmingIcon {...props} />,
  TRAIL:      (props) => <HikingIcon {...props} />,
  GARDEN:     (props) => <ZenIcon {...props} />,
  POD:        (props) => <MindGearIcon {...props} />,
}

interface FacilityTypeIconProps {
  type: string
  size?: number
  color?: string
}

export function FacilityTypeIcon({ type, size = 14, color = '#2e7d32' }: FacilityTypeIconProps) {
  const Icon = FACILITY_ICONS[type.toUpperCase()] ?? FACILITY_ICONS['POD']!
  return <Icon width={size} height={size} color={color} />
}
