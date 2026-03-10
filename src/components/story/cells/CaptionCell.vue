<template>
  <div
    class="cell cell--caption"
    :style="{ gridArea, animationDelay }"
  >
    <p class="cell__caption">
      {{ localize(section.imageDescription || section.text || '', 'strict') }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Section } from '@/utils/screenPlanner';

export default defineComponent({
  name: 'CaptionCell',
  props: {
    section: { type: Object as PropType<Section>, required: true },
    gridArea: { type: String, required: true },
    animationDelay: { type: String, default: '0ms' },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true }
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;

  &__caption {
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
