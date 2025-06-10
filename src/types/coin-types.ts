export const coin = {
  PENNY: 1,
  NICKEL: 5,
  DIME: 10,
} as const

export type CoinKey = keyof typeof coin

export type CoinWallet = Record<CoinKey, number>

export const defaultCoinWallet: CoinWallet = {
  PENNY: 0,
  NICKEL: 0,
  DIME: 0,
}

export interface MyCoinWalletType {
  wallet: CoinWallet
  totalCoins: number
}

export const coinMappingKey: Record<number, CoinKey> = {
  1: 'PENNY',
  5: 'NICKEL',
  10: 'DIME',
}
