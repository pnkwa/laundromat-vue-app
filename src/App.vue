<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMyCoinWallet } from '@/stores/my-wallet-store'
import IconWallet from '@/assets/svg/icon-my-wallet.svg'

const myWallet = useMyCoinWallet()
</script>

<template>
  <header class="navbar">
    <div class="navbar-wrapper">
      <RouterLink to="/" class="navbar-logo">CuCuWash</RouterLink>

      <div class="navbar-right">
        <nav class="navbar-links">
          <RouterLink to="/" exact-active-class="active-link">Home</RouterLink>
          <RouterLink to="/laundromat" exact-active-class="active-link">Laundromat</RouterLink>
          <RouterLink to="/top-up" exact-active-class="active-link">Top Up</RouterLink>
        </nav>
        <div class="total-coins">
          <IconWallet class="coin-icon" />
          <span class="total-amount">{{ myWallet.totalCoins }}</span>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style lang="scss" scoped>
.navbar {
  background: $btn-gradient-primary;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;

  & > .navbar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;

    .navbar-logo {
      font-family: 'Baloo 2', cursive;
      font-size: 1.6rem;
      font-weight: bold;
      color: #fff;
      text-decoration: none;
    }

    .navbar-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 1rem;

      .navbar-links {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;

        a {
          width: 100%;
          text-align: center;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          transition:
            background 0.3s,
            transform 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          &.active-link {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }

      .total-coins {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        backdrop-filter: blur(4px);

        .coin-icon {
          width: 20px;
          height: 20px;
          filter: invert(1) brightness(1.2);
        }

        .total-amount {
          font-weight: 600;
          color: #fff;
          font-size: 1.1rem;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .navbar-wrapper {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      max-width: 1080px;
      margin: 0 auto;

      .navbar-right {
        flex-direction: row;
        align-items: center;
        width: auto;
        gap: 2rem;

        .navbar-links {
          flex-direction: row;
          width: auto;

          a {
            width: auto;
            text-align: left;
          }
        }

        .total-coins {
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
