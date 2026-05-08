<template>
  <section class="screen screen--points">
    <div class="screen__inner">
      <ul class="points">
        <li
          v-for="(point, idx) in points"
          :key="idx"
          class="points__item"
          :style="{ animationDelay: `${idx * 150}ms` }"
        >
          <span class="points__num">{{ String(idx + 1).padStart(2, '0') }}</span>
          <span class="points__text">{{ localize(point, 'strict') }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { LocalizeFn } from '@/utils/screenPlanner';

export default defineComponent({
  name: 'StoryKeyPoints',
  props: {
    points: { type: Array as PropType<string[]>, required: true },
    localize: { type: Function as PropType<LocalizeFn>, required: true }
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

  &--points {
    background: linear-gradient(160deg, $black 0%, #1c2020 100%);
  }

  &__inner {
    max-width: 650px;
    width: 100%;
  }
}

.points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    animation: point-in 0.7s $ease-out both;
  }

  &__num {
    font-size: 0.75rem;
    font-weight: 700;
    color: $accent;
    opacity: 0.4;
    padding-top: 0.4rem;
    flex-shrink: 0;
  }

  &__text {
    font-size: clamp(1.0625rem, 2.5vw, 1.375rem);
    line-height: 1.5;
  }
}

@keyframes point-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
}
</style>
