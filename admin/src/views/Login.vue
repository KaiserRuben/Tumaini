<template>
  <div class="login">
    <div class="md-card contentCard">
      <div class="md-title">Login</div>
      <div class="md-subheading">If any problems with the login occur, <a href="mailto:help@kaiser.fyi"> send me a
        mail</a>.
      </div>
      <div class="md-field">
        <label>Your E-Mail</label>
        <input v-model="email" name="email" type="email"/>
      </div>
      <div class="md-field">
        <label>Your Password</label>
        <input v-model="password" name="password" type="password"/>
      </div>
      <div><a style="cursor: pointer" @click="forgotPW">I forgot my password.</a></div>
      <div v-if="loggingIn" class="md-progress-bar indeterminate">
        <div class="md-progress-bar-fill"></div>
      </div>

      <label class="md-checkbox">
        <input type="checkbox" v-model="rememberMeChecked"/>
        {{ rememberMeChecked ? 'Remember me.' : 'Dont remember me.' }}
      </label>

      <br/>
      <p v-if="loginError" class="warnings">{{ loginError }}</p>
      <div class="md-card-actions">
        <button class="md-button loginButton" @click="$router.push({ name: 'Signup' })">Signup instead</button>
        <button class="md-button md-raised md-primary loginButton" @click="loginSubmit()">Login</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store';

export default defineComponent({
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
    loggingIn(): boolean {
      const store = useAuthStore()
      return store.loggingIn
    },
    loginError(): string | null {
      const store = useAuthStore()
      return store.loginError
    }
  },
  methods: {
    loginSubmit() {
      const store = useAuthStore()
      store.doLogin({
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

.warnings {
  padding-bottom: 30px;
  color: #e53935;
}
</style>
