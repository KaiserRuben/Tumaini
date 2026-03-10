<template>
  <div class="card">
    <div class="cardImg" id="cardImg" :style="backgroundImg()"></div>
    <div class="content">
      <h3>
        {{header}}
      </h3>
      <p>
        {{text}}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'CardEntity',
  props: {
    img: {
      type: String,
    },
    header: {
      type: String,
      default: 'Header'
    },
    text: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. '
    }
  },
  methods: {
    backgroundImg() {
      return {
        'background': `url(${this.img}) no-repeat center`,
        'background-size': '110% auto'
      }
    }
  }

});
</script>
<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 320px;
  border-radius: var(--t-radius-md);
  overflow: hidden;
  background-color: var(--t-bg-card);
  transition: transform var(--t-duration-base) var(--t-ease),
              box-shadow var(--t-duration-base) var(--t-ease);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
}

.cardImg {
  aspect-ratio: 4 / 3;
  width: 100%;
}

.content {
  background-color: var(--t-bg-card);
  color: var(--t-text);
  text-align: left;
  padding: var(--t-spacing-md);

  h3 {
    margin: 0;
  }
}
</style>
