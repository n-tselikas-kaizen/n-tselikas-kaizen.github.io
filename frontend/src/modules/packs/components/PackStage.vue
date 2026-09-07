<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { THEME_ICON } from '@/modules/cards/constants'
import { usePacksStore } from '../store'
import type { Pull } from '../types'
import '../styles.css'

/**
 * The metallic-foil pack + katana-style slash-to-open gesture. Drag a
 * straight line across the pack (mouse or touch), any direction, starting
 * anywhere in this component's area (not just on the pack itself) — on
 * release, if the line is long enough and splits the pack into two
 * substantial pieces, it "cuts": the two halves clip along that line and
 * fly apart, the store's openPack() commits the 5 pulls immediately (before
 * the fly-apart animation even finishes), and after a settle beat `opened`
 * fires with the results for the parent to move on to the reveal.
 */
const emit = defineEmits<{ opened: [pulls: Pull[]] }>()

const packs = usePacksStore()

const stageRoot = ref<HTMLElement | null>(null)
const packEl = ref<HTMLElement | null>(null)
const trailSvgEl = ref<SVGSVGElement | null>(null)

const shaking = ref(false)
const flying = ref(false)
const trailLive = ref(false)
const flashShow = ref(false)
const cutTriggered = ref(false)

const halfAStyle = ref<Record<string, string>>({})
const halfBStyle = ref<Record<string, string>>({})
const flashStyle = ref<Record<string, string>>({})

type Pt = { x: number; y: number; t: number }
let trailPts: Pt[] = []
let trailRaf = 0
const TRAIL_MS = 220

let dragging = false
let startPt: { x: number; y: number } | null = null

function localPt(e: Event): { x: number; y: number } {
  const te = e as TouchEvent
  const t = te.touches && te.touches.length ? te.touches[0] : (e as unknown as MouseEvent)
  const r = packEl.value!.getBoundingClientRect()
  return { x: t.clientX - r.left, y: t.clientY - r.top }
}

function drawTrail() {
  const svg = trailSvgEl.value
  if (!svg) return
  if (trailPts.length < 2) {
    svg.innerHTML = ''
    return
  }
  const pts = trailPts.map((q) => q.x.toFixed(1) + ',' + q.y.toFixed(1)).join(' ')
  const tip = trailPts
    .slice(-4)
    .map((q) => q.x.toFixed(1) + ',' + q.y.toFixed(1))
    .join(' ')
  svg.innerHTML =
    `<polyline points="${pts}" fill="none" stroke="var(--color-gold)" stroke-opacity="0.5" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<polyline points="${tip}" fill="none" stroke="#fff" stroke-opacity="0.95" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
}

function trailFrame(now: number) {
  const cut = now - TRAIL_MS
  while (trailPts.length && trailPts[0].t < cut) trailPts.shift()
  drawTrail()
  if (trailLive.value || trailPts.length) trailRaf = requestAnimationFrame(trailFrame)
}

// Standard polygon half-plane clipping: splits rectangle [0,0,W,H] into the
// side of the line (through p0, direction d) chosen by `sign`.
function halfPoly(W: number, H: number, p0: number[], d: number[], sign: number): number[][] {
  const poly = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ]
  const f = (q: number[]) => sign * ((q[0] - p0[0]) * d[1] - (q[1] - p0[1]) * d[0])
  const out: number[][] = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const fa = f(a)
    const fb = f(b)
    if (fa <= 0) out.push(a)
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}

function polyArea(poly: number[][]): number {
  let s2 = 0
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    s2 += a[0] * b[1] - b[0] * a[1]
  }
  return Math.abs(s2) / 2
}

function polyCentroid(poly: number[][]): number[] {
  let x = 0
  let y = 0
  for (const p of poly) {
    x += p[0]
    y += p[1]
  }
  return [x / poly.length, y / poly.length]
}

function polyCss(poly: number[][]): string {
  return (
    'polygon(' + poly.map((q) => q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px').join(',') + ')'
  )
}

interface CutChord {
  p0: number[]
  d: number[]
  mag: number
  A: number[][]
  B: number[][]
}

// A genuine slash: long enough (>=35% of the pack's shorter side) and
// splitting it into two meaningfully-sized halves (each >=15% of the area)
// — otherwise it was just a nick or a tap, not a cut.
function computeCutChord(W: number, H: number, p0: number[], p1: number[]): CutChord | null {
  const d = [p1[0] - p0[0], p1[1] - p0[1]]
  const mag = Math.hypot(d[0], d[1])
  if (mag < Math.min(W, H) * 0.35) return null
  const A = halfPoly(W, H, p0, d, 1)
  const B = halfPoly(W, H, p0, d, -1)
  if (A.length < 3 || B.length < 3) return null
  const full = W * H
  if (Math.min(polyArea(A), polyArea(B)) < full * 0.15) return null
  return { p0, d, mag, A, B }
}

function onDown(e: Event) {
  if (cutTriggered.value) return
  const target = e.target as HTMLElement | null
  if (target && target.closest('button')) return // don't hijack the fallback button's own tap
  dragging = true
  startPt = localPt(e)
  trailPts = [{ ...startPt, t: performance.now() }]
  if (trailSvgEl.value && packEl.value) {
    trailSvgEl.value.setAttribute(
      'viewBox',
      `0 0 ${packEl.value.clientWidth} ${packEl.value.clientHeight}`,
    )
  }
  trailLive.value = true
  cancelAnimationFrame(trailRaf)
  trailRaf = requestAnimationFrame(trailFrame)
}

function onMove(e: Event) {
  if (!dragging || cutTriggered.value) return
  const p = localPt(e)
  trailPts.push({ ...p, t: performance.now() })
  if (trailPts.length > 40) trailPts.shift()
  if (e.cancelable) e.preventDefault()
}

function onUp(e: Event) {
  if (!dragging) return
  dragging = false
  trailLive.value = false
  const te = e as TouchEvent
  const client =
    te.changedTouches && te.changedTouches.length
      ? te.changedTouches[0]
      : (e as unknown as MouseEvent)
  const r = packEl.value!.getBoundingClientRect()
  const endPt = { x: client.clientX - r.left, y: client.clientY - r.top }
  const W = packEl.value!.clientWidth
  const H = packEl.value!.clientHeight
  const chord = computeCutChord(W, H, [startPt!.x, startPt!.y], [endPt.x, endPt.y])
  if (chord) {
    cutTriggered.value = true
    detachDragHandlers()
    performCut(chord)
  }
  // An incomplete slash just lets the trail fade — no penalty, try again.
}

function attachDragHandlers() {
  const el = stageRoot.value
  if (!el) return
  el.addEventListener('mousedown', onDown)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  el.addEventListener('touchstart', onDown, { passive: true })
  el.addEventListener('touchmove', onMove, { passive: false })
  el.addEventListener('touchend', onUp)
}

function detachDragHandlers() {
  cancelAnimationFrame(trailRaf)
  const el = stageRoot.value
  if (el) {
    el.removeEventListener('mousedown', onDown)
    el.removeEventListener('touchstart', onDown)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('touchend', onUp)
  }
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
}

// The cut itself: clip the two always-present halves along the chord, fling
// them apart in opposite perpendicular directions (whichever half sits on
// which side of the line decides which way it flies), flash the cut line,
// then hand off to the store's openPack() — which commits the pulls right
// away, before a single frame of this animation has even settled.
function performCut(chord: CutChord) {
  const ux = chord.d[0] / chord.mag
  const uy = chord.d[1] / chord.mag
  const nx = -uy
  const ny = ux
  const force = 150 + Math.random() * 70

  const cA = polyCentroid(chord.A)
  const sideA = (cA[0] - chord.p0[0]) * chord.d[1] - (cA[1] - chord.p0[1]) * chord.d[0] < 0 ? 1 : -1

  halfAStyle.value = {
    clipPath: polyCss(chord.A),
    '--flyx': (nx * force * sideA).toFixed(0) + 'px',
    '--flyy': (ny * force * sideA - 34).toFixed(0) + 'px',
    '--flyr': (sideA * (12 + Math.random() * 14)).toFixed(0) + 'deg',
  }
  halfBStyle.value = {
    clipPath: polyCss(chord.B),
    '--flyx': (nx * force * -sideA).toFixed(0) + 'px',
    '--flyy': (ny * force * -sideA + 22).toFixed(0) + 'px',
    '--flyr': (-sideA * (10 + Math.random() * 14)).toFixed(0) + 'deg',
  }

  flashStyle.value = {
    left: chord.p0[0].toFixed(1) + 'px',
    top: chord.p0[1].toFixed(1) + 'px',
    width: (chord.mag * 1.2).toFixed(0) + 'px',
    transform:
      'rotate(' + ((Math.atan2(chord.d[1], chord.d[0]) * 180) / Math.PI).toFixed(2) + 'deg)',
  }
  flashShow.value = true

  shaking.value = true
  setTimeout(() => {
    shaking.value = false
    flying.value = true
  }, 60)

  const pulls = packs.openPack() // commits the 5 pulls immediately
  setTimeout(() => emit('opened', pulls), 950) // lets the halves finish their 750ms fly-apart plus a settle beat
}

// Button fallback — no real drag, so it plays a fixed diagonal chord
// (corner to corner) through the exact same performCut() path, so both ways
// of opening a pack end up looking identical.
function autoSlash() {
  if (cutTriggered.value) return
  cutTriggered.value = true
  detachDragHandlers()
  if (!packEl.value) return
  const W = packEl.value.clientWidth
  const H = packEl.value.clientHeight
  const chord = computeCutChord(W, H, [W * 0.12, H * 0.82], [W * 0.88, H * 0.18])
  if (chord) performCut(chord)
}

function onTapFallback() {
  if (!cutTriggered.value) autoSlash()
}

onMounted(() => {
  if (packs.packInventory > 0) attachDragHandlers()
})
onBeforeUnmount(() => {
  detachDragHandlers()
})
</script>

<template>
  <template v-if="packs.packInventory <= 0">
    <div class="text-center">
      <p class="text-ink-dim mx-auto mb-4 max-w-[340px] text-[13.5px] leading-relaxed">
        You don't have any Eye of the Nile packs to open right now. Earn one through Loyalty, buy
        some on Marketplace, or add some from Demo Tools.
      </p>
      <button
        class="text-ink-faint border-line-strong cursor-default rounded-md border px-4 py-2 text-[12.5px]"
        disabled
        title="Coming in a later iteration"
      >
        Browse pack bundles
      </button>
    </div>
  </template>
  <template v-else>
    <div ref="stageRoot" class="flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div ref="packEl" class="pack-card-face" :class="{ shaking }">
        <div class="pack-half a" :class="{ flying }" :style="halfAStyle">
          <span class="p-theme">Eye of the Nile</span>
          <span class="p-glyph">{{ THEME_ICON }}</span>
          <span class="p-name">Pack</span>
        </div>
        <div class="pack-half b" :class="{ flying }" :style="halfBStyle">
          <span class="p-theme">Eye of the Nile</span>
          <span class="p-glyph">{{ THEME_ICON }}</span>
          <span class="p-name">Pack</span>
        </div>
        <svg ref="trailSvgEl" class="pack-trail" :class="{ live: trailLive }"></svg>
        <div class="pack-cut-flash" :class="{ show: flashShow }" :style="flashStyle"></div>
      </div>
      <p class="text-ink-faint m-0 text-center font-mono text-[11px] tracking-[0.04em]">
        Slash across the pack, any direction
      </p>
      <button
        class="bg-gold text-gold-ink disabled:bg-line-strong disabled:text-ink-faint rounded-md px-[22px] py-[10px] font-sans text-[13.5px] font-semibold"
        :disabled="cutTriggered"
        @click="onTapFallback"
      >
        Or tap here
      </button>
    </div>
  </template>
</template>
