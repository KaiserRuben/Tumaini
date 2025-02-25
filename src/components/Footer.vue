<template>
  <footer class="site-footer">
    <div class="site-footer__container">
      <div class="site-footer__language">
        <label for="language" class="site-footer__language-label">
          <span class="site-footer__language-icon">🌐</span>
          <select
            id="language"
            name="language"
            v-model="language"
            @change="changeLanguage()"
            class="site-footer__select"
          >
            <option value="DE">Deutsch</option>
            <option value="EN">English</option>
            <option value="NL">Nederlands</option>
          </select>
        </label>
      </div>

      <div class="site-footer__links">
        <router-link
          to="/impressum_datenschutz/impressum"
          class="site-footer__link"
        >
          {{ text[0] }}
        </router-link>
        <span class="site-footer__divider">&</span>
        <router-link
          to="/impressum_datenschutz/datenschutz"
          class="site-footer__link"
        >
          {{ text[1] }}
        </router-link>
      </div>

      <div class="site-footer__copyright">
        &copy; {{ currentYear }} Tumaini
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
  background-color: #FFF;
  border-top: 1px solid rgba(12, 13, 8, 0.1);
  color: #0C0D08;
  width: 100%;
  padding: 2rem 0;
  margin-top: auto;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 1rem;
      text-align: center;
    }
  }

  &__language {
    position: relative;

    &-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    &-icon {
      font-size: 1.2rem;
    }
  }

  &__select {
    appearance: none;
    background-color: transparent;
    border: 2px solid rgba(12, 13, 8, 0.1);
    border-radius: 8px;
    padding: 0.5rem 2rem 0.5rem 1rem;
    font-size: 1rem;
    color: #0C0D08;
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1em;

    &:focus {
      outline: none;
      border-color: #5F9AAE;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__link {
    color: #0C0D08;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #5F9AAE;
      text-decoration: underline;
    }
  }

  &__divider {
    margin: 0 0.25rem;
    color: rgba(12, 13, 8, 0.6);
  }

  &__copyright {
    color: rgba(12, 13, 8, 0.6);
    font-size: 0.9rem;
  }
}
</style>