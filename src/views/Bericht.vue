<template>
  <div class="bigContainer">
    <Header></Header>

    <div
        class="header flexColumn"
        :style="`background-image: linear-gradient(#00000041, #00000041), url(${article.image})`"
    >
      <div class="title">
        {{ article.title }}
      </div>
      <div class="subheader">
        {{ article.subheader }}
      </div>
    </div>
    <div class="content">
      <div class="meta">
        <div class="mainPoints" v-if="article.mainPoints && article.mainPoints.length">
          {{ text[0] }}:
          <ul>
            <li v-for="point in article.mainPoints" v-bind:key="point">
              {{ point }}
            </li>
          </ul>
        </div>
        <div class="date" v-if="article.created">
          {{ text[1] }}: {{ new Date(article.created).toLocaleDateString() }}
        </div>
        <div class="share">
          <button
              class="shareLink"
              @click="
              copyToClipboard();
              showSnackbar();
            "
          >
            {{ text[2] }}
          </button>
          <div id="snackbar">{{ text[3] }}</div>
        </div>
        <!-- WIP - Maybe future Feature! -->
        <!--<h4 style="text-align: center">Comments</h4>
        <div class="comments">
          <div class="comment" v-for="comment in comments" v-bind:key="comment">
            <span class="commentAuthor">{{ comment.author }}</span
            >: <span class="commentText">{{ comment.text }}</span>
          </div>
        </div>-->
      </div>
      <div class="infoContainer">
        <div
            class="information"
            v-for="(paragraph, i) in article.content"
            v-bind:key="paragraph">
          <div class="title" v-if="paragraph.title">
            {{ paragraph.title }}
          </div>
          <div class="image" v-if="paragraph.image">
            <img :src="paragraph.image" :alt="paragraph.title"/>
            <i>{{ paragraph.imageDescription }}</i>
          </div>
          <div
              :class="i === 0 ? 'paragraph firstParagraph' : 'paragraph'"
              v-if="paragraph.text"
          >
            <Markdown :source="paragraph.text" :breaks="true" :html="true"/>
          </div>
        </div>
        <!-- Moved date to below author in new layout! -->
        <!--<div class="date" v-if="article.created">
          Published: {{ new Date(article.created).toLocaleString(myLanguage) }}
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import Header from "@/components/Header.vue"
import Markdown from 'vue3-markdown-it';
import {axiosGet} from "../../admin/src/utils/axiosWrapper";

export default defineComponent({
  name: "BerichtComponent",
  components: {Header, Markdown},
  data() {
    return {
      article: {},
      articleLink: window.location.href,

      text: [] as string[],

      id: this.$route.params.id
    }
  },
  methods: {
    copyToClipboard(): Promise<void> {
      /***
       * Alternative Clipboard Copy function to be able to use in development area.
       * Source: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
       */
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(this.articleLink)
      } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = this.articleLink;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        })
      }
    },
    showSnackbar() {
      let x = document.getElementById("snackbar")
      console.log(x)
      if (x) {
        x.className = "show"
        setTimeout(function () {
          let x = document.getElementById("snackbar")
          if (x)
            x.className = x.className.replace("show", "")
        }, 2000)
      }
    },
  },
  async beforeMount() {
    // this.article = (
    //     await axios.get(
    //         SERVER_ADDRESS +
    //         "/selfSupport/article/id" +
    //         // this.$router.currentRoute.value.params.id
    //     )
    // ).data
    this.article = (
        await axiosGet('/content/article/id/' + this.id)
    ).data
    this.text = [
      await this.textObject.getContent('61d56628cc3bfb06f031f99a'),
      await this.textObject.getContent('61d56628cc3bfb06f031f99b'),
      await this.textObject.getContent('61d56628cc3bfb06f031f99c'),
      await this.textObject.getContent('61d56628cc3bfb06f031f99d'),
    ]
  }
})
</script>
<style lang="sass" scoped>
.bigContainer
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: center
  align-items: center

.container
  width: 80vw
  min-height: 93vh
  padding: 0 10vw

h1
  font-size: 3em

h2
  font-size: 2em

button
  padding-top: 0
  padding-bottom: 0

.flexColumn
  display: flex
  flex-direction: column

.header
  --width: 100vw
  background-size: auto 100%
  width: var(--width)
  height: calc(var(--width) * (1668 / 2388))
  max-width: 1700px
  max-height: calc(1700px * (1668 / 2388))
  justify-content: center
  background-blend-mode: darken
  color: #ffffff
  overflow: auto
  //background-size: cover
  background-position: center
  background-repeat: no-repeat

  .title
    font-size: 4em
    line-height: 2em
    font-weight: bold
    text-shadow: 0 0 10px black
    text-align: center

  .subheader
    font-size: 3em
    line-height: 1.5em
    text-align: center

.content
  width: 100%
  display: flex
  flex-direction: row
  max-width: 1700px
  margin: 50px

.date
  text-align: left
  margin: 25px 0

.meta
  width: 30%
  margin: 25px 5% 50px
  text-align: left
  font-size: 1em
  line-height: 1.5em
  display: flex
  flex-direction: column

  .mainPoints
    font-size: 2rem
    font-weight: bold

    li
      font-size: 1.5rem
      line-height: 1.5rem
      font-weight: normal
      padding: 5px

    li:first-child
      padding-top: 0.75em

.share
  position: relative
  padding: 0
  margin: 0
  display: flex
  flex-direction: row
  justify-content: space-between
  width: 300px
  height: 28px

.infoContainer
  width: 70%

.information
  display: flex
  flex-direction: column
  margin-bottom: 50px
  margin-right: 50px

  .firstParagraph
    display: inline-block

  .firstParagraph::first-letter
    font-size: 2em
    font-weight: bold

  .title
    font-size: 2rem
    line-height: 2rem
    font-weight: 900
    text-align: justify

  .paragraph
    font-size: 1.5em
    line-height: 1.5em
    text-align: justify

  .image
    font-size: 1em
    display: flex
    flex-direction: column
    max-width: 80%
    text-align: left
    align-self: center
    font-family: var(--text)
    padding-top: 2em

/* SNACKBAR */
#snackbar
  visibility: hidden
  max-width: 200px
  background-color: #fff
  color: #000
  text-align: center
  border-radius: 5px
  padding: 5px
  position: fixed
  float: right
  left: 0
  right: 0
  bottom: 0
  margin: 0 auto
  z-index: 1
  transition: 0.5s
  transform: scale(0)

.show
  visibility: visible !important
  //-webkit-animation: fadein 1s, fadeout 0.5s 2.5s
  //animation: fadein 1s, fadeout 0.5s 2.5s
  transform: scale(1.2) !important

@media only screen and (max-width: 1700px)
  .content
    max-width: 95%

@media only screen and (max-width: 640px)
  .content
    flex-direction: column
    font-family: var(--text)
    width: 90%
    margin: 40px

  .meta
    width: 95%
    margin: 0 2.5%
    font-size: 0.8em

    .mainPoints
      font-size: 2em

      li
        font-size: 0.9em
        line-height: 1.2em

  .date
    padding-top: 10px
    border-top: 1px dashed black

  .information
    width: 100%
    margin-bottom: 0

    .title
      font-size: 2em
      text-align: left

    .paragraph
      font-size: 1.5em
      line-height: 1.3em

    .image
      max-width: 90%

  .infoContainer
    width: 95%
    border-top: 1px dashed black
    padding-top: 10px
    margin: 20px 2.5% 0


  .header
    .title
      font-size: 2em
      line-height: 1.5em
      font-weight: bold

    .subheader
      font-size: 2em
      line-height: 1.5em


</style>