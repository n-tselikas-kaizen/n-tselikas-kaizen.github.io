<script setup lang="ts">
import { ref } from 'vue'

const steps = [
  {
    title: 'Collect, Complete, Get Rewarded',
    body: "Every album is a themed collection built from Betano's own game catalogue. Open packs, pull cards, fill every slot, and cash in real rewards along the way. The same mechanics apply to every album, whatever its theme.",
  },
  {
    title: 'Open Packs',
    body: "Every pack always matches one album's theme. Opening one tears it open and reveals five cards — tap each one to flip and reveal it, then tap again to move to the next.",
  },
  {
    title: 'Fill the Album',
    body: "Every specific card and rarity has its own dedicated slot — a Rare Book of Dead and a Legendary Book of Dead are two different slots. The first copy you pull of a slot locks into it automatically. Tap a card in the album to flip it and see what's spare.",
  },
  {
    title: 'Claim Your Reward',
    body: "A filled slot has a real reward waiting (Free Bet, Free Spins, Cash, or Bonus Money) — tap Claim to collect it. Filling and claiming are separate: your progress counts the moment a slot fills, whether or not you've claimed it yet.",
  },
  {
    title: 'Completion Milestones',
    body: 'With dozens of slots in this album, 100% is a long-term goal, not a single session. Checkpoints at 20/40/60/80/100% each pay their own bonus as your collection grows — claim each one as you cross it.',
  },
  {
    title: 'When an Album Closes',
    body: "Every album has a closing date. When it arrives, the album closes on its own and a short closure flow walks you through claiming anything you haven't yet, before it's finalized. After that, you'll find it under Collections.",
  },
  {
    title: 'Achievements, Badges & Titles',
    body: 'Playing naturally earns achievements — some track your whole collection, others are specific to one album. Every one grants a badge; the hardest (and a few quietly weird ones) also grant a Title. Equip your favorites from your Social profile.',
  },
  {
    title: 'Share the Moment',
    body: "A great pull, a fully filled album, or closing an album at 100% completion — these are worth showing off. When one happens, you'll get the option to share it. Nothing posts unless you choose to.",
  },
]

const step = ref(0)
function goTo(i: number) {
  step.value = Math.max(0, Math.min(steps.length - 1, i))
}
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'home' }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← Albums
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">How to Play</p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">How to Play</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Everything you need to know about the core loop — packs, albums, and rewards.
    </p>

    <div class="mb-5 min-h-[400px] py-3 px-1.5 text-center">
      <div
        class="bg-panel-raised border-line-strong mx-auto mb-[22px] flex h-28 w-28 items-center justify-center rounded-full border"
      />
      <p class="text-ink-faint m-0 mb-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        Step {{ step + 1 }} of {{ steps.length }}
      </p>
      <p class="font-display m-0 mb-2.5 text-[27px] tracking-[0.02em]">{{ steps[step].title }}</p>
      <p class="text-ink-dim mx-auto max-w-[440px] text-[13.5px] leading-relaxed">
        {{ steps[step].body }}
      </p>
    </div>

    <div class="flex items-center justify-center gap-[18px]">
      <button
        class="bg-panel border-line-strong text-ink-dim hover:enabled:border-gold hover:enabled:text-gold flex h-[38px] w-[38px] items-center justify-center rounded-full border text-[15px] disabled:opacity-30"
        :disabled="step === 0"
        @click="goTo(step - 1)"
      >
        ←
      </button>
      <div class="flex items-center gap-[7px]">
        <button
          v-for="(_, i) in steps"
          :key="i"
          class="h-2 rounded-full border-none p-0 transition-[width]"
          :class="i === step ? 'bg-gold w-5' : 'bg-line-strong w-2'"
          @click="goTo(i)"
        />
      </div>
      <button
        class="bg-panel border-line-strong text-ink-dim hover:enabled:border-gold hover:enabled:text-gold flex h-[38px] w-[38px] items-center justify-center rounded-full border text-[15px] disabled:opacity-30"
        :disabled="step === steps.length - 1"
        @click="goTo(step + 1)"
      >
        →
      </button>
    </div>
  </div>
</template>
