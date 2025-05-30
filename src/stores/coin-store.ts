import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCoinChange } from '@/composible/useCoinChange'
import { coin } from '@/types/coin-types'

export const useCoinStore = defineStore('coin', () => {
  const insertedCoins = ref<number[]>([])
  const total = ref(0)
  const changeCoins = ref<number[]>([])

  const insertCoin = (value: number) => {
    insertedCoins.value.push(value)
    total.value += value
  }

  const reset = () => {
    insertedCoins.value = []
    total.value = 0
    changeCoins.value = []
  }

  const calculateChange = (price: number) => {
    if (total.value >= price) {
      const change = total.value - price
      changeCoins.value = useCoinChange(Object.values(coin), change)
    } else {
      changeCoins.value = []
    }
  }

  return {
    insertedCoins,
    total,
    changeCoins,
    insertCoin,
    reset,
    calculateChange,
  }
})
