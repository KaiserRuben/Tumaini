<template>
  <img
    ref="imgRef"
    :src="src"
    :alt="alt"
    class="smart-image"
    :style="imgStyle"
    @load="onLoad"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, type PropType } from 'vue';
import { getBbox, type BboxLevel } from '@/utils/focalPoint';

export default defineComponent({
  name: 'SmartImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    /** Which bbox level to frame: tight (cards), subject (heroes), safe (full-bleed) */
    level: { type: String as PropType<BboxLevel>, default: 'subject' },
    /** CSS object-fit mode */
    fit: { type: String as PropType<'cover' | 'contain'>, default: 'cover' },
  },

  setup(props) {
    const imgRef = ref<HTMLImageElement | null>(null);
    const naturalW = ref(0);
    const naturalH = ref(0);
    const containerW = ref(0);
    const containerH = ref(0);

    let observer: ResizeObserver | null = null;

    function onLoad() {
      const img = imgRef.value;
      if (!img) return;
      naturalW.value = img.naturalWidth;
      naturalH.value = img.naturalHeight;
    }

    onMounted(() => {
      const img = imgRef.value;
      if (!img) return;

      // If already loaded (cached), grab dimensions immediately
      if (img.naturalWidth) {
        naturalW.value = img.naturalWidth;
        naturalH.value = img.naturalHeight;
      }

      // Observe the container (img element itself, since it's sized by its parent)
      observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          containerW.value = entry.contentRect.width;
          containerH.value = entry.contentRect.height;
        }
      });
      observer.observe(img);
    });

    onBeforeUnmount(() => {
      observer?.disconnect();
    });

    const imgStyle = computed(() => {
      const style: Record<string, string> = {
        objectFit: props.fit,
        width: '100%',
        height: '100%',
        display: 'block',
      };

      if (props.fit !== 'cover' || !naturalW.value || !containerW.value) {
        style.objectPosition = 'center';
        return style;
      }

      // --- Smart positioning math ---
      // Get the target bbox [x1, y1, x2, y2] on 0-1000 scale
      const [bx1, by1, bx2, by2] = getBbox(props.src, props.level);

      // Bbox center in normalized 0-1 space
      const bcx = ((bx1 + bx2) / 2) / 1000;
      const bcy = ((by1 + by2) / 2) / 1000;

      // Aspect ratios
      const imgAspect = naturalW.value / naturalH.value;
      const containerAspect = containerW.value / containerH.value;

      // With object-fit: cover, the image is scaled so the *smaller*
      // dimension fits. The *larger* dimension overflows and gets cropped.
      //
      // object-position: X% Y%  means:
      //   "align the point at X% of the image with the point at X% of the container"
      //
      // For the axis that overflows, we want to position the bbox center
      // in the container center. But we also clamp so the bbox stays
      // fully visible if possible.

      let posX = 50;
      let posY = 50;

      if (imgAspect > containerAspect) {
        // Image is wider than container → horizontal crop
        // Vertical axis fits perfectly, only horizontal positioning matters
        //
        // visibleFraction = what fraction of the image width is visible
        const visibleFraction = containerAspect / imgAspect;
        // Bbox extent in normalized space
        const bboxW = (bx2 - bx1) / 1000;

        if (bboxW >= visibleFraction) {
          // Bbox is wider than visible area — just center on it
          posX = bcx * 100;
        } else {
          // Position so bbox center aligns with container center,
          // but clamp so bbox doesn't go out of visible area
          const halfVisible = visibleFraction / 2;
          // Clamp bcx so the visible window [bcx - halfVisible, bcx + halfVisible]
          // stays within [0, 1]
          const clamped = Math.max(halfVisible, Math.min(1 - halfVisible, bcx));
          // Convert to object-position percentage
          // When visibleFraction < 1, object-position 0% shows left edge,
          // 100% shows right edge. The mapping:
          // pos% = (clamped - halfVisible) / (1 - visibleFraction) * 100
          if (visibleFraction < 1) {
            posX = ((clamped - halfVisible) / (1 - visibleFraction)) * 100;
          }
        }

        // Vertical axis fits → use bbox center for vertical position
        posY = bcy * 100;
      } else {
        // Image is taller than container → vertical crop
        const visibleFraction = imgAspect / containerAspect;
        const bboxH = (by2 - by1) / 1000;

        if (bboxH >= visibleFraction) {
          posY = bcy * 100;
        } else {
          const halfVisible = visibleFraction / 2;
          const clamped = Math.max(halfVisible, Math.min(1 - halfVisible, bcy));
          if (visibleFraction < 1) {
            posY = ((clamped - halfVisible) / (1 - visibleFraction)) * 100;
          }
        }

        posX = bcx * 100;
      }

      style.objectPosition = `${posX.toFixed(1)}% ${posY.toFixed(1)}%`;
      return style;
    });

    return { imgRef, imgStyle, onLoad };
  },
});
</script>

<style scoped>
.smart-image {
  display: block;
}
</style>
