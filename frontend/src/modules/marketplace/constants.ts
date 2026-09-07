import type { PackShopEntry } from './types'

/** The BC pack shop — Marketplace screen. Prices/caps are placeholders pending a real economy-balance pass. */
export const PACK_SHOP: PackShopEntry[] = [
  { key: 'single', label: '1 Pack', qty: 1, price: 10, limitLabel: '5 / day', cap: 5 },
  { key: 'bundle10', label: '10-Pack Bundle', qty: 10, price: 90, limitLabel: '1 / week', cap: 1 },
  {
    key: 'bundle30',
    label: '30-Pack Bundle',
    qty: 30,
    price: 240,
    limitLabel: '1 / month',
    cap: 1,
  },
]
