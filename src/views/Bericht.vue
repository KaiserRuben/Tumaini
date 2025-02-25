<template>
  <div class="report">
    <Header :class="{ 'header--hidden': isHeaderHidden }"/>

    <div
      class="report__hero"
      :style="`background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${article.image})`"
    >
      <div class="report__hero-content">
        <h1 class="report__title">{{ article.title }}</h1>
        <div class="report__subheader">{{ article.subheader }}</div>
      </div>
    </div>

    <div class="report__container">
      <aside class="report__sidebar">
        <div class="report__meta">
          <div class="report__main-points" v-if="article.mainPoints && article.mainPoints.length">
            <h2>{{ text[0] }}:</h2>
            <ul>
              <li v-for="point in article.mainPoints" v-bind:key="point">
                {{ point }}
              </li>
            </ul>
          </div>

          <div class="report__date" v-if="article.created">
            <div class="report__meta-label">{{ text[1] }}:</div>
            <div class="report__meta-value">{{ formatDate(article.created) }}</div>
          </div>

          <div class="report__share">
            <button
              class="report__share-button"
              @click="copyToClipboard(); showSnackbar();"
            >
              {{ text[2] }}
            </button>
          </div>
        </div>
      </aside>

      <main class="report__content">
        <div
          class="report__section"
          v-for="(paragraph, i) in article.content"
          v-bind:key="paragraph"
        >
          <h2 class="report__section-title" v-if="paragraph.title">
            {{ paragraph.title }}
          </h2>

          <div class="report__image" v-if="paragraph.image">
            <img :src="paragraph.image" :alt="paragraph.title"/>
            <figcaption v-if="paragraph.imageDescription">{{ paragraph.imageDescription }}</figcaption>
          </div>

          <div
            :class="['report__paragraph', { 'report__paragraph--first': i === 0 }]"
            v-if="paragraph.text"
          >
            <Markdown :source="paragraph.text" :breaks="true" :html="true"/>
          </div>
        </div>
      </main>
    </div>

    <div id="snackbar" class="report__snackbar">{{ text[3] }}</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import Markdown from 'vue3-markdown-it';
import {axiosGet} from "../../admin/src/utils/axiosWrapper";

export default defineComponent({
  name: "BerichtComponent",
  components: {Header, Markdown},

  data() {
    return {
      article: {},
      articleLink: window.location.href,
      text: [] as string[],
      id: this.$route.params.id,
      isHeaderHidden: false,
      lastScrollPosition: 0
    };
  },

  methods: {
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },

    copyToClipboard(): Promise<void> {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(this.articleLink);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = this.articleLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((res, rej) => {
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        });
      }
    },

    showSnackbar() {
      const snackbar = document.getElementById("snackbar");
      if (snackbar) {
        snackbar.classList.add("report__snackbar--visible");
        setTimeout(() => {
          snackbar.classList.remove("report__snackbar--visible");
        }, 3000);
      }
    },
    onScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      // Determine scroll direction and distance
      if (currentScrollPosition < 0) {
        return;
      }

      // Show header when scrolling up, hide when scrolling down
      // Only trigger after scrolling at least 50px to avoid small movements
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 50) {
        return;
      }

      this.isHeaderHidden = currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 100;
      this.lastScrollPosition = currentScrollPosition;
    },
  },

  async beforeMount() {
    try {
      const response = await axiosGet('/content/article/id/' + this.id);
      this.article = response.data;

      this.text = [
        await this.textObject.getContent('61d56628cc3bfb06f031f99a'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99b'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99c'),
        await this.textObject.getContent('61d56628cc3bfb06f031f99d'),
      ];
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },
});
</script>

<style lang="scss">
/* Header hide/show animation */
::v-deep(.header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.header--hidden {
  transform: translateY(-100%);
}

.report {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__hero {
    width: 100%;
    height: 60vh;
    max-height: 600px;
    min-height: 300px;
    margin-top: 0; /* Adjusted for fixed header */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &-content {
      width: 90%;
      max-width: 1200px;
      text-align: center;
      padding: 2rem;
      color: #ffffff;
    }
  }

  &__title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  &__subheader {
    font-size: 1.75rem;
    font-weight: 400;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }

  &__container {
    display: flex;
    width: 90%;
    max-width: 1200px;
    margin: 3rem auto;
    gap: 4rem;

    @media (max-width: 992px) {
      flex-direction: column;
      gap: 2rem;
    }
  }

  &__sidebar {
    flex: 0 0 30%;
    max-width: 350px;

    @media (max-width: 992px) {
      max-width: 100%;
    }
  }

  &__content {
    flex: 1;
  }

  &__meta {
    position: sticky;
    top: 2rem;
    border-radius: 8px;
    background-color: rgba(245, 245, 245, 0.05);
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 992px) {
      position: static;
      margin-bottom: 0;
    }
  }

  &__main-points {
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    ul {
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
        line-height: 1.5;
      }
    }
  }

  &__date {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .report__meta-label {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .report__meta-value {
      font-size: 1.1rem;
    }
  }

  &__share {
    &-button {
      display: inline-block;
      background-color: #5F9AAE;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken(#5F9AAE, 10%);
      }
    }
  }

  &__section {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  &__paragraph {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;

    p {
      margin-bottom: 1.5rem;
    }

    &--first::first-letter {
      float: left;
      font-size: 3.5rem;
      line-height: 0.85;
      margin-right: 0.5rem;
      font-weight: 700;
    }
  }

  &__image {
    margin: 2rem 0;

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }

    figcaption {
      margin-top: 0.75rem;
      font-size: 0.9rem;
      font-style: italic;
      opacity: 0.8;
      text-align: center;
    }
  }

  &__snackbar {
    visibility: hidden;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 1rem;
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    z-index: 100;
    opacity: 0;
    transition: all 0.3s ease;

    &--visible {
      visibility: visible;
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }
}
</style>