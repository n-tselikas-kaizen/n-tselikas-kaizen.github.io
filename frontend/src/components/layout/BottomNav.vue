<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavGroup } from '@/router'

const route = useRoute()
const activeGroup = computed<NavGroup>(() => route.meta.navGroup ?? 'albums')

const tabs: { group: NavGroup; to: { name: string }; label: string }[] = [
  { group: 'albums', to: { name: 'home' }, label: 'Albums' },
  { group: 'marketplace', to: { name: 'marketplace' }, label: 'Marketplace' },
  { group: 'social', to: { name: 'social' }, label: 'Social' },
]
</script>

<template>
  <nav
    class="bg-panel border-line-strong fixed inset-x-0 bottom-0 z-[100] flex items-stretch justify-center border-t px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]"
  >
    <RouterLink
      v-for="tab in tabs"
      :key="tab.group"
      :to="tab.to"
      :title="tab.label"
      class="text-ink-faint hover:text-ink-dim flex h-[52px] w-[60px] items-center justify-center rounded-xl"
      :class="{ 'bg-gold/[0.14] text-gold': activeGroup === tab.group }"
    >
      <span class="flex h-6 w-6 items-center justify-center">
        <svg
          v-if="tab.group === 'albums'"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
        </svg>
        <svg
          v-else-if="tab.group === 'marketplace'"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4.5" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </span>
    </RouterLink>

    <div class="bg-line-strong mx-1.5 my-1 w-px shrink-0 self-stretch" />

    <RouterLink
      :to="{ name: 'demo-tools' }"
      title="Demo Tools"
      class="text-ink-faint hover:text-ink-dim flex h-[52px] w-[60px] items-center justify-center rounded-xl"
      :class="{ 'bg-gold/[0.14] text-gold': activeGroup === 'demo-tools' }"
    >
      <span class="flex h-6 w-6 items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M14.5 3.5a5 5 0 0 0-6.4 6.4L3 15l2 2 5.1-5.1a5 5 0 0 0 6.4-6.4l-2.83 2.83-2-2z"
          />
        </svg>
      </span>
    </RouterLink>
  </nav>
</template>
