<template>
  <div class="container">
    <div class="firstRow">
      <h1>
        0{{nr}}
      </h1>
      <h2>
        {{header}}
      </h2>
      <button @click="$router.push(clickURL)">
        mehr erfahren
      </button>
    </div>
    <p>
      {{text}}
    </p>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Card',
  props: {
    nr: {
      type: Number,
      default: 1
    },
    header: {
      type: String,
      default: 'Header'
    },
    text: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
    },

    clickURL: {
      type: String,
      default: '/'
    }
  },

});
</script>
<style lang="sass" scoped>
.container
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 800px
  color: #EDF0F3
  .firstRow
    width: 100%
    display: grid
    grid-template-columns: auto 65% 25%
    align-items: center
    h1
      margin: 0
      color: #363636
      font-size: 2.5em
    h2
      font-size: 3em
      margin: 0
    button
      background-color: #5F9AAE
      color: #F5FFFF
  p
    width: 90%
    align-self: flex-end
    margin: 10px 0
</style>