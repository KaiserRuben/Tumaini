<template>
  <div class="bericht-root">
    <!-- View Mode Toggle -->
    <button
      v-if="!loading"
      class="view-toggle"
      :class="{ 'view-toggle--in-story': viewMode === 'smart' }"
      @click="toggleViewMode"
    >
      <template v-if="viewMode === 'classic'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
        </svg>
        Smart View
      </template>
      <template v-else>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Classic
      </template>
    </button>

    <!-- Loading -->
    <Transition name="view" mode="out-in">
      <div v-if="loading" key="loader" class="bericht-loader">
        <div class="loader">
          <div class="loader__spinner"></div>
          <span class="loader__text">Preparing story...</span>
        </div>
      </div>

      <!-- Classic View -->
      <ClassicArticleView
        v-else-if="viewMode === 'classic'"
        key="classic"
        :article="article"
        :ui-text="uiText"
        :localize="localized"
        :format-date="formatDate"
        @share="share"
      />

      <!-- Smart View -->
      <div
        v-else
        key="smart"
        class="story"
        :class="{ 'story--footer-visible': showFooter }"
        ref="storyEl"
        @wheel="onWheel"
        @keydown="onKeydown"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        tabindex="0"
      >
        <Header :class="{ 'header--hidden': currentScreen > 0 }" />

        <div class="story__viewport">
          <TransitionGroup
            name="screen"
            tag="div"
            class="story__screens"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <!-- HERO -->
            <StoryHero
              v-if="currentScreen === 0 && heroScreen"
              key="hero"
              :hero="heroData"
              :layout="heroScreen.layout"
              :localize="localized"
            >
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

            <!-- KEY POINTS -->
            <StoryKeyPoints
              v-if="hasKeyPoints && currentScreen === 1"
              key="points"
              :points="article.mainPoints"
              :localize="localized"
            />

            <!-- CONTENT SCREENS -->
            <template v-for="(screen, idx) in effectiveScreens" :key="`content-${idx}`">
              <StoryContentScreen
                v-if="currentScreen === getContentScreenIndex(idx)"
                :screen="screen"
                :localize="localized"
                @lightbox="openLightbox"
              />
            </template>
          </TransitionGroup>
        </div>

        <!-- Back Button -->
        <button v-if="currentScreen > 0" class="back-btn" @click="$router.back()" aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>

        <!-- Navigation -->
        <StoryNav
          :class="{ 'nav--hidden': showFooter }"
          :current="currentScreen"
          :total="totalScreens"
          @navigate="goToScreen"
        />

        <!-- Footer -->
        <Transition name="footer">
          <Footer v-if="showFooter" class="story__footer" />
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
import { defineComponent, nextTick } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ClassicArticleView from '@/components/ClassicArticleView.vue';
import StoryHero from '@/components/story/StoryHero.vue';
import StoryKeyPoints from '@/components/story/StoryKeyPoints.vue';
import StoryContentScreen from '@/components/story/StoryContentScreen.vue';
import StoryNav from '@/components/story/StoryNav.vue';
import StoryLightbox from '@/components/story/StoryLightbox.vue';
import {
  preloadImages,
  calculateMetrics,
  planScreens,
  planHeroScreen,
  type Section,
  type PlannedScreen,
  type HeroData
} from '@/utils/screenPlanner';
import { axiosGet } from '../../admin/src/utils/axiosWrapper';

const VIEW_MODE_KEY = 'tumaini-view-mode';

export default defineComponent({
  name: 'BerichtView',
  components: {
    Header, Footer, ClassicArticleView,
    StoryHero, StoryKeyPoints, StoryContentScreen, StoryNav, StoryLightbox
  },

  data() {
    return {
      // Shared
      article: {} as any,
      uiText: [] as string[],
      loading: true,
      showSnackbarFlag: false,
      viewMode: (typeof localStorage !== 'undefined' && localStorage.getItem(VIEW_MODE_KEY)) || 'classic',

      // Smart view
      currentScreen: 0,
      isTransitioning: false,
      showFooter: false,
      atEndOnceAt: 0,
      heroScreen: null as PlannedScreen | null,
      plannedScreens: [] as PlannedScreen[],
      lastWheelTime: 0,
      touchStartY: 0,
      lightboxImage: null as string | null,
      lightboxCaption: '',
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1024
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

    isMobile(): boolean {
      return this.viewportWidth <= 768;
    },

    effectiveScreens(): PlannedScreen[] {
      if (!this.isMobile) return this.plannedScreens;

      const result: PlannedScreen[] = [];
      let id = 0;

      for (const screen of this.plannedScreens) {
        const contentCells = screen.cells.filter(c => c.type !== 'filler');

        if (contentCells.length <= 2) {
          result.push({ ...screen, id: id++, cells: contentCells });
          continue;
        }

        for (let i = 0; i < contentCells.length; i += 2) {
          const chunk = contentCells.slice(i, i + 2);

          if (chunk.length === 1) {
            const isText = chunk[0].type === 'text' || chunk[0].type === 'caption';
            result.push({
              id: id++,
              sections: screen.sections,
              layout: {
                type: isText ? 'text-full' : 'split-v',
                columns: '1fr',
                rows: '1fr',
                areas: ['"main"'],
                gap: '1rem'
              },
              cells: [{ ...chunk[0], gridArea: 'main' }]
            });
          } else {
            result.push({
              id: id++,
              sections: screen.sections,
              layout: {
                type: 'split-v',
                columns: '1fr',
                rows: '1fr 1fr',
                areas: ['"top"', '"bottom"'],
                gap: '1rem'
              },
              cells: [
                { ...chunk[0], gridArea: 'top' },
                { ...chunk[1], gridArea: 'bottom' }
              ]
            });
          }
        }
      }

      return result;
    },

    totalScreens(): number {
      let count = 1;
      if (this.hasKeyPoints) count++;
      count += this.effectiveScreens.length;
      return count;
    }
  },

  methods: {
    // ---- View Mode ----
    async toggleViewMode() {
      const newMode = this.viewMode === 'classic' ? 'smart' : 'classic';
      localStorage.setItem(VIEW_MODE_KEY, newMode);

      if (newMode === 'smart') {
        if (!this.heroScreen) {
          this.loading = true;
          await this.initSmartView();
          this.loading = false;
        }
        this.viewMode = 'smart';
        this.currentScreen = 0;
        this.showFooter = false;
        document.body.style.overflow = 'hidden';
        await nextTick();
        (this.$refs.storyEl as HTMLElement)?.focus();
      } else {
        this.viewMode = 'classic';
        document.body.style.overflow = '';
      }
    },

    async initSmartView() {
      if (this.heroScreen) return;

      const heroData: HeroData = {
        title: this.article.title || '',
        subheader: this.article.subheader,
        image: this.article.image,
        created: this.article.created
      };
      this.heroScreen = planHeroScreen(heroData);

      const sections: Section[] = this.article.content || [];
      const imageDims = await preloadImages(sections);
      const metrics = calculateMetrics(sections, imageDims);
      this.plannedScreens = planScreens(metrics);
    },

    // ---- Smart View Navigation ----
    getContentScreenIndex(idx: number): number {
      return (this.hasKeyPoints ? 2 : 1) + idx;
    },

    onResize() {
      this.viewportWidth = window.innerWidth;
    },

    goToScreen(idx: number) {
      if (this.isTransitioning) return;
      if (idx < 0 || idx >= this.totalScreens) return;
      this.isTransitioning = true;
      this.currentScreen = idx;
      this.atEndOnceAt = 0;
      setTimeout(() => { this.isTransitioning = false; }, 400);
    },

    onWheel(e: WheelEvent) {
      if (this.lightboxImage) return;
      const atEnd = this.currentScreen === this.totalScreens - 1;

      if (atEnd && e.deltaY > 0 && !this.showFooter) {
        e.preventDefault();
        const now = Date.now();
        if (!this.atEndOnceAt) {
          this.atEndOnceAt = now;
        } else if (now - this.atEndOnceAt > 500) {
          this.showFooter = true;
        }
        return;
      }

      if (this.showFooter && e.deltaY < 0) {
        e.preventDefault();
        this.showFooter = false;
        return;
      }

      if (this.showFooter) return;

      e.preventDefault();
      const now = Date.now();
      if (now - this.lastWheelTime < 400) return;

      if (Math.abs(e.deltaY) > 20) {
        this.lastWheelTime = now;
        if (e.deltaY > 0) {
          this.goToScreen(this.currentScreen + 1);
        } else {
          this.atEndOnceAt = 0;
          this.goToScreen(this.currentScreen - 1);
        }
      }
    },

    onTouchStart(e: TouchEvent) {
      this.touchStartY = e.touches[0].clientY;
    },

    onTouchEnd(e: TouchEvent) {
      if (this.lightboxImage) return;
      const deltaY = this.touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        this.goToScreen(this.currentScreen + (deltaY > 0 ? 1 : -1));
      }
    },

    onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.lightboxImage) {
          this.closeLightbox();
        } else {
          this.$router.back();
        }
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        this.goToScreen(this.currentScreen + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.goToScreen(this.currentScreen - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToScreen(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToScreen(this.totalScreens - 1);
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

    // ---- Transitions ----
    onBeforeEnter(el: Element) {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(40px) scale(0.97)';
    },

    onEnter(el: Element, done: () => void) {
      requestAnimationFrame(() => {
        (el as HTMLElement).style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0) scale(1)';
      });
      setTimeout(done, 400);
    },

    onLeave(el: Element, done: () => void) {
      (el as HTMLElement).style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(-30px) scale(0.97)';
      setTimeout(done, 300);
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

        if (this.viewMode === 'smart') {
          await this.initSmartView();
        }

        this.loading = false;
        await nextTick();
        if (this.viewMode === 'smart') {
          (this.$refs.storyEl as HTMLElement)?.focus();
        }
      } catch (err) {
        console.error('Error initializing:', err);
        this.loading = false;
      }
    }
  },

  mounted() {
    if (this.viewMode === 'smart') {
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('resize', this.onResize);
    this.initialize();
  },

  beforeUnmount() {
    document.body.style.overflow = '';
    window.removeEventListener('resize', this.onResize);
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

.footer-enter-active,
.footer-leave-active {
  transition: transform 0.4s $ease-out, opacity 0.4s $ease-out;
}
.footer-enter-from,
.footer-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

// ============ VIEW TOGGLE ============
.view-toggle {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 300;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: rgba($dark, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba($accent, 0.25);
  border-radius: 999px;
  color: $light;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  min-height: unset;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.25s $ease-out;

  svg { opacity: 0.7; }

  &:hover {
    background: rgba($accent, 0.9);
    border-color: $accent;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px $glow;

    svg { opacity: 1; }
  }

  @media (max-width: $breakpoint-mobile) {
    bottom: 1rem;
    left: 1rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
  }
}

// ============ LOADER (shared) ============
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

// ============ SMART VIEW: GLOBAL OVERRIDES ============
.story ::v-deep(.site-header) {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: transform 0.5s $ease-out, opacity 0.5s $ease-out;
}
.story .header--hidden {
  transform: translateY(-100%);
  opacity: 0;
}

// ============ STORY CONTAINER ============
.story {
  position: fixed;
  inset: 0;
  background: $black;
  color: $light;
  overflow: hidden;
  outline: none;

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
  }

  &--footer-visible {
    .story__viewport {
      transform: translateY(-80px);
    }
  }

  &__viewport {
    position: absolute;
    inset: 0;
    transition: transform 0.4s $ease-out;
  }

  &__screens {
    position: absolute;
    inset: 0;
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
  transition: background 0.2s $ease-out, transform 0.2s $ease-out, opacity 0.3s $ease-out;
  padding: 0;
  min-height: unset;
  box-shadow: none;

  &:hover {
    background: rgba($accent, 0.9);
    transform: scale(1.1);
    box-shadow: 0 2px 12px $glow;
  }
}

// ============ NAV VISIBILITY ============
.nav--hidden {
  opacity: 0;
  pointer-events: none;
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
