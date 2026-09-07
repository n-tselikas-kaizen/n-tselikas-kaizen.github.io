import { ref, shallowRef, markRaw, type Component } from 'vue'

export interface ToastEntry {
  id: number
  component: Component
  props: Record<string, unknown>
  dwellMs: number
}

/**
 * Shared toast queue — mirrors the prototype's single `#ach-toast-root`.
 * Achievement unlocks, milestone claims, and album-closure liquidation all
 * push through here (in the original they were separate ad-hoc DOM inserts;
 * unifying them means two toasts can never visually overlap).
 */
const queue: ToastEntry[] = []
const current = shallowRef<ToastEntry | null>(null)
const visible = ref(false)
let seq = 0

function showNext() {
  const next = queue.shift()
  if (!next) {
    current.value = null
    return
  }
  current.value = next
  visible.value = false
  requestAnimationFrame(() => {
    visible.value = true
  })
  setTimeout(() => {
    visible.value = false
    setTimeout(showNext, 400)
  }, next.dwellMs)
}

export function useToast() {
  function push(component: Component, props: Record<string, unknown> = {}, dwellMs = 2400) {
    queue.push({ id: seq++, component: markRaw(component), props, dwellMs })
    if (!current.value) showNext()
  }
  return { push, current, visible }
}
