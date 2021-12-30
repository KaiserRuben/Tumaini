<template>
  <div>
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Footer}
})
</script>
<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Petemoss&display=swap')
body
  margin: 0
  background: #0C0D08
  color: #EDF0F3
  font-family: Montserrat, sans-serif

h1
  font-family: Montserrat, sans-serif
  font-weight: 700
  letter-spacing: 5px
  font-size: 60px
  margin: 10px auto

h2
  font-family: Petemoss, serif
  font-size: 60px

p
  font-family: Montserrat, sans-serif
  margin: 10px auto
  text-align: justify


a
  text-decoration: none

a:hover
  text-decoration: underline

button
  border-radius: 0
  border: 0
  padding: 10px 20px
  transition: opacity 1s

button:hover

  opacity: .7
  cursor: pointer

@keyframes appear
  from
    opacity: 0
  to
    opacity: 1
</style>