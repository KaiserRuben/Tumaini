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
          {{ text[0] }}
        </h2>
        <h2>
          {{ text[1] }}
        </h2>

      </div>
    </div>

    <!-- Section 2 (Welcome & Cards) -->
    <div class="section">
      <div class="welcomeSection">
        <div class="welcomeText">
          <p class="light" style="margin-bottom: 0; text-align: center">
            {{ text[2] }}
          </p>
          <h1>
            {{ text[3] }}
          </h1>
        </div>
        <div class="cardContainer">
          <Card
              class="cardContainerItem"
              img="https://files.tumaini.be/landing_wer.webp"
              :header="text[4]"
              :text="text[5]"/>
          <Card
              class="cardContainerItem"
              img="https://files.tumaini.be/landing_was.webp"
              :header="text[6]"
              :text="text[7]"/>
          <Card
              class="cardContainerItem"
              img="https://files.tumaini.be/landing_wo.webp"
              :header="text[8]"
              :text="text[9]"/>
        </div>
      </div>
    </div>

    <!-- Section 3 (About) -->
    <div class="whiteSection">
      <div class="textContainer">
        <h2>
          {{ text[10] }}
        </h2>
        <p>
          {{ text[11] }}
        </p>
      </div>
      <div class="textContainer" style="padding-top: 20px;" v-if="report">
        <h2>
          {{ report.title }}
        </h2>
        <Markdown v-if="report.content && report.content[0]" :source="report.content[0].text" :breaks="true"
                  :html="true"/>
        <button style="float: right;" @click="$router.push(`/bericht/${report._id}`)">
          {{ text[12] }}
        </button>
      </div>
    </div>

    <!-- Section 4 (Donations) -->
    <div class="section donationSection">
      <donation-card
          click-u-r-l="/spenden/1"
          :nr="1"
          :header="text[13]"
          :text="text[14]"
      />
      <donation-card
          click-u-r-l="/spenden/2"
          :nr="2"
          :header="text[15]"
          :text="text[16]"
      />
      <donation-card
          click-u-r-l="/spenden/3"
          :nr="3"
          :header="text[17]"
          :text="text[18]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import Card from "@/components/Card.vue";
import donationCard from "@/components/DonationCard.vue";
import {IArticle} from "../../api/models/article";
import {axiosGet} from '../../admin/src/utils/axiosWrapper';
import Markdown from 'vue3-markdown-it';
import {sortArticles} from "@/utils/dates";


export default defineComponent({
  name: 'HomePage',
  components: {Card, donationCard, Markdown},
  data() {
    return {
      text: [] as string[],
      report: undefined as undefined | IArticle
    }
  },
  async mounted() {
    this.report = (await axiosGet('/content/article/material/REPORT/published')).data.sort((a: IArticle, b: IArticle) => sortArticles(a, b))[0]

    this.text = [
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96a'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96b'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96c'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96d'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96e'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96f'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f970'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f971'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f972'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f973'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f974'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f975'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f976'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f977'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f978'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f979'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97a'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97b'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97c'),
    ]
  }
});
</script>
<style scoped lang="sass">
.section
  min-height: 100vh
  height: max-content

.light
  font-weight: 300

/* Image Layout for Landing */
.imgContainer
  display: grid
  grid-template-columns: 50vw 50vw
  @media only screen and (max-width: 640px)
    grid-template-rows: 50vh 50vh
    grid-template-columns: 100vw

  .imgGrid1
    display: grid
    grid-template-rows: 50vh 50vh
    @media only screen and (max-width: 640px)
      order: 2

    .imgGrid1_1
      display: grid
      grid-template-columns: 33% 67%
      @media only screen and (max-width: 640px)
        grid-template-rows: 33% 67%
        grid-template-columns: 100%

      .imgGrid1_1_1
        background: url("../assets/landing/annie-spratt-0cgpyigyIkM-unsplash.webp") no-repeat center
        background-size: auto 120%
        @media only screen and (max-width: 640px)
          background-size: 110% auto

      .imgGrid1_1_2
        background: url("../assets/landing/annie-spratt-cVEOh_JJmEE-unsplash.webp") no-repeat center
        background-size: auto 130%

    .imgGrid1_2
      background: url("../assets/landing/ben-hummitzsch-pYTgvmpuQWs-unsplash.webp") no-repeat center
      background-size: auto 150%
      @media only screen and (max-width: 640px)
        visibility: hidden

  .imgGrid2
    background: url("../assets/landing/carolinie-cavalli-yFaK9jgQeb4-unsplash.webp") no-repeat center
    background-size: auto 120%
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    align-items: flex-end
    justify-content: center
    padding-right: 10vw
    @media only screen and (max-width: 640px)
      order: 1

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
  @media only screen and (max-width: 640px)
    padding: 2em 0


.donationSection
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  align-items: center
  justify-content: space-around
  @media only screen and (max-width: 640px)
    padding: 2em 0

</style>
