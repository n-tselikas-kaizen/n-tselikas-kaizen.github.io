<script setup lang="ts" generic="T extends string | number | null">
defineProps<{
  options: { value: T; label: string }[]
  modelValue: T
}>()
defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      class="rounded-full border px-[14px] py-[6px] font-mono text-[11px]"
      :class="
        modelValue === opt.value
          ? 'border-gold text-gold bg-gold/10'
          : 'border-line-strong text-ink-dim bg-transparent'
      "
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
