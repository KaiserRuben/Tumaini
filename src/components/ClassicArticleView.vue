<template>
  <div class="article" ref="articleRef">
    <Header :class="{ 'header--hidden': isHeaderHidden }" />

    <!-- Hero Section -->
    <header
      class="article__hero"
      :style="heroStyle"
    >
      <div class="article__hero-content">
        <h1 class="article__title">{{ localize(article.title, 'strict') }}</h1>
        <p class="article__subheader" v-if="article.subheader">
          {{ localize(article.subheader, 'strict') }}
        </p>
        <div class="article__meta">
          <time v-if="article.created">{{ formatDate(article.created) }}</time>
          <span class="article__meta-dot">&middot;</span>
          <button class="article__share" @click="$emit('share')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {{ uiText[2] || 'Teilen' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="article__body">
      <!-- Key Points -->
      <ul class="article__abstract" v-if="article.mainPoints && article.mainPoints.length">
        <li v-for="(point, i) in article.mainPoints" :key="i">
          {{ localize(point, 'strict') }}
        </li>
      </ul>

      <!-- Content (Left) -->
      <main class="article__content">
        <section
          v-for="(section, i) in (article.content || [])"
          :key="i"
          :id="`section-${i}`"
          :ref="el => setSectionRef(el, i)"
          :data-index="i"
          :class="['article__section', { 'article__section--first': i === 0 && !section.image }]"
        >
          <ContentBlock
            :section="section"
            :type="getBlockType(section, i)"
            :localize="localize"
            @image-loaded="onImageLoaded($event, i)"
          />
        </section>
      </main>

      <!-- Chapter Nav (Desktop) -->
      <aside class="article__chapters" v-if="chapters.length > 1">
        <nav class="chapters">
          <a
            v-for="chapter in chapters"
            :key="chapter.index"
            :href="`#section-${chapter.index}`"
            :class="['chapters__item', { 'chapters__item--active': activeChapter === chapter.index }]"
            @click.prevent="scrollToSection(chapter.index)"
          >
            <span class="chapters__indicator"></span>
            <span class="chapters__title">{{ chapter.title }}</span>
          </a>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, type PropType } from 'vue';
import Header from '@/components/Header.vue';
import ContentBlock from '@/components/ContentBlock.vue';
import { getBackgroundPosition } from '@/utils/focalPoint';

interface Section {
  title?: string;
  text?: string;
  image?: string;
  imageDescription?: string;
}

interface Chapter {
  index: number;
  title: string;
}

export default defineComponent({
  name: 'ClassicArticleView',
  components: { Header, ContentBlock },

  props: {
    article: { type: Object as PropType<any>, required: true },
    uiText: { type: Array as PropType<string[]>, default: () => [] },
    localize: { type: Function as PropType<(text: string, mode?: string) => string>, required: true },
    formatDate: { type: Function as PropType<(d: string) => string>, required: true }
  },

  emits: ['share'],

  setup() {
    const articleRef = ref<HTMLElement | null>(null);
    return { articleRef };
  },

  data() {
    return {
      isHeaderHidden: false,
      lastScrollPosition: 0,
      activeChapter: -1,
      sectionRefs: {} as Record<number, HTMLElement | null>,
      imageAspects: {} as Record<number, number>,
      observer: null as IntersectionObserver | null
    };
  },

  computed: {
    heroStyle(): Record<string, string> {
      const pos = this.article.image
        ? getBackgroundPosition(this.article.image, 'safe')
        : 'center top';
      return {
        backgroundImage: `linear-gradient(transparent 0%, transparent 40%, rgba(0, 0, 0, 0.55) 60%, rgba(12, 13, 8, 0.85) 100%), url(${this.article.image})`,
        backgroundPosition: pos,
      };
    },

    chapters(): Chapter[] {
      if (!this.article.content) return [];
      return this.article.content
        .map((section: Section, index: number) => ({
          index,
          title: section.title ? this.localize(section.title, 'strict') : null
        }))
        .filter((ch: { title: string | null }) => ch.title !== null) as Chapter[];
    }
  },

  methods: {
    setSectionRef(el: HTMLElement | null, index: number) {
      if (el) this.sectionRefs[index] = el;
    },

    onImageLoaded(event: Event, index: number) {
      const img = event.target as HTMLImageElement;
      if (img?.naturalWidth && img?.naturalHeight) {
        this.imageAspects[index] = img.naturalWidth / img.naturalHeight;
      }
    },

    getBlockType(section: Section, index: number): string {
      const textLength = section.text?.length || 0;
      const hasImage = !!section.image;
      const aspect = this.imageAspects[index] || 1.5;

      if (index === 0 && hasImage && textLength < 100) return 'hero';
      if (!hasImage) return 'text-block';
      if (hasImage && textLength < 200) return 'caption-card';
      if (hasImage && aspect <= 1.0 && textLength >= 200) return 'portrait-aside';
      return 'landscape-card';
    },

    scrollToSection(index: number) {
      const section = this.sectionRefs[index];
      if (section) {
        const offset = section.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    },

    setupScrollSpy() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '-1');
              if (this.chapters.some(ch => ch.index === index)) {
                this.activeChapter = index;
              }
            }
          });
        },
        { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
      );

      nextTick(() => {
        Object.values(this.sectionRefs).forEach(section => {
          if (section && this.observer) this.observer.observe(section);
        });
      });
    },

    onScroll() {
      const pos = window.pageYOffset || document.documentElement.scrollTop;
      if (pos < 0 || Math.abs(pos - this.lastScrollPosition) < 50) return;
      this.isHeaderHidden = pos > this.lastScrollPosition && pos > 100;
      this.lastScrollPosition = pos;
    }
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll);
    this.$nextTick(() => this.setupScrollSpy());
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    this.observer?.disconnect();
  }
});
</script>

<style lang="scss">
/* Header hide/show animation */
.article ::v-deep(.site-header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s var(--t-ease);
}

.article .header--hidden {
  transform: translateY(-100%);
}

.article {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  // Hero Section
  &__hero {
    width: 100%;
    min-height: 320px;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    @media (min-width: 768px) { min-height: 400px; }
    @media (min-width: 1024px) { min-height: 65vh; }
  }

  &__hero-content {
    width: 100%;
    max-width: 1400px;
    padding: 8rem 1rem 1.25rem;
    color: #ffffff;

    @media (min-width: 480px) { padding: 10rem 1.25rem 1.5rem; }
    @media (min-width: 768px) { padding: 12rem 2rem 2rem; }
    @media (min-width: 1024px) { padding: 3rem 2rem 2.5rem; padding-top: 12rem; }
  }

  &__title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-weight: 400;
    font-size: clamp(1.25rem, 4vw, 2.5rem);
    margin-bottom: 0.5rem;
    line-height: 1.2;
    letter-spacing: -0.01em;

    @media (min-width: 768px) {
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    }
  }

  &__subheader {
    font-size: clamp(0.875rem, 2vw, 1.25rem);
    font-weight: 400;
    opacity: 0.85;
    line-height: 1.5;
    max-width: 700px;
    margin: 0;

    @media (min-width: 768px) {
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      margin-top: 0.75rem;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.7);

    @media (min-width: 768px) { font-size: 0.875rem; margin-top: 1.5rem; }

    time {
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
  }

  &__meta-dot { opacity: 0.4; }

  &__share {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 0;
    font-size: inherit;
    cursor: pointer;
    min-height: unset;
    box-shadow: none;
    transition: color 0.2s var(--t-ease);

    &:hover {
      color: var(--t-brand-light);
      transform: none;
      box-shadow: none;
    }
  }

  // Main Body Grid
  &__body {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 240px;
      gap: 3rem;
      padding: 2rem 2rem;
    }

    @media (min-width: 1200px) { gap: 4rem; }
  }

  // Key Points
  &__abstract {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--t-border);

    @media (min-width: 1024px) {
      grid-column: 1 / -1;
      max-width: 800px;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
    }

    li {
      font-size: 1rem;
      line-height: 1.6;
      padding-left: 1rem;
      position: relative;
      color: var(--t-text-secondary);

      &::before {
        content: '\2014';
        position: absolute;
        left: 0;
        color: var(--t-brand);
      }

      @media (min-width: 768px) { font-size: 1.0625rem; }
    }
  }

  // Content Area
  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 768px) { gap: 3rem; }
    @media (min-width: 1024px) { gap: 4rem; }
  }

  &__section {
    width: 100%;

    &--first .block--text-block .block__text p:first-of-type::first-letter {
      float: left;
      font-size: 2.75rem;
      line-height: 0.85;
      margin-right: 0.5rem;
      margin-top: 0.15rem;
      font-weight: 700;
      color: var(--t-brand);

      @media (min-width: 768px) { font-size: 3rem; }
      @media (min-width: 1024px) { font-size: 3.5rem; }
    }
  }

  // Chapter Sidebar
  &__chapters {
    display: none;
    @media (min-width: 1024px) { display: block; }
  }
}

// Chapter Navigation
.chapters {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--t-radius-sm);
    color: var(--t-text-muted);
    font-size: 0.875rem;
    line-height: 1.4;
    text-decoration: none;
    transition: all 0.2s var(--t-ease);
    cursor: pointer;

    &:hover {
      color: var(--t-text-secondary);
      background: rgba(255, 255, 255, 0.03);
      text-decoration: none;
    }

    &--active {
      color: var(--t-brand);
      background: rgba(200, 113, 46, 0.08);

      .chapters__indicator {
        background: var(--t-brand);
        transform: scale(1);
      }
    }
  }

  &__indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--t-text-muted);
    flex-shrink: 0;
    transition: all 0.2s var(--t-ease);
    transform: scale(0.8);
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
