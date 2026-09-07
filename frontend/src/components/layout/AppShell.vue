<script setup lang="ts">
import BottomNav from './BottomNav.vue'
import ModalHost from './ModalHost.vue'
import ToastHost from './ToastHost.vue'
import LegendaryFlashOverlay from './LegendaryFlashOverlay.vue'
</script>

<template>
  <div class="min-h-screen">
    <main class="min-w-0 px-8 pt-11 pb-24 max-[480px]:px-3.5 max-[480px]:pt-6.5">
      <div class="mx-auto max-w-[1080px]">
        <RouterView />
      </div>
    </main>
    <BottomNav />
    <ToastHost />
    <ModalHost />
    <LegendaryFlashOverlay />
  </div>
</template>
