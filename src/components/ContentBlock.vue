<template>
  <div :class="['block', `block--${type}`]">
    <!-- HERO Block -->
    <template v-if="type === 'hero'">
      <div
        class="block__hero-bg"
        :style="section.image ? `background-image: linear-gradient(transparent 0%, transparent 40%, rgba(0, 0, 0, 0.8) 100%), url(${section.image})` : ''"
      >
        <div class="block__hero-content">
          <h2 v-if="section.title" class="block__hero-title">{{ localizedTitle }}</h2>
          <p v-if="section.text" class="block__hero-text">{{ localizedText }}</p>
        </div>
      </div>
    </template>

    <!-- LANDSCAPE-CARD Block -->
    <template v-else-if="type === 'landscape-card'">
      <img
        v-if="section.image"
        :src="section.image"
        :alt="localizedTitle || ''"
        class="block__image"
        @load="$emit('image-loaded', $event)"
      />
      <div class="block__content">
        <h3 v-if="section.title" class="block__title">{{ localizedTitle }}</h3>
        <div v-if="section.text" class="block__text">
          <Markdown :source="localizedText" :breaks="true" :html="true" />
        </div>
      </div>
    </template>

    <!-- PORTRAIT-ASIDE Block -->
    <template v-else-if="type === 'portrait-aside'">
      <img
        v-if="section.image"
        :src="section.image"
        :alt="localizedTitle || ''"
        class="block__image"
        @load="$emit('image-loaded', $event)"
      />
      <div class="block__content">
        <h3 v-if="section.title" class="block__title">{{ localizedTitle }}</h3>
        <div v-if="section.text" class="block__text">
          <Markdown :source="localizedText" :breaks="true" :html="true" />
        </div>
      </div>
    </template>

    <!-- TEXT-BLOCK -->
    <template v-else-if="type === 'text-block'">
      <h3 v-if="section.title" class="block__title">{{ localizedTitle }}</h3>
      <div v-if="section.text" class="block__text">
        <Markdown :source="localizedText" :breaks="true" :html="true" />
      </div>
    </template>

    <!-- CAPTION-CARD Block -->
    <template v-else-if="type === 'caption-card'">
      <figure class="block__figure">
        <img
          v-if="section.image"
          :src="section.image"
          :alt="localizedTitle || ''"
          class="block__image"
          @load="$emit('image-loaded', $event)"
        />
        <figcaption v-if="section.text || section.imageDescription" class="block__caption">
          {{ section.imageDescription ? localizedImageDescription : localizedText }}
        </figcaption>
      </figure>
    </template>

    <!-- DEFAULT fallback -->
    <template v-else>
      <img
        v-if="section.image"
        :src="section.image"
        :alt="localizedTitle || ''"
        class="block__image"
      />
      <div class="block__content">
        <h3 v-if="section.title" class="block__title">{{ localizedTitle }}</h3>
        <div v-if="section.text" class="block__text">
          <Markdown :source="localizedText" :breaks="true" :html="true" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Markdown from 'vue3-markdown-it';

interface Section {
  title?: string;
  text?: string;
  image?: string;
  imageDescription?: string;
}

export default defineComponent({
  name: 'ContentBlock',
  components: { Markdown },

  props: {
    section: {
      type: Object as PropType<Section>,
      required: true
    },
    type: {
      type: String as PropType<'hero' | 'landscape-card' | 'portrait-aside' | 'text-block' | 'caption-card'>,
      required: true
    },
    localize: {
      type: Function as PropType<(text: string, mode?: string) => string>,
      required: true
    }
  },

  emits: ['image-loaded'],

  computed: {
    localizedTitle(): string {
      return this.section.title ? this.localize(this.section.title, 'strict') : '';
    },
    localizedText(): string {
      return this.section.text ? this.localize(this.section.text, 'paragraph') : '';
    },
    localizedImageDescription(): string {
      return this.section.imageDescription ? this.localize(this.section.imageDescription, 'strict') : '';
    }
  }
});
</script>

<style lang="scss">
.block {
  width: 100%;

  // HERO Block
  &--hero {
    margin: 0 -1rem;
    min-height: 50vh;

    @media (min-width: 768px) {
      margin: 0 -2rem;
      min-height: 60vh;
    }

    @media (min-width: 1024px) {
      margin: 0;
      min-height: 70vh;
      border-radius: 12px;
      overflow: hidden;
    }

    .block__hero-bg {
      width: 100%;
      min-height: inherit;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
    }

    .block__hero-content {
      width: 100%;
      padding: 2rem 1rem;

      @media (min-width: 768px) {
        padding: 3rem 2rem;
      }

      @media (min-width: 1024px) {
        padding: 4rem 3rem;
      }
    }

    .block__hero-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.75rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

      @media (min-width: 768px) {
        font-size: 2rem;
      }

      @media (min-width: 1024px) {
        font-size: 2.5rem;
      }
    }

    .block__hero-text {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }
    }
  }

  // LANDSCAPE-CARD Block
  &--landscape-card {
    .block__image {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-radius: 8px;

      @media (min-width: 768px) {
        border-radius: 12px;
      }
    }

    .block__content {
      margin-top: 1.25rem;

      @media (min-width: 768px) {
        margin-top: 1.5rem;
      }
    }

    .block__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #5F9AAE;
      margin-bottom: 0.75rem;

      @media (min-width: 768px) {
        font-size: 1.375rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.5rem;
      }
    }

    .block__text {
      font-size: 1rem;
      line-height: 1.75;
      color: rgba(237, 240, 243, 0.9);

      @media (min-width: 768px) {
        font-size: 1.0625rem;
        line-height: 1.8;
      }

      @media (min-width: 1024px) {
        font-size: 1.125rem;
        line-height: 1.85;
      }

      p {
        margin-bottom: 1.25rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  // PORTRAIT-ASIDE Block
  &--portrait-aside {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 2rem;
      align-items: start;
    }

    .block__image {
      width: 100%;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: 8px;

      @media (min-width: 768px) {
        border-radius: 12px;
        position: sticky;
        top: 100px;
      }
    }

    .block__content {
      display: flex;
      flex-direction: column;
    }

    .block__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #5F9AAE;
      margin-bottom: 1rem;

      @media (min-width: 768px) {
        font-size: 1.375rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.5rem;
      }
    }

    .block__text {
      font-size: 1rem;
      line-height: 1.75;
      color: rgba(237, 240, 243, 0.9);

      @media (min-width: 768px) {
        font-size: 1.0625rem;
        line-height: 1.8;
      }

      @media (min-width: 1024px) {
        font-size: 1.125rem;
        line-height: 1.85;
      }

      p {
        margin-bottom: 1.25rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  // TEXT-BLOCK
  &--text-block {
    max-width: 65ch;

    .block__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #5F9AAE;
      margin-bottom: 1rem;

      @media (min-width: 768px) {
        font-size: 1.375rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.5rem;
      }
    }

    .block__text {
      font-size: 1rem;
      line-height: 1.75;
      color: rgba(237, 240, 243, 0.9);

      @media (min-width: 768px) {
        font-size: 1.0625rem;
        line-height: 1.8;
      }

      @media (min-width: 1024px) {
        font-size: 1.125rem;
        line-height: 1.85;
      }

      p {
        margin-bottom: 1.25rem;

        @media (min-width: 768px) {
          margin-bottom: 1.5rem;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      blockquote {
        font-size: 1.125rem;
        font-style: italic;
        font-weight: 300;
        color: #5F9AAE;
        border-left: 4px solid #5F9AAE;
        padding: 1rem 1.5rem;
        margin: 1.5rem 0;
        background: rgba(95, 154, 174, 0.05);
        border-radius: 0 8px 8px 0;

        @media (min-width: 768px) {
          font-size: 1.25rem;
          padding: 1rem 2rem;
          margin: 2rem 0;
        }

        @media (min-width: 1024px) {
          font-size: 1.375rem;
          margin: 2.5rem 0;
        }
      }
    }
  }

  // CAPTION-CARD Block
  &--caption-card {
    .block__figure {
      margin: 0;
    }

    .block__image {
      width: 100%;
      border-radius: 8px;
      display: block;

      @media (min-width: 768px) {
        border-radius: 12px;
      }
    }

    .block__caption {
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: rgba(237, 240, 243, 0.5);
      text-align: center;
      line-height: 1.5;

      @media (min-width: 768px) {
        margin-top: 1rem;
        font-size: 0.9375rem;
      }
    }
  }
}
</style>
