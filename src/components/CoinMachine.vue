<script lang="ts" setup>
import { useCoinMachineStore } from '@/stores/coin-machine-store'
import { coin, type CoinKey } from '@/types/coin-types'
import { useMyCoinWallet } from '@/composible/use-my-coin'
import { computed, watch, ref, onMounted } from 'vue'

const props = defineProps<{
  price: number
}>()

const coinMachineStore = useCoinMachineStore()
const { myCoin, addCoinsWallet, useCoinsWallet } = useMyCoinWallet()

// Faris comment: move to store
const myCoinTotal = computed(() =>
  Object.entries(myCoin.value).reduce((sum, [key, count]) => sum + coin[key as never] * count, 0),
)

// const myWalletDisplay = computed(() => myCoin.value)

watch(
  () => props.price,
  (newPrice) => {
    const available = [
      ...coinMachineStore.insertedCoins,
      ...Object.entries(myCoin.value).flatMap(([key, count]) =>
        Array(count).fill(coin[key as CoinKey]),
      ),
    ]
    // console.log('available >>', available)

    coinMachineStore.startTransaction(newPrice, available)
  },
  { immediate: true },
)

// Faris comment: parameter type to name coin constant
const handleInsert = (value: number) => {
  const coinEntry = Object.entries(coin).find(([, v]) => v === value)
  console.log('coinEntry >>', coinEntry)

  const coinKey = coinEntry?.[0] as CoinKey | undefined
  if (coinKey && myCoin.value[coinKey] > 0 && coinMachineStore.canInsert) {
    coinMachineStore.insertCoin(value)
    myCoin.value[coinKey]--
  }
}

const handleConfirm = () => {
  const success = coinMachineStore.completeTransaction()
  if (success) {
    useCoinsWallet(coinMachineStore.insertedCoins)
    addCoinsWallet(coinMachineStore.changeCoins)
  }
}

const poweredOn = ref(false)
onMounted(() => {
  setTimeout(() => {
    poweredOn.value = true
  }, 100)
})
</script>

<template>
  <transition name="slip">
    <div
      v-if="poweredOn"
      class="cute-machine p-6 max-w-md mx-auto space-y-5 shadow-xl rounded-3xl bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 border-4 border-white"
    >
      <h2 class="text-2xl font-extrabold text-pink-500 flex items-center gap-2 font-cute">
        <span>🧺</span> Laundromat Coin Machine
      </h2>

      <div>
        <p class="font-semibold text-blue-500">My Wallet:</p>
        <ul class="ml-4 flex gap-3">
          <li
            v-for="(count, name) in myCoin"
            :key="name"
            class="bg-white/80 rounded-xl px-3 py-1 shadow font-cute text-sm flex items-center gap-1"
          >
            <span>💰</span> {{ name }}: <span class="font-bold">{{ count }}</span>
          </li>
        </ul>
        <p class="mt-2 font-bold text-yellow-600">Total: {{ myCoinTotal }}</p>
      </div>

      <div class="flex flex-wrap gap-3 mt-4">
        <button
          v-for="(value, name) in coin"
          :key="name"
          @click="handleInsert(value)"
          :disabled="myCoin[name as CoinKey] <= 0 || !coinMachineStore.canInsert"
          class="bg-pink-200 text-pink-700 px-4 py-2 rounded-full shadow hover:bg-pink-300 disabled:opacity-40 font-cute transition"
        >
          Insert {{ name }} <span class="text-xs">({{ value }})</span>
        </button>
      </div>

      <div class="bg-white/70 rounded-xl p-3 shadow">
        <p>
          <strong>Inserted Total:</strong>
          <span class="text-blue-600">{{ coinMachineStore.total }}</span>
        </p>
        <p>
          <strong>Inserted Coins:</strong>
          <span class="text-gray-700">
            {{
              coinMachineStore.insertedCoins.length
                ? coinMachineStore.insertedCoins.join(', ')
                : 'None'
            }}
          </span>
        </p>
      </div>

      <div>
        <label class="block font-semibold text-blue-400">Laundry Price</label>
        <p class="border px-2 py-1 rounded bg-yellow-100 font-bold text-yellow-700 shadow-inner">
          {{ props.price }}
        </p>

        <button
          @click="handleConfirm"
          class="mt-3 bg-blue-400 text-white px-6 py-2 rounded-full shadow font-cute text-lg hover:bg-blue-500 transition"
        >
          Confirm Payment
        </button>
      </div>

      <div v-if="coinMachineStore.requiredAmount > 0" class="text-red-500 font-cute text-center">
        Not enough coins inserted.
      </div>

      <div
        v-else-if="
          coinMachineStore.changeCoins.length === 0 && coinMachineStore.total > props.price
        "
        class="text-red-500 font-cute text-center"
      >
        Cannot make change with available coins.
      </div>

      <div
        v-else-if="coinMachineStore.changeCoins.length > 0"
        class="text-green-600 font-cute space-y-1 text-center"
      >
        <p>
          <strong>Change ({{ coinMachineStore.totalChange }}):</strong>
        </p>
        <p>{{ coinMachineStore.changeCoins.join(', ') }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Faris comment: can move to global styles, move to local font folder src/assets/fonts */
/* tailwind config font */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap');

.font-cute {
  font-family: 'Baloo 2', cursive;
}

.cute-machine {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border-radius: 2rem;
  border: 4px solid #fff;
  background: linear-gradient(135deg, #ffe0ef 0%, #e0f2fe 60%, #fffbe0 100%);
}

/* Slip animation */
.slip-enter-active {
  animation: slip-in 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.slip-leave-active {
  animation: slip-out 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
@keyframes slip-in {
  0% {
    opacity: 0;
    transform: translateY(-80px) scaleY(0.7) skewY(-8deg);
    filter: blur(6px);
  }
  70% {
    opacity: 1;
    transform: translateY(8px) scaleY(1.05) skewY(2deg);
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1) skewY(0deg);
    filter: blur(0px);
  }
}
@keyframes slip-out {
  to {
    opacity: 0;
    transform: translateY(60px) scaleY(0.7) skewY(8deg);
    filter: blur(4px);
  }
}
</style>
