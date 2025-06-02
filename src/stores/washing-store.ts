import {
  laundromatMode,
  type LaundromatOption,
  type WashingModeKey,
} from '@/types/washing-machine-types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Faris comment: remove file unused function
export const useWashingStore = defineStore('washing', () => {
  const selectedMode = ref<WashingModeKey>('NORMAL')
  const currentConfig = computed<LaundromatOption | undefined>(() => {
    return laundromatMode[selectedMode.value]
  })

  const selectType = (type: WashingModeKey) => {
    if (laundromatMode[type]) selectedMode.value = type
  }

  return {
    selectedMode,
    currentConfig,
    selectType,
    laundromatMode,
  }
})
