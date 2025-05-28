import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCountdown } from '@vueuse/core'
import type { TimeConfig } from '@/types/dateFormat'

const timeConfigToSeconds = (t: TimeConfig) => t.hours * 3600 + t.minutes * 60 + t.seconds
const secondsToTimeConfig = (total: number): TimeConfig => ({
  hours: Math.floor(total / 3600),
  minutes: Math.floor((total % 3600) / 60),
  seconds: total % 60,
})

export const useCountdownStore = defineStore('countdown', () => {
  const initial = ref(0)
  const { remaining, isActive, start, pause, resume, reset } = useCountdown(initial)
  const onComplete = ref<() => void>()
  const onTick = ref<(time: TimeConfig) => void>()

  const timeLeft = computed(() => secondsToTimeConfig(remaining.value))

  watch(remaining, (time) => {
    onTick.value?.(secondsToTimeConfig(time))
    if (time === 0 && !isActive.value) onComplete.value?.()
  })

  const begin = (
    config: TimeConfig,
    options?: { onComplete?: () => void; onTick?: (time: TimeConfig) => void },
  ) => {
    initial.value = timeConfigToSeconds(config)
    onComplete.value = options?.onComplete
    onTick.value = options?.onTick
    start()
  }

  return {
    remaining,
    timeLeft,
    isRunning: isActive,
    begin,
    pauseCountdown: pause,
    resumeCountdown: resume,
    resetCountdown: reset,
  }
})
