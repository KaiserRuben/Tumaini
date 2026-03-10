<template>
  <div
    class="cell cell--filler"
    :style="{ gridArea, animationDelay }"
  >
    <div class="cell__accent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FillerCell',
  props: {
    gridArea: { type: String, required: true },
    animationDelay: { type: String, default: '0ms' }
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

.cell {
  position: relative;
  border-radius: clamp(12px, 2vw, 20px);
  overflow: hidden;
  background: linear-gradient(135deg, $dark 0%, #1c2020 100%);
  animation: cell-in 0.6s $ease-out both;
  display: flex;
  align-items: center;
  justify-content: center;

  &__accent {
    width: 40px;
    height: 2px;
    background: rgba($accent, 0.2);
    border-radius: 1px;
  }
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}
</style>
