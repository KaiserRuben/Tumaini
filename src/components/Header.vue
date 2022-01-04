<template>
  <div class="navHeader">
    <router-link to="/"><h1>Home</h1></router-link>
    <div class="navRight">
      <router-link to="/archiv/berichte" v-if="!$route.fullPath.toLowerCase().includes('berichte')"><p>Alle Berichte</p>
      </router-link>
      <router-link to="/archiv/projekte" v-if="!$route.fullPath.toLowerCase().includes('projekte')"><p>Alle Projekte</p>
      </router-link>
    </div>
  </div>
</template>
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