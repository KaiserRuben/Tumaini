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

      <!-- Story Viewport - Screens transition in/out -->
      <div v-else key="content" class="story__viewport">

        <!-- Screen Wrapper with Transitions -->
        <TransitionGroup
          name="screen"
          tag="div"
          class="story__screens"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >

          <!-- HERO Screen (Adaptive) -->
          <section
            v-if="currentScreen === 0 && heroScreen"
            key="hero"
            :class="['screen', `screen--${heroScreen.layout.type}`]"
          >
            <!-- Hero Full: Background with overlay -->
            <template v-if="heroScreen.layout.type === 'hero-full'">
              <div class="screen__bg" :style="{ backgroundImage: article.image ? `url(${article.image})` : undefined }"></div>
              <div class="screen__overlay screen__overlay--hero"></div>
            </template>

            <!-- Hero Grid -->
            <div class="screen__grid screen__grid--hero" :style="getGridStyle(heroScreen)">
              <div
                v-for="cell in heroScreen.cells"
                :key="cell.id"
                :class="['cell', `cell--${cell.type}`]"
                :style="{ gridArea: cell.gridArea }"
              >
                <!-- Hero Image Cell -->
                <div v-if="cell.type === 'hero-image'" class="cell__image" :style="getCellBgStyle(cell)"></div>

                <!-- Hero Content Cell -->
                <template v-else-if="cell.type === 'hero-content'">
                  <div class="hero">
                    <h1 class="hero__title">{{ localized(article.title, 'strict') }}</h1>
                    <p v-if="article.subheader" class="hero__subtitle">{{ localized(article.subheader, 'strict') }}</p>
                    <div class="hero__meta">
                      <time v-if="article.created">{{ formatDate(article.created) }}</time>
                      <span class="hero__sep">·</span>
                      <button class="hero__share" @click="share">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                          <polyline points="16 6 12 2 8 6"/>
                          <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
                        {{ uiText[2] || 'Teilen' }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Scroll Hint -->
            <div class="screen__hint">
              <span>Scroll</span>
              <div class="screen__hint-line"></div>
            </div>
          </section>

          <!-- KEY POINTS Screen -->
          <section
            v-if="hasKeyPoints && currentScreen === 1"
            key="points"
            class="screen screen--points"
          >
            <div class="screen__inner screen__inner--centered">
              <div class="points">
                <ul class="points__list">
                  <li
                    v-for="(point, idx) in article.mainPoints"
                    :key="idx"
                    class="points__item"
                    :style="{ animationDelay: `${idx * 150}ms` }"
                  >
                    <span class="points__num">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <span class="points__text">{{ localized(point, 'strict') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- CONTENT Screens -->
          <section
            v-for="(screen, idx) in plannedScreens"
            v-show="currentScreen === getContentScreenIndex(idx)"
            :key="`content-${screen.id}`"
            :class="['screen', `screen--${screen.layout.type}`]"
          >
            <!-- Background for showcase/cinematic -->
            <template v-if="screen.layout.type === 'showcase' || screen.layout.type === 'cinematic'">
              <div class="screen__bg" :style="getScreenBgStyle(screen)"></div>
              <div class="screen__overlay"></div>
            </template>

            <!-- Grid -->
            <div class="screen__grid" :style="getGridStyle(screen)">
              <div
                v-for="(cell, cellIdx) in screen.cells"
                :key="cell.id"
                :class="['cell', `cell--${cell.type}`]"
                :style="{ gridArea: cell.gridArea, animationDelay: `${cellIdx * 100}ms` }"
              >
                <!-- Image Cell -->
                <div v-if="cell.type === 'image'" class="cell__image" :style="getCellBgStyle(cell)"></div>

                <!-- Text Cell -->
                <div v-else-if="cell.type === 'text'" class="cell__content">
                  <h2 v-if="cell.section.title" class="cell__title">{{ localized(cell.section.title, 'strict') }}</h2>
                  <div v-if="cell.section.text" class="cell__body">
                    <Markdown :source="localized(cell.section.text, 'paragraph')" :breaks="true" :html="true" />
                  </div>
                </div>

                <!-- Caption Cell -->
                <p v-else-if="cell.type === 'caption'" class="cell__caption">
                  {{ localized(cell.section.imageDescription || cell.section.text || '', 'strict') }}
                </p>

                <!-- Combined Cell -->
                <template v-else-if="cell.type === 'combined'">
                  <div class="cell__image" :style="getCellBgStyle(cell)"></div>
                  <div class="cell__overlay"></div>
                  <div class="cell__content cell__content--overlay">
                    <h2 v-if="cell.section.title" class="cell__title">{{ localized(cell.section.title, 'strict') }}</h2>
                    <p v-if="cell.section.text && cell.section.text.length < 250" class="cell__excerpt">
                      {{ localized(cell.section.text, 'strict') }}
                    </p>
                  </div>
                </template>

                <!-- Filler Cell -->
                <div v-else-if="cell.type === 'filler'" class="cell__filler">
                  <div class="cell__filler-accent"></div>
                </div>
              </div>
            </div>
          </section>

        </TransitionGroup>
      </div>
    </Transition>

    <!-- Back Button -->
    <button v-if="!loading" class="back-btn" @click="$router.back()" aria-label="Go back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
    </button>

    <!-- Unified Navigation -->
    <nav class="nav" v-if="!loading">
      <span class="nav__counter">{{ String(currentScreen + 1).padStart(2, '0') }}</span>

      <div class="nav__track">
        <div class="nav__progress" :style="{ height: progressPercent + '%' }"></div>
        <div class="nav__dots">
          <button
            v-for="(_, idx) in totalScreens"
            :key="idx"
            :class="['nav__dot', { 'nav__dot--active': currentScreen === idx }]"
            @click="goToScreen(idx)"
          />
        </div>
      </div>

      <span class="nav__counter nav__counter--total">{{ String(totalScreens).padStart(2, '0') }}</span>
    </nav>

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
import Markdown from 'vue3-markdown-it';
import {
  preloadImages,
  calculateMetrics,
  planScreens,
  planHeroScreen,
  type Section,
  type PlannedScreen,
  type ScreenCell,
  type HeroData
} from '@/utils/screenPlanner';
import { axiosGet } from '../../admin/src/utils/axiosWrapper';

export default defineComponent({
  name: 'BerichtView',
  components: { Header, Footer, Markdown },

  data() {
    return {
      article: {} as any,
      uiText: [] as string[],
      loading: true,
      showSnackbarFlag: false,
      currentScreen: 0,
      isTransitioning: false,
      showFooter: false,
      atEndOnce: false,
      heroScreen: null as PlannedScreen | null,
      plannedScreens: [] as PlannedScreen[],
      lastWheelTime: 0,
      touchStartY: 0
    };
  },

  computed: {
    hasKeyPoints(): boolean {
      return this.article.mainPoints?.length > 0;
    },

    // All screens in order: hero, key points (if any), content screens
    allScreens(): PlannedScreen[] {
      const screens: PlannedScreen[] = [];

      // Hero screen (always first)
      if (this.heroScreen) {
        screens.push(this.heroScreen);
      }

      // Content screens (including key points if integrated later)
      screens.push(...this.plannedScreens);

      return screens;
    },

    totalScreens(): number {
      let count = this.allScreens.length;
      if (this.hasKeyPoints) count++; // key points s// creen is still separate
      return count;
    },

    progressPercent(): number {
      if (this.totalScreens <= 1) return 100;
      return ((this.currentScreen) / (this.totalScreens - 1)) * 100;
    },

    // Check if current screen is a hero layout
    isHeroScreen(): boolean {
      if (this.currentScreen !== 0) return false;
      return this.heroScreen?.layout.type.startsWith('hero-') ?? false;
    }
  },

  methods: {
    getContentScreenIndex(idx: number): number {
      // +1 for hero, +1 for key points if present
      return (this.hasKeyPoints ? 2 : 1) + idx;
    },

    getScreenBgStyle(screen: PlannedScreen): Record<string, string> {
      const cell = screen.cells.find(c => c.section.image);
      if (!cell?.section.image) return {};
      return { backgroundImage: `url(${cell.section.image})` };
    },

    getGridStyle(screen: PlannedScreen): Record<string, string> {
      return {
        gridTemplateColumns: screen.layout.columns,
        gridTemplateRows: screen.layout.rows,
        gridTemplateAreas: screen.layout.areas.join(' ')
      };
    },

    getCellBgStyle(cell: ScreenCell): Record<string, string> {
      if (!cell.section.image) return {};
      return { backgroundImage: `url(${cell.section.image})` };
    },

    // Navigation
    goToScreen(idx: number) {
      if (this.isTransitioning) return;
      if (idx < 0 || idx >= this.totalScreens) return;

      this.isTransitioning = true;
      this.currentScreen = idx;

      setTimeout(() => {
        this.isTransitioning = false;
      }, 400);
    },

    onWheel(e: WheelEvent) {
      const atEnd = this.currentScreen === this.totalScreens - 1;

      // At end scrolling down
      if (atEnd && e.deltaY > 0 && !this.showFooter) {
        e.preventDefault();
        if (this.atEndOnce) {
          // Second scroll at end - show footer
          this.showFooter = true;
        } else {
          // First scroll at end - just mark it
          this.atEndOnce = true;
        }
        return;
      }

      // Footer visible, scrolling up - hide footer
      if (this.showFooter && e.deltaY < 0) {
        e.preventDefault();
        this.showFooter = false;
        return;
      }

      // Footer visible, ignore further scrolls
      if (this.showFooter) {
        return;
      }

      // Normal screen navigation
      e.preventDefault();

      const now = Date.now();
      if (now - this.lastWheelTime < 400) return;

      if (Math.abs(e.deltaY) > 20) {
        this.lastWheelTime = now;
        if (e.deltaY > 0) {
          this.goToScreen(this.currentScreen + 1);
        } else {
          // Reset atEndOnce when scrolling back
          this.atEndOnce = false;
          this.goToScreen(this.currentScreen - 1);
        }
      }
    },

    onTouchStart(e: TouchEvent) {
      this.touchStartY = e.touches[0].clientY;
    },

    onTouchEnd(e: TouchEvent) {
      const deltaY = this.touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        this.goToScreen(this.currentScreen + (deltaY > 0 ? 1 : -1));
      }
    },

    onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.$router.back();
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

    // Transition hooks - faster, snappier
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

    // Localization
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

    async initialize() {
      this.loading = true;

      try {
        const routeId = this.$route.params.id;

        // 1. Load article
        const res = await axiosGet('/content/article/id/' + routeId);
        this.article = res.data;

        // 2. Load UI text
        if (this.textObject) {
          this.uiText = await Promise.all([
            this.textObject.getContent('61d56628cc3bfb06f031f99a'),
            this.textObject.getContent('61d56628cc3bfb06f031f99b'),
            this.textObject.getContent('61d56628cc3bfb06f031f99c'),
            this.textObject.getContent('61d56628cc3bfb06f031f99d')
          ]);
        }

        // 3. Plan hero screen
        const heroData: HeroData = {
          title: this.article.title || '',
          subheader: this.article.subheader,
          image: this.article.image,
          created: this.article.created
        };
        this.heroScreen = planHeroScreen(heroData);

        // 4. Preload images & plan content screens
        const sections: Section[] = this.article.content || [];
        const imageDims = await preloadImages(sections);
        const metrics = calculateMetrics(sections, imageDims);
        this.plannedScreens = planScreens(metrics);

        // 5. Done
        this.loading = false;

        // 6. Focus for keyboard
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
    this.initialize();
  },

  beforeUnmount() {
    document.body.style.overflow = '';
  }
});
</script>

<style lang="scss">
// ============ TOKENS ============
$black: #0C0D08;
$dark: #151919;
$light: #EDF0F3;
$muted: rgba(237, 240, 243, 0.55);
$accent: #c8712e;
$accent-light: #e8a05c;
$glow: rgba(200, 113, 46, 0.4);

$ease-out: cubic-bezier(0.16, 1, 0.3, 1);
$ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

// ============ TRANSITIONS ============
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

// ============ GLOBAL ============
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

// ============ STORY ============
.story {
  position: fixed;
  inset: 0;
  background: $black;
  color: $light;
  overflow: hidden;
  outline: none;

  // Footer
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

    .nav {
      opacity: 0;
      pointer-events: none;
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

// ============ SCREEN ============
.screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: inherit;
      background-size: inherit;
      background-position: inherit;
      filter: blur(0);
      transform: scale(1.05);
      animation: ken-burns 20s ease-in-out infinite alternate;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba($black, 0.4) 0%,
      rgba($black, 0.1) 30%,
      rgba($black, 0.3) 60%,
      rgba($black, 0.9) 100%
    );

    &--hero {
      background: linear-gradient(
        180deg,
        rgba($black, 0.3) 0%,
        rgba($black, 0) 20%,
        rgba($black, 0.2) 50%,
        rgba($black, 0.85) 100%
      );
    }
  }

  &__inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 900px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 5rem;

    &--centered {
      justify-content: center;
      padding-bottom: 0;
    }
  }

  &__grid {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1300px;
    height: calc(100% - 2rem);
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }

  &__hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: $muted;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    animation: pulse 2s ease-in-out infinite;
  }

  &__hint-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, $accent, transparent);
  }

  &--hero, &--hero-full {
    // Full bleed hero - content overlay on background
    .screen__grid--hero {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 900px;
      height: 100%;
      display: grid;
    }

    .cell--hero-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: 5rem;
    }
  }

  &--hero-split {
    background: $black;

    .screen__grid--hero {
      height: 100%;
    }

    .cell--hero-image {
      .cell__image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
      }
    }

    .cell--hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(2rem, 5vw, 4rem);
      background: $dark;
    }
  }

  &--hero-cards {
    background: $black;
    padding: clamp(1.5rem, 4vw, 3rem);

    .screen__grid--hero {
      height: calc(100% - 2rem);
      max-width: 1400px;
    }

    .cell--hero-image {
      border-radius: clamp(12px, 2vw, 24px);
      overflow: hidden;

      .cell__image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
      }
    }

    .cell--hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(1.5rem, 3vw, 2.5rem);
      background: $dark;
      border-radius: clamp(12px, 2vw, 24px);
    }
  }

  &--points {
    background: linear-gradient(160deg, $black 0%, #1c2020 100%);
  }

  &--text-full {
    background: $dark;
  }

  // Merge template layouts
  &--duo-images,
  &--micro-gallery,
  &--quad-mix,
  &--image-split-text {
    background: $dark;
    padding: clamp(1.5rem, 4vw, 3rem);

    @media (min-width: 1024px) {
      padding-left: 6rem;
      padding-right: 6rem;
    }
  }

  &--duo-images {
    .cell--image {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
    }

    .cell--caption {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
      text-align: center;
    }
  }

  &--micro-gallery {
    .cell--image {
      border-radius: clamp(8px, 1.5vw, 16px);
      overflow: hidden;
    }
  }

  &--image-split-text {
    .cell--image {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
    }

    .cell--text {
      display: flex;
      align-items: center;
      padding: clamp(1.5rem, 3vw, 2.5rem);
    }
  }

  &--quad-mix {
    .cell {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
    }
  }
}

@keyframes ken-burns {
  0% { transform: scale(1.05) translate(0, 0); }
  100% { transform: scale(1.12) translate(-1%, -1%); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// ============ HERO ============
.hero {
  animation: hero-in 1s $ease-out both;

  &__title {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 700;
    line-height: 1.05;
    margin-bottom: 1rem;
    letter-spacing: -0.03em;
  }

  &__subtitle {
    font-size: clamp(1rem, 2.5vw, 1.375rem);
    color: rgba($light, 0.7);
    line-height: 1.5;
    margin-bottom: 2rem;
    max-width: 600px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8125rem;
    color: $muted;

    time {
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
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

    &:hover { color: $accent; }
  }
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

// ============ POINTS ============
.points {
  max-width: 650px;
  width: 100%;

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    animation: point-in 0.7s $ease-out both;
    animation-delay: var(--delay, 0ms);
  }

  &__num {
    font-size: 0.75rem;
    font-weight: 700;
    color: $accent;
    opacity: 0.4;
    padding-top: 0.4rem;
    flex-shrink: 0;
  }

  &__text {
    font-size: clamp(1.0625rem, 2.5vw, 1.375rem);
    line-height: 1.5;
  }
}

@keyframes point-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
}

// ============ CELL ============
.cell {
  position: relative;
  border-radius: clamp(12px, 2vw, 20px);
  overflow: hidden;
  background: $dark;
  animation: cell-in 0.6s $ease-out both;

  &--image, &--combined {
    .cell__image {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.4s $ease-out;
    }

    &:hover .cell__image {
      transform: scale(1.03);
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
    text-align: center;
  }

  &--combined {
    .cell__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba($black, 0.9) 0%, rgba($black, 0.2) 60%, transparent 100%);
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
    max-width: 550px;
  }

  &__title {
    font-size: clamp(1.25rem, 3vw, 1.625rem);
    font-weight: 600;
    color: $accent;
    margin-bottom: 1rem;
    line-height: 1.25;
  }

  &__body {
    font-size: clamp(0.9375rem, 2vw, 1.0625rem);
    line-height: 1.75;
    color: rgba($light, 0.85);

    :deep(p) {
      margin-bottom: 1rem;
      &:last-child { margin-bottom: 0; }
    }
  }

  &__caption, &__excerpt {
    font-size: 0.9375rem;
    color: $muted;
    line-height: 1.6;
    font-style: italic;
  }

  &--filler {
    background: linear-gradient(135deg, $dark 0%, #1c2020 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__filler {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__filler-accent {
    width: 40px;
    height: 2px;
    background: rgba($accent, 0.2);
    border-radius: 1px;
  }
}

@keyframes cell-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}

// ============ NAVIGATION ============
.nav {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s $ease-out;

  @media (max-width: 767px) {
    right: 0.75rem;
  }

  &__counter {
    font-size: 0.6875rem;
    font-weight: 600;
    color: $accent;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    transition: transform 0.2s $ease-out;

    &--total {
      color: $muted;
    }
  }

  &__track {
    position: relative;
    width: 3px;
    background: rgba($light, 0.1);
    border-radius: 2px;
    padding: 0.5rem 0;
  }

  &__progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to bottom, $accent, rgba($accent, 0.3));
    border-radius: 2px;
    transition: height 0.3s $ease-out;
    z-index: 0;
  }

  &__dots {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 0;
  }

  &__dot {
    width: 9px;
    height: 9px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    background: rgba($light, 0.2);
    cursor: pointer;
    transition: all 0.2s $ease-out;

    &:hover {
      background: rgba($light, 0.4);
      transform: scale(1.3);
    }

    &--active {
      background: $accent;
      border-color: $accent;
      box-shadow: 0 0 8px $glow;
      transform: scale(1.2);
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
