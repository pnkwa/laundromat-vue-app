export interface CoinChangeResult {
  coins: Record<number, number>
  total: number
}

export const coinMachineChange = (
  availableCoins: Record<number, number>,
  amount: number,
): CoinChangeResult => {
  console.log('availableCoins >>', availableCoins)

  const tempCoin = { ...availableCoins }
  const coinChangeResult: Record<number, number> = {}
  const sortedCoins = Object.keys(tempCoin)
    .map(Number)
    .sort((a, b) => b - a)

  let remaining = amount
  let total = 0

  console.log('sortedCoins >>', sortedCoins)

  for (const coin of sortedCoins) {
    let count = 0
    while (tempCoin[coin] > 0 && remaining >= coin) {
      tempCoin[coin]--
      remaining -= coin
      count++
      total += coin
    }
    if (count > 0) coinChangeResult[coin] = count
  }

  return { coins: tempCoin, total }
}
