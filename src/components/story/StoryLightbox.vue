<template>
  <Transition name="lightbox">
    <div v-if="image" class="lightbox" @click="$emit('close')">
      <button class="lightbox__close" @click.stop="$emit('close')" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img :src="image" :alt="caption" class="lightbox__img" @click.stop />
      <p v-if="caption" class="lightbox__caption">{{ caption }}</p>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoryLightbox',
  props: {
    image: { type: String, default: null },
    caption: { type: String, default: '' }
  },
  emits: ['close']
});
</script>

<style lang="scss">
@use '@/styles/story-tokens' as *;

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba($black, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 2rem;

  &__close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba($light, 0.1);
    border: none;
    color: $light;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s $ease-out;
    padding: 0;
    min-height: unset;
    box-shadow: none;

    &:hover {
      background: rgba($light, 0.2);
      transform: none;
      box-shadow: none;
    }
  }

  &__img {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 4px;
    cursor: default;
    animation: lightbox-in 0.3s $ease-out both;
  }

  &__caption {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: $muted;
    text-align: center;
    max-width: 600px;
    font-style: italic;
  }
}

// Transition classes (must be unscoped for Vue transitions)
.lightbox-enter-active {
  transition: opacity 0.25s $ease-out;
}
.lightbox-leave-active {
  transition: opacity 0.2s $ease-out;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@keyframes lightbox-in {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
}
</style>
