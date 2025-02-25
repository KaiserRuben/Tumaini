<template>
  <div>
    <Header/>

    <div class="donate">
      <div class="donate__container">
        <h2 class="donate__title">
          <template v-if="option === 2">{{ text[9] }}</template>
          <template v-else-if="option === 3">{{ text[10] }}</template>
          <template v-else>{{ text[8] }}</template>
        </h2>

        <p class="donate__description">
          <template v-if="option === 2">{{ text[13] }}</template>
          <template v-else-if="option === 3">{{ text[14] }}</template>
          <template v-else>{{ text[12] }}</template>
        </p>
        <p class="donate__info">
          {{ text[3] }}
        </p>

        <form class="donate__form" @submit.prevent="pushDonor()">
          <div class="donate__form-row">
            <input
              class="donate__input"
              :placeholder="text[5]"
              type="text"
              v-model="donor.firstName"
              required
            />
            <input
              class="donate__input"
              :placeholder="text[6]"
              type="text"
              v-model="donor.lastName"
              required
            />
          </div>

          <div class="donate__form-row">
            <input
              class="donate__input"
              :placeholder="text[7]"
              type="email"
              v-model="donor.email"
              required
            />
            <input
              class="donate__input"
              :placeholder="text[16]"
              type="tel"
              v-model="donor.phone"
            />
          </div>

          <div class="donate__form-row">
            <input
              class="donate__input donate__input--full"
              :placeholder="text[15]"
              type="text"
              v-model="donor.address"
            />
          </div>

          <div class="donate__form-action">
            <button type="submit" class="donate__button">{{ text[4] }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="donate__partner">
      <div class="donate__partner-container">
        <h2 class="donate__partner-title">
          {{ text[1] }}
        </h2>
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
        <h2 class="donate__title">{{ text[0] }}</h2>

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

      justInfo: false
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
        alert(this.text[11]);
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
  padding: 4rem 1rem;

  &__container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #f5ffff;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.875rem;
    }
  }

  &__description, &__info {
    max-width: 42rem;
    margin: 0 auto 1.5rem;
    font-size: 1.125rem;
    line-height: 1.6;
    text-align: center;
  }

  &__form {
    max-width: 42rem;
    margin: 2rem auto;

    &-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      @media (max-width: 640px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    &-action {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }
  }

  &__input {
    flex: 1;
    padding: 0.875rem 1.25rem;
    border-radius: 8px;
    border: 2px solid #5F9AAE;
    background-color: rgba(21, 25, 25, 0.8);
    color: #f5ffff;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #FFA400;
    }

    &--full {
      width: 100%;
    }
  }

  &__button {
    background-color: #FFA400;
    color: #0C0D08;
    border: none;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: darken(#FFA400, 10%);
      transform: translateY(-2px);
    }

    &:focus {
      outline: none;
    }
  }

  &__partner {
    padding: 4rem 1rem;
    background-color: #f5ffff;
    color: #151919;

    &-container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    &-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 1.875rem;
      }
    }

    &-content {
      display: flex;
      align-items: center;
      gap: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
      }
    }

    &-image {
      width: 300px;
      height: auto;
      border-radius: 1rem;
      object-fit: cover;

      @media (max-width: 768px) {
        width: 80%;
        max-width: 300px;
      }
    }

    &-text {
      flex: 1;
      font-size: 1.125rem;
      line-height: 1.6;
    }
  }

  &__projects {
    padding: 4rem 1rem;
  }

  &__card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &__card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  /* Fixed width card wrapper */
  &__card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>