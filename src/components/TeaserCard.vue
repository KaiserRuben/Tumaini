<template>
  <div class="card" @click="$router.push(click)">
    <div class="cardImg" id="cardImg" :style="backgroundImg()"></div>
    <div class="content">
      <h2>
        {{ header }}
      </h2>
      <Markdown :source='text.split(" ").slice(0, 50).join(" ") + "..."' :breaks="true" :html="true"/>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Markdown from 'vue3-markdown-it';

export default defineComponent({
  name: 'TeaserCardEntity',
  props: {
    img: {
      type: String,
      default: 'https://files.tumaini.be/default_project_picture.webp'
    },
    header: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
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
  components: {Markdown},
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
  max-width: 25vw
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
  min-height: 200px

  h2
    margin: 0
</style>