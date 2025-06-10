import {
  coin,
  type CoinKey,
  type CoinWallet,
  defaultCoinWallet,
  type MyCoinWalletType,
} from '@/types/coin-types'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useMyCoinWallet = defineStore('myCoin', () => {
  const wallet = useStorage<CoinWallet>('my-coin', defaultCoinWallet)

  const totalCoins = computed(() =>
    Object.values(wallet.value ?? {}).reduce((sum, count) => sum + count, 0),
  )

  const numOfCoinWallet = computed(() => {
    const result: Record<keyof CoinWallet, number> = {} as CoinWallet
    const walletValue = wallet.value ?? defaultCoinWallet
    for (const key in walletValue) {
      const coinKey = key as CoinKey
      const coinTotal = walletValue[coinKey] ?? 0
      const coinValue = coin[coinKey]
      result[coinKey] = coinValue > 0 ? Math.floor(coinTotal / coinValue) : 0
    }
    return result
  })

  const myWallet = computed(
    () =>
      ({
        wallet: wallet.value,
        totalCoins: totalCoins.value,
      }) as MyCoinWalletType,
  )

  function addCoinToWallet(type: keyof CoinWallet, amount = 1) {
    wallet.value = {
      ...wallet.value,
      [type]: (wallet.value[type] ?? 0) + amount,
    }
  }

  function removeCoinFromWallet(type: keyof CoinWallet, amount = coin[type]) {
    if (wallet.value[type] && wallet.value[type] >= amount) {
      wallet.value = {
        ...wallet.value,
        [type]: wallet.value[type] - amount,
      }
    }
    return wallet.value[type] ?? 0
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
    numOfCoinWallet,
  }
})
