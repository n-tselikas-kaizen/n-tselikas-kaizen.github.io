<script setup lang="ts">
import { useAlbumsStore } from '../store'

const albums = useAlbumsStore()
</script>

<template>
  <div
    class="bg-line border-line-strong mb-5 flex flex-wrap gap-px overflow-hidden rounded-md border"
  >
    <div class="bg-panel min-w-[56px] flex-1 px-[9px] py-1.5">
      <p
        class="text-ink-faint m-0 mb-[3px] overflow-hidden font-mono text-[8px] tracking-[0.06em] text-ellipsis whitespace-nowrap uppercase"
      >
        Slots filled
      </p>
      <p class="text-ink font-mono text-[13px] font-semibold">
        {{ albums.filledCount }} / {{ albums.album.slots.length }}
      </p>
    </div>
    <div class="bg-panel min-w-[56px] flex-1 px-[9px] py-1.5">
      <p
        class="text-ink-faint m-0 mb-[3px] overflow-hidden font-mono text-[8px] tracking-[0.06em] text-ellipsis whitespace-nowrap uppercase"
      >
        Rewards claimed
      </p>
      <p class="text-ink font-mono text-[13px] font-semibold">
        €{{ albums.claimedRewardsTotal.toFixed(2) }}
      </p>
    </div>
  </div>
</template>
