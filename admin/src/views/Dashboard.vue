<template>
  <div class="content">
    <div class="md-app">
      <div class="md-app-toolbar">
        <div style="display: flex; align-items: center;">
          <button class="md-button md-icon-button" @click="menuVisible = !menuVisible">
            <span class="md-icon">menu</span>
          </button>

          <div class="md-title title">
            <span>Welcome, {{ user.name }}</span>
            <span>kaiser dashboard</span>
          </div>
        </div>
      </div>

      <div v-if="menuVisible" class="md-app-drawer-overlay" @click="menuVisible = false"></div>
      <div class="md-app-drawer" :class="{ active: menuVisible }">
        <div style="padding: 8px;">
          <button class="md-button md-icon-button" @click="menuVisible = false" style="opacity:.7">
            <span class="md-icon">arrow_back_ios</span>
          </button>
        </div>

        <ul class="md-list">
          <li class="md-list-item mouse-style" @click="navigate('Translate')">
            <span class="md-icon">translate</span>
            <span class="md-list-item-text">Translate</span>
          </li>

          <li class="md-list-item mouse-style" @click="navigate('/dashboard/cms/content/report')">
            <span class="md-icon">summarize</span>
            <span class="md-list-item-text">Report</span>
          </li>

          <li class="md-list-item mouse-style" @click="navigate('/dashboard/cms/content/project')">
            <span class="md-icon">view_headline</span>
            <span class="md-list-item-text">Project</span>
          </li>

          <li class="md-list-item mouse-style" @click="navigate('Mail')">
            <span class="md-icon">mail</span>
            <span class="md-list-item-text">Mail</span>
          </li>

          <li class="md-list-item mouse-style" @click="navigate('Donors')">
            <span class="md-icon">volunteer_activism</span>
            <span class="md-list-item-text">Donors</span>
          </li>

          <li class="md-list-item mouse-style" @click="navigate('Files')">
            <span class="md-icon">folder</span>
            <span class="md-list-item-text">Files</span>
          </li>

          <li class="md-list-item mouse-style" @click="doLogout()">
            <span class="md-icon">logout</span>
            <span class="md-list-item-text">Logout</span>
          </li>
        </ul>
      </div>

      <div class="md-app-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store';
import { checkVersion, getVersion } from '@/utils/version';
import { axiosGet } from '@/utils/axiosWrapper';
import type { IUser } from '@/types/models';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      user: {
        name: "",
        email: ""
      } as IUser,

      menuVisible: false,

      showVersionPopup: checkVersion(),
      version: getVersion()
    }
  },
  computed: {
    userId(): string | null {
      const store = useAuthStore()
      return store.accessToken
    }
  },
  methods: {
    navigate(target: string) {
      this.menuVisible = false
      if (target.startsWith('/')) {
        this.$router.push(target)
      } else {
        this.$router.push({ name: target })
      }
    },
    doLogout() {
      const store = useAuthStore()
      store.logout()
    },
    loadData() {
      return axiosGet('/users/' + this.userId)
          .then(function (response: { data: { data: IUser }; }) {
            return response.data.data
          })
          .catch(function (error: Error) {
            console.log(error);
          });
    }
  },
  async mounted() {
    const user = await this.loadData()
    if (user)
      this.user = user
    else
      console.warn("Houston! User was not found! -> Problem")
  },
});
</script>
<style lang="scss">
.content {
  text-align: left;
  color: #333;
}

.title {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.welcome {
  margin-bottom: 1em;
}

.md-app {
  min-height: calc(100vh - 40px);
}

.mouse-style:hover {
  cursor: pointer;
}
</style>
