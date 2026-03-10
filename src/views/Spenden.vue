<template>
  <div>
    <Header/>

    <div class="donate">
      <div class="donate__container">
        <h3 class="donate__title">
          <template v-if="option === 2">{{ text[9] }}</template>
          <template v-else-if="option === 3">{{ text[10] }}</template>
          <template v-else>{{ text[8] }}</template>
        </h3>

        <p class="donate__description">
          <template v-if="option === 2">{{ text[13] }}</template>
          <template v-else-if="option === 3">{{ text[14] }}</template>
          <template v-else>{{ text[12] }}</template>
        </p>
        <p class="donate__info">
          {{ text[3] }}
        </p>

        <div v-if="submitted" class="donate__success">
          {{ text[11] }}
        </div>

        <form v-else class="donate__form" @submit.prevent="pushDonor()">
          <div class="donate__form-row">
            <div class="donate__field">
              <label class="donate__label" for="donor-firstname">{{ text[5] || 'Vorname' }}</label>
              <input
                id="donor-firstname"
                :placeholder="text[5]"
                type="text"
                v-model="donor.firstName"
                required
              />
            </div>
            <div class="donate__field">
              <label class="donate__label" for="donor-lastname">{{ text[6] || 'Nachname' }}</label>
              <input
                id="donor-lastname"
                :placeholder="text[6]"
                type="text"
                v-model="donor.lastName"
                required
              />
            </div>
          </div>

          <div class="donate__form-row">
            <div class="donate__field">
              <label class="donate__label" for="donor-email">{{ text[7] || 'E-Mail' }}</label>
              <input
                id="donor-email"
                :placeholder="text[7]"
                type="email"
                v-model="donor.email"
                required
              />
            </div>
            <div class="donate__field">
              <label class="donate__label" for="donor-phone">{{ text[16] || 'Telefon' }}</label>
              <input
                id="donor-phone"
                :placeholder="text[16]"
                type="tel"
                v-model="donor.phone"
              />
            </div>
          </div>

          <div class="donate__form-row">
            <div class="donate__field donate__field--full">
              <label class="donate__label" for="donor-address">{{ text[15] || 'Adresse' }}</label>
              <input
                id="donor-address"
                :placeholder="text[15]"
                type="text"
                v-model="donor.address"
              />
            </div>
          </div>

          <div class="donate__form-action">
            <button type="submit" class="btn btn-primary">{{ text[4] }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="donate__partner">
      <div class="donate__partner-container">
        <h3 class="donate__partner-title">
          {{ text[1] }}
        </h3>
        <div class="donate__partner-content">
          <img
            src="../assets/Joackim.webp"
            alt="Unser Partner Jaockim"
            class="donate__partner-image"
          />
          <p class="donate__partner-text">
            {{ text[2] }}
          </p>
        </div>
      </div>
    </div>

    <div class="donate__projects" v-if="projects.length">
      <div class="donate__container">
        <h3 class="donate__title">{{ text[0] }}</h3>

        <div class="donate__card-grid">
          <div
            class="donate__card-wrapper"
            v-for="project in projects"
            :key="project._id"
          >
            <TeaserCard
              class="donate__card"
              :img="project.image"
              :header="project.title"
              :text="project.content[0].text"
              :click="`/project/${project._id}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";
import {axiosGet, axiosPost} from "../../admin/src/utils/axiosWrapper";
import {IArticle} from "../../api/models/article";
import {IDonor} from "../../api/models/donor";
import {sortArticles} from "@/utils/dates";

export default defineComponent({
  name: "SpendenDetails",
  components: {Header, TeaserCard},

  data() {
    return {
      option: parseInt(typeof this.$router.currentRoute.value.params.option === "string"
        ? this.$router.currentRoute.value.params.option
        : "1"),
      text: [] as string[],
      projects: [] as IArticle[],

      donor: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        status: "CREATED",
        option: parseInt(typeof this.$router.currentRoute.value.params.option === "string"
          ? this.$router.currentRoute.value.params.option
          : "1")
      } as IDonor,

      justInfo: false,
      submitted: false
    };
  },

  methods: {
    async pushDonor() {
      try {
        await axiosPost('/donor/', this.donor);
        this.donor.firstName = '';
        this.donor.lastName = '';
        this.donor.email = '';
        this.donor.phone = '';
        this.donor.address = '';
        this.justInfo = false;
        this.submitted = true;
      } catch (err) {
        console.error(err);
      }
    }
  },

  async mounted() {
    try {
      const response = await axiosGet('/content/article/material/PROJECT/published');
      this.projects = response.data.sort((a: IArticle, b: IArticle) => sortArticles(a, b));

      this.text = [
        await this.textObject.getContent('61d56377cc3bfb06f031f986'),
        await this.textObject.getContent('61d56377cc3bfb06f031f987'),
        await this.textObject.getContent('61d56377cc3bfb06f031f988'),
        await this.textObject.getContent('61d56377cc3bfb06f031f989'),
        await this.textObject.getContent('61d56377cc3bfb06f031f98a'),
        await this.textObject.getContent('61d56466cc3bfb06f031f98e'),
        await this.textObject.getContent('61d56466cc3bfb06f031f98f'),
        await this.textObject.getContent('61d56466cc3bfb06f031f990'),
        await this.textObject.getContent('61d55fa9cc3bfb06f031f977'),
        await this.textObject.getContent('61d55fa9cc3bfb06f031f979'),
        await this.textObject.getContent('61d55fa9cc3bfb06f031f97b'),
        await this.textObject.getContent('61dc75ef52bc3e00c19de452'),
        await this.textObject.getContent('61deb33436e5281ff13f46f6'),
        await this.textObject.getContent('61deb33436e5281ff13f46f5'),
        await this.textObject.getContent('61deb33436e5281ff13f46f7'),
        await this.textObject.getContent('61deb5d939267e2068003a95'),
        await this.textObject.getContent('61deb5d939267e2068003a96'),
        await this.textObject.getContent('61f29f5fab98050332eb9a72'),
      ];

      if (isNaN(this.option)) {
        this.option = 1;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
});
</script>

<style lang="scss" scoped>
.donate {
  padding: var(--t-spacing-2xl) var(--t-spacing-md);

  &__container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 var(--t-spacing-md);
  }

  &__title {
    font-family: 'Instrument Serif', serif;
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: var(--t-spacing-lg);
    color: var(--t-text);
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.875rem;
    }
  }

  &__description, &__info {
    max-width: 42rem;
    margin: 0 auto var(--t-spacing-lg);
    font-size: 1.125rem;
    line-height: 1.6;
    text-align: center;
    color: var(--t-text-secondary);
  }

  &__success {
    max-width: 42rem;
    margin: var(--t-spacing-xl) auto;
    padding: var(--t-spacing-lg);
    background: var(--t-bg-elevated);
    border: 2px solid var(--t-brand);
    border-radius: var(--t-radius-md);
    color: var(--t-text);
    font-size: 1.125rem;
    text-align: center;
    line-height: 1.6;
  }

  &__form {
    max-width: 42rem;
    margin: var(--t-spacing-xl) auto;

    &-row {
      display: flex;
      gap: var(--t-spacing-md);
      margin-bottom: var(--t-spacing-md);

      @media (max-width: 640px) {
        flex-direction: column;
        gap: var(--t-spacing-md);
      }
    }

    &-action {
      display: flex;
      justify-content: center;
      margin-top: var(--t-spacing-lg);
    }
  }

  &__field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--t-spacing-xs);

    &--full {
      width: 100%;
    }

    input {
      width: 100%;
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t-text-secondary);
  }

  &__partner {
    padding: var(--t-spacing-2xl) var(--t-spacing-md);
    background: var(--t-bg-elevated);
    color: var(--t-text);

    &-container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 var(--t-spacing-md);
    }

    &-title {
      font-family: 'Instrument Serif', serif;
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: var(--t-spacing-xl);
      text-align: center;
      color: var(--t-text);

      @media (max-width: 768px) {
        font-size: 1.875rem;
      }
    }

    &-content {
      display: flex;
      align-items: center;
      gap: var(--t-spacing-xl);

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--t-spacing-lg);
      }
    }

    &-image {
      width: 100%;
      max-width: 300px;
      height: auto;
      border-radius: var(--t-radius-lg);
      object-fit: cover;
    }

    &-text {
      flex: 1;
      font-size: 1.125rem;
      line-height: 1.6;
      color: var(--t-text-secondary);
    }
  }

  &__projects {
    padding: var(--t-spacing-2xl) var(--t-spacing-md);
  }

  &__card {
    height: 100%;
    transition: transform var(--t-duration-medium) var(--t-ease), box-shadow var(--t-duration-medium) var(--t-ease);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &__card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--t-spacing-xl);
    margin-top: var(--t-spacing-xl);
  }

  &__card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
