import type { Config } from 'tailwindcss'

/** Builds a Tailwind color that supports opacity modifiers (bg-gold/10, etc.) from an RGB-channel CSS var. */
function withOpacity(varName: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined ? `rgb(var(${varName}))` : `rgb(var(${varName}) / ${opacityValue})`
}

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--bg-rgb'),
        panel: withOpacity('--panel-rgb'),
        'panel-raised': withOpacity('--panel-raised-rgb'),
        ink: withOpacity('--ink-rgb'),
        'ink-dim': withOpacity('--ink-dim-rgb'),
        'ink-faint': withOpacity('--ink-faint-rgb'),
        line: 'var(--color-line)',
        'line-strong': 'var(--color-line-strong)',
        gold: withOpacity('--gold-rgb'),
        'gold-ink': withOpacity('--gold-ink-rgb'),
        rarity: {
          common: withOpacity('--rarity-common-rgb'),
          uncommon: withOpacity('--rarity-uncommon-rgb'),
          rare: withOpacity('--rarity-rare-rgb'),
          epic: withOpacity('--rarity-epic-rgb'),
          legendary: withOpacity('--rarity-legendary-rgb'),
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
