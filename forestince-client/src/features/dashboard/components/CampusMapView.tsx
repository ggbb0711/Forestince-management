import satelliteMap from '../../../assets/SatelliteForestMap.png'
import { IconExternalLink } from '../../../assets/icons/IconExternalLink'

export function CampusMapView() {
  return (
    <>
      <div className="relative rounded-xl overflow-hidden h-35">
        <img
          src={satelliteMap}
          alt="Campus satellite view"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2.5 left-3">
          <div className="text-white text-[10px] font-bold drop-shadow">CAMPUS MAP VIEW</div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2.5">
        <div className="text-[11px] text-fg-muted">Last updated: 2h ago</div>
        <button className="bg-transparent border-0 cursor-pointer text-brand text-[11px] font-semibold flex items-center gap-1 p-0 hover:opacity-75 transition-opacity">
          Full Map <IconExternalLink />
        </button>
      </div>
    </>
  )
}
