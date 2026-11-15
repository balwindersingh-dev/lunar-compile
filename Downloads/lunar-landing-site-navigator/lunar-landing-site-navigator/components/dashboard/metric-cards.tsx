import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, BatteryCharging, CheckCircle2, Earth, Sun, XOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type EarthVisibility, type PowerStatus, formatDuration } from '@/lib/lunar'

function MetricCard({
  title,
  icon: Icon,
  children,
  footer,
}: {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className="glow flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border pt-3 text-xs text-muted-foreground">{footer}</footer>
    </article>
  )
}

export function SolarElevationCard({ elevation }: { elevation: number }) {
  const position = Math.max(0, Math.min(100, ((elevation + 3) / 7) * 100))
  return (
    <MetricCard
      title="Solar Elevation Angle"
      icon={Sun}
      footer={elevation > 0 ? 'Sun above local horizon' : 'Sun below local horizon'}
    >
      <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
        {elevation.toFixed(2)}
        <span className="ml-1 text-xl text-primary">°</span>
      </p>
      <div className="mt-4" aria-hidden="true">
        <div className="relative h-1.5 rounded-full bg-muted">
          <div className="absolute top-0 left-[42.8%] h-full w-px bg-foreground/50" />
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
            style={{ left: `${position}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>-3°</span>
          <span>0°</span>
          <span>+4°</span>
        </div>
      </div>
    </MetricCard>
  )
}

export function EarthsetCard({ visibility }: { visibility: EarthVisibility }) {
  const hours = visibility.visible ? visibility.hoursUntilSet : visibility.hoursUntilRise
  return (
    <MetricCard
      title="Time to Earthset"
      icon={Earth}
      footer={
        <span className="flex items-center gap-2">
          <span
            className={cn('size-2 rounded-full', visibility.visible ? 'bg-success' : 'bg-destructive')}
            aria-hidden="true"
          />
          {visibility.visible ? 'Earth in view · comms link active' : 'Earth below horizon · relay required'}
        </span>
      }
    >
      {visibility.visible ? (
        <p className="font-mono text-4xl font-semibold tracking-tight text-foreground">
          {hours === null ? 'Continuous' : formatDuration(hours)}
        </p>
      ) : (
        <div>
          <p className="font-mono text-4xl font-semibold tracking-tight text-muted-foreground">--</p>
          <p className="mt-1 text-sm text-foreground">
            Earthrise in <span className="font-mono text-primary">{hours === null ? 'N/A' : formatDuration(hours)}</span>
          </p>
        </div>
      )}
    </MetricCard>
  )
}

const POWER_STYLES: Record<PowerStatus, { icon: LucideIcon; text: string; bg: string; bar: string; note: string }> = {
  Optimal: {
    icon: CheckCircle2,
    text: 'text-success',
    bg: 'bg-success/10 border-success/40',
    bar: 'bg-success',
    note: 'Arrays at full output',
  },
  Warning: {
    icon: AlertTriangle,
    text: 'text-warning',
    bg: 'bg-warning/10 border-warning/40',
    bar: 'bg-warning',
    note: 'Grazing sunlight · reduced output',
  },
  Critical: {
    icon: XOctagon,
    text: 'text-destructive',
    bg: 'bg-destructive/10 border-destructive/40',
    bar: 'bg-destructive',
    note: 'No direct sunlight · battery only',
  },
}

export function PowerCard({ status, percent }: { status: PowerStatus; percent: number }) {
  const style = POWER_STYLES[status]
  const StatusIcon = style.icon
  return (
    <MetricCard title="Power Generation Potential" icon={BatteryCharging} footer={style.note}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold', style.bg, style.text)}
        >
          <StatusIcon className="size-4" aria-hidden="true" />
          {status}
        </span>
        <span className="font-mono text-2xl font-semibold text-foreground">{percent}%</span>
      </div>
      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-label="Power generation potential"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className={cn('h-full rounded-full transition-all', style.bar)} style={{ width: `${percent}%` }} />
      </div>
    </MetricCard>
  )
}
