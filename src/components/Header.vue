<template>
  <header class="site-header">
    <div class="site-header__container">
      <router-link to="/" class="site-header__logo">
        <h1>{{ text[0] }}</h1>
      </router-link>

      <nav class="site-header__nav">
        <button
          class="site-header__mobile-toggle"
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
  background-color: #FFF;
  color: #0C0D08;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;

    @media (max-width: 768px) {
      padding: 0 1rem;
      height: 70px;
    }
  }

  &__logo {
    text-decoration: none;
    color: #0C0D08;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    h1 {
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }
  }

  &__nav {
    display: flex;
    align-items: center;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      background-color: #FFF;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;

      &.is-active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__link {
    color: #0C0D08;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.05rem;
    position: relative;
    padding: 0.5rem 0;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: #5F9AAE;
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: center;
    }

    &:hover::after, &.router-link-active::after {
      transform: scaleX(1);
    }
  }

  &__mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 24px;
    position: relative;
    z-index: 10;
    padding: 0;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    span {
      display: block;
      width: 100%;
      height: 3px;
      background-color: #0C0D08;
      border-radius: 3px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    &.is-active {
      span:nth-child(1) {
        transform: translateY(10.5px) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: translateY(-10.5px) rotate(-45deg);
      }
    }
  }
}
</style>