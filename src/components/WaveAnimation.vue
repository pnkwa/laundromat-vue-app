<script setup lang="ts">
defineProps<{
  isActive?: boolean
}>()
</script>

<template>
  <div class="wave-container" :class="{ active: isActive }">
    <div class="wave"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '/src/assets/globals' as *;

.wave-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transform: translateY(100%);
  z-index: 1;
  overflow: hidden;
  background: transparent;

  &.active {
    transform: translateY(0);
  }

  .wave {
    width: 1000px;
    height: 1025px;
    position: absolute;
    margin-left: -500px;
    border-radius: 35%;
    background: #c2e9fb;
    animation: wave 15s infinite linear;
  }
}

@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
