<script setup lang="ts">
import { computed, ref } from 'vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import AchievementRow from '../components/AchievementRow.vue'
import { useAchievementsStore } from '../store'
import { ACHIEVEMENTS } from '../constants'

// Standalone Achievements page — reached from the Homepage's "View all".
// Every Albums-domain achievement (collection-wide + every album's own),
// grouped and filterable by album name. Read-only, same rows as everywhere else.
const achievements = useAchievementsStore()
// Separate, simpler browsing context from the equip modals' own filter state.
const filter = ref<string>('all')

const albumsDomainList = computed(() => ACHIEVEMENTS.filter((a) => a.domain === 'albums'))
const albumNames = computed(() => [
  ...new Set(albumsDomainList.value.map((a) => achievements.achAlbumLabel(a))),
])
const filterOptions = computed(() => [
  { value: 'all', label: 'All' },
  ...albumNames.value.map((n) => ({ value: n, label: n })),
])

const groups = computed(() =>
  albumNames.value
    .filter((n) => filter.value === 'all' || filter.value === n)
    .map((n) => ({
      name: n,
      list: albumsDomainList.value.filter((a) => achievements.achAlbumLabel(a) === n),
    })),
)
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'home' }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← Albums
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Achievements · Albums domain
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Achievements</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Every achievement this domain grants — collection-wide and per-album — grouped by album.
      Titles and badges are equipped from your Social profile, not here.
    </p>

    <p class="text-ink-faint mt-3.5 mb-1.5 font-mono text-[9.5px] tracking-[0.07em] uppercase">
      Album
    </p>
    <FilterChips v-model="filter" :options="filterOptions" />

    <div class="mt-1.5">
      <div v-for="group in groups" :key="group.name" class="mt-6">
        <p class="font-display mb-3.5 text-xl">{{ group.name }}</p>
        <AchievementRow v-for="ach in group.list" :key="ach.id" :achievement="ach" show-rarity />
      </div>
    </div>
  </div>
</template>
