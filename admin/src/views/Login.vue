<template>
  <div class="auth-page">
    <!-- Branding panel -->
    <div class="auth-brand">
      <div class="brand-content">
        <div class="brand-mark">T</div>
        <h1 class="brand-name">Tumaini</h1>
        <p class="brand-tagline">Admin Dashboard</p>
      </div>
      <div class="brand-pattern"></div>
    </div>

    <!-- Form panel -->
    <div class="auth-form-panel">
      <div class="auth-form-wrapper">
        <div class="auth-form-header">
          <h2>Welcome back</h2>
          <p>Sign in to manage your content</p>
        </div>

        <form class="auth-form" @submit.prevent="loginSubmit">
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" placeholder="you@example.com" class="w-full" />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask
                      placeholder="Enter your password" class="w-full" inputClass="w-full" />
          </div>

          <div class="field-row">
            <div class="flex align-items-center gap-2">
              <Checkbox v-model="rememberMeChecked" :binary="true" inputId="rememberMe" />
              <label for="rememberMe" class="remember-label">Remember me</label>
            </div>
            <a class="forgot-link" @click="forgotPW">Forgot password?</a>
          </div>

          <ProgressBar v-if="loggingIn" mode="indeterminate" style="height: 3px; border-radius: 2px;" />

          <Message v-if="loginError" severity="error" :closable="false" class="auth-error">
            {{ loginError }}
          </Message>

          <Button type="submit" label="Sign in" class="auth-submit" :loading="loggingIn" />
        </form>

        <div class="auth-alt">
          Don't have an account?
          <a @click="$router.push({ name: 'Signup' })">Create one</a>
        </div>

        <footer class="auth-footer">
          <router-link to="/legal">Legal / Impressum</router-link>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store';
import { useNotify } from '@/composables/useNotify';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Message from 'primevue/message';

export default defineComponent({
  name: 'Login',
  components: { InputText, Password, Checkbox, Button, ProgressBar, Message },
  setup() {
    const notify = useNotify();
    return { notify };
  },
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
          .then(() => this.notify.success("We just sent you a new temporary password.\nPlease change it after login.", "Password Reset"))
          .catch((err) => {
            console.error(err);
            this.notify.error("Failed to send password reset email.");
          })
    },
  },
});
</script>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
}

/* ---- Branding Panel ---- */
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
      45deg,
      transparent,
      transparent 20px,
      rgba(200, 113, 46, 0.5) 20px,
      rgba(200, 113, 46, 0.5) 21px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 20px,
      rgba(200, 113, 46, 0.5) 20px,
      rgba(200, 113, 46, 0.5) 21px
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

/* ---- Form Panel ---- */
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
  max-width: 400px;
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
  gap: 1.25rem;
}

.field {
  gap: 0.4rem;

  label {
    letter-spacing: 0.01em;
  }
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-label {
  font-size: 0.85rem;
  color: var(--t-text-label);
  cursor: pointer;
}

.forgot-link {
  font-size: 0.825rem;
  color: var(--t-brand);
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: var(--t-brand-dark);
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

/* ---- Responsive ---- */
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

  .auth-form-panel {
    padding: 2rem 1.5rem;
  }
}
</style>
