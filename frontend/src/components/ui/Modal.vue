<script setup lang="ts">
import { useModal } from '@/modules/common/composables/useModal'

withDefaults(defineProps<{ wide?: boolean }>(), { wide: false })
const { close } = useModal()
</script>

<template>
  <div
    class="fixed inset-0 z-[1000] flex items-center justify-center p-6"
    style="background: rgba(6, 13, 9, 0.72)"
    @click.self="close"
  >
    <div
      class="bg-panel-raised border-line-strong relative w-full max-h-[82vh] overflow-y-auto rounded-xl border px-[26px] pt-[26px] pb-5"
      :class="wide ? 'max-w-[700px]' : 'max-w-[560px]'"
    >
      <button
        class="bg-panel border-line-strong text-ink-dim hover:text-gold hover:border-gold absolute top-4 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full border text-sm"
        @click="close"
      >
        ✕
      </button>
      <slot />
    </div>
  </div>
</template>
