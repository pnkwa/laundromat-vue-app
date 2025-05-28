import type { TimeConfig } from '@/types/dateFormat'

export const timeConfigToSeconds = (t: TimeConfig) => t.hours * 3600 + t.minutes * 60 + t.seconds
export const secondsToTimeConfig = (total: number): TimeConfig => ({
  hours: Math.floor(total / 3600),
  minutes: Math.floor((total % 3600) / 60),
  seconds: total % 60,
})
