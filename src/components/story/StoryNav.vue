<template>
  <nav class="nav" v-if="total > 0">
    <span class="nav__counter">{{ String(current + 1).padStart(2, '0') }}</span>

    <div class="nav__track">
      <div class="nav__progress" :style="{ height: progressPercent + '%' }"></div>
      <div class="nav__dots">
        <button
          v-for="idx in total"
          :key="idx - 1"
          :class="['nav__dot', { 'nav__dot--active': current === idx - 1 }]"
          @click="$emit('navigate', idx - 1)"
        />
      </div>
    </div>

    <span class="nav__counter nav__counter--total">{{ String(total).padStart(2, '0') }}</span>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoryNav',
  props: {
    current: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  emits: ['navigate'],

  computed: {
    progressPercent(): number {
      if (this.total <= 1) return 100;
      return (this.current / (this.total - 1)) * 100;
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

.nav {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s $ease-out;

  @media (max-width: $breakpoint-mobile) {
    right: 0.75rem;
  }

  &__counter {
    font-size: 0.6875rem;
    font-weight: 600;
    color: $accent;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    transition: transform 0.2s $ease-out;

    &--total {
      color: $muted;
    }
  }

  &__track {
    position: relative;
    width: 3px;
    background: rgba($light, 0.1);
    border-radius: 2px;
    padding: 0.5rem 0;
  }

  &__progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to bottom, $accent, rgba($accent, 0.3));
    border-radius: 2px;
    transition: height 0.3s $ease-out;
    z-index: 0;
  }

  &__dots {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 0;
  }

  &__dot {
    width: 9px;
    height: 9px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    background: rgba($light, 0.2);
    cursor: pointer;
    transition: all 0.2s $ease-out;
    min-height: unset;
    box-shadow: none;

    &:hover {
      background: rgba($light, 0.4);
      transform: scale(1.3);
      box-shadow: none;
    }

    &--active {
      background: $accent;
      border-color: $accent;
      box-shadow: 0 0 8px $glow;
      transform: scale(1.2);
    }
  }
}
</style>
