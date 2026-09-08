<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { seedRng } from '@/modules/common/utils/rng'
import { useCardsStore } from '@/modules/cards/store'
import { useAlbumsStore } from '@/modules/albums/store'
import { MILESTONES } from '@/modules/albums/constants'
import { useAchievementsStore } from '@/modules/achievements/store'
import { usePacksStore } from '@/modules/packs/store'
import { useListingsStore } from '@/modules/listings/store'
import { useMarketplaceStore } from '@/modules/marketplace/store'
import { useTradingStore } from '@/modules/trading/store'
import { useSocialStore } from '@/modules/social/store'

/**
 * Every simulate/reset control from across the app, gathered in one place —
 * scaffolding for demoing mechanics that depend on other players, scheduled
 * events, or live services this prototype doesn't have. None of this exists
 * in the real product.
 */

const cards = useCardsStore()
const albums = useAlbumsStore()
const achievements = useAchievementsStore()
const packs = usePacksStore()
const listings = useListingsStore()
const marketplace = useMarketplaceStore()
const trading = useTradingStore()
const social = useSocialStore()

const simTier = ref(100)
const fillTarget = ref(MILESTONES[0])

function simulateClosures(n: number) {
  for (let i = 0; i < n; i++) achievements.closedAlbumsHistory.push({ pct: simTier.value })
  achievements.checkAchievements()
}

function simulateIncompleteClosure() {
  if (achievements.closedAlbumsHistory.some((c) => c.pct === 100))
    achievements.incompleteAfterFullFlag = true
  achievements.checkAchievements()
}

/**
 * Grants whatever's needed to jump straight to a milestone, through the same
 * ownership → auto-fill path a real pull would (so counts stay internally
 * consistent), rather than flipping `filled` directly.
 */
function jumpToMilestone(targetPct: number) {
  const targetCount = Math.ceil(albums.album.slots.length * (targetPct / 100))
  const unfilled = albums.album.slots.filter((s) => !s.filled)
  for (let i = unfilled.length - 1; i > 0; i--) {
    const j = Math.floor(seedRng() * (i + 1))
    ;[unfilled[i], unfilled[j]] = [unfilled[j], unfilled[i]]
  }
  let filledNow = albums.album.slots.length - unfilled.length
  for (const slot of unfilled) {
    if (filledNow >= targetCount) break
    cards.addOwnership(slot.subjectIndex, slot.rarity, 1)
    filledNow++
  }
  albums.tryAutoFillSlots()
  achievements.checkAchievements()
  social.checkFullAlbumShare()
}

function closeAlbumNow() {
  albums.closeAlbum()
}
</script>

<template>
  <div>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Internal · not part of the product
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Demo Tools</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Every simulate/reset control from across the prototype, gathered in one place. These stand in
      for things a real build would get from other players, scheduled events, or live services this
      prototype doesn't have — nothing here exists in the real product.
    </p>

    <p class="font-display mb-3.5 text-xl">Packs</p>
    <div class="border-line-strong mt-5.5 mb-10 rounded-lg border border-dashed px-5 py-4.5">
      <p class="text-ink-faint mb-2.5 text-xs leading-relaxed">
        Grants Eye of the Nile packs directly — standing in for a loyalty action (login streak,
        mission, etc.) that would normally grant one.
      </p>
      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" @click="packs.addPacks(1)">Add 1 pack</Button>
        <Button variant="secondary" @click="packs.addPacks(5)">Add 5 packs</Button>
      </div>
    </div>

    <p class="font-display mb-3.5 text-xl">Albums</p>
    <div class="border-line-strong mt-5.5 mb-10 rounded-lg border border-dashed px-5 py-4.5">
      <p class="text-ink-faint mb-3.5 text-xs leading-relaxed">
        Simulates past album closures so the collection-wide achievements have something to chase
        live, without needing dozens of real playthroughs.
      </p>
      <div class="mb-2.5 flex flex-wrap items-center gap-2.5">
        <select
          v-model.number="simTier"
          class="bg-panel text-ink border-line-strong max-w-[160px] rounded-md border px-2.5 py-2 text-[13px]"
        >
          <option v-for="m in MILESTONES" :key="m" :value="m">{{ m }}%</option>
        </select>
        <Button variant="secondary" @click="simulateClosures(1)">Simulate 1 closure</Button>
        <Button variant="secondary" @click="simulateClosures(5)">Simulate 5 closures</Button>
      </div>
      <p class="text-ink-faint my-3.5 text-xs leading-relaxed">
        Closing the real "Eye of the Nile" album is permanent in this prototype, so the hidden
        achievement that needs an incomplete closure has its own simulate button instead of costing
        you the live album.
      </p>
      <div class="mb-2.5 flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" @click="simulateIncompleteClosure">
          Simulate an incomplete closure (needs a prior Legendary close)
        </Button>
      </div>
      <p class="text-ink-faint my-3.5 text-xs leading-relaxed">
        Closes the live Eye of the Nile album right now — standing in for its scheduled closing date
        arriving.
      </p>
      <div class="mb-2.5 flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" :disabled="!albums.album.active" @click="closeAlbumNow"
          >Close Eye of the Nile now</Button
        >
      </div>
      <p class="text-ink-faint my-3.5 text-xs leading-relaxed">
        With 80 slots, reaching a milestone one pack at a time isn't demoable live — grants
        whatever's needed to jump straight to a checkpoint.
      </p>
      <div class="flex flex-wrap items-center gap-2.5">
        <select
          v-model.number="fillTarget"
          class="bg-panel text-ink border-line-strong max-w-[160px] rounded-md border px-2.5 py-2 text-[13px]"
        >
          <option v-for="m in MILESTONES" :key="m" :value="m">{{ m }}%</option>
        </select>
        <Button variant="secondary" @click="jumpToMilestone(fillTarget)">Jump to milestone</Button>
      </div>
    </div>

    <p class="font-display mb-3.5 text-xl">Trade</p>
    <div class="border-line-strong mt-5.5 mb-10 rounded-lg border border-dashed px-5 py-4.5">
      <p class="text-ink-faint mb-2.5 text-xs leading-relaxed">
        Simulates another player responding to one of your posted asks — either a match to your
        want-list or a counter-offer needing your review.
      </p>
      <div class="mb-2.5 flex flex-wrap items-center gap-2.5">
        <Button
          variant="secondary"
          :disabled="trading.tradeAsksEligibleForOffer().length === 0"
          @click="trading.simulateIncomingTradeOffer()"
        >
          Simulate an incoming offer
        </Button>
      </div>
      <p class="text-ink-faint my-3.5 text-xs leading-relaxed">
        Simulates a response to one of your outgoing counter-offers (sent from Browse the board) —
        resolves a random one, roughly 70% accepted.
      </p>
      <div class="flex flex-wrap items-center gap-2.5">
        <Button
          variant="secondary"
          :disabled="trading.myOutgoingProposals.length === 0"
          @click="trading.simulateRandomTradeResponse()"
        >
          Simulate a response to your counter
        </Button>
      </div>
    </div>

    <p class="font-display mb-3.5 text-xl">Listings &amp; Marketplace</p>
    <div class="border-line-strong mt-5.5 mb-10 rounded-lg border border-dashed px-5 py-4.5">
      <p class="text-ink-faint mb-2.5 text-xs leading-relaxed">
        Simulates another player buying one of your active Listings for this album — a green
        indicator shows on the album tile and the Listings button until you confirm it and collect
        the BC.
      </p>
      <div class="mb-2.5 flex flex-wrap items-center gap-2.5">
        <Button
          variant="secondary"
          :disabled="listings.myListings.length === 0"
          @click="listings.simulateListingSale()"
        >
          Simulate a listing being bought
        </Button>
      </div>
      <p class="text-ink-faint my-3.5 text-xs leading-relaxed">
        Resets the BC pack shop's daily/weekly/monthly purchase counters.
      </p>
      <div class="flex flex-wrap items-center gap-2.5">
        <Button variant="secondary" @click="marketplace.resetPurchaseLimits()"
          >Reset purchase limits</Button
        >
      </div>
    </div>

    <p class="text-ink-faint border-line mt-5.5 border-t pt-3.5 text-[11px] leading-relaxed">
      None of this exists in the real product — it's scaffolding for demoing mechanics that depend
      on other players, scheduled events, or live services this prototype doesn't have.
    </p>
  </div>
</template>
