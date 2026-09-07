<script setup lang="ts"></script>

<template>
  <div class="py-16 text-center">
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">404</p>
    <h1 class="mb-3 text-[46px]">Nothing here</h1>
    <p class="text-ink-dim mb-6">That screen doesn't exist.</p>
    <RouterLink :to="{ name: 'home' }" class="text-gold font-mono text-sm"
      >← Back to Albums</RouterLink
    >
  </div>
</template>
