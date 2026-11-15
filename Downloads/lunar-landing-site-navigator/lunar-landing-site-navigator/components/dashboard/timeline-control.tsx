'use client'

import { useEffect, useId } from 'react'
import { CalendarClock, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TIMELINE_HOURS, formatUtc } from '@/lib/lunar'

type TimelineControlProps = {
  hour: number
  onChange: (hour: number) => void
  playing: boolean
  onTogglePlay: () => void
}

const TICKS = [0, 7, 14, 21, 30]

export function TimelineControl({ hour, onChange, playing, onTogglePlay }: TimelineControlProps) {
  const sliderId = useId()
  const { date, time } = formatUtc(hour)
  const progress = (hour / TIMELINE_HOURS) * 100

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      onChange(-1)
    }, 80)
    return () => clearInterval(interval)
  }, [playing, onChange])

  const clamp = (h: number) => Math.max(0, Math.min(TIMELINE_HOURS, h))

  return (
    <section aria-labelledby={`${sliderId}-title`} className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarClock className="size-4 text-primary" aria-hidden="true" />
          <h2 id={`${sliderId}-title`} className="text-sm font-semibold text-foreground">
            Landing Window
          </h2>
        </div>
        <output htmlFor={sliderId} className="flex items-baseline gap-2 font-mono" aria-live="polite">
          <span className="text-sm text-muted-foreground">{date}</span>
          <span className="text-glow text-lg font-semibold text-primary">{time} UTC</span>
        </output>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(clamp(hour - 6))}
          aria-label="Back 6 hours"
          className="border-border bg-transparent"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor={sliderId} className="sr-only">
            Landing date and time
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={TIMELINE_HOURS}
            step={1}
            value={hour}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-valuetext={`${date} ${time} UTC`}
            className="timeline-range"
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
          <div aria-hidden="true" className="flex justify-between font-mono text-[10px] text-muted-foreground">
            {TICKS.map((day) => (
              <span key={day}>{formatUtc(day * 24).date.replace(/, \d{4}/, '')}</span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(clamp(hour + 6))}
          aria-label="Forward 6 hours"
          className="border-border bg-transparent"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause timeline' : 'Play timeline'}
          aria-pressed={playing}
          className="glow"
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </section>
  )
}
