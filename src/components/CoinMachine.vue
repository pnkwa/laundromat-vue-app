<script lang="ts" setup>
// import { useCoinMachineStore } from '@/stores/coin-machine-store'
import { coinMachineChange } from '@/helper/coin-machine-change'
import { useMyCoinWallet } from '@/stores/my-wallet-store'
import { coin, coinMappingKey, type CoinKey } from '@/types/coin-types'
import { watch, ref, computed, toRaw } from 'vue'

const props = defineProps<{
  price: number
  selectedModeLabel: string
}>()

const myWallet = useMyCoinWallet()

const myCoin = ref({ ...myWallet.numOfCoinWallet })
const modePrice = ref(0)
const insertedCoins = ref<number[]>([])
const insertedCoinsTotal = ref(0)
const availableCoins = ref<number[]>([])
const totalChange = ref(0)

const requiredAmount = computed(() => Math.max(modePrice.value - insertedCoinsTotal.value, 0))
const canInsert = computed(() => insertedCoinsTotal.value < modePrice.value)
const changeList = computed(() => {
  return coinMachineChange(toRaw(insertedCoins.value), totalChange.value)
})

const emit = defineEmits<{
  (e: 'start', changelist: Record<number, number>): void
}>()

const insertCoin = (value: number) => {
  if (!canInsert.value) return
  insertedCoins.value.push(value)
  insertedCoinsTotal.value += value
}

const completeTransaction = () => {
  if (insertedCoinsTotal.value < modePrice.value) return false
  totalChange.value = insertedCoinsTotal.value - modePrice.value

  if (changeList.value) {
    for (const coin in changeList.value) {
      myWallet.addCoinToWallet(coinMappingKey[coin], changeList.value[coin] * +coin)
    }
    emit('start', changeList.value)
  }
}

const handleInsert = (coinKey: CoinKey) => {
  const coinValue = coin[coinKey]
  if (myCoin.value[coinKey] > 0 && canInsert.value) {
    insertCoin(coinValue)
    myCoin.value[coinKey]--
    myWallet.removeCoinFromWallet(coinKey, coinValue)
  }
}

const startTransaction = (targetPrice: number, coins: number[]) => {
  modePrice.value = targetPrice
  availableCoins.value = coins

  availableCoins.value = []
}

const groupedCoins = computed(() => {
  const result: Record<number, number> = {}
  insertedCoins.value.forEach((val) => {
    result[val] = (result[val] || 0) + 1
  })
  return result
})

watch(
  () => props.price,
  (newPrice) => {
    const available = [
      insertedCoins,
      ...Object.entries(myCoin.value).flatMap(([key, count]) =>
        Array(count).fill(coin[key as CoinKey]),
      ),
    ]
    startTransaction(newPrice, available)
  },
  { immediate: true },
)
</script>

<template>
  <div class="receipt-machine">
    <div class="machine-info">
      <div class="mode-info">
        <span class="mode-label">Selected Mode:</span>
        <span class="mode-value">{{ props.selectedModeLabel }}</span>
      </div>
      <div class="price-info">
        <span class="price-label">Price:</span>
        <span class="price-value">{{ modePrice }} coins</span>
      </div>
    </div>
    <div class="receipt-section">
      <div class="section-title">My Wallet</div>
      <div class="wallet-coins">
        <div v-for="(count, name) in myCoin" :key="name" class="coin-item">
          <span class="coin-name">{{ name }}</span>
          <span class="coin-count">{{ count }}</span>
        </div>
      </div>
      <div class="wallet-total">
        <span>Total Balance:</span>
        <span class="total-amount">{{ myWallet.totalCoins }}</span>
      </div>
    </div>

    <div class="receipt-section">
      <div class="section-title">Insert Coins</div>
      <div class="coin-buttons">
        <button
          v-for="(value, name) in coin"
          :key="name"
          @click="handleInsert(name as CoinKey)"
          :disabled="!canInsert || myCoin[name as CoinKey] <= 0"
          class="insert-btn"
        >
          <span class="coin-value">{{ value }}</span>
          <span class="coin-label">{{ name }}</span>
        </button>
      </div>
    </div>

    <div class="receipt-section">
      <div class="section-title">Transaction Details</div>
      <div class="transaction-info">
        <div class="info-row">
          <span>Inserted Total:</span>
          <span class="amount">{{ insertedCoinsTotal }}</span>
        </div>
        <div class="info-row">
          <span>Inserted Coins:</span>
          <span class="coins-list">
            <template v-if="Object.keys(groupedCoins).length">
              <span v-for="(count, value) in groupedCoins" :key="value">
                {{ value }} x{{ count }}&nbsp;
              </span>
            </template>
            <template v-else> None </template>
          </span>
        </div>
        <div class="info-row">
          <span>Required Amount:</span>
          <span class="required">{{ props.price }}</span>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button
        @click="completeTransaction()"
        :disabled="insertedCoinsTotal < modePrice"
        class="start-btn"
      >
        <span>Start Washing</span>
      </button>
    </div>

    <div v-if="requiredAmount > 0" class="receipt-footer">
      <div class="warning-message">Please insert more coins to continue</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.receipt-machine {
  background: #fff;
  border-radius: 1rem;

  overflow: hidden;
  font-family: 'Baloo 2', cursive;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  .receipt-section {
    padding: 0.75rem;
    border-bottom: 1px dashed #e5e7eb;

    &:first-child {
      border-top: none;
    }

    .section-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 0.5rem;
    }

    .wallet-coins {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.4rem;
      margin-bottom: 0.5rem;

      .coin-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.35rem 0.5rem;
        background: #f3f4f6;
        border-radius: 0.5rem;
        font-size: 0.75rem;

        .coin-name {
          color: #4b5563;
        }

        .coin-count {
          font-weight: 600;
          color: #0078d4;
        }
      }
    }

    .wallet-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: #e5f6ff;
      border-radius: 0.5rem;
      font-size: 0.75rem;

      .total-amount {
        font-weight: 600;
        color: #0078d4;
      }
    }

    .coin-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.4rem;

      .insert-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        background: #f3f4f6;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .coin-value {
          font-size: 1rem;
          font-weight: 700;
          color: #0078d4;
        }

        .coin-label {
          font-size: 0.65rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
      }
    }

    .transaction-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.35rem 0;
        font-size: 0.75rem;

        .amount,
        .required {
          font-weight: 600;
          color: #0078d4;
        }

        .coins-list {
          color: #6b7280;
          font-size: 0.65rem;
          max-width: 60%;
          text-align: right;
          word-break: break-all;
        }
      }
    }
  }

  .receipt-footer {
    padding: 0.5rem;
    text-align: center;
    background: #fff3f3;

    .warning-message {
      color: #dc2626;
      font-size: 0.75rem;
      font-weight: 500;
    }
  }

  .start-btn {
    margin-top: 1.5rem;
    width: 100%;
    padding: 0.9rem 0;
    font-size: 1.15rem;
    font-weight: bold;
    background: $btn-gradient-active;
    color: #fff;
    border: none;
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: linear-gradient(90deg, #8ab4f8 0%, #b0e0f8 100%);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    &:disabled {
      background: #eee;
      color: #aaa;
      cursor: not-allowed;
    }
  }

  .action-section {
    margin-top: auto;
    padding: 1rem;
    position: sticky;
    bottom: 0;
    z-index: 1;
    background: white;
    border-top: 1px solid #e5e7eb;
  }
}

@media (min-width: 480px) {
  .receipt-machine {
    max-width: 100%;

    .receipt-section {
      padding: 0.6rem;
    }
  }
}

.machine-info {
  background: #f8f9fa;
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;

  @media (min-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .mode-info,
  .price-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .mode-label,
    .price-label {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .mode-value,
    .price-value {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.9rem;
    }

    .price-value {
      color: #0078d4;
    }
  }
}

.action-section {
  margin-top: auto;
  padding: 1rem;
  position: sticky;
  bottom: 0;
  z-index: 1;
  background: white;
  border-top: 1px solid #e5e7eb;
}
</style>
