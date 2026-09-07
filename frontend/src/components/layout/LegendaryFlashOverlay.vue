<script setup lang="ts">
import { useLegendaryFlash } from '@/modules/common/composables/useLegendaryFlash'

const { flashing } = useLegendaryFlash()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 z-[1500]"
    :class="{ 'legendary-flash-animate': flashing }"
    style="
      background: radial-gradient(circle, rgba(231, 178, 61, 0.5) 0%, rgba(231, 178, 61, 0) 65%);
      opacity: 0;
    "
    @animationend="flashing = false"
  />
</template>

<style scoped>
.legendary-flash-animate {
  animation: legendaryScreenFlash 1.2s ease-out;
}
@keyframes legendaryScreenFlash {
  0% {
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
