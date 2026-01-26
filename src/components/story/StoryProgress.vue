<template>
  <div class="story-progress">
    <div class="story-progress__bar">
      <div class="story-progress__fill" :style="{ height: `${progress}%` }"></div>
    </div>
    <span class="story-progress__count">{{ current }}/{{ total }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoryProgress',

  props: {
    progress: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
$light: #EDF0F3;
$accent: #5F9AAE;
$muted: rgba(237, 240, 243, 0.55);
$glow: rgba(95, 154, 174, 0.35);

$ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

.story-progress {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 100;

  &__bar {
    width: 3px;
    height: 100px;
    background-color: rgba($light, 0.15);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  &__fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: $accent;
    border-radius: 2px;
    transition: height 0.5s $ease-out-expo;
    box-shadow: 0 0 8px $glow;
  }

  &__count {
    font-size: 0.7rem;
    font-weight: 600;
    color: $muted;
    letter-spacing: 0.05em;
    font-variant-numeric: tabular-nums;
  }
}
</style>
