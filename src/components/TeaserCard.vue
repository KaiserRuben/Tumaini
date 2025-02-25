<template>
  <div class="teaser-card" @click="$router.push(click)">
    <div class="teaser-card__image" :style="cardImageStyle"></div>
    <div class="teaser-card__content">
      <h2 class="teaser-card__title">{{ header }}</h2>
      <div class="teaser-card__excerpt">
        <Markdown :source="excerpt" :breaks="true" :html="true"/>
      </div>
      <div class="teaser-card__footer">
        <span class="teaser-card__read-more">Mehr erfahren →</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import Markdown from 'vue3-markdown-it';

export default defineComponent({
  name: 'TeaserCard',
  props: {
    img: {
      type: String,
      default: 'https://files.tumaini.be/default_project_picture.webp'
    },
    header: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    inProgress: {
      type: Boolean,
      default: true
    },
    click: {
      type: String,
      default: '/project'
    },
  },
  components: {Markdown},
  setup(props) {
    const excerpt = computed(() => {
      if (!props.text) return '';
      const words = props.text.split(' ');
      return words.slice(0, 25).join(' ') + '...';
    });

    const cardImageStyle = computed(() => {
      return {
        'background-image': `url(${props.img})`,
        'background-position': 'center',
        'background-repeat': 'no-repeat',
        'background-size': 'cover'
      };
    });

    return {
      excerpt,
      cardImageStyle
    };
  }
});
</script>

<style lang="scss" scoped>
.teaser-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  background-color: #151919;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

    .teaser-card__content {
      background-color: #5F9AAE;
      color: #F5FFFF;
    }

    .teaser-card__read-more {
      color: #F5FFFF;
    }
  }

  &__image {
    height: 200px;
    width: 100%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to top, rgba(21, 25, 25, 0.8), transparent);
    }

    @media (max-width: 768px) {
      height: 180px;
    }

    @media (max-width: 480px) {
      height: 160px;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background-color: #151919;
    color: #EDF0F3;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      padding: 1.25rem;
    }

    @media (max-width: 480px) {
      padding: 1rem;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.35rem;
      margin-bottom: 0.75rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }

  &__excerpt {
    flex: 1;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    :deep(p) {
      margin: 0;
    }
  }

  &__footer {
    text-align: right;
    margin-top: auto;
  }

  &__read-more {
    display: inline-block;
    color: #5F9AAE;
    font-weight: 600;
    font-size: 0.95rem;
    transition: color 0.3s ease;
  }
}
</style>