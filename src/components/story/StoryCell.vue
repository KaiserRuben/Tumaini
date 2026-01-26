<template>
  <div
    :class="['cell', `cell--${cell.type}`]"
    :style="{ gridArea: cell.gridArea }"
  >
    <!-- IMAGE type -->
    <template v-if="cell.type === 'image'">
      <div class="cell__image" :style="imageStyle"></div>
    </template>

    <!-- TEXT type -->
    <template v-else-if="cell.type === 'text'">
      <div class="cell__content">
        <h2 v-if="cell.section.title" class="cell__title">
          {{ localize(cell.section.title, 'strict') }}
        </h2>
        <div v-if="cell.section.text" class="cell__body">
          <Markdown :source="localize(cell.section.text, 'paragraph')" :breaks="true" :html="true" />
        </div>
      </div>
    </template>

    <!-- CAPTION type -->
    <template v-else-if="cell.type === 'caption'">
      <p class="cell__caption">
        {{ localize(cell.section.imageDescription || cell.section.text || '', 'strict') }}
      </p>
    </template>

    <!-- COMBINED type (image + text overlay) -->
    <template v-else-if="cell.type === 'combined'">
      <div class="cell__image" :style="imageStyle"></div>
      <div class="cell__overlay"></div>
      <div class="cell__content cell__content--overlay">
        <h2 v-if="cell.section.title" class="cell__title">
          {{ localize(cell.section.title, 'strict') }}
        </h2>
        <p v-if="shortText" class="cell__excerpt">{{ shortText }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Markdown from 'vue3-markdown-it';
import type { ScreenCell } from '@/utils/screenPlanner';

export default defineComponent({
  name: 'StoryCell',
  components: { Markdown },

  props: {
    cell: {
      type: Object as PropType<ScreenCell>,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    localize: {
      type: Function as PropType<(text: string, mode?: string) => string>,
      required: true
    }
  },

  computed: {
    imageStyle(): Record<string, string> {
      if (!this.cell.section.image) return {};
      return {
        backgroundImage: `url(${this.cell.section.image})`
      };
    },

    shortText(): string | null {
      const text = this.cell.section.text;
      if (text && text.length < 300) {
        return this.localize(text, 'strict');
      }
      return null;
    }
  }
});
</script>

<style scoped lang="scss">
$black: #0C0D08;
$dark: #151919;
$light: #EDF0F3;
$accent: #5F9AAE;
$muted: rgba(237, 240, 243, 0.55);

.cell {
  position: relative;
  border-radius: clamp(12px, 2vw, 24px);
  overflow: hidden;
  background: $dark;

  &--image, &--combined {
    .cell__image {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 5s linear;
    }

    &:hover .cell__image {
      transform: scale(1.04);
    }
  }

  &--text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1.5rem, 4vw, 3rem);
  }

  &--caption {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba($dark, 0.85);
  }

  &--combined {
    .cell__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba($black, 0.9) 0%, rgba($black, 0.3) 60%, transparent 100%);
    }

    .cell__content--overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: clamp(1.5rem, 4vw, 2.5rem);
    }
  }

  &__content {
    max-width: 600px;
  }

  &__title {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
    color: $accent;
    margin-bottom: 1rem;
    line-height: 1.25;
  }

  &__body {
    font-size: clamp(0.9375rem, 2vw, 1.0625rem);
    line-height: 1.75;
    color: rgba($light, 0.9);

    :deep(p) {
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__caption, &__excerpt {
    font-size: 0.9375rem;
    color: $muted;
    line-height: 1.5;
    font-style: italic;
  }
}
</style>
