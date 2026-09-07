<script setup lang="ts">
import { computed } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import { useCardsStore } from '@/modules/cards/store'
import { CATEGORY_GLYPH, THEME_ICON } from '@/modules/cards/constants'
import BcIcon from '@/components/ui/icons/BcIcon.vue'
import Button from '@/components/ui/Button.vue'

/**
 * One row shared by all three Listings lists (pending sales, your active
 * listings, browse listings) — thumbnail, name/rarity/status text, price
 * chip, and a single action button whose label/style/handler the parent
 * configures for its own context (Confirm / Cancel / Buy).
 */
const props = withDefaults(
  defineProps<{
    subjectIndex: number
    rarity: number
    /** Text after the rarity label, e.g. "listed by you", "bought by NileRunner88", "sold by ScarabQueen · below market rate". */
    metaText: string
    price: number
    actionLabel: string
    actionVariant?: 'primary' | 'secondary'
    actionDisabled?: boolean
  }>(),
  { actionVariant: 'primary', actionDisabled: false },
)

const emit = defineEmits<{ action: [] }>()

const cards = useCardsStore()
const subject = computed(() => cards.subjects[props.subjectIndex])
const rarityInfo = computed(() => RARITIES[props.rarity])
const glyph = computed(() => CATEGORY_GLYPH[subject.value.cat] || THEME_ICON)
</script>

<template>
  <div
    class="bg-panel border-line-strong mb-2 flex flex-wrap items-center gap-3.5 rounded-lg border px-4 py-3"
  >
    <div
      class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
      :style="{ background: rarityInfo.color }"
    >
      {{ glyph }}
    </div>
    <div class="min-w-[160px] flex-1">
      <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">{{ subject.name }}</p>
      <p class="text-ink-faint m-0 font-mono text-[10.5px]">
        {{ rarityInfo.label }} · {{ metaText }}
      </p>
    </div>
    <div
      class="bg-panel-raised border-line-strong mb-0 flex shrink-0 items-center gap-2 rounded-full border py-1.5 pr-3 pl-2"
    >
      <span
        class="bg-gold flex h-[18px] w-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full"
      >
        <BcIcon :size="11" />
      </span>
      <b class="text-ink font-mono text-[14px]">{{ price.toFixed(2) }}</b>
    </div>
    <Button :variant="actionVariant" :disabled="actionDisabled" @click="emit('action')">
      {{ actionLabel }}
    </Button>
  </div>
</template>
