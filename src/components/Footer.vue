<template>
  <div class="container">
    <div>
      <select id="language" name="language" v-model="language" @change="changeLanguage()">
        <option value="DE">Deutsch</option>
        <option value="EN">English</option>
        <option value="NL">Dutch</option>
      </select>
    </div>
    <div>
      <router-link to="/impressum_datenschutz/impressum">{{ text[0] }}</router-link>
      &
      <router-link to="/impressum_datenschutz/datenschutz">{{ text[1] }}</router-link>
    </div>
    <div style="visibility: hidden">
      <select id="languageHidden" name="language" v-model="language">
        <option value="DE">Deutsch</option>
        <option value="EN">English</option>
        <option value="NL">Dutch</option>
      </select>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      text: [] as string[],
      language: this.textObject.language
    }
  },
  methods: {
    changeLanguage() {
      this.textObject.setLanguage(this.language)
      this.$router.go(0)
    }
  },
  async mounted() {
    this.text = [
      await this.textObject.getContent('61d4afdbac24bf3707c69728'),
      await this.textObject.getContent('61d4afdbac24bf3707c69729')
    ]
  }
})
</script>
<style lang="sass" scoped>
.container
  color: #0C0D08
  background-color: #FFFFFF
  width: 100vw
  display: flex
  flex-direction: row
  justify-content: space-around

  div
    padding: 10px
    margin: 0

    a
      color: #0C0D08

</style>