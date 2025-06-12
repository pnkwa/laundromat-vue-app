export function coinMachineChange(
  coins: number[],
  change: number,
): Record<number, number> | undefined {
  const sortedCoins = [...new Set(coins)].sort((a, b) => b - a)
  const result: Record<number, number> = {}

  for (const coin of sortedCoins) {
    const count = Math.floor(change / coin)
    if (count > 0) {
      result[coin] = count
      change -= coin * count
    }
  }

  if (change === 0) {
    return result
  }
}
