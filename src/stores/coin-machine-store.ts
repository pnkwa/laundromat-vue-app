import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { coinMachineChange } from '@/helper/coin-machine-change'
import { useMyCoinWallet } from './my-wallet-store'
import { coinMappingKey } from '@/types/coin-types'
export const useCoinMachineStore = defineStore('coin', () => {
  const insertedCoins = ref<number[]>([])
  const insertedCoinsTotal = ref(0)
  const changeCoins = ref<number[]>([])
  const totalChange = ref(0)
  const price = ref(0)
  const availableCoins = ref<number[]>([])
  const myCoinWallet = useMyCoinWallet()
  const startTransaction = (targetPrice: number, coins: number[]) => {
    reset()
    price.value = targetPrice
    availableCoins.value = coins
  }

  const requiredAmount = computed(() => Math.max(price.value - insertedCoinsTotal.value, 0))

  const canInsert = computed(() => insertedCoinsTotal.value < price.value)

  const changeList = computed(() => {
    return coinMachineChange(toRaw(insertedCoins.value), totalChange.value)
  })

  const insertCoin = (value: number) => {
    if (!canInsert.value) return
    insertedCoins.value.push(value)
    insertedCoinsTotal.value += value
  }

  const completeTransaction = () => {
    if (insertedCoinsTotal.value < price.value) return false
    totalChange.value = insertedCoinsTotal.value - price.value

    if (changeList.value) {
      for (const coin in changeList.value) {
        myCoinWallet.addCoinToWallet(coinMappingKey[coin], changeList.value[coin] * +coin)
      }
    }
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
    changeList,
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
