<script setup lang="ts">
import { computed } from 'vue'
import { useSocialStore } from '../store'
import { AVATAR_GLYPHS } from '../constants'
import { useModal } from '@/modules/common/composables/useModal'
import { useAchievementsStore } from '@/modules/achievements/store'
import { ACHIEVEMENTS } from '@/modules/achievements/constants'
import TitleEquipModal from './TitleEquipModal.vue'
import BadgeEquipModal from './BadgeEquipModal.vue'

const social = useSocialStore()
const achievements = useAchievementsStore()
const { open } = useModal()

const avatarGlyph = computed(() => AVATAR_GLYPHS[social.profile.avatarIdx])

const equippedTitle = computed(() => {
  const id = social.profile.equippedTitleId
  return id ? (ACHIEVEMENTS.find((a) => a.id === id) ?? null) : null
})

/** The 3 badge showcase slots, resolved to their achievement (or null if empty). */
const badgeSlots = computed(() =>
  social.profile.equippedBadgeIds.map((id) =>
    id ? (ACHIEVEMENTS.find((a) => a.id === id) ?? null) : null,
  ),
)

function badgeStyle(slotIdx: number) {
  const ach = badgeSlots.value[slotIdx]
  return ach ? { background: achievements.achRarityColor(ach) } : {}
}

function openTitleModal() {
  open(TitleEquipModal)
}

function openBadgeModal(slotIndex: number) {
  open(BadgeEquipModal, { slotIndex })
}
</script>

<template>
  <div class="profile-header">
    <div class="profile-avatar-wrap">
      <div class="profile-avatar">{{ avatarGlyph }}</div>
      <button class="avatar-shuffle-btn" title="Change avatar" @click="social.cycleAvatar()">
        ⟳
      </button>
    </div>
    <div>
      <input v-model="social.profile.name" class="profile-name-input" maxlength="20" />
      <div class="title-row">
        <p class="profile-title-display" :class="{ 'has-title': !!equippedTitle }">
          <span v-if="equippedTitle" class="shimmer-text">𓋹 {{ equippedTitle.title }} 𓋹</span>
          <template v-else>No title equipped</template>
        </p>
        <button class="title-edit-btn" title="Change title" @click="openTitleModal">✎</button>
      </div>
      <div class="badge-showcase">
        <button
          v-for="(ach, i) in badgeSlots"
          :key="i"
          class="badge-showcase-slot"
          :class="{ filled: !!ach }"
          :style="badgeStyle(i)"
          :title="ach ? `${ach.name} — click to change` : 'Empty badge slot'"
          @click="openBadgeModal(i)"
        >
          {{ ach?.glyph ?? '+' }}
        </button>
      </div>
      <p class="text-ink-faint mt-2 text-xs leading-relaxed">
        Click a badge slot to fill or change it.
      </p>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.profile-avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--color-panel-raised);
  border: 2px solid var(--color-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  color: var(--color-gold);
}
.avatar-shuffle-btn {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: var(--color-panel);
  border: 1px solid var(--color-line-strong);
  color: var(--color-ink-dim);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.avatar-shuffle-btn:hover {
  color: var(--color-gold);
  border-color: var(--color-gold);
}
.profile-name-input {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 29px;
  letter-spacing: 0.01em;
  background: transparent;
  border: none;
  border-bottom: 1px dashed var(--color-line-strong);
  color: var(--color-ink);
  padding: 0 0 3px;
  max-width: 280px;
  width: 100%;
}
.profile-name-input:focus {
  outline: none;
  border-bottom-color: var(--color-gold);
}
.profile-title-display {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--color-ink-faint);
  margin: 0;
}
.profile-title-display.has-title {
  color: var(--color-gold);
}
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}
.title-edit-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-gold);
  border: none;
  color: var(--color-gold-ink);
  cursor: pointer;
  font-size: 11px;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}
.title-edit-btn:hover {
  transform: scale(1.1);
}
.badge-showcase {
  display: flex;
  gap: 10px;
  margin-top: 13px;
}
.badge-showcase-slot {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px dashed var(--color-line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: var(--color-ink-faint);
  flex-shrink: 0;
  background: none;
  cursor: pointer;
  font-family: inherit;
}
.badge-showcase-slot:hover {
  border-color: var(--color-gold);
}
.badge-showcase-slot.filled {
  border-style: solid;
  color: var(--color-gold-ink);
}
</style>
