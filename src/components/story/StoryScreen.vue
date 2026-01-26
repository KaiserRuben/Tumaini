<template>
  <section
    class="screen"
    :class="[`screen--${screen.layout.type}`, { 'screen--active': active }]"
  >
    <!-- Background for showcase/cinematic layouts -->
    <div v-if="hasFullBleedBg" class="screen__bg" :style="bgStyle"></div>
    <div v-if="hasFullBleedBg" class="screen__overlay"></div>

    <!-- Grid of cells -->
    <div class="screen__grid" :style="gridStyle" :class="{ 'screen__grid--visible': active }">
      <StoryCell
        v-for="cell in screen.cells"
        :key="cell.id"
        :cell="cell"
        :active="active"
        :localize="localize"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { PlannedScreen } from "@/utils/screenPlanner";
import StoryCell from "./StoryCell.vue";

export default defineComponent({
  name: "StoryScreen",

  components: {
    StoryCell
  },

  props: {
    screen: {
      type: Object as PropType<PlannedScreen>,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    localize: {
      type: Function as PropType<(text: string, mode?: string) => string>,
      required: true
    }
  },

  computed: {
    hasFullBleedBg(): boolean {
      return this.screen.layout.type === 'showcase' || this.screen.layout.type === 'cinematic';
    },

    bgStyle(): Record<string, string> {
      if (!this.hasFullBleedBg || !this.screen.cells.length) {
        return {};
      }

      // Find the first cell with an image
      const cellWithImage = this.screen.cells.find(cell => cell.section?.image);
      if (!cellWithImage?.section?.image) {
        return {};
      }

      return {
        backgroundImage: `url(${cellWithImage.section.image})`
      };
    },

    gridStyle(): Record<string, string> {
      const layout = this.screen.layout;
      return {
        gridTemplateColumns: layout.columns,
        gridTemplateRows: layout.rows,
        gridTemplateAreas: layout.areas.join(' ')
      };
    }
  }
});
</script>

<style lang="scss" scoped>
.screen {
  position: relative;
  min-height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding-left: 5rem;
    padding-right: 4rem;
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transform: scale(1.08);
    transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &--active &__bg {
    transform: scale(1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(12,13,8,0.2) 0%, rgba(12,13,8,0.1) 40%, rgba(12,13,8,0.7) 70%, rgba(12,13,8,0.95) 100%);
  }

  &__grid {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    height: calc(100vh - 4rem);
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.5rem);
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
