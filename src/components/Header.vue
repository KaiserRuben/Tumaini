<template>
  <div class="navHeader">
    <router-link to="/"><h1>LOGO</h1></router-link>
    <router-link to="/berichte"><p>Berichte</p></router-link>
  </div>
</template>
<style lang="sass" scoped>
.navHeader
  background-color: #FFF
  color: #0C0D08
  width: 80vw
  padding: 0 10vw
  display: flex
  flex-direction: row-reverse
  justify-content: flex-start
  align-items: center

h1
  font-size: 2em
  margin: 0
  padding: 10px 20px

a
  color: #0C0D08
</style>