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
        <h2>
          Vor Ort
        </h2>
        <h2>
          Helfen
        </h2>

      </div>
    </div>

    <!-- Section 2 (Welcome & Cards) -->
    <div class="section">
      <div class="welcomeSection">
        <div>
          <p class="light" style="margin-bottom: 0; text-align: center">
            Herzlich Willkommen
          </p>
          <h1>
            TUMAINI
          </h1>
        </div>
        <div class="cardContainer">
          <Card
              class="cardContainerItem"
              :img="photo1"
              header="Wer?"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."/>
          <Card
              class="cardContainerItem"
              :img="photo2"
              header="Was?"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."/>
          <Card
              class="cardContainerItem"
              :img="photo3"
              header="Wo?"
              text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."/>
        </div>
      </div>
    </div>

    <!-- Section 3 (About) -->
    <div class="aboutSection">
      <div class="textContainer">
        <h2>
          Die Tumaini Stiftung
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
          clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
          consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
          diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
          dolor sit amet.
        </p>
      </div>
      <div class="textContainer" style="padding-top: 20px;">
        <h2>
          Aktueller Bericht
        </h2>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
          clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
          consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
        <button style="float: right;">Weiterlesen</button>
      </div>
    </div>

    <!-- Section 4 (Donations) -->
    <div class="section donationSection">
      <donation-card
          click-u-r-l="/"
          :nr="1"
          header="Support: 5550 €"
          text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <donation-card
          click-u-r-l="/"
          :nr="2"
          header="Forestering: 50€ / Monat"
          text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <donation-card
          click-u-r-l="/"
          :nr="3"
          header="Sponsorship: 200€ / Monat"
          text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import Card from "@/components/Card.vue";
import donationCard from "@/components/DonationCard.vue";

// Photos for Cards
import * as p1 from '@/assets/landing/roman-nguyen-lPPkJ4NfQtQ-unsplash.webp'
import * as p2 from '@/assets/landing/elcarito-fouVDmGXoPI-unsplash.webp'
import * as p3 from '@/assets/landing/damian-patkowski-T-LfvX-7IVg-unsplash.webp'


export default defineComponent({
  name: 'Home',
  components: {Card, donationCard},
  data() {
    return {
      photo1: p1,
      photo2: p2,
      photo3: p3
    }
  }
});
</script>
<style scoped lang="sass">
.section
  min-height: 100vh
  height: max-content

.light
  font-weight: 300

@keyframes appear
  from
    opacity: 0
  to
    opacity: 1

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
      background-size: auto 120%

  .imgGrid2
    background: url("../assets/landing/carolinie-cavalli-yFaK9jgQeb4-unsplash.webp") no-repeat center
    background-size: auto 120%
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    align-items: flex-end
    justify-content: center
    padding-right: 10vw

    h2
      font-size: 7em
      margin: 0
      animation-name: appear
      animation-duration: 3s

.welcomeSection
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  align-items: center
  justify-content: space-evenly
  text-align: center

  min-height: 100vh
  height: 100%

.cardContainer
  display: flex
  flex-wrap: wrap
  flex-direction: row
  justify-content: center

  .cardContainerItem
    margin: 10px

.aboutSection
  background-color: #FFF
  color: #0C0D08
  height: max-content
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding: 40px 0

  .textContainer
    width: 1140px

    h2
      margin: 0

    button
      background-color: #151919
      color: #EDF0F3

.donationSection
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  align-items: center
  justify-content: space-around

</style>