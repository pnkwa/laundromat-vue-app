<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import CountdownLabel from '@/components/base/CountdownLabel.vue'
import { useCountdownWashing } from '@/composible/use-countdown-washing'
import { laundromatMode, type WashingModeKey } from '@/types/washing-machine-types'
import { DotLottieVue, type DotLottieVueInstance } from '@lottiefiles/dotlottie-vue'
import CoinMachine from '@/components/CoinMachine.vue'

const showModal = ref(false)
const hasStarted = ref(false)
// Faris comment: use constant Mode key
const selectedMode = ref<WashingModeKey>('NORMAL')
const player = ref<DotLottieVueInstance | null>(null)

const countdown = useCountdownWashing({
  onComplete: () => {
    player.value?.getDotLottieInstance()?.stop()
  },
})

const startButtonLabel = computed(() =>
  countdown.remaining.value > 0 && !countdown.isRunning.value ? 'Resume' : 'Power On',
)

const modePrice = computed(() => laundromatMode[selectedMode.value].price)

function handleStartOrResume() {
  if (countdown.remaining.value > 0 && !countdown.isRunning.value) {
    countdown.resumeCountdown()
  } else {
    countdown.begin(laundromatMode[selectedMode.value].timeCount)
  }
  player.value?.getDotLottieInstance()?.play()
  hasStarted.value = true
  showModal.value = false
}

function pause() {
  countdown.pauseCountdown()
  player.value?.getDotLottieInstance()?.pause()
}

watch(selectedMode, () => {
  if (!countdown.isRunning.value) {
    player.value?.getDotLottieInstance()?.stop()
  }
})

const progress = computed(() => {
  const total = Number(laundromatMode[selectedMode.value].timeCount)
  const remaining = Number(countdown.remaining.value)
  return total > 0 ? ((total - remaining) / total) * 100 : 0
})
</script>

<template>
  <div class="laundromat-view">
    <div class="machine-card">
      <DotLottieVue
        ref="player"
        src="https://lottie.host/204dcf22-0e95-445d-adc8-9473c7457df9/qFuHLw1SAD.lottie"
        loop
        style="height: 220px; width: 220px"
      />

      <div class="progress-bar-bg">
        <div class="progress-bar-fg" :style="{ width: progress + '%' }"></div>
      </div>

      <CountdownLabel
        :hours="countdown.timeLeft.value.hours"
        :minutes="countdown.timeLeft.value.minutes"
        :seconds="countdown.timeLeft.value.seconds"
        class="mt-4"
      />

      <div class="btn-group">
        <button @click="showModal = true" type="button" class="cute-btn">
          {{ startButtonLabel }}
        </button>
        <button @click="pause" :disabled="!countdown.isRunning.value" class="cute-btn secondary">
          Pause
        </button>
      </div>

      <div class="mode-select">
        <button
          @click="selectedMode = 'NORMAL'"
          :disabled="countdown.isRunning.value"
          :class="{ active: selectedMode === 'NORMAL' }"
          class="cute-btn"
        >
          🧺 Normal
        </button>
        <button
          @click="selectedMode = 'HEAVY_DUTY'"
          :disabled="countdown.isRunning.value"
          :class="{ active: selectedMode === 'HEAVY_DUTY' }"
          class="cute-btn"
        >
          💪 Heavy
        </button>
      </div>
    </div>

    <BaseModal v-model:isOpen="showModal" header="✨ Ready to Start?" class="cute-modal">
      <div class="modal-content" style="min-width: 320px">
        <!-- Faris comment: change to tailwind -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem">
          <CoinMachine :price="modePrice" />

          <div style="font-size: 1.15rem; color: #555; margin-bottom: 0.5rem">
            <span>Mode:</span>
            <strong style="margin-left: 0.5rem; color: #0078d4">
              {{ laundromatMode[selectedMode].label }}
            </strong>
          </div>
        </div>
        <button
          @click="handleStartOrResume"
          :disabled="countdown.isRunning.value"
          class="start-btn cute-btn"
          style="
            margin-top: 1.7rem;
            width: 100%;
            font-size: 1.13rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6em;
          "
        >
          <span style="font-size: 1.3em">🧼</span>
          <span>Start Washing</span>
        </button>
        <button
          @click="showModal = false"
          class="cute-btn secondary"
          style="margin-top: 0.8rem; width: 100%"
        >
          <span style="font-size: 1.1em">❌</span>
          <span>Cancel</span>
        </button>
      </div>
    </BaseModal>
  </div>
</template>
<!-- Faris comment: change to scss -->
<style scoped>
/* Faris comment: can move to global styles, move to local font folder src/assets/fonts */
/* tailwind config font */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

.laundromat-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8e1f4 0%, #e1f4f8 100%);
  font-family: 'Quicksand', sans-serif;
}

.machine-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 340px;
  max-width: 95vw;
}

.progress-bar-bg {
  width: 180px;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  margin: 1rem 0 0.5rem 0;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
}

.progress-bar-fg {
  height: 100%;
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 6px 0 0 6px;
  transition: width 0.4s cubic-bezier(0.4, 2, 0.6, 1);
}

.btn-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cute-btn {
  padding: 0.6rem 1.7rem;
  font-weight: 700;
  border: none;
  border-radius: 1.5rem;
  background: linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%);
  color: #444;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s,
    box-shadow 0.2s;
  outline: none;
}

.cute-btn.secondary {
  background: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
}

.cute-btn:active {
  transform: scale(0.97);
}

.cute-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mode-select {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.mode-select .cute-btn {
  font-size: 1rem;
  background: #f6faff;
  color: #888;
  border: 2px solid #e0e7ef;
  transition:
    background 0.2s,
    color 0.2s,
    border 0.2s;
}

.mode-select .cute-btn.active {
  background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%);
  color: #0078d4;
  border: 2px solid #a1c4fd;
  box-shadow: 0 2px 8px 0 rgba(161, 196, 253, 0.18);
}

.start-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.9rem 0;
  font-size: 1.15rem;
  font-weight: bold;
  background: linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%);
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  transition: background 0.2s;
}

.start-btn:disabled {
  background: #eee;
  color: #aaa;
}

/* Faris commit what is >>> */
/* .modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
} */

/* Faris comment: remove styled duplicate class from tailwind*/
.mt-4 {
  margin-top: 1.2rem;
}
</style>
