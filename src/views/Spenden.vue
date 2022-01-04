<template>
  <div>
    <Header/>
    <div class="container">
      <div class="contentContainer">
        <h2>Unsere Projekte</h2>

        <div class="cardContainer">
          <TeaserCard
              class="cardContainerItem"/>
          <TeaserCard
              class="cardContainerItem"/>
          <TeaserCard
              class="cardContainerItem"/>
          <!-- Section 3 (About) -->
        </div>
      </div>
    </div>
    <div class="whiteSection">
      <div class="textContainer">
        <h2>
          Unser Partner
        </h2>
        <div class="partnerTextAndImg">
          <img src="../assets/temp_partner.jpg" alt="Unser Partner"/>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
            clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
            sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no
            sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
            elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
            vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.

            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu
            feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
            delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

            Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
            commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
            vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit
            praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

            Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer
            possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
            tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu
            feugiat nulla facilisis.

            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
            est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="contentContainer">
        <h2 v-if="option === 2">Forestering: 50€ / Monat</h2>
        <h2 v-else-if="option === 3">Sponsorship: 200€ / Monat</h2>
        <h2 v-else>Support: 5550 €</h2>
        <p>
          Nach Abschicken untenstehendes Formulars erhalten Sie eine E-Mail mit allen weiteren Informationen.
        </p>
        <form class="spendenForm" @submit.prevent="">
          <input placeholder="Vorname" type="text"/><input placeholder="Nachname" type="text"/>
          <input placeholder="E-Mail" type="email"/>
          <div class="break"></div>
          <button type="submit">Bestätigen</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";

export default defineComponent({
  name: "Spenden Details",
  components: {Header, TeaserCard},
  data() {
    return {
      option: parseInt(typeof this.$router.currentRoute.value.params.option === "string" ? this.$router.currentRoute.value.params.option : "1"),
      sampleData: {
        published: true,
        image: "https://media.idownloadblog.com/wp-content/uploads/2021/09/Apple-September-Event-California-Streaming-BasicAppleGuy-iDownloadBlog-6K-No-Logo.png",
        title: 'Beispiel Projekt',
        subheader: 'Fürs Testen',
        tags: [],
        mainPoints: [],
        content: [{
          title: 'test',
          text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
          nr: 1,
          created: new Date()
        }],
        created: new Date()
      }
    }
  },
  mounted() {
    if (isNaN(this.option))
      this.option = 1
  },
  watch: {}
})
</script>
<style lang="sass" scoped>
.container
  width: 100vw
  border-radius: 10px
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: center
  padding-bottom: 20px
  @media only screen and (max-width: 640px)
    padding-bottom: 20px


.contentContainer
  max-width: 1140px
  @media only screen and (max-width: 1140px)
    p
      margin: 0 20vw
    h2
      text-align: center


.partnerTextAndImg
  display: flex
  flex-direction: row
  justify-content: center
  @media only screen and (max-width: 640px)
    flex-wrap: wrap

  img
    width: 25vw
    height: max-content
    max-width: 300px
    border-radius: 20px
    @media only screen and (max-width: 640px)
      width: 60vw
      margin-bottom: 10px

  p
    margin: 0 0 0 20px
    @media only screen and (max-width: 640px)
      margin: 0

.spendenForm
  width: 1140px
  display: flex
  flex-direction: row
  flex-wrap: wrap
  align-items: center
  justify-content: flex-start
  //border: 2px solid #FFA400
  //border-radius: 20px
  @media only screen and (max-width: 1140px)
    width: 80vw
    margin: 0 20vw

  input
    margin: 15px 5px 15px 0
    width: 45%
    @media only screen and (max-width: 640px)
      width: 80vw

  .break
    width: 100%

  button
    margin: 10px 5px
    background-color: #FFA400
    color: #0C0D08

@media only screen and (max-width: 640px)
  h2
    margin-left: 20px
</style>