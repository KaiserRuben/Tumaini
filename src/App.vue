<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath"/>
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
  methods: {
    onEnter() {
      console.log('Enter transition started')
    },
    onAfterEnter() {
      console.log('Enter transition complete')
    },
    onLeave() {
      console.log('Leave transition started')
    },
    onAfterLeave() {
      console.log('Leave transition complete')
    },
  }
});
</script>

<style lang="scss">
// Import fonts
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Petemoss&display=swap');

// Variables
$primary-color: #5F9AAE;
$accent-color: #FFA400;
$dark-bg: #0C0D08;
$dark-card-bg: #151919;
$light-text: #EDF0F3;
$white: #FFF;

// Reset
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

// Base styles
body {
  margin: 0;
  background: $dark-bg;
  color: $light-text;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
  line-height: 1.6;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// Typography
h1 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 5px;
  font-size: 60px;
  margin: 10px auto;

  @media (max-width: 768px) {
    font-size: 40px;
    letter-spacing: 3px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    letter-spacing: 2px;
  }
}

h2 {
  font-family: 'Petemoss', serif;
  font-size: 60px;

  @media (max-width: 768px) {
    font-size: 50px;
  }

  @media (max-width: 480px) {
    font-size: 40px;
  }
}

h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.3;

  @media (min-width: 480px) {
    font-size: 1.375rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

p {
  font-family: 'Montserrat', sans-serif;
  margin: 10px auto;
  text-align: justify;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
}

// Links
a {
  text-decoration: none;
  color: $light-text;
  transition: color 0.3s ease;

  &:hover {
    text-decoration: underline;
  }
}

// Form elements
select {
  border-radius: 6px;
  border: 0;
  padding: 10px 14px;
  padding-right: 36px;
  color: $dark-bg;
  background-color: $white;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($accent-color, 0.4);
  }
}

button {
  border-radius: 6px;
  border: 0;
  padding: 12px 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($accent-color, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus:not(:focus-visible) {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba($accent-color, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

input {
  border: 0;
  font-size: 1em;
  padding: 12px 14px;
  background: rgba($dark-bg, 0.8);
  color: $light-text;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($accent-color, 0.4);
  }
}

// Section styles
.whiteSection {
  background-color: $white;
  color: $dark-bg;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0;

  .textContainer {
    max-width: 1140px;
    width: 100%;
    padding: 0 20px;

    @media (max-width: 1200px) {
      width: 90%;
    }

    h2 {
      margin: 0;
    }

    button {
      background-color: $dark-card-bg;
      color: $light-text;

      &:hover {
        background-color: lighten($dark-card-bg, 8%);
        box-shadow: 0 4px 12px rgba($dark-card-bg, 0.4);
      }
    }
  }
}

// Card containers
.cardContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  padding: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
}

.cardContainerItem {
  margin: 0;
  flex: 0 0 auto;
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Utility classes
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
}

.text-center {
  text-align: center;
}

.mt-1 {
  margin-top: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 1.5rem;
}

.mt-4 {
  margin-top: 2rem;
}

.mt-5 {
  margin-top: 3rem;
}

.mb-1 {
  margin-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 2rem;
}

.mb-5 {
  margin-bottom: 3rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

// Buttons
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-decoration: none;
  }

  &:active {
    transform: translateY(0);
  }

  &-primary {
    background-color: $primary-color;
    color: $white;

    &:hover {
      background-color: darken($primary-color, 8%);
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);
    }
  }

  &-accent {
    background-color: $accent-color;
    color: $dark-bg;

    &:hover {
      background-color: darken($accent-color, 8%);
      box-shadow: 0 4px 12px rgba($accent-color, 0.3);
    }
  }

  &-outline {
    background-color: transparent;
    border: 1.5px solid $primary-color;
    color: $primary-color;
    box-shadow: none;

    &:hover {
      background-color: $primary-color;
      color: $white;
      box-shadow: 0 4px 12px rgba($primary-color, 0.25);
    }
  }
}
</style>