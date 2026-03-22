import { HutIcon } from '../assets/icons/HutIcon'
import { SwimmingIcon } from '../assets/icons/SwimmingIcon'
import { HikingIcon } from '../assets/icons/HikingIcon'
import { ZenIcon } from '../assets/icons/ZenIcon'
import { MindGearIcon } from '../assets/icons/MindGearIcon'
import type { JSX, SVGProps } from 'react'

const FACILITY_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  HutIcon:      (props) => <HutIcon {...props} />,
  SwimmingIcon: (props) => <SwimmingIcon {...props} />,
  HikingIcon:   (props) => <HikingIcon {...props} />,
  ZenIcon:      (props) => <ZenIcon {...props} />,
  MindGearIcon: (props) => <MindGearIcon {...props} />,
}

interface FacilityTypeIconProps {
  iconName: string
  size?: number
  color?: string
}

export function FacilityTypeIcon({ iconName, size = 14, color = '#2e7d32' }: FacilityTypeIconProps) {
  const Icon = FACILITY_ICONS[iconName] ?? MindGearIcon
  return <Icon width={size} height={size} color={color} />
}
