'use client'

import { useCallback, useMemo, useState } from 'react'
import { Radio } from 'lucide-react'
import {
  LANDING_SITES,
  TIMELINE_HOURS,
  earthVisibility,
  powerPotential,
  solarElevation,
} from '@/lib/lunar'
import { SiteSidebar } from './site-sidebar'
import { SurfaceMap } from './surface-map'
import { TimelineControl } from './timeline-control'
import { EarthsetCard, PowerCard, SolarElevationCard } from './metric-cards'

export function Dashboard() {
  const [siteId, setSiteId] = useState(LANDING_SITES[0].id)
  const [hour, setHour] = useState(96)
  const [playing, setPlaying] = useState(false)

  const site = LANDING_SITES.find((s) => s.id === siteId) ?? LANDING_SITES[0]

  const handleHourChange = useCallback((next: number) => {
    if (next === -1) {
      setHour((h) => (h >= TIMELINE_HOURS ? 0 : h + 1))
    } else {
      setHour(next)
    }
  }, [])

  const metrics = useMemo(() => {
    const elevation = solarElevation(site, hour)
    return {
      elevation,
      visibility: earthVisibility(site, hour),
      power: powerPotential(elevation),
    }
  }, [site, hour])

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <SiteSidebar sites={LANDING_SITES} selectedId={siteId} onSelect={setSiteId} />

      <main className="flex flex-1 flex-col gap-5 p-5 lg:p-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase">NASA Space Apps · Artemis</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground text-balance md:text-3xl">
              {site.name}
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Radio className="size-3.5" aria-hidden="true" />
            Simulation Live
          </span>
        </header>

        <SurfaceMap site={site} solarElevation={metrics.elevation} />

        <TimelineControl
          hour={hour}
          onChange={handleHourChange}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SolarElevationCard elevation={metrics.elevation} />
          <EarthsetCard visibility={metrics.visibility} />
          <PowerCard status={metrics.power.status} percent={metrics.power.percent} />
        </div>
      </main>
    </div>
  )
}
