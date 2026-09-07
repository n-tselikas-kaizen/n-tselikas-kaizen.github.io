<script setup lang="ts">
import { useToast } from '@/modules/common/composables/useToast'

const { current, visible } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed top-4 right-4 left-4 z-[1200] flex flex-col items-end gap-2 sm:left-auto"
  >
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-8px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-8px]"
    >
      <component :is="current.component" v-if="current && visible" v-bind="current.props" />
    </Transition>
  </div>
</template>
