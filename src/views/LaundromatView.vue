<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import CountdownLabel from '@/components/base/CountdownLabel.vue'
import { useCountdownWashing } from '@/composable/use-countdown-washing'
import {
  laundromatMode,
  NORMAL,
  HEAVY_DUTY,
  type WashingModeKey,
} from '@/types/washing-machine-types'
import { DotLottieVue, type DotLottieVueInstance } from '@lottiefiles/dotlottie-vue'
import CoinMachine from '@/components/CoinMachine.vue'
import { useCoinMachineStore } from '@/stores/coin-machine-store'

const showModal = ref(false)
const hasStarted = ref(false)
const selectedMode = ref<WashingModeKey>(NORMAL)
const player = ref<DotLottieVueInstance | undefined>(undefined)
const isPaused = ref(false)
const countdown = useCountdownWashing({
  onComplete: () => {
    player.value?.getDotLottieInstance()?.stop()
  },
})

const useCoinMachine = useCoinMachineStore()

const pauseOrResumeLabel = computed(() =>
  countdown.isRunning.value ? 'Pause' : countdown.remaining.value > 0 ? 'Resume' : 'Pause',
)
const modePrice = computed(() => laundromatMode[selectedMode.value].price)
const selectedModeObj = computed(() => laundromatMode[selectedMode.value])
const coinChange = computed(() => useCoinMachine.changeCoins)

function handleStart() {
  countdown.begin(laundromatMode[selectedMode.value].timeCount)
  player.value?.getDotLottieInstance()?.play()
  hasStarted.value = true
  showModal.value = false
  useCoinMachine.completeTransaction()
}

function pauseOrResume() {
  if (countdown.isRunning.value) {
    countdown.pauseCountdown()
    player.value?.getDotLottieInstance()?.pause()
    isPaused.value = true
  } else if (countdown.remaining.value > 0) {
    countdown.resumeCountdown()
    player.value?.getDotLottieInstance()?.play()
    isPaused.value = false
  }
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
      />

      <div class="btn-group">
        <button
          @click="showModal = true"
          class="cute-btn"
          :disabled="countdown.isRunning.value || isPaused"
        >
          Power On
        </button>
        <button
          @click="pauseOrResume"
          :disabled="countdown.remaining.value === 0"
          class="cute-btn secondary"
        >
          {{ pauseOrResumeLabel }}
        </button>
      </div>

      <div class="mode-select">
        <button
          v-for="mode in [NORMAL, HEAVY_DUTY]"
          :key="mode"
          @click="selectedMode = mode"
          :class="{ active: selectedMode === mode }"
          :disabled="countdown.isRunning.value || isPaused"
          class="cute-btn"
        >
          <span v-if="mode === NORMAL">🧺 Normal</span>
          <span v-else-if="mode === HEAVY_DUTY">💪 Heavy</span>
        </button>
      </div>
    </div>

    <BaseModal v-model:isOpen="showModal" header="✨ Ready to Start?" class="cute-modal">
      <div class="modal-content min-w-[320px]">
        <div class="flex flex-col items-center gap-4">
          <CoinMachine :price="modePrice" />

          <div class="text-[1.15rem] text-[#555] mb-2">
            <strong class="ml-2 text-[#0078d4]">
              {{ selectedModeObj.label }}
            </strong>
          </div>
        </div>
        <button
          @click="handleStart"
          :disabled="countdown.isRunning.value"
          class="cute-btn mt-7 w-full text-[1.13rem] flex items-center justify-center gap-2.5"
        >
          <span>🧼</span>
          <span>Start Washing</span>
        </button>
      </div>
    </BaseModal>
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-[#0078d4]">Change Returned:</h3>
      <ul class="list-disc ml-5 mt-2">
        <li v-for="(amount, idx) in coinChange" :key="idx">{{ amount }}</li>
      </ul>
    </div>
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
</style>
