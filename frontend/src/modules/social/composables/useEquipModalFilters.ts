import { computed, ref } from 'vue'
import { useAchievementsStore } from '@/modules/achievements/store'
import { ACHIEVEMENTS } from '@/modules/achievements/constants'
import type { Achievement } from '@/modules/achievements/types'

/**
 * Shared Source/Album filter state for the Title and Badge equip modals —
 * mirrors the prototype's shared `modalFilters` + `modalFilterChipsHTML`/
 * `getModalFilteredList` (achievements.js), which both modals reused instead
 * of each keeping its own filter UI.
 */
export function useEquipModalFilters() {
  const achievements = useAchievementsStore()

  const source = ref<string>('all')
  const album = ref<string>('all')

  const domainOptions = computed(() => {
    const domains = [...new Set(ACHIEVEMENTS.map((a) => a.domain))]
    return [
      { value: 'all', label: 'All' },
      ...domains.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
    ]
  })

  const albumOptions = computed(() => {
    const names = [...new Set(ACHIEVEMENTS.map((a) => achievements.achAlbumLabel(a)))]
    return [{ value: 'all', label: 'All' }, ...names.map((n) => ({ value: n, label: n }))]
  })

  function filterList(list: Achievement[]): Achievement[] {
    return list.filter(
      (a) =>
        (source.value === 'all' || a.domain === source.value) &&
        (album.value === 'all' || achievements.achAlbumLabel(a) === album.value),
    )
  }

  return { source, album, domainOptions, albumOptions, filterList }
}
