<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import CountdownLabel from '@/components/base/CountdownLabel.vue'
import WaveAnimation from '@/components/WaveAnimation.vue'
import { useCountdownWashing } from '@/composable/use-countdown-washing'
import { timeConfigToSeconds } from '@/helper/time'
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

const showWave = computed(() => countdown.isRunning.value && !isPaused.value)

function handleStart() {
  if (coinMachineStore.insertedCoinsTotal < modePrice.value) return

  const duration = laundromatMode[selectedMode.value].timeCount
  countdown.begin(duration)
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
})

const progress = computed(() => {
  const total = timeConfigToSeconds(laundromatMode[selectedMode.value].timeCount)
  const remaining = countdown.remaining.value
  const elapsed = total - remaining
  return total > 0 ? (elapsed / total) * 100 : 0
})
</script>

<template>
  <div class="laundromat-view">
    <WaveAnimation :isActive="showWave" />
    <div class="machine-content">
      <div class="left-sec">
        <div class="btn-group">
          <button
            @click="showModal = true"
            class="btn"
            :disabled="countdown.isRunning.value || isPaused"
          >
            Power On
          </button>
          <button
            @click="pauseOrResume"
            :disabled="countdown.remaining.value === 0"
            class="btn secondary"
          >
            {{ pauseOrResumeLabel }}
          </button>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fg" :style="{ width: progress + '%' }"></div>
        </div>

        <CountdownLabel
          :hours="countdown.timeLeft.value.hours"
          :minutes="countdown.timeLeft.value.minutes"
          :seconds="countdown.timeLeft.value.seconds"
        />

        <div class="mode-select">
          <button
            v-for="mode in [NORMAL, HEAVY_DUTY]"
            :key="mode"
            @click="selectedMode = mode"
            :class="{ active: selectedMode === mode }"
            :disabled="countdown.isRunning.value || isPaused"
            class="btn"
          >
            <span v-if="mode === NORMAL"> Normal</span>
            <span v-else-if="mode === HEAVY_DUTY">Heavy</span>
          </button>
        </div>
      </div>
      <div class="right-sec">
        <DotLottieVue
          ref="player"
          src="https://lottie.host/204dcf22-0e95-445d-adc8-9473c7457df9/qFuHLw1SAD.lottie"
          loop
          class="washing-animation"
        />
      </div>
    </div>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="machine-info">
          <div class="mode-info">
            <span class="mode-label">Selected Mode:</span>
            <span class="mode-value">{{ selectedModeObj.label }}</span>
          </div>
          <div class="price-info">
            <span class="price-label">Price:</span>
            <span class="price-value">{{ modePrice }} coins</span>
          </div>
        </div>

        <CoinMachine :price="modePrice" />

        <div class="action-section">
          <button
            @click="handleStart"
            :disabled="coinMachineStore.insertedCoinsTotal < modePrice"
            class="start-btn"
          >
            <span>Start Washing</span>
          </button>
        </div>
      </div>
    </div>

    <BaseModal
      v-if="showModal === false && hasStarted"
      v-model:isOpen="showChangeModal"
      header="Change Returned"
      class="modal"
    >
      <div class="change-modal-content">
        <div class="change-header">
          <span class="change-icon">💰</span>
          <h3 class="change-title">Your Change</h3>
        </div>

        <div class="change-list">
          <div v-for="(count, coin) in coinMachineStore.changeList" :key="coin" class="change-item">
            <span class="coin-type">{{ coinMappingKey[coin] }}</span>
            <span class="coin-count">x{{ count }}</span>
          </div>
        </div>

        <div class="total-change">
          <span class="total-label">Total Change:</span>
          <span class="total-value">{{ coinMachineStore.totalChange }} coins</span>
        </div>

        <button @click="handleChangeModalClose" class="close-btn">Got it!</button>
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
  min-height: $min-height;
  justify-content: center;
  padding: 2rem;
  background: $laundry-bg-gradient;
  font-family: $font-main;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .machine-content {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 4rem;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;

    @media (max-width: 1024px) {
      gap: 2rem;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }

    .right-sec {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      @media (max-width: 768px) {
        width: 100%;
        max-width: 400px;
      }

      .washing-animation {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        max-width: 500px;
        max-height: 500px;

        @media (max-width: 1024px) {
          max-width: 450px;
          max-height: 450px;
        }

        @media (max-width: 768px) {
          max-width: 350px;
          max-height: 350px;
        }

        @media (max-width: 480px) {
          max-width: 280px;
          max-height: 280px;
        }
      }
    }

    .left-sec {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
      min-width: 340px;
      align-items: center;

      @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        padding: 1rem;
        gap: 1.5rem;
      }

      .progress-bar-bg {
        width: 100%;
        height: 8px;
        background: $progress-bg;
        border-radius: 4px;
        overflow: hidden;

        .progress-bar-fg {
          height: 100%;
          background: $btn-gradient-primary;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }

      .btn-group {
        display: flex;
        gap: 1rem;
        width: 100%;
        justify-content: center;

        @media (max-width: 480px) {
          flex-direction: column;
        }
      }

      .mode-select {
        display: flex;
        gap: 1rem;
        width: 100%;
        justify-content: center;

        @media (max-width: 480px) {
          flex-direction: column;
        }

        .btn {
          font-size: 1rem;
          background: #f6faff;
          color: #888;
          border: 2px solid #e0e7ef;
          transition:
            background 0.2s,
            color 0.2s,
            border 0.2s;

          @media (max-width: 480px) {
            width: 100%;
          }

          &.active {
            background: $btn-gradient-active;
            color: #0078d4;
            border: 2px solid #a1c4fd;
            box-shadow: 0 2px 8px rgba(161, 196, 253, 0.18);
          }
        }
      }
    }
  }

  .btn {
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

    @media (max-width: 480px) {
      width: 100%;
      padding: 0.8rem;
      font-size: 1rem;
    }

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
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: linear-gradient(90deg, #8ab4f8 0%, #b0e0f8 100%);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    &:disabled {
      background: #eee;
      color: #aaa;
      cursor: not-allowed;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2rem;
  z-index: 1000;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: center;
  }
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  height: 90dvh;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    border-radius: 0.25rem;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      color: #333;
    }
  }

  .machine-info {
    background: #f8f9fa;
    border-radius: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
    background: white;

    @media (max-width: 480px) {
      padding: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .mode-info,
    .price-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .mode-label,
      .price-label {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .mode-value,
      .price-value {
        font-weight: 600;
        color: #1f2937;
        font-size: 0.9rem;
      }

      .price-value {
        color: #0078d4;
      }
    }
  }

  .action-section {
    margin-top: auto;
    padding: 1rem;
    position: sticky;
    bottom: 0;
    z-index: 1;
    background: white;
    border-top: 1px solid #e5e7eb;
  }
}

.change-modal-content {
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .change-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    position: sticky;
    top: 0;
    background: white;
    padding-bottom: 0.5rem;
    z-index: 1;

    .change-icon {
      font-size: 1.25rem;
    }

    .change-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .change-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .change-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.75rem;
      background: #f3f4f6;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      font-weight: 500;

      .coin-type {
        color: #4b5563;
      }

      .coin-count {
        color: #0078d4;
        font-weight: 600;
      }
    }
  }

  .total-change {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #e5f6ff;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    position: sticky;
    bottom: 0;
    background: #e5f6ff;
    z-index: 1;
  }

  .close-btn {
    width: 100%;
    padding: 0.75rem;
    background: #0078d4;
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: sticky;
    bottom: 0;
    background: #0078d4;
    z-index: 1;

    &:hover {
      background: #005a9e;
    }
  }
}

@media (max-width: 480px) {
  .modal-content,
  .change-modal-content {
    padding: 0.75rem;
    max-height: calc(100vh - 150px);
  }

  .machine-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start !important;
  }

  .change-list {
    .change-item {
      font-size: 0.85rem;
      padding: 0.5rem 0.6rem;
    }
  }
}
</style>
