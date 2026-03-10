<template>
  <div
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

    <!-- Loading State -->
    <Transition name="fade" mode="out-in">
      <div v-if="loading" key="loader" class="story__loader">
        <div class="loader">
          <div class="loader__spinner"></div>
          <span class="loader__text">Preparing story...</span>
        </div>
      </div>

      <!-- Story Viewport -->
      <div v-else key="content" class="story__viewport">
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
    </Transition>

    <!-- Back Button -->
    <button v-if="!loading && currentScreen > 0" class="back-btn" @click="$router.back()" aria-label="Go back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
    </button>

    <!-- Navigation -->
    <StoryNav
      v-if="!loading"
      :class="{ 'nav--hidden': showFooter }"
      :current="currentScreen"
      :total="totalScreens"
      @navigate="goToScreen"
    />

    <!-- Lightbox -->
    <StoryLightbox
      :image="lightboxImage"
      :caption="lightboxCaption"
      @close="closeLightbox"
    />

    <!-- Snackbar -->
    <Transition name="snackbar">
      <div v-if="showSnackbarFlag" class="snackbar">{{ uiText[3] || 'Link kopiert!' }}</div>
    </Transition>

    <!-- Footer -->
    <Transition name="footer">
      <Footer v-if="showFooter" class="story__footer" />
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
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

export default defineComponent({
  name: 'BerichtView',
  components: { Header, Footer, StoryHero, StoryKeyPoints, StoryContentScreen, StoryNav, StoryLightbox },

  data() {
    return {
      article: {} as any,
      uiText: [] as string[],
      loading: true,
      showSnackbarFlag: false,
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

    // On mobile, split screens with 3+ cells into chunks of 2
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

        // Split into chunks of 2
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
      let count = 1; // hero
      if (this.hasKeyPoints) count++;
      count += this.effectiveScreens.length;
      return count;
    }
  },

  methods: {
    getContentScreenIndex(idx: number): number {
      return (this.hasKeyPoints ? 2 : 1) + idx;
    },

    onResize() {
      this.viewportWidth = window.innerWidth;
    },

    // ---- Navigation ----
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
          // First scroll at end — record timestamp
          this.atEndOnceAt = now;
        } else if (now - this.atEndOnceAt > 500) {
          // Second scroll at end, after a distinct gesture (500ms gap)
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

        this.loading = false;
        await nextTick();
        (this.$refs.storyEl as HTMLElement)?.focus();
      } catch (err) {
        console.error('Error initializing:', err);
        this.loading = false;
      }
    }
  },

  mounted() {
    document.body.style.overflow = 'hidden';
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

// ============ TRANSITIONS (must be unscoped) ============
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s $ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

// ============ GLOBAL OVERRIDES ============
::v-deep(.header) {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: transform 0.5s $ease-out, opacity 0.5s $ease-out;
}
.header--hidden {
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

  &__loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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

// ============ LOADER ============
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

// ============ HERO META (slotted into StoryHero) ============
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
