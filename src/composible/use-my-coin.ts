import { useLocalStorage } from '@vueuse/core'
import { coin, type CoinKey, type CoinWallet } from '@/types/coin-types'
import { defaultCoinWallet } from '@/types/coin-types'

export const useMyCoinWallet = () => {
  const myCoin = useLocalStorage<CoinWallet>('my-coin', defaultCoinWallet)

  // Faris comment: use computed
  const valueToCoinKeyMap = Object.entries(coin).reduce(
    (map, [key, value]) => {
      map[value as number] = key as CoinKey
      return map
    },
    {} as Record<number, CoinKey>,
  )

  // Faris comment: change naming function or parameter type
  const addCoinsWallet = (coinList: number[]) => {
    for (const value of coinList) {
      const coinKey = valueToCoinKeyMap[value]
      if (coinKey) {
        myCoin.value[coinKey]++
      }
    }
  }

  // Faris comment: change naming function or parameter type
  const useCoinsWallet = (coinList: number[]) => {
    for (const value of coinList) {
      const coinKey = valueToCoinKeyMap[value]
      if (coinKey && myCoin.value[coinKey] > 0) {
        myCoin.value[coinKey]--
      }
    }
  }

  return {
    myCoin,
    addCoinsWallet,
    useCoinsWallet,
  }
}
