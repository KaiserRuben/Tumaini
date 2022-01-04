<template>
  <div class="card" @click="$router.push(click)">
    <div class="cardImg" id="cardImg" :style="backgroundImg()"></div>
    <div class="content">
      <h2>
        {{ header }}
      </h2>
      <p>
        {{ text }}
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
      default: 'https://media.kaiser.fyi/mindsupport/840/Mindfulness.png'
    },
    header: {
      type: String,
      default: 'Header'
    },
    text: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua... '
    },
    inProgress: {
      type: Boolean,
      default: true
    },
    click: {
      type: String,
      default: '/project'
    },
  },
  methods: {
    backgroundImg() {
      return {
        'background': `url(${this.img}) no-repeat center`,
        'background-size': '120% auto'
      }
    }
  }

});
</script>
<style lang="sass" scoped>
.card
  min-width: 200px
  max-width: 20vw
  width: max-content
  @media only screen and (max-width: 640px)
    max-width: 80vw

.content:hover
  background-color: #5F9AAE
  color: #F5FFFF
  //background-color: #FFA400
  //color: #0C0D08
  cursor: pointer

.cardImg
  height: 200px

.content
  transition: 1s
  background-color: #151919
  color: #EDF0F3
  text-align: left
  padding: 20px

  h2
    margin: 0
</style>