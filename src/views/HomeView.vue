<script setup lang="ts">
import homepageImage from '@/assets/homepage-image.png'
</script>

<template>
  <main class="homepage">
    <div class="homepage-content">
      <div class="homepage-text">
        <h1 class="homepage-title">Welcome to CuCuWash!</h1>
        <p class="homepage-desc">
          Enjoy a cozy laundry experience.<br />
          Insert coins, start washing, and relax!
        </p>
        <router-link to="/TopUp" class="homepage-btn">Top Up Coins 💰</router-link>
      </div>

      <div class="homepage-image-wrapper">
        <img :src="homepageImage" alt="Laundromat" class="homepage-image" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.homepage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8e1f4 0%, #e1f4f8 100%);
  font-family: 'Quicksand', 'Baloo 2', cursive, sans-serif;
}

.homepage-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 960px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.8s ease-out;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
  }
}

.homepage-text {
  flex: 1;
}

.homepage-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #e17cb8;
  margin-bottom: 1rem;
  font-family: 'Baloo 2', cursive;
  letter-spacing: 1px;
}

.homepage-desc {
  font-size: 1.15rem;
  color: #7b8fa1;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.homepage-btn {
  display: inline-block;
  background: linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
  padding: 0.9rem 2.5rem;
  border-radius: 2rem;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(251, 194, 235, 0.3);
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(90deg, #a6c1ee 0%, #fbc2eb 100%);
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(226, 147, 204, 0.3);
  }
}

.homepage-image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.homepage-image {
  max-width: 260px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 200px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
