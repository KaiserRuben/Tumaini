<template>
  <div class="teaser-card" @click="$router.push(click)">
    <div class="teaser-card__image" :style="cardImageStyle"></div>
    <div class="teaser-card__content">
      <h3 class="teaser-card__title">{{ header }}</h3>
      <div class="teaser-card__excerpt">
        <Markdown :source="excerpt" :breaks="true" :html="true"/>
      </div>
      <div class="teaser-card__footer">
        <span class="teaser-card__read-more">Mehr erfahren →</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import Markdown from 'vue3-markdown-it';
import { getBackgroundPosition } from '@/utils/focalPoint';

export default defineComponent({
  name: 'TeaserCard',
  props: {
    img: {
      type: String,
      default: 'https://files.tumaini.be/default_project_picture.webp'
    },
    header: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    inProgress: {
      type: Boolean,
      default: true
    },
    click: {
      type: String,
      default: '/project'
    },
  },
  components: {Markdown},
  setup(props) {
    const excerpt = computed(() => {
      if (!props.text) return '';
      const words = props.text.split(' ');
      return words.slice(0, 25).join(' ') + '...';
    });

    const cardImageStyle = computed(() => {
      return {
        'background-image': `url(${props.img})`,
        'background-position': getBackgroundPosition(props.img, 'safe'),
        'background-repeat': 'no-repeat',
        'background-size': 'cover'
      };
    });

    return {
      excerpt,
      cardImageStyle
    };
  }
});
</script>

<style lang="scss" scoped>
.teaser-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--t-radius-lg);
  overflow: hidden;
  background-color: var(--t-bg-card);
  cursor: pointer;
  transition: transform var(--t-duration-base) var(--t-ease),
              box-shadow var(--t-duration-base) var(--t-ease);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

    .teaser-card__image {
      &::before {
        opacity: 0.15;
      }
    }

    .teaser-card__read-more {
      gap: 0.5rem;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  // Image - Mobile First
  &__image {
    aspect-ratio: 16 / 10;
    width: 100%;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--t-brand);
      opacity: 0;
      transition: opacity var(--t-duration-slow) var(--t-ease-out);
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to top, var(--t-bg-card), transparent);
      z-index: 2;
    }
  }

  // Content - Mobile First
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--t-spacing-md);
    background-color: var(--t-bg-card);
    color: var(--t-text);

    @media (min-width: 480px) {
      padding: var(--t-spacing-lg);
    }

    @media (min-width: 768px) {
      padding: var(--t-spacing-xl);
    }
  }

  &__title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    line-height: 1.3;

    @media (min-width: 480px) {
      font-size: 1.25rem;
    }

    @media (min-width: 768px) {
      font-size: 1.375rem;
      margin-bottom: var(--t-spacing-md);
    }
  }

  &__excerpt {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: var(--t-spacing-md);
    color: var(--t-text-secondary);

    @media (min-width: 768px) {
      font-size: 0.95rem;
      margin-bottom: var(--t-spacing-lg);
    }

    :deep(p) {
      margin: 0;
    }
  }

  &__footer {
    margin-top: auto;
  }

  &__read-more {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--t-brand);
    font-weight: 600;
    font-size: 0.875rem;
    transition: gap var(--t-duration-base) var(--t-ease);
  }
}
</style>
