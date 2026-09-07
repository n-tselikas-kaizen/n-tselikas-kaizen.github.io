<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  columns: { key: string; label: string }[]
  rows: T[]
  rowKey: (row: T) => string | number
}>()
</script>

<template>
  <table class="border-line-strong w-full border-collapse text-left text-sm">
    <thead>
      <tr class="border-line-strong border-b">
        <th
          v-for="col in columns"
          :key="col.key"
          class="text-ink-faint px-3 py-2 font-mono text-[11px] tracking-wide uppercase"
        >
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="rowKey(row)" class="border-line border-b">
        <td v-for="col in columns" :key="col.key" class="text-ink px-3 py-2">
          <slot :name="col.key" :row="row">{{ row[col.key] }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
