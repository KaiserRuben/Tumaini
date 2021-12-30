<template>
  <div class="container">
    <div>
      <router-link to="/impressum_datenschutz/impressum">Impressum</router-link>
      &
      <router-link to="/impressum_datenschutz/datenschutz">Datenschutz</router-link>
    </div>
  </div>
</template>
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