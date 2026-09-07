import type { MarketTradeAsk } from './types'

/** Mocked demo accounts — used for simulated incoming offers and seeded board posters. */
export const DEMO_BUYER_NAMES = [
  'NileRunner88',
  'ScarabQueen',
  'PharaohFan',
  'DeltaDrifter',
  'SandStormer',
]

/** Mocked other players' asks for this album, seeded like marketListings. */
export const INITIAL_MARKET_TRADE_ASKS: MarketTradeAsk[] = [
  {
    id: 't1',
    poster: 'NileRunner88',
    si: 2,
    ri: 2,
    wantCards: [{ si: 0, ri: 2 }],
    reserved: false,
  },
  {
    id: 't2',
    poster: 'ScarabQueen',
    si: 6,
    ri: 3,
    wantCards: [
      { si: 3, ri: 3 },
      { si: 7, ri: 3 },
    ],
    reserved: false,
  },
  { id: 't3', poster: 'PharaohFan', si: 1, ri: 1, wantCards: [{ si: 5, ri: 1 }], reserved: false },
  {
    id: 't4',
    poster: 'DeltaDrifter',
    si: 4,
    ri: 1,
    wantCards: [{ si: 8, ri: 1 }],
    reserved: false,
  },
]
