<template>
  <section :class="['screen', `screen--${screen.layout.type}`]">
    <!-- Background for showcase/cinematic -->
    <template v-if="hasFullBleedBg">
      <div class="screen__bg" :style="bgStyle"></div>
      <div class="screen__overlay"></div>
    </template>

    <!-- Grid -->
    <div class="screen__grid" :style="gridStyle">
      <template v-for="(cell, cellIdx) in screen.cells" :key="cell.id">
        <ImageCell
          v-if="cell.type === 'image'"
          :section="cell.section"
          :grid-area="cell.gridArea"
          :animation-delay="`${cellIdx * 100}ms`"
          :localize="localize"
          @lightbox="$emit('lightbox', $event)"
        />
        <TextCell
          v-else-if="cell.type === 'text'"
          :section="cell.section"
          :grid-area="cell.gridArea"
          :animation-delay="`${cellIdx * 100}ms`"
          :localize="localize"
        />
        <CaptionCell
          v-else-if="cell.type === 'caption'"
          :section="cell.section"
          :grid-area="cell.gridArea"
          :animation-delay="`${cellIdx * 100}ms`"
          :localize="localize"
        />
        <CombinedCell
          v-else-if="cell.type === 'combined'"
          :section="cell.section"
          :grid-area="cell.gridArea"
          :animation-delay="`${cellIdx * 100}ms`"
          :localize="localize"
          @lightbox="$emit('lightbox', $event)"
        />
        <FillerCell
          v-else-if="cell.type === 'filler'"
          :grid-area="cell.gridArea"
          :animation-delay="`${cellIdx * 100}ms`"
        />
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { PlannedScreen } from '@/utils/screenPlanner';
import ImageCell from './cells/ImageCell.vue';
import TextCell from './cells/TextCell.vue';
import CombinedCell from './cells/CombinedCell.vue';
import CaptionCell from './cells/CaptionCell.vue';
import FillerCell from './cells/FillerCell.vue';

export default defineComponent({
  name: 'StoryContentScreen',
  components: { ImageCell, TextCell, CombinedCell, CaptionCell, FillerCell },
  props: {
    screen: { type: Object as PropType<PlannedScreen>, required: true },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true }
  },
  emits: ['lightbox'],

  computed: {
    hasFullBleedBg(): boolean {
      return this.screen.layout.type === 'showcase' || this.screen.layout.type === 'cinematic';
    },

    bgStyle(): Record<string, string> {
      const cell = this.screen.cells.find(c => c.section.image);
      if (!cell?.section.image) return {};
      return { backgroundImage: `url(${cell.section.image})` };
    },

    gridStyle(): Record<string, string> {
      return {
        gridTemplateColumns: this.screen.layout.columns,
        gridTemplateRows: this.screen.layout.rows,
        gridTemplateAreas: this.screen.layout.areas.join(' ')
      };
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

.screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }

  // ---- Backgrounds ----
  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: inherit;
      background-size: inherit;
      background-position: inherit;
      transform: scale(1.05);
      animation: ken-burns 20s ease-in-out infinite alternate;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba($black, 0.4) 0%,
      rgba($black, 0.1) 30%,
      rgba($black, 0.3) 60%,
      rgba($black, 0.9) 100%
    );
  }

  // ---- Grid ----
  &__grid {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1300px;
    height: calc(100% - 2rem);
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.5rem);

    // Mobile: single column, cells share the viewport height
    @media (max-width: $breakpoint-mobile) {
      grid-template-columns: 1fr !important;
      grid-template-areas: none !important;
      height: calc(100% - 2rem);
      gap: 1rem;

      :deep(> *) {
        grid-area: auto !important;
      }
    }
  }

  // ---- Layout variants ----
  &--text-full {
    background: $dark;
  }

  &--duo-images,
  &--micro-gallery,
  &--quad-mix,
  &--image-split-text {
    background: $dark;
    padding: clamp(1.5rem, 4vw, 3rem);

    @media (min-width: 1024px) {
      padding-left: 6rem;
      padding-right: 6rem;
    }
  }

  &--duo-images {
    :deep(.cell--caption) {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      text-align: center;
    }
  }

  &--duo-images,
  &--micro-gallery,
  &--image-split-text {
    :deep(.cell--image) {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
    }
  }

  &--quad-mix {
    :deep(.cell) {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
    }
  }

  &--image-split-text {
    :deep(.cell--text) {
      display: flex;
      align-items: center;
      padding: clamp(1.5rem, 3vw, 2.5rem);
    }
  }
}

@keyframes ken-burns {
  0% { transform: scale(1.05) translate(0, 0); }
  100% { transform: scale(1.12) translate(-1%, -1%); }
}
</style>
