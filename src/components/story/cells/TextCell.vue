<template>
  <div
    ref="cellEl"
    class="cell cell--text"
    :style="{ gridArea, animationDelay }"
    @wheel="onCellWheel"
    @touchstart.passive="onCellTouchStart"
    @touchmove.passive="onCellTouchMove"
  >
    <div class="cell__content">
      <h2 v-if="section.title" class="cell__title">{{ localize(section.title, 'strict') }}</h2>
      <div v-if="section.text" class="cell__body">
        <Markdown :source="localize(section.text, 'paragraph')" :breaks="true" :html="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Markdown from 'vue3-markdown-it';
import type { Section } from '@/utils/screenPlanner';

export default defineComponent({
  name: 'TextCell',
  components: { Markdown },
  props: {
    section: { type: Object as PropType<Section>, required: true },
    gridArea: { type: String, required: true },
    animationDelay: { type: String, default: '0ms' },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true }
  },
  data() {
    return { touchStartY: 0 };
  },
  methods: {
    isScrollable(): boolean {
      const el = this.$refs.cellEl as HTMLElement | undefined;
      if (!el) return false;
      return el.scrollHeight > el.clientHeight;
    },
    onCellWheel(e: WheelEvent) {
      if (!this.isScrollable()) return;
      const el = this.$refs.cellEl as HTMLElement;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      // Only stop propagation if we can scroll in the intended direction
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
        e.stopPropagation();
      }
    },
    onCellTouchStart(e: TouchEvent) {
      this.touchStartY = e.touches[0].clientY;
    },
    onCellTouchMove(e: TouchEvent) {
      if (!this.isScrollable()) return;
      const el = this.$refs.cellEl as HTMLElement;
      const deltaY = this.touchStartY - e.touches[0].clientY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        e.stopPropagation();
      }
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
  overflow-y: auto;
  background: $dark;
  animation: cell-in 0.6s $ease-out both;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  -webkit-overflow-scrolling: touch;

  @media (max-width: $breakpoint-mobile) {
    align-items: flex-start;
  }

  &__content {
    max-width: 550px;
  }

  &__title {
    font-size: clamp(1.25rem, 3vw, 1.625rem);
    font-weight: 600;
    color: $accent;
    margin-bottom: 1rem;
    line-height: 1.25;
  }

  &__body {
    font-size: clamp(0.9375rem, 2vw, 1.0625rem);
    line-height: 1.75;
    color: rgba($light, 0.85);

    :deep(p) {
      margin-bottom: 1rem;
      &:last-child { margin-bottom: 0; }
    }
  }
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}
</style>
