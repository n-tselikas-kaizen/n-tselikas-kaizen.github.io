<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import TradeIcon from '@/components/ui/icons/TradeIcon.vue'
import { useModal } from '@/modules/common/composables/useModal'
import { useCardsStore } from '@/modules/cards/store'
import { RARITIES } from '@/modules/common/constants'
import { SUBJECTS } from '@/modules/cards/constants'
import type { CardCombo } from '@/modules/common/types'
import { useTradingStore, askCardMatches, isCounterAllowed } from '../store'
import TradeCardSlot from './TradeCardSlot.vue'
import CardPickerList from './CardPickerList.vue'

/**
 * The shared trading-table modal — posting a new ask, viewing an
 * already-posted one read-only, and responding to a board ask all reuse
 * this same "you'd take" / "you give" table, toggling between the table and
 * a filterable card-picker inside the same modal (no second modal on top).
 */
const props = withDefaults(
  defineProps<{
    context: 'compose' | 'respond'
    readOnly?: boolean
    askId?: string | null
  }>(),
  { readOnly: false, askId: null },
)

const trading = useTradingStore()
const cards = useCardsStore()
const modal = useModal()

type PickerMode = 'offer' | 'want' | 'give'
const view = ref<'table' | 'picker'>('table')
const pickerMode = ref<PickerMode | null>(null)
const wantIndex = ref<number | null>(null)

const offer = ref<CardCombo | null>(null)
const wants = ref<CardCombo[]>([])
const giveCard = ref<CardCombo | null>(null)

// Read-only replay of an already-posted ask — same table, nothing pickable.
if (props.context === 'compose' && props.readOnly && props.askId) {
  const a = trading.myTradeAsks.find((x) => x.id === props.askId)
  if (a) {
    offer.value = { si: a.si, ri: a.ri }
    wants.value = a.wantCards.map((w) => ({ si: w.si, ri: w.ri }))
  }
}

const respondAsk = computed(() =>
  props.context === 'respond'
    ? (trading.marketTradeAsks.find((x) => x.id === props.askId) ?? null)
    : null,
)

const canPost = computed(() => {
  if (!offer.value || wants.value.length < 1) return false
  return cards.ownership[offer.value.si]?.[offer.value.ri] > 0
})

const respondIsMatch = computed(
  () =>
    !!(
      respondAsk.value &&
      giveCard.value &&
      askCardMatches(respondAsk.value, giveCard.value.si, giveCard.value.ri)
    ),
)

function openPicker(mode: PickerMode, idx: number | null = null) {
  pickerMode.value = mode
  wantIndex.value = mode === 'want' ? idx : null
  view.value = 'picker'
}

const pickerTitles: Record<PickerMode, [string, string]> = {
  offer: ['Give a card', 'Pick a spare card to put up for trade.'],
  want: ['Ask for a card', "Pick a card you'd accept back."],
  give: ['Give a card', 'Exact matches propose instantly; anything else sends as a counter-offer.'],
}
const pickerTitle = computed(() =>
  pickerMode.value ? pickerTitles[pickerMode.value][0] : 'Pick a card',
)
const pickerSubtitle = computed(() => (pickerMode.value ? pickerTitles[pickerMode.value][1] : ''))

const pickerCombos = computed<CardCombo[]>(() => {
  if (pickerMode.value === 'want') return cards.allCatalogCombos()
  const spares = cards.sellableCombos()
  if (pickerMode.value === 'give') {
    const a = respondAsk.value
    return a ? spares.filter((c) => askCardMatches(a, c.si, c.ri) || isCounterAllowed(a, c.ri)) : []
  }
  return spares
})

const pickerSelection = computed<CardCombo | null>(() => {
  if (pickerMode.value === 'offer') return offer.value
  if (pickerMode.value === 'want')
    return wantIndex.value !== null ? (wants.value[wantIndex.value] ?? null) : null
  if (pickerMode.value === 'give') return giveCard.value
  return null
})

function onPick(combo: CardCombo | null) {
  if (pickerMode.value === 'offer') {
    offer.value = combo
  } else if (pickerMode.value === 'want' && wantIndex.value !== null) {
    if (combo === null) wants.value.splice(wantIndex.value, 1)
    else wants.value.splice(wantIndex.value, 1, combo)
  } else if (pickerMode.value === 'give') {
    giveCard.value = combo
  }
  view.value = 'table'
}

function removeWant(i: number) {
  wants.value.splice(i, 1)
}

function post() {
  if (!canPost.value || !offer.value) return
  trading.postTradeAsk(offer.value, wants.value)
  modal.close()
}

function cancelAsk() {
  if (props.askId) trading.cancelTradeAsk(props.askId)
  modal.close()
}

function sendResponse() {
  if (!respondAsk.value || !giveCard.value) return
  trading.sendTradeResponse(respondAsk.value.id, giveCard.value.si, giveCard.value.ri)
  modal.close()
}
</script>

<template>
  <Modal wide>
    <template v-if="view === 'picker'">
      <button
        class="text-ink-faint hover:text-ink-dim mb-1.5 inline-flex items-center gap-1 font-mono text-xs"
        @click="view = 'table'"
      >
        ← Back to table
      </button>
      <p class="font-display m-0 mb-1 pr-9 text-[25px]">{{ pickerTitle }}</p>
      <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">{{ pickerSubtitle }}</p>
      <CardPickerList
        class="mt-3.5"
        :combos="pickerCombos"
        :selected="pickerSelection"
        :show-qty="pickerMode !== 'want'"
        :match-ask="pickerMode === 'give' ? respondAsk : null"
        @pick="onPick"
      />
    </template>

    <template v-else-if="context === 'respond'">
      <template v-if="!respondAsk">
        <p class="font-display m-0 mb-1 pr-9 text-[25px]">This ask is no longer available</p>
        <p class="text-ink-faint m-0 text-[12.5px] leading-relaxed">
          Someone else beat you to it — check the board for what's still open.
        </p>
      </template>
      <template v-else>
        <p class="font-display m-0 mb-1 pr-9 text-[25px]">
          Respond to {{ respondAsk.poster }}'s ask
        </p>
        <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">
          They'll take:
          {{
            respondAsk.wantCards
              .map((w) => RARITIES[w.ri].label + ' ' + SUBJECTS[w.si].name)
              .join(', ')
          }}
        </p>
        <div class="mt-1 flex flex-col items-center gap-5">
          <div class="w-full text-center">
            <p
              class="text-ink-faint m-0 mb-2.5 font-mono text-[10.5px] tracking-[0.07em] uppercase"
            >
              You'd take
            </p>
            <div class="flex flex-wrap justify-center gap-3.5">
              <TradeCardSlot :si="respondAsk.si" :ri="respondAsk.ri" :interactive="false" />
            </div>
          </div>
          <div class="rotate-90 opacity-70">
            <TradeIcon :size="24" color="var(--color-gold)" />
          </div>
          <div class="w-full text-center">
            <p
              class="text-ink-faint m-0 mb-2.5 font-mono text-[10.5px] tracking-[0.07em] uppercase"
            >
              You give
            </p>
            <div class="flex flex-wrap justify-center gap-3.5">
              <TradeCardSlot
                :si="giveCard?.si ?? null"
                :ri="giveCard?.ri ?? null"
                @open="openPicker('give')"
                @remove="giveCard = null"
              />
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          class="mt-[18px] w-full"
          :disabled="!giveCard"
          @click="sendResponse"
        >
          {{ respondIsMatch ? 'Propose this trade' : 'Send counter-offer' }}
        </Button>
      </template>
    </template>

    <template v-else>
      <p class="font-display m-0 mb-1 pr-9 text-[25px]">
        {{ readOnly ? 'Your ask' : 'Post an ask' }}
      </p>
      <p class="text-ink-faint m-0 mb-1 text-[12.5px] leading-relaxed">
        {{
          readOnly
            ? "Posted — cancel it below if you've changed your mind."
            : "Pick 1 to 5 cards you'd take, then what you'll give for them."
        }}
      </p>
      <div class="mt-1 flex flex-col items-center gap-5">
        <div class="w-full text-center">
          <p class="text-ink-faint m-0 mb-2.5 font-mono text-[10.5px] tracking-[0.07em] uppercase">
            You'd take
          </p>
          <div class="flex flex-wrap justify-center gap-3.5">
            <TradeCardSlot
              v-for="(w, i) in wants"
              :key="i"
              :si="w.si"
              :ri="w.ri"
              :interactive="!readOnly"
              @open="openPicker('want', i)"
              @remove="removeWant(i)"
            />
            <TradeCardSlot
              v-if="!readOnly && wants.length < 5"
              @open="openPicker('want', wants.length)"
            />
          </div>
        </div>
        <div class="rotate-90 opacity-70">
          <TradeIcon :size="24" color="var(--color-gold)" />
        </div>
        <div class="w-full text-center">
          <p class="text-ink-faint m-0 mb-2.5 font-mono text-[10.5px] tracking-[0.07em] uppercase">
            You give
          </p>
          <div class="flex flex-wrap justify-center gap-3.5">
            <TradeCardSlot
              :si="offer?.si ?? null"
              :ri="offer?.ri ?? null"
              :interactive="!readOnly"
              @open="openPicker('offer')"
              @remove="offer = null"
            />
          </div>
        </div>
      </div>
      <Button v-if="readOnly" variant="secondary" class="mt-[18px] w-full" @click="cancelAsk"
        >Cancel this ask</Button
      >
      <Button v-else variant="primary" class="mt-[18px] w-full" :disabled="!canPost" @click="post"
        >Post to the board</Button
      >
    </template>
  </Modal>
</template>
