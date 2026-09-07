<script setup lang="ts">
import { useModal } from '@/modules/common/composables/useModal'
import { RARITIES } from '@/modules/common/constants'
import { SUBJECTS, CATEGORY_GLYPH, THEME_ICON } from '@/modules/cards/constants'
import Button from '@/components/ui/Button.vue'
import { useTradingStore, tradeWantLabel } from '../store'
import type { TradeActivityRow } from '../types'
import TradeTableModal from './TradeTableModal.vue'

/**
 * One row of the unified "your active asks" list — the shape/rendering
 * varies by `row.kind` (proposal awaiting a decision, a completed trade
 * ready to claim, an outgoing counter awaiting response, or a plain open
 * ask). Plain asks are clickable to reopen their read-only table.
 */
const props = defineProps<{ row: TradeActivityRow }>()
const trading = useTradingStore()
const modal = useModal()

function glyphFor(si: number): string {
  return CATEGORY_GLYPH[SUBJECTS[si].cat] || THEME_ICON
}

function viewAsk() {
  if (props.row.kind === 'ask')
    modal.open(TradeTableModal, { context: 'compose', readOnly: true, askId: props.row.ask.id })
}
</script>

<template>
  <div
    class="border-line-strong bg-panel mb-2 flex flex-wrap items-center gap-3.5 rounded-lg border px-4 py-3"
    :class="{ 'cursor-pointer': row.kind === 'ask' }"
    @click="row.kind === 'ask' && viewAsk()"
  >
    <template v-if="row.kind === 'proposal'">
      <div
        class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
        :style="{ background: RARITIES[row.proposal.ri].color }"
      >
        {{ glyphFor(row.proposal.si) }}
      </div>
      <div class="min-w-[160px] flex-1">
        <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">
          {{ SUBJECTS[row.proposal.si].name }}
          <span class="text-ink-faint font-normal">({{ RARITIES[row.proposal.ri].label }})</span>
          <span
            class="ml-1 rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] whitespace-nowrap uppercase"
            :style="
              row.proposal.isMatch
                ? 'background:rgba(47,184,143,0.18);color:var(--color-rarity-uncommon);'
                : 'background:rgba(62,134,214,0.18);color:var(--color-rarity-rare);'
            "
          >
            {{ row.proposal.isMatch ? 'Matches your ask' : 'Counter-offer' }}
          </span>
        </p>
        <p class="text-ink-faint font-mono text-[10.5px]">
          {{ row.proposal.proposer }} · for your {{ RARITIES[row.ask.ri].label }}
          {{ SUBJECTS[row.ask.si].name }}
        </p>
      </div>
      <div class="flex shrink-0 flex-row gap-1.5">
        <Button variant="primary" @click.stop="trading.acceptTradeProposal(row.proposal.id)"
          >Accept</Button
        >
        <Button variant="secondary" @click.stop="trading.declineTradeProposal(row.proposal.id)"
          >Decline</Button
        >
      </div>
    </template>

    <template v-else-if="row.kind === 'claim'">
      <div
        class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
        :style="{ background: RARITIES[row.claim.ri].color }"
      >
        {{ glyphFor(row.claim.si) }}
      </div>
      <div class="min-w-[160px] flex-1">
        <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">
          {{ SUBJECTS[row.claim.si].name }}
          <span class="text-ink-faint font-normal">({{ RARITIES[row.claim.ri].label }})</span>
          <span
            class="ml-1 rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] whitespace-nowrap uppercase"
            style="background: rgba(201, 162, 39, 0.18); color: var(--color-gold)"
          >
            Ready to claim
          </span>
        </p>
        <p class="text-ink-faint font-mono text-[10.5px]">Traded with {{ row.claim.partner }}</p>
      </div>
      <Button variant="primary" class="shrink-0" @click.stop="trading.claimTrade(row.claim.id)"
        >Claim</Button
      >
    </template>

    <template v-else-if="row.kind === 'outgoing'">
      <div
        class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
        :style="{ background: RARITIES[row.outgoing.offerRi].color }"
      >
        {{ glyphFor(row.outgoing.offerSi) }}
      </div>
      <div class="min-w-[160px] flex-1">
        <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">
          You offered: {{ RARITIES[row.outgoing.offerRi].label }}
          {{ SUBJECTS[row.outgoing.offerSi].name }}
          <span
            class="ml-1 rounded px-1.5 py-0.5 font-mono text-[9px] tracking-[0.04em] whitespace-nowrap uppercase"
            style="background: rgba(162, 179, 165, 0.18); color: var(--color-ink-dim)"
          >
            Awaiting response
          </span>
        </p>
        <p class="text-ink-faint font-mono text-[10.5px]">
          For {{ row.outgoing.poster }}'s {{ RARITIES[row.outgoing.targetRi].label }}
          {{ SUBJECTS[row.outgoing.targetSi].name }}
        </p>
      </div>
    </template>

    <template v-else>
      <div
        class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[17px]"
        :style="{ background: RARITIES[row.ask.ri].color }"
      >
        {{ glyphFor(row.ask.si) }}
      </div>
      <div class="min-w-[160px] flex-1">
        <p class="text-ink m-0 mb-0.5 text-[13.5px] font-semibold">
          {{ SUBJECTS[row.ask.si].name }}
          <span class="text-ink-faint font-normal">({{ RARITIES[row.ask.ri].label }})</span>
        </p>
        <p class="text-ink-faint font-mono text-[10.5px]">{{ tradeWantLabel(row.ask) }}</p>
      </div>
      <Button variant="secondary" class="shrink-0" @click.stop="trading.cancelTradeAsk(row.ask.id)"
        >Cancel</Button
      >
    </template>
  </div>
</template>
