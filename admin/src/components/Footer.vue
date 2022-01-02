<template>
  <div class="legal">
    <div>
      <router-link to="/legal">Legal / Impressum</router-link>
    </div>
    <div>
      Copyright 2021
    </div>
    <div>
      Version {{ version }}
    </div>
  </div>
</template>

<script lang="ts">
import {getVersion} from '@/utils/version';
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      version: getVersion()
    }
  }
});
</script>

<style scoped>
.legal {
  width: 90%;
  position: fixed;
  bottom: 0;
  margin: 10px 5%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
