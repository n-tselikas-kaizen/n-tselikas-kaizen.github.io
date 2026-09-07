/** Tiny deterministic PRNG — fixed seed so seeded catalog/state stays reproducible across reloads. */
export function mulberry32(a: number) {
  return function (): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const seedRng = mulberry32(20260907)

export function weightedDraw(odds: number[]): number {
  const r = Math.random()
  let cum = 0
  for (let i = 0; i < odds.length; i++) {
    cum += odds[i]
    if (r <= cum) return i
  }
  return odds.length - 1
}
