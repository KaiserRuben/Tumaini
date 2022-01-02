<template>
  <div class="login">
    <md-card class="contentCard">
      <div class="md-title">Sign Up</div>
      <div class="md-subhead"></div>
      <md-field>
        <label>Enter your Name</label>
        <md-input v-model="userdata.name" name="name" md-clearable></md-input>
      </md-field>
      <md-field>
        <label>Fill in your E-Mail</label>
        <md-input v-model="userdata.email" name="email" type="email"></md-input>
      </md-field>
      <md-field>
        <label>Enter a password</label>
        <md-input v-model="userdata.password" name="password" type="password"></md-input>
      </md-field>
      <md-field :class="userdata.password === password2 ? '' : 'md-invalid'">
        <label>Repeat your password</label>
        <md-input v-model="password2" name="password" type="password" md-clearable></md-input>
      </md-field>
      <md-checkbox v-model="agb" class="md-primary">I read the Terms of Service and the privacy statement and agree to
        the mentioned terms.
      </md-checkbox>
      <div v-if="query">
        <md-progress-bar md-mode="query"></md-progress-bar>
      </div>
      <br/>
      <p v-if="formErrors" class="warnings">{{ formErrors }}</p>
      <md-card-actions>
        <md-button class=" loginButton" @click="$router.push({name: 'Login'})">Login instead</md-button>
        <md-button class="md-raised md-primary loginButton" @click="checkForm()">Sign up</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script lang="ts">
import {axiosDelete, axiosGet, axiosPost} from '@/utils/axiosWrapper';
import Vue from 'vue';

export default Vue.extend({
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

md-progress-bar {
  margin: 10px;
}

.warnings {
  padding-bottom: 30px;
  color: #e53935;
}
</style>