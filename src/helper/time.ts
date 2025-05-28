import type { TimeConfig } from '@/types/date-format'

export const timeConfigToSeconds = (time: TimeConfig) =>
  time.hours * 3600 + time.minutes * 60 + time.seconds

export const secondsToTimeConfig = (total: number): TimeConfig => ({
  hours: Math.floor(total / 3600),
  minutes: Math.floor((total % 3600) / 60),
  seconds: total % 60,
})
