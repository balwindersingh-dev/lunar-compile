import { Crosshair, Layers, Map as MapIcon } from 'lucide-react'
import type { LandingSite } from '@/lib/lunar'

export function SurfaceMap({ site, solarElevation }: { site: LandingSite; solarElevation: number }) {
  const sunAzimuth = ((site.longitude + 180) % 360).toFixed(1)

  return (
    <section
      aria-labelledby="map-title"
      className="relative flex min-h-80 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card lg:min-h-[28rem]"
    >
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <MapIcon className="size-4 text-primary" aria-hidden="true" />
          <h2 id="map-title" className="text-sm font-semibold text-foreground">
            Lunar Surface Map
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="size-3.5" aria-hidden="true" />
          <span>LOLA DEM · Placeholder</span>
        </div>
      </header>

      <div
        className="relative flex flex-1 items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(0.78 0.16 225 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.78 0.16 225 / 0.07) 1px, transparent 1px), radial-gradient(circle at 50% 50%, oklch(0.24 0.06 258) 0%, oklch(0.15 0.04 262) 70%)',
          backgroundSize: '40px 40px, 40px 40px, 100% 100%',
        }}
      >
        <div aria-hidden="true" className="absolute size-64 rounded-full border border-primary/15 sm:size-80" />
        <div aria-hidden="true" className="absolute size-40 rounded-full border border-primary/25 sm:size-52" />
        <div aria-hidden="true" className="absolute size-16 rounded-full border border-dashed border-primary/40" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="relative flex size-12 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/30" aria-hidden="true" />
            <span className="glow relative flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Crosshair className="size-6" aria-hidden="true" />
            </span>
          </span>
          <div>
            <p className="text-glow text-base font-semibold text-foreground">{site.name}</p>
            <p className="mt-1 max-w-xs px-4 text-xs leading-relaxed text-muted-foreground text-pretty">
              {site.description}
            </p>
          </div>
        </div>

        <dl className="absolute bottom-4 left-4 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-border bg-background/70 px-4 py-3 font-mono text-xs backdrop-blur">
          <dt className="text-muted-foreground">LAT</dt>
          <dd className="text-right text-foreground">{site.latitude.toFixed(2)}°</dd>
          <dt className="text-muted-foreground">LON</dt>
          <dd className="text-right text-foreground">{site.longitude.toFixed(2)}°</dd>
          <dt className="text-muted-foreground">ELEV</dt>
          <dd className="text-right text-foreground">{site.elevationKm.toFixed(1)} km</dd>
        </dl>

        <div className="absolute right-4 bottom-4 hidden rounded-lg border border-border bg-background/70 px-4 py-3 font-mono text-xs backdrop-blur sm:block">
          <p className="text-muted-foreground">SUN AZ / EL</p>
          <p className="mt-1 text-primary">
            {sunAzimuth}° / {solarElevation.toFixed(2)}°
          </p>
        </div>
      </div>
    </section>
  )
}
