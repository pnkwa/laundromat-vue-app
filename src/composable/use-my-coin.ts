import { useLocalStorage } from '@vueuse/core'
import { coin, type CoinKey, type CoinWallet } from '@/types/coin-types'
import { defaultCoinWallet } from '@/types/coin-types'
import { computed } from 'vue'

export const useMyCoinWallet = () => {
  const myCoin = useLocalStorage<CoinWallet>('my-coin', defaultCoinWallet)

  const valueToCoinKeyMap = computed(() =>
    Object.entries(coin).reduce(
      (map, [key, value]) => {
        map[value as number] = key as CoinKey
        return map
      },
      {} as Record<number, CoinKey>,
    ),
  )

  const addCoinsWallet = (coinList: number[]) => {
    for (const value of coinList) {
      const coinKey = valueToCoinKeyMap.value[value]
      if (coinKey) {
        myCoin.value[coinKey]++
      }
    }
  }

  const useCoinsWallet = (coinList: number[]) => {
    for (const value of coinList) {
      const coinKey = valueToCoinKeyMap.value[value]
      if (coinKey && myCoin.value[coinKey] > 0) {
        myCoin.value[coinKey]--
      }
    }
  }

  const totalMyCoins = computed(() => Object.values(myCoin.value).reduce((sum, n) => sum + n, 0))

  return {
    myCoin,
    addCoinsWallet,
    useCoinsWallet,
    totalMyCoins,
  }
}
