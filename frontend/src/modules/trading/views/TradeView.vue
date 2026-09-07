<script setup lang="ts">
import { computed } from 'vue'
import { useTradingStore } from '../store'
import { useModal } from '@/modules/common/composables/useModal'
import { useAlbumsStore } from '@/modules/albums/store'
import { CURRENT_ALBUM_ID } from '@/modules/albums/constants'
import TradeActivityRow from '../components/TradeActivityRow.vue'
import TradeBoardRow from '../components/TradeBoardRow.vue'
import TradeTableModal from '../components/TradeTableModal.vue'
import Button from '@/components/ui/Button.vue'

const trading = useTradingStore()
const albums = useAlbumsStore()
const modal = useModal()

const visibleBoard = computed(() => trading.marketTradeAsks.filter((a) => !a.reserved))

function openPost() {
  modal.open(TradeTableModal, { context: 'compose' })
}
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'album', params: { albumId: CURRENT_ALBUM_ID } }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← {{ albums.album.name }}
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Trade · {{ albums.album.name }} · browsable board, no pricing
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Trade</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Post a spare card with what you'd take for it, or browse what other players are offering.
      Every trade is card-for-card — no Betano Coins, no valuation formula anywhere in this screen.
      There's no friends list yet, so this board is how players find each other to trade at all; a
      direct, named trade with someone you already know is a natural addition once Social supports
      that, not a replacement for this.
    </p>

    <p class="font-display m-0 mb-3.5 text-xl">Your active asks</p>
    <p class="text-ink-faint -mt-2 mb-3 text-xs leading-relaxed">
      Everything happening with your asks in one place — review a proposal, collect a completed
      trade, or just wait.
    </p>
    <div id="trade-activity-list">
      <TradeActivityRow v-for="(row, i) in trading.activityRows" :key="i" :row="row" />
      <p v-if="trading.activityRows.length === 0" class="text-ink-faint m-0 text-xs">
        Nothing posted yet — set up an ask below.
      </p>
    </div>

    <Button variant="primary" class="mt-5 w-full" @click="openPost">+ Post an ask</Button>
    <p class="text-ink-faint mt-3.5 min-h-[16px] font-mono text-[11.5px]">{{ trading.postLog }}</p>

    <p class="font-display mt-8 mb-3.5 text-xl">Browse the board</p>
    <div id="trade-board-list">
      <TradeBoardRow v-for="ask in visibleBoard" :key="ask.id" :ask="ask" />
      <p v-if="visibleBoard.length === 0" class="text-ink-faint m-0 text-xs">
        No open asks on the board right now.
      </p>
    </div>

    <p class="text-ink-faint border-line mt-[22px] border-t pt-3.5 text-[11px] leading-relaxed">
      Mocked asks and responses from synthetic demo accounts — not a real multi-user trade session
      yet. Accepting is final the instant it happens; Claim only adds the card to your collection
      afterward, it doesn't re-confirm or undo anything. If this album closes, any unclaimed trade
      cards or unfulfilled asks here convert to BC (or return to your pool first) along with the
      rest of your unclaimed spares.
    </p>
  </div>
</template>
