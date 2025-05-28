<script setup lang="ts">
interface PropCountdownLabel {
  hours: number
  minutes: number
  seconds: number
}

const props = defineProps<PropCountdownLabel>()
</script>

<template>
  <div class="flex flex-col gap-4 items-center text-lg font-mono">
    <div class="flex gap-4">
      <div>
        <span class="countdown text-4xl">{{ props.hours }}</span> hrs
      </div>
      <div>
        <span class="countdown text-4xl">{{ props.minutes }}</span> min
      </div>
      <div>
        <span class="countdown text-4xl">{{ props.seconds }}</span> sec
      </div>
    </div>
  </div>
</template>
