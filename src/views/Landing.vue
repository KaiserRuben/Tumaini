<template>
  <div>

    <!-- Section 1 (IMG Layout) -->
    <div class="section imgContainer">
      <div class="imgGrid1">
        <div class="imgGrid1_1">

          <div class="imgGrid1_1_1">

          </div>
          <div class="imgGrid1_1_2">

          </div>
        </div>
        <div class="imgGrid1_2">

        </div>
      </div>
      <div class="imgGrid2">

      </div>
    </div>
    <div class="section">
      <div class="welcomeSection">
        <div>
          <p class="light" style="margin-bottom: 0">
            Herzlich Willkommen
          </p>
          <h1>
            TUMAINI
          </h1>
        </div>
        <p>
          test123
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Home',
  components: {},
});
</script>
<style scoped lang="sass">
.section
  height: 100vh

.light
  font-weight: 300

/* Image Layout for Landing */
.imgContainer
  display: grid
  grid-template-columns: 50vw 50vw

  .imgGrid1
    display: grid
    grid-template-rows: 50vh 50vh

    .imgGrid1_1
      display: grid
      grid-template-columns: 33% 67%

      .imgGrid1_1_1
        background: url("../assets/landing/annie-spratt-0cgpyigyIkM-unsplash.webp") no-repeat center
        background-size: auto 120%

      .imgGrid1_1_2
        background: url("../assets/landing/annie-spratt-cVEOh_JJmEE-unsplash.webp") no-repeat center
        background-size: auto 120%

    .imgGrid1_2
      background: url("../assets/landing/ben-hummitzsch-pYTgvmpuQWs-unsplash.webp") no-repeat center
      background-size: 120% auto

  .imgGrid2
    background: url("../assets/landing/carolinie-cavalli-yFaK9jgQeb4-unsplash.webp") no-repeat center
    background-size: auto 120%

.welcomeSection
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  align-items: center
  justify-content: center
  text-align: center

  height: 100%
</style>