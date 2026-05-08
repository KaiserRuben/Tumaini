<template>
  <section
    ref="el"
    :class="sectionClasses"
  >
    <!-- MOMENT: full-viewport image, no/minimal text -->
    <template v-if="type === 'moment'">
      <div class="section__image" @click="$emit('lightbox', section)">
        <SmartImage :src="section.image || ''" :alt="imageAlt" level="safe" />
      </div>
      <div v-if="section.title || section.imageDescription" class="section__overlay">
        <h2 v-if="section.title">{{ localize(section.title, 'strict') }}</h2>
        <p v-if="section.imageDescription">{{ localize(section.imageDescription, 'strict') }}</p>
      </div>
    </template>

    <!-- SPOTLIGHT (side-by-side): image alongside full text -->
    <template v-else-if="type === 'spotlight-side'">
      <div class="section__media" @click="$emit('lightbox', section)">
        <SmartImage :src="section.image || ''" :alt="imageAlt" level="subject" />
      </div>
      <div class="section__body">
        <h2 v-if="section.title" class="section__title">{{ localize(section.title, 'strict') }}</h2>
        <div v-if="section.text" class="section__text">
          <Markdown :source="localize(section.text, 'paragraph')" :breaks="true" :html="true" />
        </div>
        <p v-if="section.imageDescription" class="section__img-desc">{{ localize(section.imageDescription, 'strict') }}</p>
      </div>
    </template>

    <!-- SPOTLIGHT (stacked): wide image on top, text below -->
    <template v-else-if="type === 'spotlight-stacked'">
      <div class="section__media section__media--wide" @click="$emit('lightbox', section)">
        <SmartImage :src="section.image || ''" :alt="imageAlt" level="subject" />
      </div>
      <div class="section__body">
        <h2 v-if="section.title" class="section__title">{{ localize(section.title, 'strict') }}</h2>
        <div v-if="section.text" class="section__text">
          <Markdown :source="localize(section.text, 'paragraph')" :breaks="true" :html="true" />
        </div>
        <p v-if="section.imageDescription" class="section__img-desc">{{ localize(section.imageDescription, 'strict') }}</p>
      </div>
    </template>

    <!-- CAPTION: image with short descriptive text -->
    <template v-else-if="type === 'caption'">
      <div class="section__media section__media--captioned" @click="$emit('lightbox', section)">
        <SmartImage :src="section.image || ''" :alt="imageAlt" level="subject" />
      </div>
      <figcaption class="section__figcaption">
        <h2 v-if="section.title" class="section__caption-title">{{ localize(section.title, 'strict') }}</h2>
        <p v-if="section.text">{{ localize(section.text, 'strict') }}</p>
        <p v-if="section.imageDescription" class="section__img-desc">{{ localize(section.imageDescription, 'strict') }}</p>
      </figcaption>
    </template>

    <!-- NARRATIVE: text only, no image -->
    <template v-else>
      <div class="section__prose">
        <h2 v-if="section.title" class="section__title">{{ localize(section.title, 'strict') }}</h2>
        <div v-if="section.text" class="section__text">
          <Markdown :source="localize(section.text, 'paragraph')" :breaks="true" :html="true" />
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Markdown from 'vue3-markdown-it';
import type { Section, SectionMetrics, LocalizeFn } from '@/utils/screenPlanner';
import SmartImage from '@/components/SmartImage.vue';

type SectionType = 'moment' | 'spotlight-side' | 'spotlight-stacked' | 'caption' | 'narrative';

export default defineComponent({
  name: 'StorySection',
  components: { SmartImage, Markdown },
  props: {
    section: { type: Object as PropType<Section>, required: true },
    metric: { type: Object as PropType<SectionMetrics>, required: true },
    index: { type: Number, required: true },
    localize: { type: Function as PropType<LocalizeFn>, required: true }
  },
  emits: ['lightbox'],

  data() {
    return { revealed: false };
  },

  computed: {
    type(): SectionType {
      if (!this.metric.hasImage) return 'narrative';
      if (this.metric.textLength === 0) return 'moment';
      if (this.metric.textLength < 200) return 'caption';

      // Spotlight: side-by-side vs stacked based on image category
      const cat = this.metric.placementCategory;
      if (cat === 'building' || cat === 'landscape' || cat === 'construction') {
        return 'spotlight-stacked';
      }
      return 'spotlight-side';
    },

    imageRight(): boolean {
      return this.type === 'spotlight-side' && this.index % 2 === 1;
    },

    sectionClasses(): Record<string, boolean> {
      return {
        'section': true,
        [`section--${this.type}`]: true,
        'section--image-right': this.imageRight,
        'section--visible': this.revealed,
        'section--central': this.metric.placementRole === 'central',
      };
    },

    imageAlt(): string {
      return this.localize(
        this.section.imageDescription || this.section.title || '', 'strict'
      );
    }
  },

  mounted() {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.revealed = true;
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    observer.observe(this.$el);
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

// ---- Base reveal animation ----
.section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s $ease-out, transform 0.8s $ease-out;

  &--visible {
    opacity: 1;
    transform: none;
  }
}

// ---- MOMENT: full viewport image ----
.section--moment {
  position: relative;
  height: 100vh;
  overflow: hidden;
  cursor: zoom-in;

  .section__image {
    position: absolute;
    inset: 0;
  }

  .section__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 3rem clamp(1.5rem, 5vw, 6rem);
    background: linear-gradient(transparent, rgba($black, 0.85));
    z-index: 1;

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 600;
      line-height: 1.2;
    }

    p {
      font-size: 1rem;
      color: $muted;
      margin-top: 0.5rem;
      font-style: italic;
    }
  }
}

// ---- SPOTLIGHT: side-by-side ----
.section--spotlight-side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 3rem);
  padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 5vw, 6rem);
  min-height: 50vh;
  max-width: 1400px;
  margin: 0 auto;

  .section__media {
    align-self: stretch;
    min-height: 300px;

    @media (min-width: 769px) { min-height: 400px; }
  }

  .section__body {
    align-self: center;
    padding: 0.5rem 0;
  }

  &.section--image-right {
    .section__media { order: 2; }
    .section__body { order: 1; }
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: clamp(2rem, 4vw, 3rem) 1.25rem;

    .section__media,
    .section__body {
      order: unset !important;
    }

    .section__media {
      aspect-ratio: 4/3;
      min-height: unset;
    }
  }
}

// ---- SPOTLIGHT: stacked (cinematic) ----
.section--spotlight-stacked {
  padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 5vw, 6rem);
  max-width: 1400px;
  margin: 0 auto;

  .section__media--wide {
    width: 100%;
    aspect-ratio: 16 / 9;
    margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  }

  .section__body {
    max-width: 700px;
  }

  @media (max-width: $breakpoint-mobile) {
    padding: clamp(2rem, 4vw, 3rem) 1.25rem;

    .section__media--wide {
      aspect-ratio: 3 / 2;
    }
  }
}

// ---- CAPTION: image with short text ----
.section--caption {
  padding: clamp(2rem, 4vw, 4rem) clamp(1.5rem, 5vw, 6rem);
  max-width: 900px;
  margin: 0 auto;

  .section__media--captioned {
    width: 100%;
    aspect-ratio: 4 / 3;
  }

  .section__figcaption {
    text-align: center;
    padding: 1.25rem 1rem 0;
  }

  .section__caption-title {
    font-size: clamp(1.125rem, 2.5vw, 1.375rem);
    font-weight: 600;
    color: $accent;
    margin-bottom: 0.5rem;
  }

  .section__figcaption p {
    font-size: 0.9375rem;
    color: $muted;
    font-style: italic;
    line-height: 1.6;
  }

  @media (max-width: $breakpoint-mobile) {
    padding: clamp(1.5rem, 3vw, 2rem) 1.25rem;
  }
}

// ---- NARRATIVE: text only ----
.section--narrative {
  padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 5vw, 6rem);

  .section__prose {
    max-width: 650px;
    margin: 0 auto;
  }

  @media (max-width: $breakpoint-mobile) {
    padding: clamp(2rem, 4vw, 3rem) 1.25rem;
  }
}

// ---- Shared ----
.section__media {
  position: relative;
  border-radius: clamp(12px, 2vw, 20px);
  overflow: hidden;
  cursor: zoom-in;

  &:hover :deep(.smart-image) {
    transform: scale(1.02);
  }

  :deep(.smart-image) {
    transition: transform 0.5s $ease-out;
  }
}

.section__title {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  color: $accent;
  margin-bottom: 1.25rem;
  line-height: 1.25;
}

.section__text {
  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
  line-height: 1.8;
  color: rgba($light, 0.85);

  :deep(p) {
    margin-bottom: 1.25rem;
    &:last-child { margin-bottom: 0; }
  }

  :deep(strong) {
    color: $light;
    font-weight: 600;
  }
}

.section__img-desc {
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: $muted;
  font-style: italic;
}
</style>
