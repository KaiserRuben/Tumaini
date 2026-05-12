<template>
  <header class="site-header">
    <div class="site-header__container">
      <router-link to="/" class="site-header__brand" aria-label="Tumaini — Startseite">
        <svg class="site-header__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient :id="`brandSky-${uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#1a1a14"/>
              <stop offset="55%" stop-color="#221d12"/>
              <stop offset="100%" stop-color="#3a2914"/>
            </linearGradient>
            <linearGradient :id="`brandSkyWarm-${uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#3a1d3f"/>
              <stop offset="35%" stop-color="#8a3a2a"/>
              <stop offset="70%" stop-color="#d97a2e"/>
              <stop offset="100%" stop-color="#ffb45a"/>
            </linearGradient>
            <linearGradient :id="`brandGroundWarm-${uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#6a3415"/>
              <stop offset="100%" stop-color="#2a1408"/>
            </linearGradient>
            <radialGradient :id="`brandReflection-${uid}`" cx="50%" cy="0%" r="100%">
              <stop offset="0%"   stop-color="#ffd084" stop-opacity="0.95"/>
              <stop offset="45%"  stop-color="#ffb43f" stop-opacity="0.55"/>
              <stop offset="100%" stop-color="#c8712e" stop-opacity="0"/>
            </radialGradient>
            <radialGradient :id="`brandSun-${uid}`" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stop-color="#ffe7b8"/>
              <stop offset="35%" stop-color="#ffb43f"/>
              <stop offset="80%" stop-color="#c8712e"/>
              <stop offset="100%" stop-color="#7a3f15"/>
            </radialGradient>
            <radialGradient :id="`brandHalo-${uid}`" cx="50%" cy="100%" r="100%">
              <stop offset="0%"  stop-color="#ffb43f" stop-opacity="0.55"/>
              <stop offset="60%" stop-color="#c8712e" stop-opacity="0"/>
            </radialGradient>
            <linearGradient :id="`brandRim-${uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.55"/>
              <stop offset="35%" stop-color="#ffffff" stop-opacity="0.08"/>
              <stop offset="70%" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient :id="`brandGround-${uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stop-color="#2c2415"/>
              <stop offset="100%" stop-color="#1a1208"/>
            </linearGradient>
          </defs>

          <rect width="64" height="64" rx="14" ry="14" :fill="`url(#brandSky-${uid})`"/>
          <rect class="site-header__mark-skywarm" width="64" height="64" rx="14" ry="14" :fill="`url(#brandSkyWarm-${uid})`"/>
          <ellipse class="site-header__mark-halo" cx="32" cy="44" rx="28" ry="14" :fill="`url(#brandHalo-${uid})`"/>
          <circle
            class="site-header__mark-sun"
            cx="32" cy="44" r="18"
            :fill="`url(#brandSun-${uid})`"
          />
          <path
            class="site-header__mark-ground"
            d="M 0 44 L 64 44 L 64 50 Q 64 64 50 64 L 14 64 Q 0 64 0 50 Z"
            :fill="`url(#brandGround-${uid})`"
          />
          <path
            class="site-header__mark-ground-warm"
            d="M 0 44 L 64 44 L 64 50 Q 64 64 50 64 L 14 64 Q 0 64 0 50 Z"
            :fill="`url(#brandGroundWarm-${uid})`"
          />
          <g class="site-header__mark-reflection">
            <ellipse cx="32" cy="50" rx="14" ry="5" :fill="`url(#brandReflection-${uid})`"/>
            <line x1="22" y1="48.5" x2="42" y2="48.5" stroke="#fefdf8" stroke-opacity="0.32" stroke-width="0.5" stroke-linecap="round"/>
            <line x1="19" y1="52"   x2="45" y2="52"   stroke="#fefdf8" stroke-opacity="0.20" stroke-width="0.5" stroke-linecap="round"/>
            <line x1="23" y1="56"   x2="41" y2="56"   stroke="#fefdf8" stroke-opacity="0.12" stroke-width="0.5" stroke-linecap="round"/>
            <line x1="26" y1="60"   x2="38" y2="60"   stroke="#fefdf8" stroke-opacity="0.08" stroke-width="0.5" stroke-linecap="round"/>
          </g>
          <line x1="8" y1="44" x2="56" y2="44" stroke="#c8712e" stroke-width="1.4" stroke-linecap="round" opacity="0.95"/>
          <line x1="8" y1="44" x2="56" y2="44" stroke="#ffe0a8" stroke-width="0.5" stroke-linecap="round" opacity="0.7"/>
          <g class="site-header__mark-star">
            <circle cx="48" cy="14" r="3.4" fill="#fefdf8" opacity="0.18"/>
            <circle cx="48" cy="14" r="1.6" fill="#fefdf8" opacity="0.95"/>
          </g>
          <rect width="64" height="32" rx="14" ry="14" :fill="`url(#brandRim-${uid})`"/>
          <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" ry="13.25"
                fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1"
                pointer-events="none"/>
        </svg>
        <span class="site-header__wordmark">Tumaini</span>
      </router-link>

      <nav class="site-header__nav">
        <button
          class="site-header__mobile-toggle"
          :class="{ 'is-active': mobileMenuOpen }"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="site-header__links" :class="{ 'is-active': mobileMenuOpen }">
          <router-link
            to="/archiv/berichte"
            v-if="!isActivePath('berichte')"
            class="site-header__link"
          >
            {{ text[1] }}
          </router-link>

          <router-link
            to="/archiv/projekte"
            v-if="!isActivePath('projekte')"
            class="site-header__link"
          >
            {{ text[2] }}
          </router-link>

          <router-link
            to="/spenden/1"
            class="site-header__link site-header__link--donate-mobile"
          >
            {{ text[3] }}
          </router-link>
        </div>

        <router-link
          to="/spenden/1"
          class="site-header__donate"
        >
          <span class="site-header__donate-label">{{ text[3] }}</span>
          <span class="site-header__donate-arrow" aria-hidden="true">→</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent} from "vue";

let brandUidCounter = 0;

export default defineComponent({
  name: "HeaderComponent",

  data() {
    return {
      text: [] as string[],
      mobileMenuOpen: false,
      uid: `b${++brandUidCounter}`,
    }
  },

  methods: {
    isActivePath(path: string): boolean {
      return this.$route.fullPath.toLowerCase().includes(path);
    }
  },

  async mounted() {
    this.text = [
      await this.textObject.getContent('61d4a9196eaf27340d6b5310'),
      await this.textObject.getContent('61d4a9196eaf27340d6b5311'),
      await this.textObject.getContent('61d4a9196eaf27340d6b5312'),
      await this.textObject.getContent('6a035adcf951d1f4c4d60728'),
    ]
  },

  watch: {
    $route() {
      // Close mobile menu when route changes
      this.mobileMenuOpen = false;
    }
  }
})
</script>

<style lang="scss" scoped>
.site-header {
  background-color: var(--t-bg);
  color: var(--t-text);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--t-border);

  // Mobile First
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;

    @media (min-width: 480px) {
      padding: 0 1.5rem;
      height: 64px;
    }

    @media (min-width: 768px) {
      padding: 0 2rem;
      height: 72px;
    }
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: var(--t-text);
    transition: color var(--t-duration-base) var(--t-ease);

    &:hover {
      text-decoration: none;
      .site-header__mark             { filter: drop-shadow(0 14px 30px rgba(255, 200, 100, 0.65)); }
      .site-header__mark-sun         { transform: translateY(-14px); }
      .site-header__mark-halo        { opacity: 1; transform: scale(1.3); }
      .site-header__mark-star        { opacity: 0; }
      .site-header__mark-skywarm     { opacity: 1; }
      .site-header__mark-ground-warm { opacity: 1; }
      .site-header__mark-reflection  { opacity: 1; transform: translateY(3px) scaleY(1.5); }
      .site-header__wordmark         { color: var(--t-brand); }
    }

    @media (min-width: 768px) { gap: 0.75rem; }
  }

  &__mark {
    display: block;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    filter: drop-shadow(0 6px 14px rgba(200, 113, 46, 0.35));
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease;
    overflow: visible;

    @media (min-width: 768px) {
      width: 36px;
      height: 36px;
    }

    &-sun {
      transform: translateY(0);
      transition: transform 2.4s cubic-bezier(0.16, 0.84, 0.44, 1);
    }
    &-halo {
      opacity: 0.7;
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(1);
      transition: opacity 1.8s ease, transform 1.8s cubic-bezier(0.16, 0.84, 0.44, 1);
    }
    &-star {
      transform-box: fill-box;
      transform-origin: center;
      opacity: 1;
      transition: opacity 1s ease, transform 1s ease;
    }
    &-skywarm {
      opacity: 0;
      transition: opacity 2.2s cubic-bezier(0.22, 0.7, 0.36, 1);
    }
    &-ground-warm {
      opacity: 0;
      transition: opacity 2.0s cubic-bezier(0.22, 0.7, 0.36, 1);
    }
    &-reflection {
      transform-box: fill-box;
      transform-origin: 32px 44px;
      transform: translateY(0) scaleY(1);
      opacity: 0.7;
      transition: opacity 2.0s ease, transform 2.4s cubic-bezier(0.16, 0.84, 0.44, 1);
    }
  }

  &__wordmark {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--t-text);
    transition: color var(--t-duration-base) var(--t-ease);

    @media (min-width: 768px) { font-size: 1.5rem; }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__donate {
    display: none;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
    color: #fff;
    background-color: var(--t-brand);
    padding: 0.85rem 1.5rem 0.85rem 1.75rem;
    border-radius: 999px;
    white-space: nowrap;
    gap: 0.6rem;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset,
                0 8px 22px -10px rgba(200, 113, 46, 0.6);
    transition: background-color var(--t-duration-base) var(--t-ease),
                box-shadow var(--t-duration-base) var(--t-ease),
                transform var(--t-duration-base) var(--t-ease);

    &-arrow {
      display: inline-block;
      transition: transform var(--t-duration-base) var(--t-ease);
      font-size: 1.05rem;
      line-height: 1;
    }

    &:hover {
      background-color: var(--t-brand-dark);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset,
                  0 12px 28px -8px rgba(255, 164, 0, 0.55);
      transform: translateY(-1px);
      text-decoration: none;

      .site-header__donate-arrow { transform: translateX(3px); }
    }

    @media (min-width: 768px) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    @media (min-width: 768px) {
      gap: 2rem;
    }

    @media (max-width: 767px) {
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background-color: var(--t-bg);
      flex-direction: column;
      padding: 1.5rem 1rem;
      gap: 0;
      border-bottom: 1px solid var(--t-border);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: transform var(--t-duration-base) var(--t-ease),
                  opacity var(--t-duration-base) var(--t-ease),
                  visibility var(--t-duration-base) var(--t-ease);

      &.is-active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__link {
    color: var(--t-text);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    padding: 0.5rem 0;
    transition: color var(--t-duration-base) var(--t-ease);

    &:hover {
      color: var(--t-brand);
      text-decoration: none;
    }

    @media (max-width: 767px) {
      width: 100%;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      opacity: 0;
      animation: staggerFadeIn var(--t-duration-medium) var(--t-ease-out) forwards;
      animation-play-state: paused;

      .is-active & {
        animation-play-state: running;
      }

      &:nth-child(1) { animation-delay: 50ms; }
      &:nth-child(2) { animation-delay: 100ms; }
      &:nth-child(3) { animation-delay: 150ms; }

      &:last-child {
        border-bottom: none;
      }
    }

    &--donate-mobile {
      @media (min-width: 768px) {
        display: none;
      }

      @media (max-width: 767px) {
        color: var(--t-brand);
        font-weight: 600;
      }
    }

    @media (min-width: 768px) {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background-color: var(--t-brand);
        transform: scaleX(0);
        transition: transform var(--t-duration-base) var(--t-ease);
        transform-origin: center;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }
  }

  &__mobile-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    width: 44px;
    height: 44px;
    padding: 8px;
    z-index: 10;

    @media (min-width: 768px) {
      display: none;
    }

    span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: var(--t-text);
      border-radius: 2px;
      transition: transform var(--t-duration-base) var(--t-ease),
                  opacity var(--t-duration-base) var(--t-ease);
    }

    &.is-active {
      span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }
  }
}

@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>