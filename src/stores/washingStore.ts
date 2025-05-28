import { laundromatMode, type LaundromatOption } from '@/types/washingMachineTypes'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWashingStore = defineStore('washing', () => {
  const selectedType = ref<string>('NORMAL')
  const currentConfig = computed<LaundromatOption | undefined>(() => {
    return laundromatMode[selectedType.value]
  })

  const selectType = (type: string) => {
    if (laundromatMode[type]) selectedType.value = type
  }

  return {
    selectedType,
    currentConfig,
    selectType,
    laundromatMode,
  }
})
