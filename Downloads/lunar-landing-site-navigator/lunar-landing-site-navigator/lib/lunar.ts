export type LandingSite = {
  id: string
  name: string
  region: string
  latitude: number
  longitude: number
  elevationKm: number
  horizonBoost: number
  earthBias: number
  description: string
}

export const LANDING_SITES: LandingSite[] = [
  {
    id: 'shackleton',
    name: 'Shackleton Crater Rim',
    region: 'Connecting ridge',
    latitude: -89.67,
    longitude: 129.78,
    elevationKm: 1.9,
    horizonBoost: 0.9,
    earthBias: 0.4,
    description: 'Near-permanent illumination on the rim adjacent to a permanently shadowed interior.',
  },
  {
    id: 'malapert',
    name: 'Malapert Massif',
    region: 'Massif summit',
    latitude: -86.0,
    longitude: 2.9,
    elevationKm: 5.0,
    horizonBoost: 1.4,
    earthBias: 4.2,
    description: 'Tall summit with excellent Earth line-of-sight for direct communications.',
  },
  {
    id: 'de-gerlache',
    name: 'de Gerlache Rim',
    region: 'Crater rim 1',
    latitude: -88.67,
    longitude: -68.51,
    elevationKm: 1.6,
    horizonBoost: 0.6,
    earthBias: -1.8,
    description: 'Extended sunlit periods with nearby cold traps for volatile prospecting.',
  },
  {
    id: 'haworth',
    name: 'Haworth Plateau',
    region: 'Plateau edge',
    latitude: -87.45,
    longitude: -4.8,
    elevationKm: 2.3,
    horizonBoost: 0.3,
    earthBias: 2.6,
    description: 'Broad, gently sloped terrain bordering one of the largest shadowed craters.',
  },
  {
    id: 'nobile',
    name: 'Nobile Rim 1',
    region: 'Crater rim',
    latitude: -85.29,
    longitude: 36.94,
    elevationKm: 1.1,
    horizonBoost: -0.2,
    earthBias: 3.4,
    description: 'Target region for robotic rovers studying water ice distribution.',
  },
]

export const TIMELINE_START = Date.UTC(2026, 11, 1, 0, 0, 0)
export const TIMELINE_HOURS = 30 * 24

const SYNODIC_HOURS = 29.530589 * 24
const DRACONIC_HOURS = 27.212221 * 24
const ANOMALISTIC_HOURS = 27.554549 * 24
const AXIAL_TILT = 1.54
const LIBRATION_LON = 6.7

const toRad = (deg: number) => (deg * Math.PI) / 180

export function solarElevation(site: LandingSite, hour: number): number {
  const colatitude = 90 - Math.abs(site.latitude)
  const hourAngle = (2 * Math.PI * hour) / SYNODIC_HOURS + toRad(site.longitude)
  const seasonal = AXIAL_TILT * Math.sin((2 * Math.PI * hour) / (DRACONIC_HOURS * 12.37) + 0.8)
  return colatitude * Math.cos(hourAngle) + seasonal + site.horizonBoost
}

export function earthElevation(site: LandingSite, hour: number): number {
  const libration = LIBRATION_LON * Math.sin((2 * Math.PI * hour) / ANOMALISTIC_HOURS + toRad(site.longitude))
  return site.earthBias + libration * 0.55
}

export type EarthVisibility =
  | { visible: true; hoursUntilSet: number | null }
  | { visible: false; hoursUntilRise: number | null }

export function earthVisibility(site: LandingSite, hour: number): EarthVisibility {
  const visibleNow = earthElevation(site, hour) > 0
  const step = 0.25
  for (let h = step; h <= 30 * 24; h += step) {
    const visible = earthElevation(site, hour + h) > 0
    if (visible !== visibleNow) {
      return visibleNow ? { visible: true, hoursUntilSet: h } : { visible: false, hoursUntilRise: h }
    }
  }
  return visibleNow ? { visible: true, hoursUntilSet: null } : { visible: false, hoursUntilRise: null }
}

export type PowerStatus = 'Optimal' | 'Warning' | 'Critical'

export function powerPotential(elevation: number): { status: PowerStatus; percent: number } {
  const percent = Math.max(0, Math.min(100, Math.round(((elevation + 0.5) / 3) * 100)))
  if (elevation >= 1.2) return { status: 'Optimal', percent }
  if (elevation >= 0) return { status: 'Warning', percent }
  return { status: 'Critical', percent }
}

export function formatDuration(hours: number): string {
  const total = Math.round(hours * 60)
  const d = Math.floor(total / 1440)
  const h = Math.floor((total % 1440) / 60)
  const m = total % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  return `${h}h ${m.toString().padStart(2, '0')}m`
}

export function formatUtc(hour: number): { date: string; time: string } {
  const d = new Date(TIMELINE_START + hour * 3600 * 1000)
  return {
    date: d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}
