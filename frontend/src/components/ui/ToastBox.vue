<script setup lang="ts">
withDefaults(defineProps<{ iconBg?: string; large?: boolean }>(), { iconBg: 'var(--color-gold)' })
</script>

<template>
  <div
    class="bg-panel-raised border-line-strong pointer-events-auto flex items-center gap-[13px] rounded-[10px] border"
    :class="
      large ? 'max-w-[380px] min-w-[340px] px-7 py-5' : 'min-w-[250px] max-w-[380px] px-[18px] py-3'
    "
  >
    <div
      class="text-gold-ink flex shrink-0 items-center justify-center rounded-full"
      :class="large ? 'h-[58px] w-[58px] text-[27px]' : 'h-[42px] w-[42px] text-xl'"
      :style="{ background: iconBg }"
    >
      <slot name="icon" />
    </div>
    <div>
      <p class="text-ink-faint m-0 mb-0.5 font-mono text-[9.5px] tracking-[0.09em] uppercase">
        <slot name="eyebrow" />
      </p>
      <p
        class="text-ink font-display m-0 tracking-[0.02em]"
        :class="large ? 'text-2xl' : 'text-lg'"
      >
        <slot name="name" />
      </p>
      <p v-if="$slots.reward" class="text-gold mt-[3px] font-mono text-[10.5px]">
        <slot name="reward" />
      </p>
    </div>
  </div>
</template>
