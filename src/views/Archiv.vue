<template>
  <Header/>
  <div class="container">
    <div class="contentContainer" v-if="page.toLowerCase() === 'projekte'">
      <h1>{{ text[0] }}</h1>
      <div class="berichtContainer">
        <TeaserCard
            class="cardContainerItem"
            v-for="project in projects"
            v-bind:key="project._id"
            :img="project.image"
            :header="project.title"
            :text="report.content && report.content[0]?project.content[0].text:''"
            :click="`/project/${project._id}`"
        />
      </div>
    </div>
    <div class="contentContainer" v-else>
      <h1>{{ text[1] }}</h1>
      <div class="berichtContainer">
        <div class="bericht" v-for="report in reports" v-bind:key="report._id"
             @click="$router.push(`/bericht/${report._id}`)">
          <h2>{{ report.title }}</h2>
          <Markdown v-if="report.content && report.content[0]"
                    :source='report.content[0].text.split(" ").slice(0, 50).join(" ") + "..."' :breaks="true"
                    :html="true"/>

        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";
import {IArticle} from "../../api/models/article";
import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import Markdown from 'vue3-markdown-it';
import {sortArticles} from "@/utils/dates";

export default defineComponent({
  name: "BerichteArchiv",
  components: {Header, TeaserCard, Markdown},
  data() {
    return {
      page: this.$router.currentRoute.value.params.page,
      text: [] as string[],


      projects: [] as IArticle[],
      reports: [] as IArticle[],

    }
  },
  watch: {
    $route(to, from) { // react to route changes...
      if (to !== from) {
        location.reload();
      }
    }
  },
  async mounted() {
    this.projects = (await axiosGet('/content/article/material/PROJECT/published')).data.sort((a: IArticle, b: IArticle) => sortArticles(a, b))
    this.reports = (await axiosGet('/content/article/material/REPORT/published')).data.sort((a: IArticle, b: IArticle) => sortArticles(a, b))

    this.text = [
      await this.textObject.getContent('61d56537cc3bfb06f031f996'),
      await this.textObject.getContent('61d56537cc3bfb06f031f997')
    ]
  }
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
  @media only screen and (max-width: 640px)
    padding-bottom: 20px


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
    align-items: stretch

    .bericht
      background-color: #151919
      border-radius: 30px
      padding: 30px
      transition: 1s
      max-width: 40%
      margin: 20px
      @media only screen and (max-width: 640px)

        max-width: 90%

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