<script setup lang="ts">
defineProps<{
  text: string
  onClick?: () => void
}>()
</script>

<template>
  <button class="blob-btn" @click="onClick">
    {{ text }}
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    style="position: absolute; width: 0; height: 0"
  >
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
          result="goo"
        ></feColorMatrix>
        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
      </filter>
    </defs>
  </svg>
</template>

<style lang="scss" scoped>
@use 'sass:math';

.blob-btn {
  $numOfBlobs: 4;
  z-index: 1;
  position: relative;
  padding: 20px 46px;
  margin-bottom: 30px;
  text-align: center;
  text-transform: uppercase;
  color: $color-primary;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  outline: none;
  border: none;
  transition: color 0.5s;
  cursor: pointer;
  border-radius: 30px;
  font-family: $font-main;

  &:before {
    content: '';
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: $borderW solid $color-primary;
    border-radius: 30px;
  }

  &:after {
    content: '';
    z-index: -2;
    position: absolute;
    left: $borderW * 1.5;
    top: $borderW * 1.5;
    width: 100%;
    height: 100%;
    transition: all 0.3s 0.2s;
    border-radius: 30px;
  }

  &:hover {
    color: $text-color-tertiary;
    border-radius: 30px;

    &:after {
      transition: all 0.3s;
      left: 0;
      top: 0;
      border-radius: 30px;
    }
  }

  &__inner {
    z-index: -1;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    background: transparent;
  }

  &__blobs {
    position: relative;
    display: block;
    height: 100%;
    filter: url('#goo');
  }

  &__blob {
    position: absolute;
    top: $borderW;
    width: math.div(100%, $numOfBlobs);
    height: 100%;
    background: transparent;
    border-radius: 100%;
    transform: translate3d(0, 150%, 0) scale(1.7);
    transition:
      transform 0.45s,
      background 0.3s;

    @supports (filter: url('#goo')) {
      transform: translate3d(0, 150%, 0) scale(1.4);
    }

    @for $i from 1 through $numOfBlobs {
      &:nth-child(#{$i}) {
        left: ($i - 1) * math.div(120%, $numOfBlobs);
        transition-delay: ($i - 1) * 0.08s;
      }
    }

    .blob-btn:hover & {
      transform: translateZ(0) scale(1.7);
      background: $color-primary;

      @supports (filter: url('#goo')) {
        transform: translateZ(0) scale(1.4);
      }
    }
  }
}
</style>
