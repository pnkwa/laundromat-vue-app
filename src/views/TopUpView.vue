<script setup lang="ts">
import { useMyCoinWallet } from '@/stores/my-wallet-store'
import { coin, type CoinKey } from '@/types/coin-types'
import { ref } from 'vue'

const myWallet = useMyCoinWallet()
const myCoin = ref({ ...myWallet.numOfCoinWallet })

const handleAddCoin = (coinKey: CoinKey) => {
  myWallet.addCoinToWallet(coinKey, coin[coinKey])
  myCoin.value[coinKey]++
}
</script>

<template>
  <div class="topup-view">
    <div class="topup-content">
      <h1 class="title">Top Up Your Wallet</h1>

      <div class="wallet-section">
        <h2 class="section-title">My Wallet</h2>
        <ul class="coin-list">
          <li v-for="(count, name) in myCoin" :key="name" class="coin-item">
            <span class="coin-name">{{ name }}</span>
            <span class="coin-count">{{ count }}</span>
          </li>
        </ul>
        <div class="total-section">
          <span class="total-label">Total:</span>
          <span class="total-amount">{{ myWallet.totalCoins }}</span>
        </div>
      </div>

      <div class="add-coins-section">
        <h2 class="section-title">Add Coins</h2>
        <div class="coin-buttons">
          <button
            v-for="(value, name) in coin"
            :key="name"
            @click="handleAddCoin(name as CoinKey)"
            class="add-coin-btn"
          >
            Add {{ name }} <span class="coin-value">({{ value }})</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topup-view {
  min-height: $min-height;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $laundry-bg-gradient;
  padding: 2rem;
  font-family: $font-main;

  .topup-content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 2rem;
    padding: 3rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);

    .title {
      font-size: 2.5rem;
      font-weight: 800;
      color: $color-dark;
      text-align: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: $color-dark;
      margin-bottom: 1rem;
    }

    .wallet-section {
      background: white;
      border-radius: 1.5rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      .coin-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;

        .coin-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          border-radius: 1rem;
          font-weight: 600;

          .coin-name {
            color: $color-dark;
          }

          .coin-count {
            color: $color-blue;
            font-size: 1.1rem;
          }
        }
      }

      .total-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f0f7ff;
        border-radius: 1rem;
        margin-top: 1rem;

        .total-label {
          font-weight: 600;
          color: $color-dark;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: $color-blue;
        }
      }
    }

    .add-coins-section {
      .coin-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;

        .add-coin-btn {
          padding: 1rem;
          border: none;
          border-radius: 1rem;
          background: $btn-gradient-secondary;
          color: $text-color-tertiary;
          font-weight: 600;
          cursor: pointer;
          transition:
            transform 0.2s,
            box-shadow 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          &:active {
            transform: translateY(0);
          }

          .coin-value {
            font-size: 0.9rem;
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
