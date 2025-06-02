import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { coinMachineChange } from '@/helper/coin-machine-change'

export const useCoinMachineStore = defineStore('coin', () => {
  const insertedCoins = ref<number[]>([])
  const total = ref(0)
  const changeCoins = ref<number[]>([])
  const totalChange = ref(0)
  const price = ref(0)
  const availableCoins = ref<number[]>([])

  const startTransaction = (targetPrice: number, coins: number[]) => {
    reset()
    price.value = targetPrice
    availableCoins.value = coins
  }

  const requiredAmount = computed(() => Math.max(price.value - total.value, 0))

  const canInsert = computed(() => total.value < price.value)

  const insertCoin = (value: number) => {
    if (!canInsert.value) return
    insertedCoins.value.push(value)
    total.value += value
  }

  const completeTransaction = () => {
    if (total.value < price.value) return false
    const change = total.value - price.value
    totalChange.value = change
    const changeList = coinMachineChange(availableCoins.value, change)
    if (changeList) {
      changeCoins.value = Object.entries(changeList).flatMap(([coin, count]) =>
        Array(Number(count)).fill(Number(coin)),
      )
    } else {
      changeCoins.value = []
    }
    setTimeout(reset, 1000)
    return true
  }

  const reset = () => {
    insertedCoins.value = []
    total.value = 0
    changeCoins.value = []
    totalChange.value = 0
    price.value = 0
    availableCoins.value = []
  }

  return {
    insertedCoins,
    total,
    changeCoins,
    totalChange,
    price,
    availableCoins,
    requiredAmount,
    canInsert,
    insertCoin,
    startTransaction,
    completeTransaction,
    reset,
  }
})
