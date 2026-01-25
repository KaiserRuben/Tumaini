<template>
  <footer class="site-footer">
    <div class="site-footer__container">
      <div class="site-footer__brand">
        <span class="site-footer__logo">Tumaini</span>
        <span class="site-footer__copyright">&copy; {{ currentYear }}</span>
      </div>

      <div class="site-footer__links">
        <router-link
          to="/impressum_datenschutz/impressum"
          class="site-footer__link"
        >
          {{ text[0] }}
        </router-link>
        <span class="site-footer__divider">&bull;</span>
        <router-link
          to="/impressum_datenschutz/datenschutz"
          class="site-footer__link"
        >
          {{ text[1] }}
        </router-link>
      </div>

      <div class="site-footer__language">
        <select
          id="language"
          name="language"
          v-model="language"
          @change="changeLanguage()"
          class="site-footer__select"
          aria-label="Select language"
        >
          <option value="DE">Deutsch</option>
          <option value="EN">English</option>
          <option value="NL">Nederlands</option>
        </select>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "FooterComponent",

  data() {
    return {
      text: [] as string[],
      language: this.textObject.language,
      currentYear: new Date().getFullYear()
    }
  },

  methods: {
    changeLanguage() {
      this.textObject.setLanguage(this.language);
      this.$router.go(0);
    }
  },

  async mounted() {
    this.text = [
      await this.textObject.getContent('61d4afdbac24bf3707c69728'),
      await this.textObject.getContent('61d4afdbac24bf3707c69729')
    ]
  }
})
</script>

<style lang="scss" scoped>
.site-footer {
  background-color: #0C0D08;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #EDF0F3;
  width: 100%;
  margin-top: auto;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    @media (min-width: 480px) {
      padding: 1.5rem 1.5rem;
    }

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      gap: 1.5rem;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (min-width: 768px) {
      order: 1;
    }
  }

  &__logo {
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.02em;

    @media (min-width: 480px) {
      font-size: 1.0625rem;
    }
  }

  &__copyright {
    color: rgba(237, 240, 243, 0.5);
    font-size: 0.875rem;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (min-width: 768px) {
      order: 2;
    }
  }

  &__link {
    color: rgba(237, 240, 243, 0.7);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s ease;

    &:hover {
      color: #5F9AAE;
      text-decoration: none;
    }
  }

  &__divider {
    color: rgba(237, 240, 243, 0.3);
    font-size: 0.75rem;
  }

  &__language {
    @media (min-width: 768px) {
      order: 3;
    }
  }

  &__select {
    appearance: none;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 0.4rem 2rem 0.4rem 0.75rem;
    font-size: 0.875rem;
    color: #EDF0F3;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EDF0F3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 0.875em;

    option {
      background-color: #0C0D08;
      color: #EDF0F3;
    }

    &:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background-color: rgba(255, 255, 255, 0.05);
    }

    &:focus {
      outline: none;
      border-color: #5F9AAE;
    }
  }
}
</style>