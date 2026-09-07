import type { CardCombo } from '@/modules/common/types'

/**
 * A posted ask — 1-5 cards you'd take (`wantCards`) for the one spare card
 * (`si`/`ri`) you're giving up. Card-for-card only; no BC, no valuation.
 */
export interface TradeAsk {
  id: string
  si: number
  ri: number
  wantCards: CardCombo[]
}

/**
 * A board ask posted by another (mocked) player. `reserved` means one of the
 * player's own outgoing counters is pending against it — held off the
 * visible board until it resolves (Phase-1: one pending proposal per ask).
 */
export interface MarketTradeAsk extends TradeAsk {
  poster: string
  reserved: boolean
}

/** An incoming proposal against one of the player's own asks, awaiting Accept/Decline. */
export interface TradeProposal {
  id: string
  askId: string
  proposer: string
  si: number
  ri: number
  isMatch: boolean
}

/** The player's own counter-offer sent against a board ask, awaiting a (simulated) response. */
export interface OutgoingProposal {
  id: string
  askId: string
  poster: string
  offerSi: number
  offerRi: number
  targetSi: number
  targetRi: number
}

/** An accepted trade's incoming card, waiting to be collected into ownership. */
export interface TradeClaim {
  id: string
  si: number
  ri: number
  partner: string
}

/**
 * One row of the unified "your active asks" activity list — ordered by how
 * much it needs the player: a decision first, then a quick collect, then
 * things just waiting on someone else, then plain open asks.
 */
export type TradeActivityRow =
  | { kind: 'proposal'; ask: TradeAsk; proposal: TradeProposal }
  | { kind: 'claim'; claim: TradeClaim }
  | { kind: 'outgoing'; outgoing: OutgoingProposal }
  | { kind: 'ask'; ask: TradeAsk }
