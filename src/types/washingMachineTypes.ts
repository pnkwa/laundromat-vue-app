import type { TimeConfig } from './dateFormat'

const washingMode = {
  NORMAL: 'NORMAL',
  HEAVY_DUTY: 'HEAVY_DUTY',
}

export type LaundromatOption = {
  type: WashingMode
  price: number
  timeCount: TimeConfig
}

export type WashingModeKey = keyof typeof washingMode
export type WashingMode = (typeof washingMode)[WashingModeKey]

export const laundromatMode: Record<WashingMode, LaundromatOption> = {
  [washingMode.NORMAL]: {
    type: washingMode.NORMAL,
    price: 20,
    timeCount: { hours: 0, minutes: 0, seconds: 5 },
  },
  [washingMode.HEAVY_DUTY]: {
    type: washingMode.HEAVY_DUTY,
    price: 40,
    timeCount: { hours: 0, minutes: 4, seconds: 0 },
  },
}
