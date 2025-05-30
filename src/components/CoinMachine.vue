<script lang="ts" setup>
import { useCoinStore } from '@/stores/coin-store'
import { coin } from '@/types/coin-types'

const coinMachineProps = defineProps<{
  price: number
}>()

const coinStore = useCoinStore()
</script>

<template>
  <div class="p-4 max-w-md mx-auto space-y-4">
    <h2 class="text-xl font-bold">Laundromat Coin Machine</h2>

    <div class="space-x-2">
      <button
        v-for="(value, name) in coin"
        :key="name"
        @click="coinStore.insertCoin(value)"
        class="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
      >
        {{ name }} ({{ value }})
      </button>
    </div>

    <div>
      <p>Total: {{ coinStore.total }}</p>
      <p>Inserted Coins: {{ coinStore.insertedCoins.join(', ') || 'None' }}</p>
    </div>

    <div>
      <label class="block font-medium">Laundry Price</label>
      <p class="border px-2 py-1 rounded bg-gray-100">{{ coinMachineProps.price }}</p>

      <button
        @click="coinStore.calculateChange(coinMachineProps.price)"
        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Calculate Change
      </button>
    </div>

    <div v-if="coinMachineProps.price > coinStore.total" class="text-red-600">
      Not enough coins inserted.
    </div>
    <div v-else-if="coinStore.changeCoins.length > 0" class="text-green-600">
      <p>Change ({{ coinStore.total - coinMachineProps.price }}):</p>
      <p>{{ coinStore.changeCoins.join(', ') }}</p>
    </div>
  </div>
</template>
