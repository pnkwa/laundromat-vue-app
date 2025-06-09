import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { coinMachineChange } from '@/helper/coin-machine-change'

export const useCoinMachineStore = defineStore('coin', () => {
  const insertedCoins = ref<number[]>([])
  const insertedCoinsTotal = ref(0)
  const changeCoins = ref<number[]>([])
  const totalChange = ref(0)
  const price = ref(0)
  const availableCoins = ref<number[]>([])

  const startTransaction = (targetPrice: number, coins: number[]) => {
    reset()
    price.value = targetPrice
    availableCoins.value = coins
  }

  const requiredAmount = computed(() => Math.max(price.value - insertedCoinsTotal.value, 0))

  const canInsert = computed(() => insertedCoinsTotal.value < price.value)

  const insertCoin = (value: number) => {
    if (!canInsert.value) return
    insertedCoins.value.push(value)
    insertedCoinsTotal.value += value
  }

  const completeTransaction = () => {
    if (insertedCoinsTotal.value < price.value) return false
    const change = insertedCoinsTotal.value - price.value
    totalChange.value = change

    const changeList = coinMachineChange(toRaw(insertedCoins.value), change)
    if (changeList) {
      changeCoins.value = Object.entries(changeList).flatMap(([coin, count]) =>
        Array(Number(count)).fill(Number(coin)),
      )
    } else changeCoins.value = []

    setTimeout(reset, 1000)
    return changeList
  }

  const reset = () => {
    insertedCoins.value = []
    insertedCoinsTotal.value = 0
    changeCoins.value = []
    totalChange.value = 0
    price.value = 0
    availableCoins.value = []
  }

  return {
    insertedCoins,
    insertedCoinsTotal,
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
