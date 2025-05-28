import type { TimeConfig } from './dateFormat'

export const NORMAL = 'NORMAL'
export const HEAVY_DUTY = 'HEAVY_DUTY'
export const washingMode = [NORMAL, HEAVY_DUTY] as const
export type WashingModeKey = (typeof washingMode)[number]

export type LaundromatOption = {
  type: WashingModeKey
  price: number
  timeCount: TimeConfig
}

export const laundromatMode: Record<WashingModeKey, LaundromatOption> = {
  [NORMAL]: {
    type: NORMAL,
    price: 20,
    timeCount: { hours: 0, minutes: 0, seconds: 5 },
  },
  [HEAVY_DUTY]: {
    type: HEAVY_DUTY,
    price: 40,
    timeCount: { hours: 0, minutes: 4, seconds: 0 },
  },
}
