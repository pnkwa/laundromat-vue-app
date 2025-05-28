<script setup lang="ts">
import CountdownLabel from '@/components/base/CountdownLabel.vue'
import { useCountdownWashing } from '@/composible/useCountdownWashing'
import { laundromatMode, type WashingModeKey } from '@/types/washing-machine-types'
import { DotLottieVue, type DotLottieVueInstance } from '@lottiefiles/dotlottie-vue'
import { ref, computed, onMounted, useTemplateRef } from 'vue'

const countdown = useCountdownWashing({
  onComplete: () => {
    player.value?.getDotLottieInstance()?.stop()
  },
})
const player = useTemplateRef<DotLottieVueInstance>('player')
const selectedMode = ref<WashingModeKey>('NORMAL')

const startButtonLabel = computed(() => {
  return countdown.remaining.value > 0 && !countdown.isRunning ? 'Resume' : 'Start'
})

const handleStartOrResume = () => {
  if (countdown.remaining.value > 0 && !countdown.isRunning) {
    countdown.resumeCountdown()
    player.value?.getDotLottieInstance()?.play()
  } else {
    const config = laundromatMode[selectedMode.value].timeCount
    countdown.begin(config)
    player.value?.getDotLottieInstance()?.play()
  }
}

const pause = () => {
  countdown.pauseCountdown()
  player.value?.getDotLottieInstance()?.pause()
}

onMounted(() => {
  const dotLottie = player.value?.getDotLottieInstance()
  dotLottie?.addEventListener('play', () => console.log('Lottie playing'))
  dotLottie?.addEventListener('pause', () => console.log('Lottie paused'))
  dotLottie?.addEventListener('stop', () => console.log('Lottie stopped'))
  dotLottie?.addEventListener('complete', () => console.log('Lottie complete'))
})
</script>

<template>
  <div class="about">
    <DotLottieVue
      ref="player"
      src="https://lottie.host/204dcf22-0e95-445d-adc8-9473c7457df9/qFuHLw1SAD.lottie"
      loop
      style="height: 500px; width: 500px"
    />

    <CountdownLabel
      :hours="countdown.timeLeft.value.hours"
      :minutes="countdown.timeLeft.value.minutes"
      :seconds="countdown.timeLeft.value.seconds"
    />

    <div class="btn-group">
      <button @click="handleStartOrResume" :disabled="countdown.isRunning.value">
        {{ startButtonLabel }}
      </button>
      <button @click="pause" :disabled="!countdown.isRunning.value">Pause</button>
    </div>

    <div class="mode-select flex gap-4 mt-4">
      <button @click="selectedMode = 'NORMAL'" :disabled="countdown.isRunning.value">Normal</button>
      <button @click="selectedMode = 'HEAVY_DUTY'" :disabled="countdown.isRunning.value">
        Heavy
      </button>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
}
.btn-group button,
.mode-select button {
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
