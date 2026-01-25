<template>
  <div class="article">
    <Header :class="{ 'header--hidden': isHeaderHidden }" />

    <!-- Hero Section (Full-width) -->
    <header
      class="article__hero"
      :style="`background-image: linear-gradient(transparent 0%, transparent 30%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.85) 100%), url(${article.image})`"
    >
      <div class="article__hero-content">
        <h1 class="article__title">{{ localized(article.title, 'strict') }}</h1>
        <p class="article__subheader">{{ localized(article.subheader, 'strict') }}</p>
        <div class="article__meta">
          <time v-if="article.created">{{ formatDate(article.created) }}</time>
          <span class="article__meta-dot">·</span>
          <button class="article__share" @click="copyToClipboard(); showSnackbar();">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {{ text[2] }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="article__body">
      <!-- Abstract / Key Points -->
      <ul class="article__abstract" v-if="article.mainPoints && article.mainPoints.length">
        <li v-for="point in article.mainPoints" :key="point">{{ localized(point, 'strict') }}</li>
      </ul>

      <!-- Smart Grid (Left) -->
      <main class="article__content">
        <section
          v-for="(section, i) in article.content"
          :key="i"
          :id="`section-${i}`"
          :ref="el => setSectionRef(el, i)"
          :data-index="i"
          :class="['article__section', { 'article__section--first': i === 0 && !section.image }]"
        >
          <ContentBlock
            :section="section"
            :type="getBlockType(section, i)"
            :localize="localized"
            @image-loaded="onImageLoaded($event, i)"
          />
        </section>
      </main>

      <!-- Chapter Nav (Right, Desktop only) -->
      <aside class="article__chapters">
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

    <div id="snackbar" class="article__snackbar">{{ text[3] }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Header from '@/components/Header.vue';
import ContentBlock from '@/components/ContentBlock.vue';
import { axiosGet } from '../../admin/src/utils/axiosWrapper';

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

interface ImageAspectCache {
  [key: number]: number;
}

export default defineComponent({
  name: 'BerichtComponent',
  components: { Header, ContentBlock },

  data() {
    return {
      article: {} as any,
      articleLink: window.location.href,
      text: [] as string[],
      id: this.$route.params.id,
      isHeaderHidden: false,
      lastScrollPosition: 0,
      activeChapter: -1,
      sectionRefs: {} as Record<number, HTMLElement | null>,
      imageAspects: {} as ImageAspectCache,
      observer: null as IntersectionObserver | null
    };
  },

  computed: {
    chapters(): Chapter[] {
      if (!this.article.content) return [];
      return this.article.content
        .map((section: Section, index: number) => ({
          index,
          title: section.title ? this.localized(section.title, 'strict') : null
        }))
        .filter((chapter: { title: string | null }) => chapter.title !== null);
    }
  },

  methods: {
    setSectionRef(el: HTMLElement | null, index: number) {
      if (el) {
        this.sectionRefs[index] = el;
      }
    },

    onImageLoaded(event: Event, index: number) {
      const img = event.target as HTMLImageElement;
      if (img && img.naturalWidth && img.naturalHeight) {
        this.imageAspects[index] = img.naturalWidth / img.naturalHeight;
      }
    },

    getBlockType(section: Section, index: number): string {
      const textLength = section.text?.length || 0;
      const hasImage = !!section.image;
      const aspect = this.imageAspects[index] || 1.5; // Default to landscape

      // Hero: first section with image and short text
      if (index === 0 && hasImage && textLength < 100) {
        return 'hero';
      }

      // No image cases
      if (!hasImage) {
        return 'text-block';
      }

      // Caption card: image with short text (< 200 chars)
      if (hasImage && textLength < 200) {
        return 'caption-card';
      }

      // Portrait aside: portrait image (aspect <= 1.0) with longer text
      if (hasImage && aspect <= 1.0 && textLength >= 200) {
        return 'portrait-aside';
      }

      // Landscape card: landscape image (aspect > 1.3) with text
      if (hasImage && aspect > 1.3) {
        return 'landscape-card';
      }

      // Default to landscape-card for other image+text combinations
      return 'landscape-card';
    },

    scrollToSection(index: number) {
      const section = this.sectionRefs[index];
      if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },

    setupScrollSpy() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '-1');
              // Only update if this section has a title (is a chapter)
              const isChapter = this.chapters.some(ch => ch.index === index);
              if (isChapter) {
                this.activeChapter = index;
              }
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '-100px 0px -50% 0px'
        }
      );

      // Observe all sections
      nextTick(() => {
        Object.values(this.sectionRefs).forEach(section => {
          if (section && this.observer) {
            this.observer.observe(section);
          }
        });
      });
    },

    looksGerman(text: string): boolean {
      const germanIndicators = /\b(und|der|die|das|ist|mit|für|auf|ein|eine|einer|haben|wird|sind|nach|auch|oder|bei|nur|über|noch|ihre?|unser|wir|zur?|vom|den|dem|des|wurde|hat|kann|sehr|neue?n?|erste?n?)\b|[äöüßÄÖÜ]/i;
      return germanIndicators.test(text);
    },

    looksEnglish(text: string): boolean {
      const englishIndicators = /\b(the|and|is|are|was|were|with|for|our|their|have|has|from|this|that|which|will|been|also|new|first|after|about|into|more|school|children|project)\b/i;
      return englishIndicators.test(text);
    },

    isBilingualSplit(left: string, right: string): boolean {
      const leftGerman = this.looksGerman(left);
      const leftEnglish = this.looksEnglish(left);
      const rightGerman = this.looksGerman(right);
      const rightEnglish = this.looksEnglish(right);

      return (leftGerman && rightEnglish) || (leftGerman && !leftEnglish && rightEnglish && !rightGerman);
    },

    localized(text: string, mode: 'strict' | 'smart' | 'paragraph' = 'smart'): string {
      if (!text) return '';

      const lang = this.textObject?.language || 'DE';
      const isEnglish = lang === 'EN';

      if (mode === 'paragraph') {
        const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
        if (paragraphs.length >= 2) {
          const germanPara = paragraphs.find(p => this.looksGerman(p) && !this.looksEnglish(p));
          const englishPara = paragraphs.find(p => this.looksEnglish(p) && !this.looksGerman(p));

          if (germanPara && englishPara) {
            return isEnglish ? englishPara : germanPara;
          }

          const first = paragraphs[0];
          const last = paragraphs[paragraphs.length - 1];
          if (this.looksGerman(first) && this.looksEnglish(last)) {
            return isEnglish ? last : first;
          }
        }
        return text;
      }

      const separator = ' - ';
      const dashCount = (text.match(/ - /g) || []).length;

      if (dashCount === 0) return text;

      const lastIndex = text.lastIndexOf(separator);
      const left = text.slice(0, lastIndex);
      const right = text.slice(lastIndex + separator.length);

      if (mode === 'smart') {
        if (left.length < 3 || right.length < 3) return text;
        const ratio = left.length / right.length;
        if (ratio > 3 || ratio < 0.33) return text;
        if (dashCount > 2) return text;
        if (!this.isBilingualSplit(left, right)) return text;
      }

      return isEnglish ? right : left;
    },

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },

    copyToClipboard(): Promise<void> {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(this.articleLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = this.articleLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((res, rej) => {
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
        });
      }
    },

    showSnackbar() {
      const snackbar = document.getElementById('snackbar');
      if (snackbar) {
        snackbar.classList.add('article__snackbar--visible');
        setTimeout(() => {
          snackbar.classList.remove('article__snackbar--visible');
        }, 3000);
      }
    },

    onScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollPosition < 0) return;

      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 50) return;

      this.isHeaderHidden = currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 100;
      this.lastScrollPosition = currentScrollPosition;
    }
  },

  async beforeMount() {
    try {
      const response = await axiosGet('/content/article/id/' + this.id);
      this.article = response.data;

      this.text = [
        await this.textObject.getContent('61d56628cc3bfb06f031f99a'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99b'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99c'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99d')
      ];
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll);
    this.$nextTick(() => {
      this.setupScrollSpy();
    });
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    if (this.observer) {
      this.observer.disconnect();
    }
  }
});
</script>

<style lang="scss">
/* Header hide/show animation */
::v-deep(.header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.header--hidden {
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
    height: auto;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;

    @media (min-width: 768px) {
      min-height: 400px;
    }

    @media (min-width: 1024px) {
      min-height: 50vh;
    }
  }

  &__hero-content {
    width: 100%;
    max-width: 1400px;
    padding: 1rem;
    padding-top: 8rem;
    padding-bottom: 1.25rem;
    color: #ffffff;

    @media (min-width: 480px) {
      padding: 1.25rem;
      padding-top: 10rem;
      padding-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
      padding: 2rem;
      padding-top: 12rem;
    }

    @media (min-width: 1024px) {
      padding: 3rem 2rem;
      padding-bottom: 2.5rem;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    word-wrap: break-word;
    hyphens: auto;

    @media (min-width: 480px) {
      font-size: 1.5rem;
    }

    @media (min-width: 768px) {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    }

    @media (min-width: 1024px) {
      font-size: 2.5rem;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
  }

  &__subheader {
    font-size: 0.875rem;
    font-weight: 400;
    opacity: 0.85;
    line-height: 1.4;
    max-width: 700px;

    @media (min-width: 480px) {
      font-size: 1rem;
    }

    @media (min-width: 768px) {
      font-size: 1.125rem;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
    }

    @media (min-width: 1024px) {
      font-size: 1.25rem;
      font-weight: 400;
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

    @media (min-width: 768px) {
      font-size: 0.875rem;
      margin-top: 1.5rem;
    }

    time {
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
  }

  &__meta-dot {
    opacity: 0.4;
  }

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
    transition: color 0.2s ease;

    &:hover {
      color: #5F9AAE;
    }
  }

  // Main Body - Grid Layout
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
      padding: 3rem 2rem;
    }

    @media (min-width: 1200px) {
      gap: 4rem;
    }
  }

  // Abstract / Key Points
  &__abstract {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(237, 240, 243, 0.1);

    @media (min-width: 1024px) {
      grid-column: 1 / -1;
      max-width: 800px;
      margin-bottom: 3rem;
      padding-bottom: 3rem;
    }

    li {
      font-size: 1rem;
      line-height: 1.6;
      padding-left: 1rem;
      position: relative;
      color: rgba(237, 240, 243, 0.8);

      &::before {
        content: '—';
        position: absolute;
        left: 0;
        color: #5F9AAE;
      }

      @media (min-width: 768px) {
        font-size: 1.0625rem;
      }
    }
  }

  // Content Area (Smart Grid)
  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 768px) {
      gap: 3rem;
    }

    @media (min-width: 1024px) {
      gap: 4rem;
    }
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
      color: #5F9AAE;

      @media (min-width: 768px) {
        font-size: 3rem;
      }

      @media (min-width: 1024px) {
        font-size: 3.5rem;
      }
    }
  }

  // Chapters Sidebar
  &__chapters {
    display: none;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  // Snackbar
  &__snackbar {
    visibility: hidden;
    background-color: #151919;
    color: #fff;
    text-align: center;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    position: fixed;
    bottom: 1.5rem;
    left: 1rem;
    right: 1rem;
    z-index: 100;
    opacity: 0;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(95, 154, 174, 0.2);

    @media (min-width: 480px) {
      left: 50%;
      right: auto;
      transform: translateX(-50%) translateY(10px);
      min-width: 280px;
    }

    &--visible {
      visibility: visible;
      opacity: 1;

      @media (min-width: 480px) {
        transform: translateX(-50%) translateY(0);
      }
    }
  }
}

// Chapter Navigation Component
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
    border-radius: 6px;
    color: rgba(237, 240, 243, 0.5);
    font-size: 0.875rem;
    line-height: 1.4;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      color: rgba(237, 240, 243, 0.8);
      background: rgba(237, 240, 243, 0.03);
    }

    &--active {
      color: #5F9AAE;
      background: rgba(95, 154, 174, 0.1);

      .chapters__indicator {
        background: #5F9AAE;
        transform: scale(1);
      }
    }
  }

  &__indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(237, 240, 243, 0.3);
    flex-shrink: 0;
    transition: all 0.2s ease;
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
