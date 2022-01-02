<template>
  <div class="content">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>

          <div class="md-title title">
            <span>Welcome, {{ user.name }}</span>
            <span>kaiser dashboard</span>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-drawer v-bind:md-active="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible" style="opacity:.7">
            <md-icon>arrow_back_ios</md-icon>
          </md-button>

        </md-toolbar>

        <md-list>
          <md-list-item class="mouse-style">
            <md-icon>translate</md-icon>
            <span class="md-list-item-text " @click="$router.push({name:'Translate'})">Translate</span>
          </md-list-item>

          <md-list-item class="mouse-style">
            <md-icon>article</md-icon>
            <span class="md-list-item-text " @click="$router.push({name:'Content'})">Content</span>
          </md-list-item>


          <md-list-item class="mouse-style">
            <md-icon>mail</md-icon>
            <span class="md-list-item-text " @click="$router.push({name:'Mail'})">Mail</span>
          </md-list-item>

          <md-list-item class="mouse-style">
            <md-icon>folder</md-icon>
            <span class="md-list-item-text" @click="$router.push({name:'Files'})">Files</span>
          </md-list-item>

          <md-list-item class="mouse-style">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text " @click="logout()">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>

    <!--    <md-dialog :md-active="showVersionPopup">-->
    <!--      <md-dialog-title>New Version: v{{ version }}</md-dialog-title>-->

    <!--      <md-dialog-content>-->
    <!--        <p>Adapted the Dashboard for Tumaini. </p>-->
    <!--        <p>Ruben</p>-->
    <!--      </md-dialog-content>-->

    <!--      <md-dialog-actions>-->
    <!--        <md-button class="md-primary" @click="showVersionPopup = false">OK!</md-button>-->
    <!--      </md-dialog-actions>-->
    <!--    </md-dialog>-->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store'
import {mapActions} from 'vuex';
import {checkVersion, getVersion} from '@/utils/version';
import {axiosGet} from '@/utils/axiosWrapper';
import {IUser} from "../../../api/models/user";

export default Vue.extend({
  name: 'Dashboard',
  data() {
    return {
      user: {
        name: "",
        email: ""
      } as IUser,
      userId: store.state.accessToken,

      menuVisible: false,

      showVersionPopup: checkVersion(),
      version: getVersion()
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
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
  height: calc(100vh - 40px);
}

.md-drawer {
  width: 230px;
}

.mouse-style:hover {
  cursor: pointer;
}
</style>