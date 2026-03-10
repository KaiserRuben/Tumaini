<template>
  <div
    :class="['cell', 'cell--combined', { 'cell--has-lightbox': section.image }]"
    :style="{ gridArea, animationDelay }"
    @click="section.image ? $emit('lightbox', section) : null"
  >
    <div class="cell__image" :style="bgStyle"></div>
    <div class="cell__overlay"></div>
    <div class="cell__content">
      <h2 v-if="section.title" class="cell__title">{{ localize(section.title, 'strict') }}</h2>
      <p v-if="shortText" class="cell__excerpt">{{ shortText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Section } from '@/utils/screenPlanner';

export default defineComponent({
  name: 'CombinedCell',
  props: {
    section: { type: Object as PropType<Section>, required: true },
    gridArea: { type: String, required: true },
    animationDelay: { type: String, default: '0ms' },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true }
  },
  emits: ['lightbox'],

  computed: {
    bgStyle(): Record<string, string> {
      if (!this.section.image) return {};
      return { backgroundImage: `url(${this.section.image})` };
    },
    shortText(): string | null {
      const text = this.section.text;
      if (text && text.length < 250) {
        return this.localize(text, 'strict');
      }
      return null;
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

.cell {
  position: relative;
  border-radius: clamp(12px, 2vw, 20px);
  overflow: hidden;
  background: $dark;
  animation: cell-in 0.6s $ease-out both;
  cursor: zoom-in;

  &__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.4s $ease-out;
  }

  &:hover .cell__image {
    transform: scale(1.03);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba($black, 0.9) 0%, rgba($black, 0.2) 60%, transparent 100%);
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: clamp(1.5rem, 4vw, 2.5rem);
  }

  &__title {
    font-size: clamp(1.25rem, 3vw, 1.625rem);
    font-weight: 600;
    color: $accent;
    margin-bottom: 1rem;
    line-height: 1.25;
  }

  &__excerpt {
    font-size: 0.9375rem;
    color: $muted;
    line-height: 1.6;
    font-style: italic;
  }
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}
</style>
