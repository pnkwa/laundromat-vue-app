<script setup lang="ts">
import { computed } from 'vue'
import { coin } from '@/types/coin-types'
import { useMyCoinWallet } from '@/composible/use-my-coin'

const { myCoin, addCoinsWallet } = useMyCoinWallet()

const totalCoins = computed(() => Object.values(myCoin.value).reduce((sum, n) => sum + n, 0))
</script>

<template>
  <div
    class="max-w-md mx-auto bg-gradient-to-br from-pink-100 to-blue-100 shadow-xl rounded-3xl p-8 space-y-6 border-4 border-white"
  >
    <h2 class="text-3xl font-extrabold text-pink-600 mb-3 text-center drop-shadow">
      ✨ Top Up Coins ✨
    </h2>
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        v-for="(value, name) in coin"
        :key="name"
        @click="addCoinsWallet([value])"
        class="flex flex-col items-center bg-white hover:bg-pink-200 text-pink-600 px-6 py-3 rounded-2xl shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300 border-2 border-pink-200"
      >
        <span class="font-bold text-2xl mb-1">+{{ value }}</span>
        <span
          class="text-xs uppercase tracking-wider font-semibold bg-pink-100 px-2 py-0.5 rounded-full"
          >{{ name }}</span
        >
      </button>
    </div>
    <div class="mt-8 bg-white rounded-2xl p-6 shadow-inner border-2 border-blue-100">
      <h3 class="font-bold text-blue-600 mb-3 text-lg flex items-center gap-2">
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="10" />
        </svg>
        Your Wallet
      </h3>
      <ul class="mb-4">
        <li
          v-for="(amount, name) in myCoin"
          :key="name"
          class="flex justify-between py-1 border-b last:border-b-0 text-base"
        >
          <span class="capitalize font-medium">{{ name }}</span>
          <span class="font-mono font-bold text-pink-500">{{ amount }}</span>
        </li>
      </ul>
      <div class="flex justify-between items-center mt-4 pt-3 border-t">
        <span class="font-semibold text-blue-700 text-lg">Total</span>
        <span class="font-mono text-2xl font-extrabold text-yellow-500 drop-shadow">{{
          totalCoins
        }}</span>
      </div>
    </div>
  </div>
</template>
