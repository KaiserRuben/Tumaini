<template>
  <header class="site-header">
    <div class="site-header__container">
      <router-link to="/" class="site-header__logo">
        <h1>{{ text[0] }}</h1>
      </router-link>

      <nav class="site-header__nav">
        <router-link
          to="/spenden/1"
          class="site-header__donate"
        >
          Donate
        </router-link>

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
            Donate
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "HeaderComponent",

  data() {
    return {
      text: [] as string[],
      mobileMenuOpen: false
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

  &__logo {
    text-decoration: none;
    color: var(--t-text);
    transition: color var(--t-duration-base) var(--t-ease);

    &:hover {
      color: var(--t-brand);
      text-decoration: none;
    }

    h1 {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic;
      font-size: 1.125rem;
      margin: 0;
      font-weight: 600;
      letter-spacing: 0.02em;

      @media (min-width: 480px) {
        font-size: 1.25rem;
      }

      @media (min-width: 768px) {
        font-size: 1.375rem;
      }
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__donate {
    display: none;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    background-color: var(--t-brand);
    padding: 0.375rem 1rem;
    border-radius: 999px;
    transition: background-color var(--t-duration-base) var(--t-ease),
                box-shadow var(--t-duration-base) var(--t-ease);

    &:hover {
      background-color: var(--t-brand-dark);
      box-shadow: 0 2px 8px rgba(200, 113, 46, 0.3);
      text-decoration: none;
    }

    @media (min-width: 768px) {
      display: inline-flex;
      align-items: center;
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