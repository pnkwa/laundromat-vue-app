<script setup lang="ts">
import { computed } from 'vue'
import { useCountdownStore } from '@/stores/countdownStore'

const countdown = useCountdownStore()

const timeLeft = computed(() => {
  const total = countdown.remaining
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { hours, minutes, seconds }
})
</script>

<template>
  <div class="flex flex-col gap-4 items-center text-lg font-mono">
    <div class="flex gap-4">
      <div>
        <span class="countdown text-4xl">{{ timeLeft.hours }}</span> hrs
      </div>
      <div>
        <span class="countdown text-4xl">{{ timeLeft.minutes }}</span> min
      </div>
      <div>
        <span class="countdown text-4xl">{{ timeLeft.seconds }}</span> sec
      </div>
    </div>
  </div>
</template>
