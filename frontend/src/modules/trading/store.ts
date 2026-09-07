import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { RARITIES } from '@/modules/common/constants'
import type { CardCombo } from '@/modules/common/types'
import { useCardsStore } from '@/modules/cards/store'
import { SUBJECTS } from '@/modules/cards/constants'
import { useAlbumsStore } from '@/modules/albums/store'
import { useAchievementsStore } from '@/modules/achievements/store'
import { useSocialStore } from '@/modules/social/store'
import { DEMO_BUYER_NAMES, INITIAL_MARKET_TRADE_ASKS } from './constants'
import type {
  TradeAsk,
  MarketTradeAsk,
  TradeProposal,
  OutgoingProposal,
  TradeClaim,
  TradeActivityRow,
} from './types'

/**
 * A counter must land within one rarity tier of at least one of the ask's
 * wanted rarities — this is what stops a Legendary-for-Legendary ask from
 * being "countered" with an Uncommon. It's the soft-collusion guardrail
 * Roadmap §5 flags for Trade (two colluding accounts moving a high-value
 * card for a token amount) without needing a full valuation formula, which
 * would undercut Pillar 13's "negotiated, not priced" premise.
 */
export function isCounterAllowed(a: TradeAsk, ri: number): boolean {
  return a.wantCards.some((w) => Math.abs(w.ri - ri) <= 1)
}

export function askCardMatches(a: TradeAsk, si: number, ri: number): boolean {
  return a.wantCards.some((w) => w.si === si && w.ri === ri)
}

export function tradeWantLabel(a: TradeAsk): string {
  if (a.wantCards.length === 1) {
    const w = a.wantCards[0]
    return 'Wants: ' + RARITIES[w.ri].label + ' ' + SUBJECTS[w.si].name
  }
  return (
    'Wants any of: ' +
    a.wantCards.map((w) => RARITIES[w.ri].label + ' ' + SUBJECTS[w.si].name).join(', ')
  )
}

/**
 * Trading — a browsable per-album trade board, card-for-card only (no BC, no
 * valuation formula). See trading.js in the source prototype for the full
 * behavioral spec this ports; modal/picker UI state (which slot is being
 * edited, the current rarity filter, ...) lives in the trading components
 * instead of here, since that's transient view state rather than domain data.
 */
export const useTradingStore = defineStore('trading', () => {
  const myTradeAsks = reactive<TradeAsk[]>([])
  const marketTradeAsks = reactive<MarketTradeAsk[]>(
    INITIAL_MARKET_TRADE_ASKS.map((a) => ({ ...a, wantCards: a.wantCards.map((w) => ({ ...w })) })),
  )
  const pendingTradeProposals = reactive<TradeProposal[]>([])
  const myOutgoingProposals = reactive<OutgoingProposal[]>([])
  const pendingTradeClaims = reactive<TradeClaim[]>([])
  /** Mirrors the prototype's `#trade-post-log` hint under the Post button. */
  const postLog = ref('')

  let myTradeAskSeq = 1
  let pendingTradeProposalSeq = 1
  let myOutgoingProposalSeq = 1
  let pendingTradeClaimSeq = 1

  const needsReview = computed(() => pendingTradeProposals.length > 0)
  const readyToClaim = computed(() => pendingTradeClaims.length > 0)
  const hasAttention = computed(() => needsReview.value || readyToClaim.value)

  /** Asks not already covered by a pending incoming proposal — eligible targets for a simulated offer. */
  function tradeAsksEligibleForOffer(): TradeAsk[] {
    return myTradeAsks.filter((a) => !pendingTradeProposals.some((p) => p.askId === a.id))
  }

  const activityRows = computed<TradeActivityRow[]>(() => {
    const rows: TradeActivityRow[] = []
    myTradeAsks.forEach((a) => {
      const proposal = pendingTradeProposals.find((p) => p.askId === a.id)
      if (proposal) rows.push({ kind: 'proposal', ask: a, proposal })
    })
    pendingTradeClaims.forEach((c) => rows.push({ kind: 'claim', claim: c }))
    myOutgoingProposals.forEach((p) => rows.push({ kind: 'outgoing', outgoing: p }))
    myTradeAsks.forEach((a) => {
      if (!pendingTradeProposals.some((p) => p.askId === a.id)) rows.push({ kind: 'ask', ask: a })
    })
    return rows
  })

  /** Posting requires >=1 want card and a valid spare of the given card; removes it from ownership immediately. */
  function postTradeAsk(offer: CardCombo, wantCards: CardCombo[]) {
    if (wantCards.length < 1) return
    const cards = useCardsStore()
    if (!cards.removeOwnership(offer.si, offer.ri, 1)) return
    myTradeAsks.push({
      id: 'ask' + myTradeAskSeq++,
      si: offer.si,
      ri: offer.ri,
      wantCards: wantCards.slice(0, 5).map((w) => ({ si: w.si, ri: w.ri })),
    })
    postLog.value =
      'Posted ' + RARITIES[offer.ri].label + ' ' + SUBJECTS[offer.si].name + ' to the board.'
  }

  function cancelTradeAsk(id: string) {
    const idx = myTradeAsks.findIndex((a) => a.id === id)
    if (idx < 0) return
    const a = myTradeAsks[idx]
    useCardsStore().addOwnership(a.si, a.ri, 1) // back into the fungible pool
    myTradeAsks.splice(idx, 1)
  }

  function simulateIncomingTradeOffer() {
    const eligible = tradeAsksEligibleForOffer()
    if (eligible.length === 0) return
    const a = eligible[Math.floor(Math.random() * eligible.length)]
    const proposer = DEMO_BUYER_NAMES[Math.floor(Math.random() * DEMO_BUYER_NAMES.length)]
    const w = a.wantCards[Math.floor(Math.random() * a.wantCards.length)]
    let si: number
    let ri: number
    if (Math.random() < 0.5) {
      si = w.si
      ri = w.ri // an exact match
    } else {
      // A counter — kept within the same +/-1-tier allowance a live player's
      // counter would have to pass, so the demo never shows a "counter" that
      // the rule wouldn't actually let anyone send.
      const lo = Math.max(0, w.ri - 1)
      const hi = Math.min(RARITIES.length - 1, w.ri + 1)
      ri = lo + Math.floor(Math.random() * (hi - lo + 1))
      si = Math.floor(Math.random() * SUBJECTS.length)
    }
    const isMatch = askCardMatches(a, si, ri)
    pendingTradeProposals.push({
      id: 'prop' + pendingTradeProposalSeq++,
      askId: a.id,
      proposer,
      si,
      ri,
      isMatch,
    })
  }

  function acceptTradeProposal(id: string) {
    const idx = pendingTradeProposals.findIndex((p) => p.id === id)
    if (idx < 0) return
    const p = pendingTradeProposals[idx]
    const askIdx = myTradeAsks.findIndex((a) => a.id === p.askId)
    pendingTradeProposals.splice(idx, 1)
    if (askIdx >= 0) myTradeAsks.splice(askIdx, 1) // your offered card was already spent the moment you posted it
    pendingTradeClaims.push({
      id: 'claim' + pendingTradeClaimSeq++,
      si: p.si,
      ri: p.ri,
      partner: p.proposer,
    })
  }

  function declineTradeProposal(id: string) {
    const idx = pendingTradeProposals.findIndex((p) => p.id === id)
    if (idx < 0) return
    pendingTradeProposals.splice(idx, 1) // your ask stays open for a different offer
  }

  function claimTrade(id: string) {
    const idx = pendingTradeClaims.findIndex((c) => c.id === id)
    if (idx < 0) return
    const c = pendingTradeClaims[idx]
    useCardsStore().addOwnership(c.si, c.ri, 1)
    useAlbumsStore().tryAutoFillSlots()
    pendingTradeClaims.splice(idx, 1)
    useAchievementsStore().checkAchievements()
    useSocialStore().checkFullAlbumShare()
  }

  /** Guaranteed match — executes immediately, same as buying a Listing does. */
  function proposeTradeMatch(askId: string, si: number, ri: number) {
    const idx = marketTradeAsks.findIndex((a) => a.id === askId)
    if (idx < 0) return
    const a = marketTradeAsks[idx]
    if (!useCardsStore().removeOwnership(si, ri, 1)) return
    pendingTradeClaims.push({
      id: 'claim' + pendingTradeClaimSeq++,
      si: a.si,
      ri: a.ri,
      partner: a.poster,
    })
    marketTradeAsks.splice(idx, 1) // fulfilled, off the board for good
  }

  function sendCounterTrade(askId: string, si: number, ri: number) {
    const a = marketTradeAsks.find((x) => x.id === askId)
    if (!a || a.reserved) return
    if (!isCounterAllowed(a, ri)) return // defense in depth — the picker already filters to valid options
    if (!useCardsStore().removeOwnership(si, ri, 1)) return
    a.reserved = true // Phase-1 placeholder: one pending proposal per ask, not a real queue
    myOutgoingProposals.push({
      id: 'out' + myOutgoingProposalSeq++,
      askId,
      poster: a.poster,
      offerSi: si,
      offerRi: ri,
      targetSi: a.si,
      targetRi: a.ri,
    })
  }

  /** Exact matches propose instantly; anything else within the counter allowance sends as a counter-offer. */
  function sendTradeResponse(askId: string, si: number, ri: number) {
    const a = marketTradeAsks.find((x) => x.id === askId)
    if (!a) return
    if (askCardMatches(a, si, ri)) proposeTradeMatch(askId, si, ri)
    else if (isCounterAllowed(a, ri)) sendCounterTrade(askId, si, ri)
  }

  function simulateTradeResponse(id: string) {
    const idx = myOutgoingProposals.findIndex((p) => p.id === id)
    if (idx < 0) return
    const p = myOutgoingProposals[idx]
    const a = marketTradeAsks.find((x) => x.id === p.askId)
    myOutgoingProposals.splice(idx, 1)
    const accepted = Math.random() < 0.7
    if (accepted) {
      pendingTradeClaims.push({
        id: 'claim' + pendingTradeClaimSeq++,
        si: p.targetSi,
        ri: p.targetRi,
        partner: p.poster,
      })
      if (a) marketTradeAsks.splice(marketTradeAsks.indexOf(a), 1) // fulfilled, off the board for good
    } else {
      useCardsStore().addOwnership(p.offerSi, p.offerRi, 1) // your counter wasn't taken — card returned
      if (a) a.reserved = false // ask reopens exactly as it was
    }
  }

  /**
   * Demo Tools' generic trigger — picks one of the player's outstanding
   * outgoing counters at random and resolves it, same 70/30 accept/decline
   * odds. Unlike a specific proposal's own row, this button has no single
   * target to act on by design — it stands in for "some player, eventually,
   * responds to one of your counters."
   */
  function simulateRandomTradeResponse() {
    if (myOutgoingProposals.length === 0) return
    const p = myOutgoingProposals[Math.floor(Math.random() * myOutgoingProposals.length)]
    simulateTradeResponse(p.id)
  }

  /**
   * Album-closure cleanup — once the album is gone there's nowhere left for
   * any of these cards to matter. Every outstanding card returns to
   * ownership (the albums store then liquidates whatever's left), and
   * everything trade-related clears.
   */
  function liquidateForClosure() {
    const cards = useCardsStore()
    pendingTradeClaims.forEach((c) => cards.addOwnership(c.si, c.ri, 1))
    myTradeAsks.forEach((a) => cards.addOwnership(a.si, a.ri, 1))
    myOutgoingProposals.forEach((p) => cards.addOwnership(p.offerSi, p.offerRi, 1))
    pendingTradeClaims.splice(0, pendingTradeClaims.length)
    myTradeAsks.splice(0, myTradeAsks.length)
    myOutgoingProposals.splice(0, myOutgoingProposals.length)
    pendingTradeProposals.splice(0, pendingTradeProposals.length)
    marketTradeAsks.splice(0, marketTradeAsks.length)
  }

  return {
    myTradeAsks,
    marketTradeAsks,
    pendingTradeProposals,
    myOutgoingProposals,
    pendingTradeClaims,
    postLog,
    needsReview,
    readyToClaim,
    hasAttention,
    activityRows,
    tradeAsksEligibleForOffer,
    postTradeAsk,
    cancelTradeAsk,
    acceptTradeProposal,
    declineTradeProposal,
    claimTrade,
    proposeTradeMatch,
    sendCounterTrade,
    sendTradeResponse,
    simulateIncomingTradeOffer,
    simulateTradeResponse,
    simulateRandomTradeResponse,
    liquidateForClosure,
  }
})
