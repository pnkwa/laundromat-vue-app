import { type CoinWallet, defaultCoinWallet, type MyCoinWalletType } from '@/types/coin-types'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useMyCoinStore = defineStore('myCoin', () => {
  const wallet = useLocalStorage<CoinWallet>('my-coin', defaultCoinWallet)

  const totalCoins = computed(() =>
    Object.values(wallet.value ?? {}).reduce((sum, count) => sum + count, 0),
  )

  const myWallet = () =>
    ({
      wallet: wallet.value,
      totalCoins: totalCoins.value,
    }) as MyCoinWalletType

  function addCoinToWallet(type: keyof CoinWallet, amount = 1) {
    wallet.value[type] += amount
  }

  function removeCoinFromWallet(type: keyof CoinWallet, amount = 1) {
    if (wallet.value[type] >= amount) wallet.value[type] -= amount
  }

  function resetWallet() {
    Object.assign(wallet.value, defaultCoinWallet)
  }

  return {
    wallet,
    totalCoins,
    myWallet,
    addCoinToWallet,
    removeCoinFromWallet,
    resetWallet,
  }
})
