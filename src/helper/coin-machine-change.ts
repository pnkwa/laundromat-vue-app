export interface CoinChangeResult {
  coins: Record<number, number>
  total: number
}

export const coinMachineChange = (
  availableCoins: Record<number, number>,
  amount: number,
): CoinChangeResult => {
  const coinChangeResult: Record<number, number> = {}
  const sortedCoins = Object.keys(availableCoins)
    .map(Number)
    .sort((a, b) => b - a)

  let remaining = amount
  let total = 0

  for (const coin of sortedCoins) {
    let count = 0
    while (availableCoins[coin] > 0 && remaining >= coin) {
      availableCoins[coin]--
      remaining -= coin
      count++
      total += coin
    }
    if (count > 0) coinChangeResult[coin] = count
  }

  return { coins: coinChangeResult, total }
}
