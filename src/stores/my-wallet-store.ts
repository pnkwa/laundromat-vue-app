import { type CoinWallet, defaultCoinWallet, type MyCoinWalletType } from '@/types/coin-types'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useMyCoinStore = defineStore('myCoin', () => {
  const wallet = useLocalStorage<CoinWallet>('my-coin', defaultCoinWallet)

  // Faris comment: totalCoins is a function that calculates the total number of coins in the wallet computed
  const totalCoins = () => Object.values(wallet.value).reduce((sum, count) => sum + count, 0)

  const myWallet = () =>
    ({
      wallet: wallet.value,
      totalCoins: totalCoins(),
    }) as MyCoinWalletType

  function addCoin(type: keyof CoinWallet, amount = 1) {
    wallet.value[type] += amount
  }

  function removeCoin(type: keyof CoinWallet, amount = 1) {
    if (wallet.value[type] >= amount) wallet.value[type] -= amount
  }

  function resetWallet() {
    // Faris comment: reset the wallet to default values use ref.value
    Object.assign(wallet.value, defaultCoinWallet)
  }

  return {
    wallet,
    totalCoins,
    myWallet,
    addCoin,
    removeCoin,
    resetWallet,
  }
})
