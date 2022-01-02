<template>
  <div class="login">
    <md-card class="contentCard">
      <div class="md-title">Login</div>
      <div class="md-subhead">If any problems with the login occur, <a href="mailto:help@kaiser.fyi"> send me a mail</a>.
      </div>
      <md-field>
        <label>Your E-Mail</label>
        <md-input v-model="email" name="email" md-clearable></md-input>
      </md-field>
      <md-field>
        <label>Your Password</label>
        <md-input v-model="password" name="password" type="password" md-clearable></md-input>
      </md-field>
      <div><a style="cursor: pointer" @click="forgotPW">I forgot my password.</a></div>
      <div v-if="loggingIn">
        <md-progress-bar md-mode="query"></md-progress-bar>
      </div>


      <md-checkbox type="checkbox" id="rememberMeBox" v-model="rememberMeChecked"></md-checkbox>
      <label for="rememberMeBox" v-if="rememberMeChecked">Remember me.</label>
      <label for="rememberMeBox" v-else>Dont remember me.</label>

      <br/>
      <p v-if="loginError" class="warnings">{{ loginError }}</p>
      <md-card-actions>
        <md-button class=" loginButton" @click="$router.push({name: 'Signup'})">Signup instead</md-button>
        <md-button class="md-raised md-primary loginButton" @click="loginSubmit()">Login</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script lang="ts">
import {axiosPost} from '@/utils/axiosWrapper';
import Vue from 'vue';
import {mapActions, mapState} from 'vuex';

export default Vue.extend({
  name: 'Login',
  beforeMount() {
    this.checkCookie();
  },
  data() {
    return {
      rememberMeChecked: true,
      email: "",
      password: "",
    }
  },
  computed: {
    ...mapState([
      'loggingIn',
      'loginError',
      'loginSuccessful'
    ])
  },
  methods: {
    ...mapActions([
      'doLogin'
    ]),
    loginSubmit() {
      this.doLogin({
        email: this.email,
        password: this.password,
        rememberMeChecked: this.rememberMeChecked
      });
    },
    checkCookie: function () {
      if (localStorage.getItem("email") != null && localStorage.getItem("password") != null) {
        const localEmail = localStorage.getItem("email");
        const localPassword = localStorage.getItem("password");
        if (localEmail)
          this.email = localEmail
        if (localPassword)
          this.password = localPassword
      }
    },
    forgotPW: function () {
      axiosPost('/users/password/new', {
        email: this.email.toLowerCase(),
      })
          .then(() => alert("We just sent you a new temporary password.\nPlease change it after login."))
          .catch((err) => console.error(err))
    },
  },
});
</script>
<style lang="scss">

.login {
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.contentCard {
  padding: 2em;
  width: 50em;
}

.loginButton {
  margin-left: 0;
}

md-progress-bar {
  margin: 10px;
}

.warnings {
  padding-bottom: 30px;
  color: #e53935;
}
</style>