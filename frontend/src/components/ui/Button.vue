<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    equipped?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', equipped: false, type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-sans transition-colors disabled:cursor-default"
    :class="{
      'bg-gold text-gold-ink px-[22px] py-[11px] text-sm font-semibold disabled:bg-line-strong disabled:text-ink-faint':
        variant === 'primary',
      'border px-[13px] py-[7px] text-[11.5px] font-semibold disabled:border-line-strong disabled:text-ink-faint':
        variant === 'secondary',
      'border-gold text-gold border': variant === 'secondary' && !equipped,
      'bg-gold text-gold-ink border-gold border': variant === 'secondary' && equipped,
      'text-ink-faint hover:text-ink-dim inline-flex items-center gap-1 bg-transparent p-0 font-mono text-xs':
        variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
