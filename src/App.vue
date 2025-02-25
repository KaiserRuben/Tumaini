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
  border-radius: 8px;
  border: 0;
  padding: 8px 12px;
  color: $dark-bg;
  background-color: $white;
  font-family: 'Montserrat', sans-serif;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 1em;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($accent-color, 0.5);
  }
}

button {
  border-radius: 8px;
  border: 0;
  padding: 10px 20px;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($accent-color, 0.5);
  }
}

input {
  border: 0;
  font-size: 1em;
  padding: 10px 12px;
  background: rgba($dark-bg, 0.8);
  color: $light-text;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px $accent-color;
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
        background-color: lighten($dark-card-bg, 10%);
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
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;

  &-primary {
    background-color: $primary-color;
    color: $white;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  &-accent {
    background-color: $accent-color;
    color: $dark-bg;

    &:hover {
      background-color: darken($accent-color, 10%);
    }
  }

  &-outline {
    background-color: transparent;
    border: 2px solid $primary-color;
    color: $primary-color;

    &:hover {
      background-color: $primary-color;
      color: $white;
    }
  }
}
</style>