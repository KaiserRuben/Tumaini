<template>
  <div id="tumaini-app">
    <Toast position="top-right" />
    <ConfirmDialog />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

export default defineComponent({
  name: 'App',
  components: {
    Toast,
    ConfirmDialog
  },
});
</script>

<style lang="scss">
#tumaini-app {
  min-height: 100vh;
}
</style>
