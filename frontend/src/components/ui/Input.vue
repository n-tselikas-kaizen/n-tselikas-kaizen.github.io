<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number
    type?: 'text' | 'number'
    step?: string
    min?: string
    maxlength?: number
    placeholder?: string
  }>(),
  { type: 'text' },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :step="step"
    :min="min"
    :maxlength="maxlength"
    :placeholder="placeholder"
    class="bg-panel text-ink border-line-strong w-full max-w-[340px] rounded-md border px-[10px] py-2 font-sans text-[13px]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
