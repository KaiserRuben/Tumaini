<template>
  <div
    :class="['cell', 'cell--image', { 'cell--has-lightbox': section.image }]"
    :style="{ gridArea, animationDelay }"
    @click="section.image ? $emit('lightbox', section) : null"
  >
    <SmartImage
      v-if="section.image"
      :src="section.image"
      :alt="localize(section.imageDescription || section.title || '', 'strict')"
      level="subject"
      fit="contain"
      class="cell__img"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Section } from '@/utils/screenPlanner';
import SmartImage from '@/components/SmartImage.vue';

export default defineComponent({
  name: 'ImageCell',
  components: { SmartImage },
  props: {
    section: { type: Object as PropType<Section>, required: true },
    gridArea: { type: String, required: true },
    animationDelay: { type: String, default: '0ms' },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true }
  },
  emits: ['lightbox']
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

  &__img {
    position: absolute;
    inset: 0;
    transition: transform 0.4s $ease-out;
  }

  &:hover .cell__img {
    transform: scale(1.02);
  }
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}
</style>
