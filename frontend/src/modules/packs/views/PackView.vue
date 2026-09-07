<script setup lang="ts">
import { ref } from 'vue'
import { usePacksStore } from '../store'
import { CURRENT_ALBUM_ID } from '@/modules/albums/constants'
import { useAlbumsStore } from '@/modules/albums/store'
import PackStage from '../components/PackStage.vue'
import PullReveal from '../components/PullReveal.vue'
import type { Pull } from '../types'

const packs = usePacksStore()
const albums = useAlbumsStore()

type Stage = 'stage' | 'reveal'
const stage = ref<Stage>('stage')
const pulls = ref<Pull[]>([])
const packLog = ref('')

function onOpened(newPulls: Pull[]) {
  pulls.value = newPulls
  packLog.value = ''
  stage.value = 'reveal'
}

function onLog(text: string) {
  packLog.value = text
}

/** Purely a UI dismiss — the pulls were already committed to ownership the
 * instant they were drawn (see store.openPack). This just resets the stage
 * back to a fresh pack, ready to slash again. */
function onDismiss() {
  stage.value = 'stage'
  pulls.value = []
  packLog.value = ''
}
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'album', params: { albumId: CURRENT_ALBUM_ID } }"
      class="text-ink-faint hover:text-ink-dim mb-[18px] inline-flex items-center gap-1 font-mono text-xs"
    >
      ← {{ albums.album.name }}
    </RouterLink>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Packs domain · standalone work item
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Packs</h1>
    <p class="text-ink-dim mb-6 font-mono text-xs">Eye of the Nile · Egyptian Gods</p>

    <div class="bg-panel-raised border-line-strong rounded-[10px] border p-[26px]">
      <div class="mb-1.5 flex flex-wrap items-center justify-center gap-[22px]">
        <div class="text-center">
          <p class="text-gold m-0 font-mono text-[34px] leading-none font-semibold">
            {{ packs.packInventory }}
          </p>
          <p class="text-ink-faint mt-1 mb-0 font-mono text-[10.5px] tracking-[0.06em] uppercase">
            packs on hand
          </p>
        </div>
        <label
          class="group flex cursor-pointer items-center gap-[9px] select-none"
          title="Skip the card-by-card reveal and see all 5 pulls at once"
        >
          <input
            v-model="packs.quickOpenMode"
            type="checkbox"
            class="absolute h-px w-px opacity-0"
          />
          <span
            class="border-line-strong bg-panel group-has-[:checked]:border-gold group-has-[:checked]:bg-gold/20 group-has-[:focus-visible]:outline-gold relative h-5 w-[34px] shrink-0 rounded-full border transition-colors group-has-[:focus-visible]:outline group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2"
          >
            <span
              class="bg-ink-faint group-has-[:checked]:bg-gold absolute top-[1px] left-[1px] h-4 w-4 rounded-full transition-transform group-has-[:checked]:translate-x-[14px]"
            />
          </span>
          <span class="text-ink-dim font-mono text-[11.5px] tracking-[0.03em]">Quick open</span>
        </label>
      </div>

      <div
        class="relative flex min-h-[340px] flex-col items-center justify-center gap-4"
        style="perspective: 1100px; touch-action: none"
      >
        <PackStage v-if="stage === 'stage'" @opened="onOpened" />
        <PullReveal
          v-else
          :pulls="pulls"
          :quick-open="packs.quickOpenMode"
          @log="onLog"
          @dismiss="onDismiss"
        />
      </div>
      <p class="text-ink-faint min-h-[16px] text-center font-mono text-[11px]">{{ packLog }}</p>
    </div>
  </div>
</template>
