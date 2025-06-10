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
import { coinMappingKey } from '@/types/coin-types'

const showModal = ref(false)
const showChangeModal = ref(false)
const hasStarted = ref(false)
const selectedMode = ref<WashingModeKey>(NORMAL)
const player = ref<DotLottieVueInstance | undefined>(undefined)
const isPaused = ref(false)

const coinMachineStore = useCoinMachineStore()
const countdown = useCountdownWashing({
  onComplete: () => {
    player.value?.getDotLottieInstance()?.stop()
  },
})

const pauseOrResumeLabel = computed(() =>
  countdown.isRunning.value ? 'Pause' : countdown.remaining.value > 0 ? 'Resume' : 'Pause',
)
const modePrice = computed(() => laundromatMode[selectedMode.value].price)
const selectedModeObj = computed(() => laundromatMode[selectedMode.value])

function handleStart() {
  countdown.begin(laundromatMode[selectedMode.value].timeCount)
  player.value?.getDotLottieInstance()?.play()
  hasStarted.value = true

  showModal.value = false
  coinMachineStore.completeTransaction()

  if (Object.keys(coinMachineStore.changeList ?? {}).length > 0) {
    setTimeout(() => {
      showChangeModal.value = true
    }, 500)
  }
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

function handleChangeModalClose() {
  showChangeModal.value = false
  setTimeout(() => {
    coinMachineStore.reset()
  }, 300)
}

watch(selectedMode, () => {
  if (!countdown.isRunning.value) {
    player.value?.getDotLottieInstance()?.stop()
    hasStarted.value = false
  }
  console.log(showModal.value)
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

    <BaseModal
      v-if="showModal"
      v-model:isOpen="showModal"
      header="✨ Ready to Start?"
      class="cute-modal"
    >
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
          :disabled="coinMachineStore.canInsert"
          class="cute-btn mt-7 w-full text-[1.13rem] flex items-center justify-center gap-2.5"
        >
          <span>🧼</span>
          <span>Start Washing</span>
        </button>
      </div>
    </BaseModal>
    <BaseModal
      v-if="showModal === false && hasStarted"
      v-model:isOpen="showChangeModal"
      header="💰 Change Returned"
      class="cute-modal"
    >
      <div class="flex flex-col items-center gap-4 min-w-[220px]">
        <div class="text-lg text-green-700 font-bold mb-2">You received change:</div>
        <ul class="flex gap-2">
          <li
            v-for="(count, coin) in coinMachineStore.changeList"
            :key="coin"
            class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold shadow"
          >
            {{ coinMappingKey[coin] }} x{{ count }}
          </li>
        </ul>
        <div class="text-sm text-gray-600 mt-2">
          Total Change: <strong class="text-blue-600">{{ coinMachineStore.totalChange }}</strong>
        </div>
        <button @click="handleChangeModalClose" class="cute-btn mt-4 w-full">OK</button>
      </div>
    </BaseModal>
  </div>
</template>
<style lang="scss" scoped>
@use '/src//assets/globals' as *;

.laundromat-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
  padding: 2rem;
  background: $laundry-bg-gradient;
  font-family: $font-main;

  .machine-card {
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    padding: 2.5rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 340px;
    max-width: 95vw;

    .progress-bar-bg {
      width: 180px;
      height: 12px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      margin: 1rem 0 0.5rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      .progress-bar-fg {
        height: 100%;
        background: $btn-gradient-active;
        border-radius: 6px 0 0 6px;
        transition: width 0.4s cubic-bezier(0.4, 2, 0.6, 1);
      }
    }

    .btn-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .mode-select {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;

      .cute-btn {
        font-size: 1rem;
        background: #f6faff;
        color: #888;
        border: 2px solid #e0e7ef;
        transition:
          background 0.2s,
          color 0.2s,
          border 0.2s;

        &.active {
          background: $btn-gradient-active;
          color: #0078d4;
          border: 2px solid #a1c4fd;
          box-shadow: 0 2px 8px rgba(161, 196, 253, 0.18);
        }
      }
    }
  }

  .cute-btn {
    padding: 0.6rem 1.7rem;
    font-weight: 700;
    border: none;
    border-radius: 1.5rem;
    background: $btn-gradient-primary;
    color: #444;
    font-size: 1.1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.1s,
      box-shadow 0.2s;
    outline: none;

    &.secondary {
      background: $btn-gradient-secondary;
    }

    &:active {
      transform: scale(0.97);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .start-btn {
    margin-top: 1.5rem;
    width: 100%;
    padding: 0.9rem 0;
    font-size: 1.15rem;
    font-weight: bold;
    background: $btn-gradient-active;
    color: #fff;
    border: none;
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: background 0.2s;

    &:disabled {
      background: #eee;
      color: #aaa;
    }
  }
}
</style>
