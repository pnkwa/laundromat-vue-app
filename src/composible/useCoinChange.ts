export const useCoinChange = (coins: number[], amount: number): number[] => {
  const minCoinAmount = Array(amount + 1).fill(Infinity)
  const lastCoinUsedAmount = Array(amount + 1).fill(-1)
  minCoinAmount[0] = 0

  for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
    for (const coin of coins) {
      if (currentAmount >= coin) {
        const remaining = currentAmount - coin
        if (minCoinAmount[remaining] + 1 < minCoinAmount[currentAmount]) {
          minCoinAmount[currentAmount] = minCoinAmount[remaining] + 1
          lastCoinUsedAmount[currentAmount] = coin
        }
      }
    }
  }

  const result: number[] = []
  let current = amount
  while (current > 0 && lastCoinUsedAmount[current] !== -1) {
    const coin = lastCoinUsedAmount[current]
    result.push(coin)
    current -= coin
  }

  return minCoinAmount[amount] === Infinity ? [] : result
}
