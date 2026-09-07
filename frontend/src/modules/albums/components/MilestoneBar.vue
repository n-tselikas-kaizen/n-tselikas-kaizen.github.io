<script setup lang="ts">
import { useAlbumsStore } from '../store'
import { MILESTONES, MILESTONE_BONUS } from '../constants'

const albums = useAlbumsStore()

function canClaim(reached: boolean, isClaimed: boolean) {
  return albums.album.active && reached && !isClaimed
}
</script>

<template>
  <div class="milestone-bar mb-1.5">
    <div class="milestone-bar-track">
      <div
        class="milestone-bar-fill"
        :style="{ width: Math.min(100, albums.currentProgressPct) + '%' }"
      />
      <div
        class="milestone-progress-flag"
        :style="{ left: Math.min(100, albums.currentProgressPct) + '%' }"
      >
        {{ Math.round(albums.currentProgressPct) }}% complete
      </div>
      <button
        v-for="(m, i) in MILESTONES"
        :key="m"
        class="milestone-node"
        :class="{
          ready: canClaim(albums.currentProgressPct >= m, albums.claimedMilestones.includes(i)),
          done: albums.claimedMilestones.includes(i),
        }"
        :style="{ left: m + '%' }"
        :disabled="!canClaim(albums.currentProgressPct >= m, albums.claimedMilestones.includes(i))"
        :title="`${m}% — €${MILESTONE_BONUS[i].toFixed(2)}${albums.claimedMilestones.includes(i) ? ' (claimed)' : ''}`"
        @click="albums.claimMilestone(i)"
      >
        <span
          v-if="canClaim(albums.currentProgressPct >= m, albums.claimedMilestones.includes(i))"
          class="milestone-claim-chip"
        >
          Claim €{{ MILESTONE_BONUS[i].toFixed(2) }}
        </span>
        <span v-else class="milestone-tooltip">
          €{{ MILESTONE_BONUS[i].toFixed(2)
          }}{{ albums.claimedMilestones.includes(i) ? ' (claimed)' : '' }}
        </span>
        <span class="milestone-node-label">{{ m }}%</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.milestone-bar-track {
  position: relative;
  height: 8px;
  background: var(--color-line-strong);
  border-radius: 4px;
  margin: 38px 14px 34px;
}
.milestone-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--color-gold);
  border-radius: 4px;
  transition: width 0.4s ease;
}
.milestone-progress-flag {
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  transform: translateX(-50%);
  background: var(--color-panel-raised);
  border: 1px solid var(--color-gold);
  border-radius: 6px;
  padding: 3px 9px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--color-gold);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 9;
}
.milestone-bar-track:hover .milestone-progress-flag {
  opacity: 1;
}
.milestone-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--color-line-strong);
  background: var(--color-panel);
  padding: 0;
  cursor: default;
}
.milestone-node.done {
  border-color: var(--color-gold);
  background: var(--color-panel-raised);
}
.milestone-node.done::after {
  content: '\2713';
  display: block;
  font-size: 12px;
  color: var(--color-gold);
  line-height: 1;
}
.milestone-node.ready {
  border-color: var(--color-gold);
  background: var(--color-gold);
  cursor: pointer;
  animation: milestonePulse 1.6s ease-in-out infinite;
}
.milestone-claim-chip {
  position: absolute;
  bottom: 100%;
  margin-bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--color-gold);
  color: var(--color-gold-ink);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 4px;
  pointer-events: none;
}
@keyframes milestonePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.55);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(201, 162, 39, 0);
  }
}
.milestone-node-label {
  position: absolute;
  top: 100%;
  margin-top: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  color: var(--color-ink-faint);
}
.milestone-node.done .milestone-node-label,
.milestone-node.ready .milestone-node-label {
  color: var(--color-gold);
}
.milestone-tooltip {
  position: absolute;
  bottom: 100%;
  margin-bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--color-panel-raised);
  border: 1px solid var(--color-line-strong);
  border-radius: 6px;
  padding: 4px 9px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  color: var(--color-ink);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 10;
}
.milestone-node:hover .milestone-tooltip,
.milestone-node:focus .milestone-tooltip {
  opacity: 1;
}
</style>
