<template>
  <div class="login">
    <div class="md-card contentCard">
      <div class="md-title">Sign Up</div>
      <div class="md-subheading"></div>
      <div class="md-field">
        <label>Enter your Name</label>
        <input v-model="userdata.name" name="name"/>
      </div>
      <div class="md-field">
        <label>Fill in your E-Mail</label>
        <input v-model="userdata.email" name="email" type="email"/>
      </div>
      <div class="md-field">
        <label>Enter a password</label>
        <input v-model="userdata.password" name="password" type="password"/>
      </div>
      <div class="md-field" :class="userdata.password === password2 ? '' : 'md-invalid'">
        <label>Repeat your password</label>
        <input v-model="password2" name="password2" type="password"/>
      </div>
      <label class="md-checkbox">
        <input type="checkbox" v-model="agb"/>
        I read the Terms of Service and the privacy statement and agree to the mentioned terms.
      </label>
      <div v-if="query" class="md-progress-bar indeterminate">
        <div class="md-progress-bar-fill"></div>
      </div>
      <br/>
      <p v-if="formErrors" class="warnings">{{ formErrors }}</p>
      <div class="md-card-actions">
        <button class="md-button loginButton" @click="$router.push({ name: 'Login' })">Login instead</button>
        <button class="md-button md-raised md-primary loginButton" @click="checkForm()">Sign up</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosDelete, axiosGet, axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Signup",
  data() {
    return {
      userdata: {
        name: "",
        email: "",
        password: "",
        aboutMe: ""
      },
      password2: "",
      agb: false,

      formErrors: "",
      query: false
    }
  },
  methods: {
    async signupSubmit() {
      this.query = true
      let doesUserExist = (await axiosGet(`/users/email/${this.userdata.email}`))
      console.log(doesUserExist)

      if (doesUserExist.data.data) {
        console.warn("User already exists, overwriting old user if he didnt set a password.")
        if (doesUserExist.data.pwdHash) {
          this.formErrors = 'User already exists. Please enter a different E-Mail or try to sign in.'
        } else {
          await axiosDelete(`/users/${doesUserExist.data._id}`)
          this.doSignUp()
        }
      } else {
        this.doSignUp()
      }

      this.query = false
    },
    doSignUp: function () {
      axiosPost(`/users/`,
          {
            name: this.userdata.name,
            email: this.userdata.email,
            password: this.userdata.password,
          }
      ).then(() => {
        this.$router.push('/login')
      }).catch(err => {
        console.warn(err)
        alert("Your Sign-up was not successful. If this error continues, feel free to write us an E-Mail at help@kaiser.fyi")
      })
    },
    checkForm: function () {
      this.formErrors = "";
      if (!this.agb)
        this.formErrors = "Please accept the privacy statement and the terms of service.";
      if (this.userdata.email === "") {
        this.formErrors = 'Email required.';
      } else if (!this.validEmail(this.userdata.email)) {
        this.formErrors = 'Valid email required.';
      }
      this.userdata.email = this.userdata.email.toLowerCase()
      if (this.formErrors === "" && this.userdata.password === this.password2) {
        this.signupSubmit()
      }
    },
    validEmail: function (email: string) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
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
