<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="$route.fullPath"/>
      </transition>
    </router-view>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Footer from "@/components/Footer.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "App",
  components: {Footer},
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=Petemoss&display=swap');

// ==========================================================================
//  Design Tokens
// ==========================================================================
:root {
  // Brand
  --t-brand: #c8712e;
  --t-brand-light: #e8a05c;
  --t-brand-dark: #9b5520;
  --t-accent: #FFA400;

  // Surfaces (dark theme)
  --t-bg: #0C0D08;
  --t-bg-card: #151919;
  --t-bg-elevated: #1e2222;
  --t-border: rgba(255, 255, 255, 0.08);
  --t-border-light: rgba(255, 255, 255, 0.15);

  // Text
  --t-text: #EDF0F3;
  --t-text-secondary: rgba(237, 240, 243, 0.7);
  --t-text-muted: rgba(237, 240, 243, 0.5);

  // Spacing
  --t-spacing-xs: 0.5rem;
  --t-spacing-sm: 0.75rem;
  --t-spacing-base: 1rem;
  --t-spacing-md: 1.5rem;
  --t-spacing-lg: 2rem;
  --t-spacing-xl: 3rem;
  --t-spacing-2xl: 4rem;

  // Container
  --t-container-max: 1200px;

  // Timing
  --t-duration-fast: 80ms;
  --t-duration-base: 150ms;
  --t-duration-medium: 250ms;
  --t-duration-slow: 400ms;
  --t-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --t-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --t-ease-sharp: cubic-bezier(0.16, 1, 0.3, 1);

  // Radius
  --t-radius-sm: 6px;
  --t-radius-md: 10px;
  --t-radius-lg: 14px;
  --t-radius-xl: 20px;
}

// ==========================================================================
//  Reset
// ==========================================================================
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// ==========================================================================
//  Base
// ==========================================================================
body {
  margin: 0;
  background: var(--t-bg);
  color: var(--t-text);
  font-family: 'DM Sans', 'Montserrat', sans-serif;
  overflow-x: hidden;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// ==========================================================================
//  Typography
// ==========================================================================
h1 {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: clamp(2rem, 5vw, 3.75rem);
  margin: 0;
}

h2 {
  font-family: 'Petemoss', serif;
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  margin: 0;
}

h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  line-height: 1.3;
  margin: 0;
}

h4 {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

p {
  font-family: 'DM Sans', sans-serif;
  margin: 0.75rem 0;
  text-align: justify;

  @media (max-width: 768px) { font-size: 0.95rem; }
}

// ==========================================================================
//  Links
// ==========================================================================
a {
  text-decoration: none;
  color: var(--t-text);
  transition: color var(--t-duration-base) var(--t-ease);

  &:hover { text-decoration: underline; }
}

// ==========================================================================
//  Form Elements
// ==========================================================================
input, textarea {
  border: 2px solid var(--t-border-light);
  font-size: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(21, 25, 25, 0.6);
  color: var(--t-text);
  transition: border-color var(--t-duration-base) var(--t-ease), box-shadow var(--t-duration-base) var(--t-ease);
  border-radius: var(--t-radius-sm);
  font-family: 'DM Sans', sans-serif;
  min-height: 44px;

  &::placeholder { color: var(--t-text-muted); }

  &:focus {
    outline: none;
    border-color: var(--t-brand);
    box-shadow: 0 0 0 3px rgba(200, 113, 46, 0.2);
  }
}

select {
  border-radius: var(--t-radius-sm);
  border: 2px solid var(--t-border-light);
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  color: var(--t-text);
  background-color: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EDF0F3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  cursor: pointer;
  min-height: 44px;
  transition: border-color var(--t-duration-base) var(--t-ease), box-shadow var(--t-duration-base) var(--t-ease);

  option { background-color: var(--t-bg); color: var(--t-text); }

  &:focus {
    outline: none;
    border-color: var(--t-brand);
    box-shadow: 0 0 0 3px rgba(200, 113, 46, 0.2);
  }
}

// ==========================================================================
//  Buttons
// ==========================================================================
button, .btn {
  border-radius: var(--t-radius-sm);
  border: 0;
  padding: 0.75rem 1.5rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  cursor: pointer;
  min-height: 44px;
  transition: transform var(--t-duration-base) var(--t-ease),
              box-shadow var(--t-duration-base) var(--t-ease),
              background-color var(--t-duration-base) var(--t-ease);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: translateY(0) scale(0.98);
    transition-duration: var(--t-duration-fast);
  }
  &:focus-visible {
    outline: 2px solid var(--t-brand);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(200, 113, 46, 0.15);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover { text-decoration: none; }

  &-primary {
    background-color: var(--t-brand);
    color: #fff;
    &:hover { background-color: var(--t-brand-dark); box-shadow: 0 4px 14px rgba(200, 113, 46, 0.3); }
  }

  &-accent {
    background-color: var(--t-accent);
    color: var(--t-bg);
    &:hover { box-shadow: 0 4px 14px rgba(255, 164, 0, 0.3); }
  }

  &-outline {
    background-color: transparent;
    border: 2px solid var(--t-brand);
    color: var(--t-brand-light);
    box-shadow: none;
    &:hover { background-color: var(--t-brand); color: #fff; box-shadow: 0 4px 12px rgba(200, 113, 46, 0.25); }
  }

  &-ghost {
    background: transparent;
    color: var(--t-text-secondary);
    box-shadow: none;
    &:hover { color: var(--t-text); background: rgba(255, 255, 255, 0.06); box-shadow: none; transform: none; }
  }
}

// ==========================================================================
//  Layout
// ==========================================================================
.container {
  max-width: var(--t-container-max);
  margin: 0 auto;
  padding: 0 var(--t-spacing-base);
  width: 100%;

  @media (min-width: 768px) { padding: 0 var(--t-spacing-md); }
  @media (min-width: 1024px) { padding: 0 var(--t-spacing-lg); }
}

// ==========================================================================
//  Section styles
// ==========================================================================
.whiteSection {
  background-color: var(--t-bg-card);
  color: var(--t-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--t-spacing-2xl) 0;

  @media (max-width: 768px) { padding: var(--t-spacing-xl) 0; }

  .textContainer {
    max-width: 1140px;
    width: 100%;
    padding: 0 var(--t-spacing-base);

    @media (min-width: 768px) { padding: 0 var(--t-spacing-md); }

    button {
      background-color: var(--t-brand);
      color: #fff;
      &:hover { background-color: var(--t-brand-dark); box-shadow: 0 4px 12px rgba(200, 113, 46, 0.3); }
    }
  }
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--t-spacing-base);
  padding: var(--t-spacing-base);

  @media (min-width: 768px) { gap: var(--t-spacing-md); }
}

.cardContainerItem {
  margin: 0;
  flex: 0 0 auto;
}

// ==========================================================================
//  Transitions
// ==========================================================================
.fade-enter-active,
.fade-leave-active { transition: opacity var(--t-duration-medium) var(--t-ease); }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.page-enter-active,
.page-leave-active { transition: opacity 0.25s var(--t-ease), transform 0.25s var(--t-ease); }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-6px); }

// Scroll-triggered reveal
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s var(--t-ease-out), transform 0.6s var(--t-ease-out);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-stagger {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s var(--t-ease-out), transform 0.5s var(--t-ease-out);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

// ==========================================================================
//  Utilities
// ==========================================================================
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }
.mt-5 { margin-top: 3rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mb-5 { margin-bottom: 3rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

// ==========================================================================
//  Scrollbar
// ==========================================================================
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--t-text-muted); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--t-text-secondary); }

// ==========================================================================
//  Reduced Motion
// ==========================================================================
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
