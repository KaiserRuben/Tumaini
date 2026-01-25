<template>
  <div class="container">
    <div class="firstRow">
      <h1>
        0{{ nr }}
      </h1>
      <h3>
        {{ header }}
      </h3>
      <a :href="clickURL">
        <button>
          {{ textLoaded[0] }}
        </button>
      </a>
    </div>
    <p>
      {{ text }}
    </p>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'DonationCardEntity',
  props: {
    nr: {
      type: Number,
      default: 1
    },
    header: {
      type: String,
      default: 'Header'
    },
    text: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
    },

    clickURL: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      textLoaded: [] as string[]
    }
  },
  async mounted() {
    this.textLoaded = [
      await this.textObject.getContent('61d5620fcc3bfb06f031f982')
    ]
  }

});
</script>
<style lang="sass" scoped>
// Mobile First
.container
  display: flex
  flex-direction: column
  width: 100%
  max-width: 800px
  padding: 0 1rem
  color: #EDF0F3

  .firstRow
    width: 100%
    display: flex
    flex-direction: column
    gap: 0.75rem
    margin-bottom: 1rem

    h1
      margin: 0
      color: #363636
      font-size: 1.5rem
      order: 1

    h3
      font-size: 1.125rem
      font-weight: 600
      margin: 0
      line-height: 1.3
      order: 2

    a
      order: 3
      align-self: flex-start

    button
      background-color: #5F9AAE
      color: #F5FFFF
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1)

      &:hover
        background-color: darken(#5F9AAE, 8%)
        box-shadow: 0 4px 12px rgba(#5F9AAE, 0.3)

  p
    width: 100%
    margin: 0
    line-height: 1.6
    font-size: 0.95rem

// Tablet and up
@media (min-width: 640px)
  .container
    padding: 0

    .firstRow
      display: grid
      grid-template-columns: auto 1fr auto
      align-items: center
      gap: 1rem
      margin-bottom: 0.75rem

      h1
        font-size: 2rem
        order: 0

      h3
        font-size: 1.25rem
        order: 0

      a
        order: 0
        align-self: center

    p
      width: 90%
      align-self: flex-end
      margin: 0.5rem 0

// Desktop
@media (min-width: 800px)
  .container
    .firstRow
      h1
        font-size: 2.5rem

      h3
        font-size: 1.5rem
</style>