import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCountdown } from '@vueuse/core'
import { secondsToTimeConfig, timeConfigToSeconds } from '@/helper/time'
import type { TimeConfig } from '@/types/date-format'

// Faris comment: move to composable useCountdown
export const useCountdownStore = defineStore('countdown', () => {
  const initialSecTime = ref(0)
  const { remaining, isActive, start, pause, resume, reset } = useCountdown(initialSecTime)
  const onComplete = ref<() => void>()

  const timeLeft = computed(() => secondsToTimeConfig(remaining.value))

  watch(remaining, (time) => {
    if (time === 0 && !isActive.value) onComplete.value?.()
  })

  const begin = (config: TimeConfig, options?: { onComplete?: () => void }) => {
    initialSecTime.value = timeConfigToSeconds(config)
    onComplete.value = options?.onComplete
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
