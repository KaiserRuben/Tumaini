<template>
  <div>
    <Header/>

    <div class="container">
      <div class="contentContainer">
        <h2 v-if="option === 2">{{ text[9] }}</h2>
        <h2 v-else-if="option === 3">{{ text[10] }}</h2>
        <h2 v-else>{{ text[8] }}</h2>

        <p v-if="option === 2">{{ text[13] }}</p>
        <p v-else-if="option === 3">{{ text[14] }}</p>
        <p v-else>{{ text[12] }}</p>
        <p>
          {{ text[3] }}
        </p>
        <form class="spendenForm" @submit.prevent="pushDonor()">
          <input :placeholder="text[5]" type="text" v-model="donor.firstName" required/>
          <input :placeholder="text[6]" type="text" v-model="donor.lastName" required/>
          <input :placeholder="text[7]" type="email" v-model="donor.email" required/>
          <input :placeholder="text[16]" type="tel" v-model="donor.phone"/>
          <input :placeholder="text[15]" type="text" v-model="donor.address"/>
          <div class="break"></div>
          <div style="margin: auto 0; padding-left: 10px">
            <input type="checkbox" style="width: auto" v-model="justInfo"/> {{ text[17] }}
          </div>
          <div class="break"></div>
          <button type="submit">{{ text[4] }}</button>
        </form>
      </div>
    </div>

    <div class="whiteSection">
      <div class="textContainer">
        <h2>
          {{ text[1] }}
        </h2>
        <div class="partnerTextAndImg">
          <img src="../assets/Joackim.webp" alt="Unser Partner Jaockim"/>
          <p>
            {{ text[2] }}
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="contentContainer" v-if="projects.length">
        <h2>{{ text[0] }}</h2>

        <div class="cardContainer">
          <TeaserCard
              class="cardContainerItem"
              v-for="project in projects"
              v-bind:key="project._id"
              :img="project.image"
              :header="project.title"
              :text="project.content[0].text"
              :click="`/project/${project._id}`"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";
import {axiosGet, axiosPost} from "../../admin/src/utils/axiosWrapper";
import {IArticle} from "../../api/models/article";
import {IDonor} from "../../api/models/donor";

export default defineComponent({
  name: "Spenden Details",
  components: {Header, TeaserCard},
  data() {
    return {
      option: parseInt(typeof this.$router.currentRoute.value.params.option === "string" ? this.$router.currentRoute.value.params.option : "1"),
      text: [] as string[],
      projects: [] as IArticle[],

      donor: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        status: "CREATED",
        option: parseInt(typeof this.$router.currentRoute.value.params.option === "string" ? this.$router.currentRoute.value.params.option : "1")
      } as IDonor,

      justInfo: false
    }
  },
  methods: {
    async pushDonor() {
      if (this.justInfo)
        this.donor.option = 0
      try {
        await axiosPost('/donor/', this.donor)
        this.donor.firstName = ''
        this.donor.lastName = ''
        this.donor.email = ''
        this.donor.phone = ''
        this.donor.address = ''
        this.justInfo = false
        alert(this.text[11])
      } catch (err) {
        console.error(err)
      }
    }
  },
  async mounted() {
    this.projects = (await axiosGet('/content/article/material/PROJECT/published')).data.sort((a: IArticle, b: IArticle) => b.created.getDate() - a.created.getDate())

    this.text = [
      await this.textObject.getContent('61d56377cc3bfb06f031f986'),
      await this.textObject.getContent('61d56377cc3bfb06f031f987'),
      await this.textObject.getContent('61d56377cc3bfb06f031f988'),
      await this.textObject.getContent('61d56377cc3bfb06f031f989'),
      await this.textObject.getContent('61d56377cc3bfb06f031f98a'),
      await this.textObject.getContent('61d56466cc3bfb06f031f98e'),
      await this.textObject.getContent('61d56466cc3bfb06f031f98f'),
      await this.textObject.getContent('61d56466cc3bfb06f031f990'),

      await this.textObject.getContent('61d55fa9cc3bfb06f031f977'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f979'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97b'),

      await this.textObject.getContent('61dc75ef52bc3e00c19de452'),

      await this.textObject.getContent('61deb33436e5281ff13f46f6'),
      await this.textObject.getContent('61deb33436e5281ff13f46f5'),
      await this.textObject.getContent('61deb33436e5281ff13f46f7'),

      await this.textObject.getContent('61deb5d939267e2068003a95'),
      await this.textObject.getContent('61deb5d939267e2068003a96'),

      await this.textObject.getContent('61f29f5fab98050332eb9a72'),
    ]

    if (isNaN(this.option))
      this.option = 1
  }
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
    height: autoß
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