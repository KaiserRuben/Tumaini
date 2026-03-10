<template>
  <div class="auth-page">
    <!-- Branding panel -->
    <div class="auth-brand">
      <div class="brand-content">
        <div class="brand-mark">T</div>
        <h1 class="brand-name">Tumaini</h1>
        <p class="brand-tagline">Join the team</p>
      </div>
      <div class="brand-pattern"></div>
    </div>

    <!-- Form panel -->
    <div class="auth-form-panel">
      <div class="auth-form-wrapper">
        <div class="auth-form-header">
          <h2>Create account</h2>
          <p>Get started managing content for Tumaini</p>
        </div>

        <form class="auth-form" @submit.prevent="checkForm">
          <div class="field">
            <label for="name">Full name</label>
            <InputText id="name" v-model="userdata.name" placeholder="Your name" class="w-full" />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="userdata.email" type="email" placeholder="you@example.com" class="w-full" />
          </div>

          <div class="field-grid">
            <div class="field">
              <label for="password">Password</label>
              <Password id="password" v-model="userdata.password" :feedback="false" toggleMask
                        placeholder="Create password" class="w-full" inputClass="w-full" />
            </div>
            <div class="field">
              <label for="password2">Confirm</label>
              <Password id="password2" v-model="password2" :feedback="false" toggleMask
                        placeholder="Repeat password" class="w-full" inputClass="w-full"
                        :invalid="password2 !== '' && userdata.password !== password2" />
            </div>
          </div>

          <div class="flex align-items-center gap-2" style="margin-top: 0.25rem;">
            <Checkbox v-model="agb" :binary="true" inputId="agb" />
            <label for="agb" class="terms-label">
              I agree to the <router-link to="/legal">Terms of Service</router-link> and privacy statement.
            </label>
          </div>

          <ProgressBar v-if="query" mode="indeterminate" style="height: 3px; border-radius: 2px;" />

          <Message v-if="formErrors" severity="error" :closable="false" class="auth-error">
            {{ formErrors }}
          </Message>

          <Button type="submit" label="Create account" class="auth-submit" :loading="query" />
        </form>

        <div class="auth-alt">
          Already have an account?
          <a @click="$router.push({ name: 'Login' })">Sign in</a>
        </div>

        <footer class="auth-footer">
          <router-link to="/legal">Legal / Impressum</router-link>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosDelete, axiosGet, axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import { useNotify } from '@/composables/useNotify';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Message from 'primevue/message';

export default defineComponent({
  name: "Signup",
  components: { InputText, Password, Checkbox, Button, ProgressBar, Message },
  setup() {
    const notify = useNotify();
    return { notify };
  },
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
        this.notify.error("Your Sign-up was not successful. If this error continues, feel free to write us an E-Mail at help@kaiser.fyi", "Sign-up Failed")
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

<style lang="scss" scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
}

.auth-brand {
  position: relative;
  width: 42%;
  min-height: 100vh;
  background: linear-gradient(160deg, var(--t-text) 0%, #292524 40%, var(--t-text-label) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.brand-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image:
    repeating-linear-gradient(
      45deg, transparent, transparent 20px,
      rgba(200, 113, 46, 0.5) 20px, rgba(200, 113, 46, 0.5) 21px
    ),
    repeating-linear-gradient(
      -45deg, transparent, transparent 20px,
      rgba(200, 113, 46, 0.5) 20px, rgba(200, 113, 46, 0.5) 21px
    );
  pointer-events: none;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--t-surface-warm);
}

.brand-mark {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 20px;
  background: var(--t-brand);
  color: #fff;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 44px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(200, 113, 46, 0.35);
}

.brand-name {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 3rem;
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}

.brand-tagline {
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
  margin: 0;
  font-weight: 500;
}

.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--t-surface-warm);
}

.auth-form-wrapper {
  width: 100%;
  max-width: 440px;
}

.auth-form-header {
  margin-bottom: 2rem;

  h2 {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--t-text);
    margin: 0 0 0.35rem;
  }

  p {
    color: var(--t-text-muted);
    font-size: 0.95rem;
    margin: 0;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.field {
  gap: 0.4rem;

  label {
    letter-spacing: 0.01em;
  }
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.terms-label {
  font-size: 0.825rem;
  color: var(--t-text-label);
  cursor: pointer;
  line-height: 1.4;

  a {
    color: var(--t-brand);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-error {
  margin: 0;
}

.auth-submit {
  width: 100%;
  margin-top: 0.25rem;
  padding-block: 0.7rem;
  font-weight: 600;
  font-size: 0.925rem;
}

.auth-alt {
  text-align: center;
  margin-top: 1.75rem;
  font-size: 0.875rem;
  color: var(--t-text-muted);

  a {
    color: var(--t-brand);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--t-surface-cream);

  a {
    font-size: 0.8rem;
    color: var(--t-text-subtle);
    text-decoration: none;

    &:hover {
      color: var(--t-text-muted);
    }
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }

  .auth-brand {
    width: 100%;
    min-height: auto;
    padding: 3rem 2rem;
  }

  .brand-mark {
    width: 56px;
    height: 56px;
    font-size: 30px;
    border-radius: 14px;
    margin-bottom: 1rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .auth-form-panel {
    padding: 2rem 1.5rem;
  }
}
</style>
