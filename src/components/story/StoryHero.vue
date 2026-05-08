<template>
  <section :class="['screen', `screen--${layout.type}`]">
    <!-- Hero Full: background image + overlay + content -->
    <template v-if="layout.type === 'hero-full'">
      <div class="screen__bg">
        <SmartImage v-if="hero.image" :src="hero.image" :alt="heroAlt" level="safe" class="screen__bg-img" />
      </div>
      <div class="screen__overlay screen__overlay--hero"></div>
      <div class="screen__inner">
        <div class="hero">
          <h1 class="hero__title">{{ localize(hero.title, 'strict') }}</h1>
          <p v-if="hero.subheader" class="hero__subtitle">{{ localize(hero.subheader, 'strict') }}</p>
          <slot name="meta"></slot>
        </div>
      </div>
    </template>

    <!-- Hero Split: image left, content right -->
    <template v-else-if="layout.type === 'hero-split'">
      <div class="screen__grid screen__grid--split">
        <div class="hero-image">
          <SmartImage v-if="hero.image" :src="hero.image" :alt="heroAlt" level="subject" class="hero-image__img" />
        </div>
        <div class="hero-content">
          <div class="hero">
            <h1 class="hero__title">{{ localize(hero.title, 'strict') }}</h1>
            <p v-if="hero.subheader" class="hero__subtitle">{{ localize(hero.subheader, 'strict') }}</p>
            <slot name="meta"></slot>
          </div>
        </div>
      </div>
    </template>

    <!-- Hero Cards: image card + content card -->
    <template v-else-if="layout.type === 'hero-cards'">
      <div class="screen__grid screen__grid--cards">
        <div v-if="hero.image" class="hero-image hero-image--card">
          <SmartImage :src="hero.image" :alt="heroAlt" level="subject" class="hero-image__img" />
        </div>
        <div class="hero-content hero-content--card">
          <div class="hero">
            <h1 class="hero__title">{{ localize(hero.title, 'strict') }}</h1>
            <p v-if="hero.subheader" class="hero__subtitle">{{ localize(hero.subheader, 'strict') }}</p>
            <slot name="meta"></slot>
          </div>
        </div>
      </div>
    </template>

<!--    &lt;!&ndash; Scroll Hint &ndash;&gt;-->
<!--    <div class="screen__hint">-->
<!--      <span>Scroll</span>-->
<!--      <div class="screen__hint-line"></div>-->
<!--    </div>-->
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { HeroData, ScreenLayout, LocalizeFn } from '@/utils/screenPlanner';
import SmartImage from '@/components/SmartImage.vue';
import { getDescription, hasPlacement } from '@/utils/focalPoint';

export default defineComponent({
  name: 'StoryHero',
  components: { SmartImage },
  props: {
    hero: { type: Object as PropType<HeroData>, required: true },
    layout: { type: Object as PropType<ScreenLayout>, required: true },
    localize: { type: Function as PropType<LocalizeFn>, required: true }
  },
  computed: {
    heroAlt(): string {
      const title = this.localize(this.hero.title || '', 'strict');
      if (!this.hero.image || !hasPlacement(this.hero.image)) return title;
      const desc = getDescription(this.hero.image);
      const bilingual = desc.de && desc.en ? `${desc.de} - ${desc.en}` : desc.de || desc.en || desc.nl;
      const localized = bilingual ? this.localize(bilingual, 'strict') : '';
      return localized || title;
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/story-tokens' as *;

.screen {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  // ---- Hero Full ----
  &--hero-full {
    .screen__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .screen__bg-img {
      animation: ken-burns 20s ease-in-out infinite alternate;
    }

    .screen__overlay--hero {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        180deg,
        rgba($black, 0.3) 0%,
        rgba($black, 0) 20%,
        rgba($black, 0.2) 50%,
        rgba($black, 0.85) 100%
      );
    }

    .screen__inner {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 900px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 clamp(1rem, 4vw, 3rem) 5rem;
    }
  }

  // ---- Hero Split ----
  &--hero-split {
    background: $black;

    .screen__grid--split {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;

      @media (max-width: $breakpoint-mobile) {
        grid-template-columns: 1fr;
        grid-template-rows: 50% 50%;
      }
    }

    .hero-image {
      position: relative;
      overflow: hidden;
    }

    .hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(2rem, 5vw, 4rem);
      background: $dark;
    }
  }

  // ---- Hero Cards ----
  &--hero-cards {
    background: $black;
    padding: clamp(1.5rem, 4vw, 3rem);

    .screen__grid--cards {
      width: 100%;
      max-width: 1400px;
      height: calc(100% - 2rem);
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;

      @media (max-width: $breakpoint-mobile) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
        height: auto;
        min-height: calc(100vh - 6rem);
      }
    }

    .hero-image--card {
      border-radius: clamp(12px, 2vw, 24px);
      overflow: hidden;
    }

    .hero-content--card {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(1.5rem, 3vw, 2.5rem);
      background: $dark;
      border-radius: clamp(12px, 2vw, 24px);
    }
  }
}

// ---- Hero Typography ----
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
}

// ---- Scroll Hint ----
.screen__hint {
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

.screen__hint-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, $accent, transparent);
}

// ---- Keyframes ----
@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

@keyframes ken-burns {
  0% { transform: scale(1.0) translate(0, 0); }
  100% { transform: scale(1.07) translate(-1%, -1%); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
