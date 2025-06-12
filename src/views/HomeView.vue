<script setup lang="ts">
import homepageImage from '@/assets/homepage-image.png'
import BlobButton from '@/components/BlobButton.vue'
import { computed } from 'vue'

const bubbles = computed(() =>
  Array.from({ length: 20 }, () => {
    const size = 10 + Math.random() * 30
    const left = Math.random() * 100
    const delay = -6 * Math.random()
    return {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      animationDelay: `${delay}s`,
    }
  }),
)
</script>

<template>
  <div class="homepage">
    <div class="bubble-bg">
      <span v-for="(bubble, index) in bubbles" :key="index" class="bubble" :style="bubble"></span>
    </div>
    <div class="text-content">
      <div class="main-title">
        <h1 class="title">Welcome to</h1>
        <h1 class="logo">CuCuWash</h1>
      </div>
      <p class="description">Enjoy a cozy laundry experience.<br /></p>
      <div class="btns">
        <BlobButton text="Top Up Coins" @click="$router.push('/TopUp')" />
        <BlobButton text="Start Washing" @click="$router.push('/Laundromat')" />
      </div>
    </div>

    <div class="img">
      <img :src="homepageImage" alt="Laundromat" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.homepage {
  position: relative;
  overflow: hidden;
  height: $min-height;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $laundry-bg-gradient;
  font-family: $font-main;

  .bubble-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;

    .bubble {
      position: absolute;
      bottom: -100px;
      background: rgb(255, 255, 255);
      border-radius: 50%;
      animation: bubbleUp 6s linear infinite;
      filter: blur(1px);
    }
  }

  @keyframes bubbleUp {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.7;
    }
    80% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-110vh) scale(1.2);
      opacity: 0;
    }
  }

  .text-content {
    position: relative;
    z-index: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
    max-width: 800px;
    width: 90%;
    margin: 0 auto;

    & > .main-title {
      display: flex;
      align-items: center;
      font-size: 2rem;
      margin-top: 2rem;
      gap: 0.5rem;

      @media (min-width: 768px) {
        font-size: 3.5rem;
        flex-direction: row;
        gap: 0.5rem;
      }

      .title {
        font-weight: 900;
        color: $color-dark;
      }

      .logo {
        color: $color-light;
        background-color: $color-blue;
        border: 4px solid $color-blue;
        padding: 4px 12px;
        border-radius: 40px;
        width: fit-content;
        margin-left: 0px;

        @media (min-width: 768px) {
          margin-left: 10px;
          border-width: 6px;
        }
      }
    }

    .description {
      font-size: 1.1rem;
      margin-top: 1rem;
      color: $color-dark;
      max-width: 400px;
    }

    .btns {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
      flex-direction: column;
      max-width: 600px;

      @media (min-width: 768px) {
        flex-direction: row;
        gap: 1.5rem;
        width: 100%;
      }

      :deep(.blob-btn) {
        margin: 0;
        background: #f0f0f0;
        font-size: 1.2rem;
        padding: 0.8rem 1.5rem;

        @media (min-width: 768px) {
          width: 100%;
        }
      }
    }
  }

  .img {
    position: relative;
    z-index: 1;
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    max-width: 1000px;
    margin: 0 auto;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      width: 70%;
      aspect-ratio: 1/0.75;
      background: rgb(255, 255, 255);
      border-top-left-radius: 100% 100%;
      border-top-right-radius: 100% 100%;
      transform: translateY(50%);
      z-index: 0;
    }

    img {
      position: relative;
      z-index: 1;
      max-width: 70%;
      height: auto;
    }
  }
}
</style>
