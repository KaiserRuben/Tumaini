<template>
  <div class="bericht-root">
    <!-- Loading -->
    <Transition name="view" mode="out-in">
      <div v-if="loading" key="loader" class="bericht-loader">
        <div class="loader">
          <div class="loader__spinner"></div>
          <span class="loader__text">Preparing story...</span>
        </div>
      </div>

      <!-- Story -->
      <div
        v-else
        key="story"
        class="story"
        ref="storyEl"
        @scroll.passive="onStoryScroll"
        @keydown.esc="onEscape"
        tabindex="-1"
      >
        <Header :class="{ 'header--hidden': isHeaderHidden }" />

        <!-- Hero -->
        <div class="story__hero">
          <StoryHero :hero="heroData" :layout="heroLayout" :localize="localized">
            <template #meta>
              <div class="hero-meta">
                <time v-if="article.created">{{ formatDate(article.created) }}</time>
                <span class="hero-meta__sep">&middot;</span>
                <button class="hero-meta__share" @click="share">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  {{ uiText[2] || 'Teilen' }}
                </button>
              </div>
            </template>
          </StoryHero>
        </div>

        <!-- Key Points -->
        <div v-if="hasKeyPoints" class="story__key-points">
          <StoryKeyPoints :points="article.mainPoints" :localize="localized" />
        </div>

        <!-- Content Sections -->
        <StorySection
          v-for="(metric, idx) in sectionMetrics"
          :key="idx"
          :section="metric.section"
          :metric="metric"
          :index="idx"
          :localize="localized"
          @lightbox="openLightbox"
        />

        <!-- Footer -->
        <Footer class="story__footer" />

        <!-- Back Button -->
        <Transition name="fade">
          <button v-if="isHeaderHidden" class="back-btn" @click="$router.back()" aria-label="Go back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
        </Transition>

      </div>
    </Transition>

    <!-- Shared: Lightbox -->
    <StoryLightbox
      :image="lightboxImage"
      :caption="lightboxCaption"
      @close="closeLightbox"
    />

    <!-- Shared: Snackbar -->
    <Transition name="snackbar">
      <div v-if="showSnackbarFlag" class="snackbar">{{ uiText[3] || 'Link kopiert!' }}</div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import StoryHero from '@/components/story/StoryHero.vue';
import StoryKeyPoints from '@/components/story/StoryKeyPoints.vue';
import StorySection from '@/components/story/StorySection.vue';
import StoryLightbox from '@/components/story/StoryLightbox.vue';
import {
  preloadImages,
  calculateMetrics,
  determineHeroLayout,
  type Section,
  type SectionMetrics,
  type HeroData,
  type ScreenLayout
} from '@/utils/screenPlanner';
import { getDescription, hasPlacement } from '@/utils/focalPoint';
import { axiosGet } from '../../admin/src/utils/axiosWrapper';

export default defineComponent({
  name: 'BerichtView',
  components: {
    Header, Footer,
    StoryHero, StoryKeyPoints, StorySection, StoryLightbox
  },

  data() {
    return {
      article: {} as any,
      uiText: [] as string[],
      loading: true,
      showSnackbarFlag: false,
      sectionMetrics: [] as SectionMetrics[],
      isHeaderHidden: false,
      lastScrollPos: 0,
      lightboxImage: null as string | null,
      lightboxCaption: '',
    };
  },

  computed: {
    hasKeyPoints(): boolean {
      return this.article.mainPoints?.length > 0;
    },

    heroData(): HeroData {
      return {
        title: this.article.title || '',
        subheader: this.article.subheader,
        image: this.article.image,
        created: this.article.created
      };
    },

    heroLayout(): ScreenLayout {
      return determineHeroLayout(this.heroData);
    }
  },

  methods: {
    async initSmartView() {
      const sections: Section[] = this.article.content || [];

      // Enrich sections with vision-model descriptions where imageDescription is missing.
      // Format `de - en` matches localize() separator so per-locale picking works downstream.
      for (const section of sections) {
        if (section.image && !section.imageDescription && hasPlacement(section.image)) {
          const desc = getDescription(section.image);
          if (desc.de && desc.en) {
            section.imageDescription = `${desc.de} - ${desc.en}`;
          } else {
            section.imageDescription = desc.de || desc.en || desc.nl || '';
          }
        }
      }

      const imageDims = await preloadImages(sections);
      this.sectionMetrics = calculateMetrics(sections, imageDims);
    },

    onStoryScroll() {
      const el = this.$refs.storyEl as HTMLElement;
      if (!el) return;
      const pos = el.scrollTop;
      if (Math.abs(pos - this.lastScrollPos) < 30) return;
      this.isHeaderHidden = pos > this.lastScrollPos && pos > 100;
      this.lastScrollPos = pos;
    },

    onEscape() {
      if (this.lightboxImage) {
        this.closeLightbox();
      } else {
        this.$router.back();
      }
    },

    // ---- Lightbox ----
    openLightbox(section: Section) {
      if (section.image) {
        this.lightboxImage = section.image;
        this.lightboxCaption = this.localized(section.imageDescription || '', 'strict');
      }
    },

    closeLightbox() {
      this.lightboxImage = null;
      this.lightboxCaption = '';
    },

    // ---- Localization ----
    looksGerman(t: string): boolean {
      return /\b(und|der|die|das|ist|mit|für|auf|ein|eine|haben|wird|sind|oder|wir)\b|[äöüß]/i.test(t);
    },

    looksEnglish(t: string): boolean {
      return /\b(the|and|is|are|was|with|for|our|have|has|from|this|that|which|will)\b/i.test(t);
    },

    localized(text: string, mode: 'strict' | 'smart' | 'paragraph' = 'smart'): string {
      if (!text) return '';
      const isEn = this.textObject?.language === 'EN';

      if (mode === 'paragraph') {
        const parts = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const de = parts.find(p => this.looksGerman(p) && !this.looksEnglish(p));
          const en = parts.find(p => this.looksEnglish(p) && !this.looksGerman(p));
          if (de && en) return isEn ? en : de;
        }
        return text;
      }

      const sep = ' - ';
      if (!text.includes(sep)) return text;
      const idx = text.lastIndexOf(sep);
      const left = text.slice(0, idx), right = text.slice(idx + 3);
      if (mode === 'smart' && (left.length < 3 || right.length < 3)) return text;
      if (mode === 'smart' && !this.looksGerman(left)) return text;
      return isEn ? right : left;
    },

    formatDate(d: string): string {
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(d));
    },

    share() {
      navigator.clipboard?.writeText(window.location.href);
      this.showSnackbarFlag = true;
      setTimeout(() => { this.showSnackbarFlag = false; }, 3000);
    },

    // ---- Data Loading ----
    async initialize() {
      this.loading = true;
      try {
        const routeId = this.$route.params.id;
        const res = await axiosGet('/content/article/id/' + routeId);
        this.article = res.data;

        if (this.textObject) {
          this.uiText = await Promise.all([
            this.textObject.getContent('61d56628cc3bfb06f031f99a'),
            this.textObject.getContent('61d56628cc3bfb06f031f99b'),
            this.textObject.getContent('61d56628cc3bfb06f031f99c'),
            this.textObject.getContent('61d56628cc3bfb06f031f99d')
          ]);
        }

        await this.initSmartView();
        this.loading = false;
        document.body.style.overflow = 'hidden';
      } catch (err) {
        console.error('Error initializing:', err);
        this.loading = false;
      }
    }
  },

  mounted() {
    this.initialize();
  },

  beforeUnmount() {
    document.body.style.overflow = '';
  }
});
</script>

<style lang="scss">
@use '@/styles/story-tokens' as *;

// ============ VIEW TRANSITION ============
.view-enter-active,
.view-leave-active {
  transition: opacity 0.3s $ease-out;
}
.view-enter-from,
.view-leave-to {
  opacity: 0;
}

// ============ FADE TRANSITION ============
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s $ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ============ SHARED TRANSITIONS ============
.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.3s $ease-out;
}
.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

// ============ LOADER ============
.bericht-loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $black;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  &__spinner {
    width: 48px;
    height: 48px;
    border: 2px solid rgba($light, 0.1);
    border-top-color: $accent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__text {
    font-size: 0.875rem;
    color: $muted;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ============ SMART VIEW ============
.story {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: $black;
  color: $light;
  outline: none;
  -webkit-overflow-scrolling: touch;

  // Header
  ::v-deep(.site-header) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: transform 0.5s $ease-out, opacity 0.5s $ease-out;
  }

  .header--hidden {
    transform: translateY(-100%);
    opacity: 0;
  }

  // Hero wrapper — provides sizing context for absolute-positioned StoryHero
  &__hero {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  // Key points wrapper — override StoryKeyPoints absolute positioning
  &__key-points {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.screen) {
      position: relative;
      inset: auto;
      min-height: 60vh;
    }
  }

  // Footer
  &__footer {
    position: relative;
  }
}

// ============ HERO META ============
.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: $muted;

  time {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__sep { opacity: 0.3; }

  &__share {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    color: $muted;
    font-size: inherit;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
    min-height: unset;
    box-shadow: none;

    &:hover {
      color: $accent;
      transform: none;
      box-shadow: none;
    }
  }
}

// ============ BACK BUTTON ============
.back-btn {
  position: fixed;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba($dark, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba($light, 0.1);
  color: $light;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s $ease-out, transform 0.2s $ease-out;
  padding: 0;
  min-height: unset;
  box-shadow: none;

  &:hover {
    background: rgba($accent, 0.9);
    transform: scale(1.1);
    box-shadow: 0 2px 12px $glow;
  }
}

// ============ SNACKBAR ============
.snackbar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: $dark;
  color: $light;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  z-index: 200;
  border: 1px solid rgba($accent, 0.2);
  backdrop-filter: blur(12px);
}
</style>
