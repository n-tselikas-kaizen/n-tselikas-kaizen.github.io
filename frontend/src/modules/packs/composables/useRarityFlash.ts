import { ref } from 'vue'
import { useLegendaryFlash } from '@/modules/common/composables/useLegendaryFlash'

export interface Spark {
  id: number
  left: string
  top: string
  delay: string
  cls: string
}

let sparkSeq = 0

/**
 * Reveal-moment flash, scaled by rarity — a quick pulse for Rare, a
 * stronger double-pulse + sparkle burst for Epic, and a triple-pulse +
 * sparkle burst + full-screen gold flash for Legendary. Mirrors packs.js's
 * triggerRarityFlash(); timers stand in for the original's `animationend`
 * listeners since there's no single persistent DOM node here to attach them
 * to (each pull card is its own component instance).
 *
 * Call this factory fresh per card — it holds one card's flash/spark state,
 * it isn't shared global state like useModal/useToast.
 */
export function useRarityFlash() {
  const flashClass = ref<string | null>(null)
  const sparks = ref<Spark[]>([])
  const legendaryFlash = useLegendaryFlash()

  function trigger(rarityIdx: number) {
    if (rarityIdx < 2) return
    const cls = rarityIdx === 4 ? 'flash-legendary' : rarityIdx === 3 ? 'flash-epic' : 'flash-rare'
    const duration = rarityIdx === 4 ? 1900 : rarityIdx === 3 ? 1100 : 700
    flashClass.value = cls
    setTimeout(() => {
      if (flashClass.value === cls) flashClass.value = null
    }, duration)

    if (rarityIdx >= 3) {
      const sparkCls = rarityIdx === 4 ? 'burst-spark-legendary' : 'burst-spark-epic'
      const count = rarityIdx === 4 ? 6 : 3
      for (let i = 0; i < count; i++) {
        const id = sparkSeq++
        sparks.value.push({
          id,
          left: Math.random() * 70 + 15 + '%',
          top: Math.random() * 70 + 15 + '%',
          delay: i * 0.09 + 's',
          cls: sparkCls,
        })
        setTimeout(
          () => {
            sparks.value = sparks.value.filter((s) => s.id !== id)
          },
          900 + i * 90,
        )
      }
    }

    if (rarityIdx === 4) legendaryFlash.trigger()
  }

  return { flashClass, sparks, trigger }
}
