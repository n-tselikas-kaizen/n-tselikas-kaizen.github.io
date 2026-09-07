import { ref } from 'vue'

/** Full-screen gold flash — fires once per Legendary pull reveal, from anywhere. */
const flashing = ref(false)

export function useLegendaryFlash() {
  function trigger() {
    flashing.value = false
    requestAnimationFrame(() => {
      flashing.value = true
    })
  }
  return { flashing, trigger }
}
