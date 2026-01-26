<template>
  <nav class="story-nav" v-if="chapters.length">
    <a
      v-for="chapter in chapters"
      :key="chapter.screenIndex"
      :class="['story-nav__item', { 'story-nav__item--active': activeIndex === chapter.screenIndex }]"
      @click="$emit('navigate', chapter.screenIndex)"
    >
      <span class="story-nav__dot"></span>
      <span class="story-nav__label">{{ chapter.title }}</span>
    </a>
  </nav>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface Chapter {
  title: string;
  screenIndex: number;
}

export default defineComponent({
  name: 'StoryNav',

  props: {
    chapters: {
      type: Array as PropType<Chapter[]>,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },

  emits: ['navigate']
});
</script>

<style scoped lang="scss">
$light: #EDF0F3;
$accent: #5F9AAE;
$muted: rgba(237, 240, 243, 0.55);
$glow: rgba(95, 154, 174, 0.35);

$ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

.story-nav {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 100;

  @media (max-width: 768px) {
    display: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      .story-nav__dot {
        transform: scale(1.3);
        background-color: $accent;
        box-shadow: 0 0 12px $glow;
      }

      .story-nav__label {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
      }
    }

    &--active {
      .story-nav__dot {
        background-color: $accent;
        box-shadow: 0 0 8px $glow;
      }
    }
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $muted;
    transition: all 0.4s $ease-out-expo;
    flex-shrink: 0;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: $light;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.4s $ease-out-expo;
    pointer-events: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
</style>
