<template>
  <div class="navHeader">
    <router-link to="/"><h1>{{ text[0] }}</h1></router-link>
    <div class="navRight">
      <router-link to="/archiv/berichte" v-if="!$route.fullPath.toLowerCase().includes('berichte')"><p>{{ text[1] }}</p>
      </router-link>
      <router-link to="/archiv/projekte" v-if="!$route.fullPath.toLowerCase().includes('projekte')"><p>{{ text[2] }}</p>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, inject} from "vue";
import {TextLoader} from "@/utils/textLoader";

export default defineComponent({
  name: "Header",
  data() {
    return {
      textObject: inject('textObject') as TextLoader,
      text: [] as string[]
    }
  },
  methods: {
    textLoader(id: string) {
      return this.textObject.getContent(id)
    }
  },
  async mounted() {
    this.text = [
      await this.textLoader('61d4a9196eaf27340d6b5310'),
      await this.textLoader('61d4a9196eaf27340d6b5311'),
      await this.textLoader('61d4a9196eaf27340d6b5312'),
    ]
  }
})
</script>
<style lang="sass" scoped>
.navHeader
  background-color: #FFF
  color: #0C0D08
  width: 80vw
  padding: 0 10vw
  display: flex
  justify-content: space-between
  align-items: center
  @media only screen and (max-width: 640px)
    width: 90vw
    padding: 0 5vw

.navRight
  display: flex
  flex-direction: row-reverse
  flex-wrap: nowrap
  min-width: 250px
  align-items: center
  justify-content: space-around

h1
  font-size: 1.5em
  margin: 0
  padding: 10px 20px 10px 0

a
  color: #0C0D08

</style>