<template>
  <div ref="landingRef">

    <!-- Section 1 (IMG Layout / Hero) — untouched -->
    <div class="section imgContainer">
      <div class="imgGrid1">
        <div class="imgGrid1_1">
          <div class="imgGrid1_1_1"></div>
          <div class="imgGrid1_1_2"></div>
        </div>
        <div class="imgGrid1_2"></div>
      </div>
      <div class="imgGrid2">
        <h2 class="hero-text">{{ text[0] }}</h2>
        <h2 class="hero-text hero-text--delay">{{ text[1] }}</h2>
      </div>
    </div>

    <!-- Section 2: Welcome + 3 cards -->
    <section class="landing-welcome">
      <div class="landing-welcome__grain" aria-hidden="true"></div>

      <header class="landing-welcome__head reveal">
        <p class="landing-eyebrow">
          <span class="landing-eyebrow__dot"></span>
          {{ text[2] }}
        </p>
        <h2 class="landing-welcome__title">{{ text[3] }}</h2>
      </header>

      <div class="landing-welcome__grid">
        <article
          v-for="(card, i) in welcomeCards"
          :key="i"
          class="landing-feature reveal-stagger"
          :data-index="i"
          :style="{ '--idx': i }"
        >
          <div class="landing-feature__media-wrap">
            <div class="landing-feature__media" :style="{ backgroundImage: `url(${card.img})` }"></div>
          </div>
          <h3 class="landing-feature__title">{{ card.header }}</h3>
          <p class="landing-feature__text">{{ card.text }}</p>
        </article>
      </div>
    </section>

    <!-- Section 3: About + featured report -->
    <section class="landing-about">
      <div class="landing-about__split reveal">
        <div class="landing-about__head">
          <p class="landing-eyebrow">
            <span class="landing-eyebrow__dot"></span>
            {{ text[22] }}
          </p>
          <h2 class="landing-about__title">{{ text[10] }}</h2>
        </div>
        <p class="landing-about__body">{{ text[11] }}</p>
      </div>

      <article v-if="report" class="landing-report reveal" @click="$router.push(`/bericht/${report._id}`)">
        <div class="landing-report__media-wrap">
          <div
            v-if="report.image"
            class="landing-report__media"
            :style="{ backgroundImage: `url(${report.image})` }"
          ></div>
          <div v-else class="landing-report__media landing-report__media--placeholder"></div>
        </div>
        <div class="landing-report__copy">
          <p class="landing-eyebrow landing-eyebrow--amber">
            <span class="landing-eyebrow__dot"></span>
            {{ text[23] }}
          </p>
          <h3 class="landing-report__title">{{ report.title }}</h3>
          <div class="landing-report__lede">
            <Markdown
              v-if="report.content && report.content[0]"
              :source="report.content[0].text"
              :breaks="true"
              :html="true"
            />
          </div>
          <button
            type="button"
            class="landing-report__cta"
            @click.stop="$router.push(`/bericht/${report._id}`)"
          >
            <span>{{ text[12] }}</span>
            <span class="landing-report__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </section>

    <!-- Section 4: Donation tiers -->
    <section class="landing-donate">
      <header class="landing-donate__head reveal">
        <p class="landing-eyebrow">
          <span class="landing-eyebrow__dot"></span>
          {{ donateLabel }}
        </p>
        <h2 class="landing-donate__title">{{ donateTitle }}</h2>
      </header>

      <div class="landing-donate__grid">
        <router-link
          v-for="(d, i) in donationTiers"
          :key="d.option"
          :to="d.url"
          class="landing-donate__card reveal-stagger"
          :data-index="i"
          :style="{ '--idx': i }"
        >
          <div class="landing-donate__top">
            <span class="landing-donate__num">{{ String(d.option).padStart(2, '0') }}</span>
            <span class="landing-donate__amount">{{ d.amount }}</span>
          </div>
          <h3 class="landing-donate__card-title">{{ d.header }}</h3>
          <p class="landing-donate__card-text">{{ d.text }}</p>
          <span class="landing-donate__cta">
            <span>{{ donateCta }}</span>
            <span class="landing-donate__arrow" aria-hidden="true">→</span>
          </span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {IArticle} from "../../api/models/article";
import {axiosGet} from '../../admin/src/utils/axiosWrapper';
import Markdown from 'vue3-markdown-it';
import {sortArticles} from "@/utils/dates";
import {useReveal} from "@/composables/useReveal";

export default defineComponent({
  name: 'HomePage',
  components: {Markdown},
  setup() {
    const landingRef = ref<HTMLElement | null>(null);
    useReveal(landingRef);
    return {landingRef};
  },
  data() {
    return {
      text: [] as string[],
      report: undefined as undefined | IArticle,
    };
  },
  computed: {
    welcomeCards() {
      return [
        { img: 'https://files.tumaini.be/landing_wer.webp', header: this.text[4],  text: this.text[5] },
        { img: 'https://files.tumaini.be/landing_was.webp', header: this.text[6],  text: this.text[7] },
        { img: 'https://files.tumaini.be/landing_wo.webp',  header: this.text[8],  text: this.text[9] },
      ];
    },
    donationTiers() {
      return [
        { option: 1, amount: 'Frei',  url: '/spenden/1', header: this.text[13], text: this.text[14] },
        { option: 2, amount: '€25',   url: '/spenden/2', header: this.text[15], text: this.text[16] },
        { option: 3, amount: '€100',  url: '/spenden/3', header: this.text[17], text: this.text[18] },
      ];
    },
    donateLabel(): string { return this.text[19] || 'Spende'; },
    donateTitle(): string { return this.text[20] || this.text[13] || ''; },
    donateCta(): string   { return this.text[21] || 'Mehr erfahren'; },
  },
  async mounted() {
    this.report = (await axiosGet('/content/article/material/REPORT/published'))
      .data
      .sort((a: IArticle, b: IArticle) => sortArticles(a, b))[0];

    this.text = [
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96a'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96b'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96c'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96d'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96e'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f96f'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f970'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f971'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f972'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f973'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f974'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f975'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f976'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f977'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f978'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f979'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97a'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97b'),
      await this.textObject.getContent('61d55fa9cc3bfb06f031f97c'),
      await this.textObject.getContent('6a036c5adf827c5abd5a1c11'),
      await this.textObject.getContent('6a036c5adf827c5abd5a1c12'),
      await this.textObject.getContent('6a036c5adf827c5abd5a1c13'),
      await this.textObject.getContent('6a036c78cea5bef08c063746'),
      await this.textObject.getContent('6a036c78cea5bef08c063747'),
    ];
  },
});
</script>

<style scoped lang="scss">
$serif:  'Instrument Serif', Georgia, serif;
$sans:   'DM Sans', system-ui, sans-serif;
$script: 'Petemoss', 'Caveat', cursive;
$grain:  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");

.section { min-height: 100vh; height: max-content; }

/* === Section 1 hero — preserved === */
.imgContainer {
  display: grid;
  grid-template-columns: 50vw 50vw;

  @media only screen and (max-width: 640px) {
    grid-template-rows: 50vh 50vh;
    grid-template-columns: 100vw;
  }

  .imgGrid1 {
    display: grid;
    grid-template-rows: 50vh 50vh;
    @media only screen and (max-width: 640px) { order: 2; }

    .imgGrid1_1 {
      display: grid;
      grid-template-columns: 33% 67%;
      @media only screen and (max-width: 640px) { grid-template-rows: 33% 67%; grid-template-columns: 100%; }

      .imgGrid1_1_1 {
        background: url("../assets/landing/annie-spratt-0cgpyigyIkM-unsplash.webp") no-repeat center;
        background-size: auto 120%;
        @media only screen and (max-width: 640px) { background-size: 110% auto; }
      }
      .imgGrid1_1_2 {
        background: url("../assets/landing/annie-spratt-cVEOh_JJmEE-unsplash.webp") no-repeat center;
        background-size: auto 130%;
      }
    }
    .imgGrid1_2 {
      background: url("../assets/landing/ben-hummitzsch-pYTgvmpuQWs-unsplash.webp") no-repeat center;
      background-size: auto 150%;
      @media only screen and (max-width: 640px) { visibility: hidden; }
    }
  }

  .imgGrid2 {
    background: url("../assets/landing/carolinie-cavalli-yFaK9jgQeb4-unsplash.webp") no-repeat center;
    background-size: auto 120%;
    display: flex; flex-direction: column; flex-wrap: nowrap;
    align-items: flex-end; justify-content: center;
    padding-right: 10vw;
    @media only screen and (max-width: 640px) { order: 1; }
  }
}

.hero-text {
  font-size: 7em; margin: 0;
  animation: appear 0.8s var(--t-ease-out) both;
  &--delay { animation-delay: 0.15s; }
  @media only screen and (max-width: 640px) { font-size: 3.5em; }
}
@keyframes appear {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* === Shared eyebrow === */
.landing-eyebrow {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: $sans;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--t-text-secondary);
  margin: 0 0 1rem;

  &--amber { color: var(--t-brand); }

  &__dot {
    width: 6px; height: 6px; border-radius: 999px;
    background: var(--t-brand);
    box-shadow: 0 0 0 4px rgba(200, 113, 46, 0.18);
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* === Section 2: Welcome === */
.landing-welcome {
  position: relative;
  padding: clamp(5rem, 9vw, 8rem) clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vw, 6rem);
  overflow: hidden;

  &__grain {
    position: absolute; inset: 0;
    background-image: $grain;
    opacity: 0.16; mix-blend-mode: overlay;
    pointer-events: none;
  }

  &__head {
    position: relative;
    max-width: 1200px;
    margin: 0 auto clamp(2.5rem, 5vw, 4.5rem);
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2.5rem, 6.5vw, 5rem);
    line-height: 1.02;
    letter-spacing: -0.025em;
    color: var(--t-text);
    margin: 0;
    max-width: 18ch;
    background: linear-gradient(180deg, var(--t-text) 45%, rgba(255, 164, 0, 0.85) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__grid {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(1.5rem, 3vw, 2.75rem);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
}

.landing-feature {
  position: relative;
  display: flex; flex-direction: column;
  gap: 1rem;
  opacity: 0;
  animation: fadeUp 0.7s ease-out forwards;
  animation-delay: calc(var(--idx, 0) * 100ms + 150ms);

  &__media-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: var(--t-bg-elevated);
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

    &::after {
      content: '';
      position: absolute; inset: 0;
      border: 1px solid rgba(200, 113, 46, 0);
      border-radius: inherit;
      transition: border-color 0.4s ease;
      pointer-events: none;
    }
  }

  &__media {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s ease;
    filter: saturate(0.95);
  }

  &__num {
    position: absolute;
    top: 0.75rem; left: 0.85rem;
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: #fff;
    padding: 0.3rem 0.55rem;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(6px);
    border-radius: 999px;
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-size: clamp(1.5rem, 2vw, 1.875rem);
    font-weight: 400;
    line-height: 1.15;
    margin: 0;
    color: var(--t-text);
    letter-spacing: -0.01em;
  }

  &__text {
    font-family: $sans;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--t-text-secondary);
    margin: 0;
  }

  &:hover {
    .landing-feature__media-wrap { transform: translateY(-4px); }
    .landing-feature__media { transform: scale(1.05); filter: saturate(1.1); }
    .landing-feature__media-wrap::after { border-color: rgba(200, 113, 46, 0.5); }
  }
}

/* === Section 3: About + report === */
.landing-about {
  position: relative;
  padding: clamp(5rem, 9vw, 8rem) clamp(1.5rem, 6vw, 5rem);
  background: var(--t-bg);

  &__split {
    max-width: 1200px;
    margin: 0 auto clamp(3rem, 6vw, 5rem);
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: start;

    @media (max-width: 880px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2.25rem, 5vw, 4rem);
    line-height: 1.02;
    letter-spacing: -0.025em;
    color: var(--t-text);
    margin: 0;
    max-width: 14ch;
    background: linear-gradient(180deg, var(--t-text) 50%, rgba(255, 164, 0, 0.85) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__body {
    font-family: $sans;
    font-size: clamp(1rem, 1.4vw, 1.125rem);
    line-height: 1.7;
    color: var(--t-text-secondary);
    margin: 0;
    max-width: 56ch;
  }
}

.landing-report {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 0;
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.5s ease;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(200, 113, 46, 0.5);

    .landing-report__media { transform: scale(1.04); filter: saturate(1.1); }
    .landing-report__arrow { transform: translateX(4px); }
    .landing-report__cta { background: var(--t-brand); color: var(--t-bg); border-color: var(--t-brand); }
  }

  &__media-wrap {
    position: relative;
    overflow: hidden;
    min-height: 320px;
    aspect-ratio: 4 / 3;

    @media (max-width: 880px) {
      aspect-ratio: 16 / 10;
      min-height: 220px;
    }
  }

  &__media {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s ease;

    &--placeholder {
      background: linear-gradient(135deg, rgba(200, 113, 46, 0.2), rgba(255, 164, 0, 0.05));
    }
  }

  &__copy {
    padding: clamp(1.75rem, 3vw, 2.75rem);
    display: flex; flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(1.75rem, 3.2vw, 2.5rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--t-text);
    margin: 0;
  }

  &__lede {
    font-family: $sans;
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--t-text-secondary);

    :deep(p) { margin: 0 0 0.75rem; }
    :deep(p:last-child) { margin-bottom: 0; }

    // Truncate to ~5 lines
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__cta {
    align-self: flex-start;
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-family: $sans;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--t-text);
    background: transparent;
    border: 1px solid var(--t-border);
    padding: 0.7rem 1.2rem;
    border-radius: 999px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease;
  }
}

/* === Section 4: Donations === */
.landing-donate {
  position: relative;
  padding: clamp(5rem, 9vw, 8rem) clamp(1.5rem, 6vw, 5rem) clamp(6rem, 10vw, 9rem);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -10%; left: -10%; right: -10%;
    height: 60%;
    background: radial-gradient(ellipse at center top,
      rgba(255, 164, 0, 0.12) 0%,
      rgba(200, 113, 46, 0.04) 35%,
      transparent 65%);
    filter: blur(20px);
    pointer-events: none;
  }

  &__head {
    position: relative;
    max-width: 1200px;
    margin: 0 auto clamp(2.5rem, 5vw, 4.5rem);
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 1.02;
    letter-spacing: -0.025em;
    color: var(--t-text);
    margin: 0;
    max-width: 16ch;
    background: linear-gradient(180deg, var(--t-text) 45%, rgba(255, 164, 0, 0.95) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__grid {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(1.25rem, 2vw, 1.75rem);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
  }

  &__card {
    position: relative;
    display: flex; flex-direction: column;
    gap: 0.85rem;
    padding: clamp(1.5rem, 2.5vw, 2rem);
    background: var(--t-bg-elevated);
    border: 1px solid var(--t-border);
    border-radius: 18px;
    color: var(--t-text);
    text-decoration: none;
    overflow: hidden;
    opacity: 0;
    animation: fadeUp 0.7s ease-out forwards;
    animation-delay: calc(var(--idx, 0) * 100ms + 200ms);
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease, background 0.4s ease;

    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--t-brand) 0%, rgba(255, 164, 0, 0.4) 100%);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    &:hover {
      transform: translateY(-6px);
      border-color: rgba(200, 113, 46, 0.5);
      background: linear-gradient(180deg,
        rgba(200, 113, 46, 0.04) 0%,
        var(--t-bg-elevated) 100%);

      &::before { transform: scaleX(1); }
      .landing-donate__arrow { transform: translateX(4px); }
      .landing-donate__cta   { color: var(--t-brand); }
    }
  }

  &__top {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  &__num {
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.24em;
    color: var(--t-text-secondary);
  }

  &__amount {
    font-family: $serif;
    font-style: italic;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    color: var(--t-brand);
    line-height: 1;
  }

  &__card-title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(1.25rem, 1.8vw, 1.5rem);
    line-height: 1.2;
    margin: 0;
    color: var(--t-text);
    letter-spacing: -0.01em;
  }

  &__card-text {
    font-family: $sans;
    font-size: 0.92rem;
    line-height: 1.55;
    color: var(--t-text-secondary);
    margin: 0 0 0.5rem;

    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__cta {
    margin-top: auto;
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: $sans;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    transition: color 0.3s ease;
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease;
  }
}
</style>
