<script setup lang="ts">
import { useModal } from '@/modules/common/composables/useModal'

const { activeComponent, activeProps } = useModal()
</script>

<template>
  <component :is="activeComponent" v-if="activeComponent" v-bind="activeProps" />
</template>
