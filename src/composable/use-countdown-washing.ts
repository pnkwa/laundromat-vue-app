import { ref, computed } from 'vue'
import { useCountdown } from '@vueuse/core'
import { secondsToTimeConfig, timeConfigToSeconds } from '@/helper/time'
import type { TimeConfig } from '@/types/date-format'

export const useCountdownWashing = ({ onComplete: onFinish = () => {} }) => {
  const initialSec = ref(0)
  const { remaining, isActive, start, pause, resume, reset } = useCountdown(initialSec, {
    onComplete: () => {
      onFinish()
    },
  })

  const timeLeft = computed(() => secondsToTimeConfig(remaining.value))

  const begin = (config: TimeConfig) => {
    initialSec.value = timeConfigToSeconds(config)
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
}
