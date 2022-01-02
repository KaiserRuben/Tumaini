<template>
  <Header/>
  <div class="container">
    <div class="contentContainer">
      <h1>Berichte Archiv</h1>
      <div class="berichtContainer">
        <div class="bericht" v-for="i in [1,2,3,4,5]" v-bind:key="i" @click="$router.push('/bericht')">
          <h2>Bericht {{ i }}</h2>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
            clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
            sed diam voluptua...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Berichte Archiv",
  components: {Header}
})
</script>
<style lang="sass" scoped>
.container
  min-height: 92vh
  width: 100vw
  border-radius: 10px
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: center

.contentContainer
  max-width: 1140px

  h1
    font-size: 3em
    padding: 20px

  .berichtContainer
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-evenly
    align-items: center

    .bericht
      background-color: #151919
      border-radius: 30px
      padding: 30px
      transition: 1s
      max-width: 40%
      margin: 20px

      h2
        font-size: 2em

    .bericht:hover
      background-color: #5F9AAE
      color: #F5FFFF
      //background-color: #FFA400
      //color: #0C0D08
      cursor: pointer
      border-radius: 10px
</style>