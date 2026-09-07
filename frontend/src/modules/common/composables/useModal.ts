import { shallowRef, markRaw, type Component } from 'vue'

/**
 * Single global modal slot — mirrors the prototype's one `#modal-root`.
 * Whatever calls `open()` is rendered by <ModalHost/> in App.vue; the opened
 * component is responsible for its own <Modal> chrome and closing itself.
 */
const activeComponent = shallowRef<Component | null>(null)
const activeProps = shallowRef<Record<string, unknown>>({})

export function useModal() {
  function open(component: Component, props: Record<string, unknown> = {}) {
    activeComponent.value = markRaw(component)
    activeProps.value = props
  }
  function close() {
    activeComponent.value = null
    activeProps.value = {}
  }
  return { activeComponent, activeProps, open, close }
}
