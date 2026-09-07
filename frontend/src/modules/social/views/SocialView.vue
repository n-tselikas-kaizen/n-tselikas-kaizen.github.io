<script setup lang="ts">
import { useSocialStore } from '../store'
import ProfileHeader from '../components/ProfileHeader.vue'

const social = useSocialStore()
</script>

<template>
  <div>
    <p class="text-gold m-0 mb-2 font-mono text-xs tracking-[0.14em] uppercase">
      Social · mock profile · Share domain, Pillars 14–15
    </p>
    <h1 class="m-0 mb-1.5 text-[46px] leading-none">Social</h1>
    <p class="text-ink-dim mb-7 max-w-[660px] text-[14.5px] leading-relaxed">
      Your identity — equip whichever title and badges you want to show off. This is a stand-in for
      Betano's real Social profile page — not a real integration.
    </p>

    <ProfileHeader />

    <p class="font-display mt-2 mb-3.5 text-xl">Recent Shares</p>
    <p class="text-ink-faint -mt-2 mb-3 text-xs leading-relaxed">
      A mocked feed — confirming a share here is what it's standing in for, since nothing actually
      posts to Betano's Social platform yet.
    </p>

    <p v-if="social.sharedMoments.length === 0" class="text-ink-faint m-0 text-xs leading-relaxed">
      Nothing shared yet — share a pull, an album milestone, or a Legendary close and it'll show up
      here.
    </p>
    <div v-else>
      <div
        v-for="(moment, i) in social.sharedMoments"
        :key="i"
        class="shared-moment-card"
        :style="{ borderLeftColor: moment.color }"
      >
        <div class="shared-moment-glyph" :style="{ color: moment.color }">{{ moment.glyph }}</div>
        <div class="shared-moment-info">
          <p class="shared-moment-title">{{ moment.title }}</p>
          <p class="shared-moment-subtitle">{{ moment.subtitle }}</p>
          <p class="shared-moment-body">{{ moment.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shared-moment-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--color-panel);
  border: 1px solid var(--color-line-strong);
  border-left: 3px solid var(--color-gold);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.shared-moment-glyph {
  font-size: 22px;
  line-height: 1.3;
  flex-shrink: 0;
}
.shared-moment-info {
  flex: 1;
  min-width: 0;
}
.shared-moment-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 0.01em;
  margin: 0;
  color: var(--color-ink);
}
.shared-moment-subtitle {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-ink-faint);
  margin: 2px 0 4px;
}
.shared-moment-body {
  font-size: 12px;
  color: var(--color-ink-dim);
  line-height: 1.5;
  margin: 0;
}
</style>
