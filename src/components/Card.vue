<template>
  <div class="card">
    <div class="cardImg" id="cardImg" :style="backgroundImg()"></div>
    <div class="content">
      <h2>
        {{header}}
      </h2>
      <p>
        {{text}}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Card',
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
<style lang="sass" scoped>
.card
  min-width: 300px
  max-width: 25vw
  width: max-content

.cardImg
  height: 200px

.content
  background-color: #151919
  color: #EDF0F3
  text-align: left
  padding: 20px
  h2
    margin: 0
</style>