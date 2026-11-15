'use client'

import { MapPin, Orbit, Satellite } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LandingSite } from '@/lib/lunar'

type SiteSidebarProps = {
  sites: LandingSite[]
  selectedId: string
  onSelect: (id: string) => void
}

export function SiteSidebar({ sites, selectedId, onSelect }: SiteSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6 border-b border-sidebar-border bg-sidebar p-5 lg:sticky lg:top-0 lg:h-dvh lg:w-80 lg:shrink-0 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3">
        <div className="glow flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Orbit className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-foreground">Lunar Landing</p>
          <p className="text-xs text-muted-foreground">Site Navigator</p>
        </div>
      </div>

      <nav aria-label="Landing sites" className="flex flex-col gap-3">
        <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          South Pole Sites
        </h2>
        <ul role="radiogroup" aria-label="Select a landing site" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {sites.map((site) => {
            const active = site.id === selectedId
            return (
              <li key={site.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSelect(site.id)}
                  className={cn(
                    'flex w-56 items-start gap-3 rounded-lg border p-3 text-left transition-colors lg:w-full',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active
                      ? 'glow border-primary/60 bg-sidebar-accent'
                      : 'border-transparent hover:border-sidebar-border hover:bg-sidebar-accent/50',
                  )}
                >
                  <MapPin
                    className={cn('mt-0.5 size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{site.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}°
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto hidden rounded-lg border border-sidebar-border bg-background/40 p-4 lg:block">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Satellite className="size-4" aria-hidden="true" />
          Mission Link
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Values are generated from a simplified illumination and libration model for planning demos.
        </p>
      </div>
    </aside>
  )
}
