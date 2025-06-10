<script lang="ts" setup>
import { useCoinMachineStore } from '@/stores/coin-machine-store'
import { useMyCoinWallet } from '@/stores/my-wallet-store'
import { coin, type CoinKey } from '@/types/coin-types'
import { watch, ref } from 'vue'

const props = defineProps<{
  price: number
}>()

const coinMachineStore = useCoinMachineStore()
const myWallet = useMyCoinWallet()

const myCoin = ref({ ...myWallet.numOfCoinWallet })

watch(
  () => props.price,
  (newPrice) => {
    const available = [
      ...coinMachineStore.insertedCoins,
      ...Object.entries(myCoin.value).flatMap(([key, count]) =>
        Array(count).fill(coin[key as CoinKey]),
      ),
    ]
    coinMachineStore.startTransaction(newPrice, available)
  },
  { immediate: true },
)

const handleInsert = (coinKey: CoinKey) => {
  const coinValue = coin[coinKey]
  if (myCoin.value[coinKey] > 0 && coinMachineStore.canInsert) {
    coinMachineStore.insertCoin(coinValue)
    myCoin.value[coinKey]--
    myWallet.removeCoinFromWallet(coinKey, coinValue)
  }
}
</script>

<template>
  <div class="receipt-machine">
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
          :disabled="!coinMachineStore.canInsert || myCoin[name as CoinKey] <= 0"
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
          <span class="amount">{{ coinMachineStore.insertedCoinsTotal }}</span>
        </div>
        <div class="info-row">
          <span>Inserted Coins:</span>
          <span class="coins-list">
            {{
              coinMachineStore.insertedCoins.length
                ? coinMachineStore.insertedCoins.join(', ')
                : 'None'
            }}
          </span>
        </div>
        <div class="info-row">
          <span>Required Amount:</span>
          <span class="required">{{ props.price }}</span>
        </div>
      </div>
    </div>

    <div v-if="coinMachineStore.requiredAmount > 0" class="receipt-footer">
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
}

@media (max-width: 480px) {
  .receipt-machine {
    max-width: 100%;

    .receipt-section {
      padding: 0.6rem;
    }
  }
}
</style>
