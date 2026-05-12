<template>
  <div class="spenden">
    <Header/>

    <section class="spenden-hero">
      <div class="spenden-hero__grain" aria-hidden="true"></div>
      <div class="spenden-hero__glow" aria-hidden="true"></div>
      <div class="spenden-hero__shimmer" aria-hidden="true"></div>
      <div class="spenden-hero__orb spenden-hero__orb--a" aria-hidden="true"></div>
      <div class="spenden-hero__orb spenden-hero__orb--b" aria-hidden="true"></div>

      <div class="spenden-hero__inner">
        <div class="spenden-hero__meta">
          <span class="spenden-hero__dot"></span>
          <span>{{ text[19] }}</span>
          <span class="spenden-hero__sep">·</span>
          <span class="spenden-hero__meta-light">Stiftung Tumaini</span>
        </div>

        <h1 class="spenden-hero__title">
          <template v-if="option === 2">{{ text[9] }}</template>
          <template v-else-if="option === 3">{{ text[10] }}</template>
          <template v-else>{{ text[8] }}</template>
        </h1>

        <p class="spenden-hero__lede">
          <template v-if="option === 2">{{ text[13] }}</template>
          <template v-else-if="option === 3">{{ text[14] }}</template>
          <template v-else>{{ text[12] }}</template>
        </p>

        <p class="spenden-hero__thanks">{{ text[18] }}</p>
      </div>
    </section>

    <section class="spenden-iban">
      <p class="spenden-iban__label">IBAN</p>
      <button
        class="spenden-iban__poster"
        type="button"
        :title="text[25]"
        @click="copy('iban', ibanRaw)"
      >
        <span v-for="(grp, i) in ibanGroups" :key="i" class="spenden-iban__group">{{ grp }}</span>
        <span class="spenden-iban__copy" :class="{ 'is-copied': copied === 'iban' }">
          <span class="spenden-iban__copy-default">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M5 5V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2M3 5h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
            </svg>
            {{ text[25] }}
          </span>
          <span class="spenden-iban__copy-done">✓ {{ text[26] }}</span>
        </span>
      </button>
    </section>

    <section class="spenden-grid">
      <div class="spenden-grid__inner">
        <article class="spenden-ticket">
          <div class="spenden-ticket__grain" aria-hidden="true"></div>
          <div class="spenden-ticket__perfs" aria-hidden="true"></div>

          <header class="spenden-ticket__head">
            <p class="spenden-ticket__eyebrow">{{ text[19] }}</p>
            <p class="spenden-ticket__mark">
              <span class="spenden-ticket__mark-italic">Stiftung</span>
              <span class="spenden-ticket__mark-bold">Tumaini</span>
            </p>
          </header>

          <ol class="spenden-ticket__rows">
            <li
              v-for="(row, i) in detailRows"
              :key="row.key"
              class="spenden-ticket__row"
            >
              <button
                type="button"
                class="spenden-ticket__row-btn"
                :class="{ 'is-copied': copied === row.key }"
                :aria-label="`${row.label}: ${row.value} — ${text[25]}`"
                @click="copy(row.key, row.raw ?? row.value)"
              >
                <span class="spenden-ticket__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="spenden-ticket__label">{{ row.label }}</span>
                <span class="spenden-ticket__value" :class="{ 'spenden-ticket__value--mono': row.mono }">{{ row.value }}</span>
                <span class="spenden-ticket__hint">
                  <span class="spenden-ticket__hint-default">{{ text[25] }}</span>
                  <span class="spenden-ticket__hint-done">✓ {{ text[26] }}</span>
                </span>
              </button>
            </li>
          </ol>

          <button
            type="button"
            class="spenden-ticket__foot"
            :class="{ 'is-copied': copied === 'ref' }"
            :aria-label="`${text[24]}: ${reference} — ${text[25]}`"
            @click="copy('ref', reference)"
          >
            <span class="spenden-ticket__foot-label">{{ text[24] }}</span>
            <span class="spenden-ticket__foot-value">{{ reference }}</span>
            <span class="spenden-ticket__hint spenden-ticket__hint--foot">
              <span class="spenden-ticket__hint-default">{{ text[25] }}</span>
              <span class="spenden-ticket__hint-done">✓ {{ text[26] }}</span>
            </span>
          </button>
        </article>

        <aside class="spenden-qr">
          <div class="spenden-qr__amounts">
            <span class="spenden-qr__amounts-label">{{ text[31] || 'Betrag' }}</span>
            <button
              v-for="opt in amountOptions"
              :key="opt.value"
              type="button"
              class="spenden-qr__chip"
              :class="{ 'is-active': amount === opt.value }"
              @click="selectAmount(opt.value)"
            >{{ opt.value === 0 ? (text[28] || 'Frei') : opt.label }}</button>
          </div>

          <div class="spenden-qr__frame">
            <div class="spenden-qr__svg" v-html="qrSvg"></div>
            <div class="spenden-qr__corners" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
            <span class="spenden-qr__badge">EPC · SEPA</span>
          </div>

          <p class="spenden-qr__hint">
            <span class="spenden-qr__hint-script">{{ text[27] }}</span>
          </p>
        </aside>
      </div>
    </section>

    <section class="spenden-partner">
      <div class="spenden-partner__grain" aria-hidden="true"></div>
      <div class="spenden-partner__inner">
        <div class="spenden-partner__media">
          <img src="../assets/Joackim.webp" alt="Unser Partner Joackim" class="spenden-partner__image" />
          <span class="spenden-partner__caption">Joackim · Mwereni</span>
        </div>
        <div class="spenden-partner__copy">
          <p class="spenden-partner__eyebrow">
            <span class="spenden-partner__dot"></span>
            {{ text[29] || 'Vor Ort' }}
          </p>
          <h2 class="spenden-partner__title">{{ text[1] }}</h2>
          <p class="spenden-partner__text">{{ text[2] }}</p>
        </div>
      </div>
    </section>

    <section v-if="projects.length" class="spenden-projects">
      <div class="spenden-projects__head">
        <p class="spenden-projects__eyebrow">
          <span class="spenden-projects__dot"></span>
          {{ text[30] || 'Projekte' }}
        </p>
        <h2 class="spenden-projects__title">{{ text[0] }}</h2>
      </div>
      <div class="spenden-projects__grid">
        <TeaserCard
          v-for="(project, i) in projects"
          :key="String(project._id)"
          class="spenden-projects__card"
          :style="{ '--idx': i }"
          :img="project.image"
          :header="project.title"
          :text="project.content[0].text"
          :click="`/project/${project._id}`"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";
import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import {IArticle} from "../../api/models/article";
import {sortArticles} from "@/utils/dates";
import QRCode from "qrcode";

const RECIPIENT = "Stiftung Tumaini";
const BANK = "Hamburger Sparkasse";
const IBAN_RAW = "DE42200505501500499163";
const BIC = "HASPDEHHXXX";

function buildEpcPayload(reference: string, amountEur: number | null): string {
  const amountLine = amountEur && amountEur > 0 ? `EUR${amountEur.toFixed(2)}` : "";
  return [
    "BCD",
    "002",
    "1",
    "SCT",
    BIC,
    RECIPIENT,
    IBAN_RAW,
    amountLine,
    "",
    "",
    reference.slice(0, 140),
  ].join("\n");
}

function groupIban(raw: string): string[] {
  const groups: string[] = [];
  for (let i = 0; i < raw.length; i += 4) {
    groups.push(raw.slice(i, i + 4));
  }
  return groups;
}

type AmountOpt = { label: string; value: number };

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
      qrSvg: "" as string,
      copied: "" as string,
      copyTimer: null as ReturnType<typeof setTimeout> | null,
      amount: 0 as number,
      ibanRaw: IBAN_RAW,
      amountOptions: [
        { label: "Frei",  value: 0 },
        { label: "€25",   value: 25 },
        { label: "€50",   value: 50 },
        { label: "€100",  value: 100 },
        { label: "€250",  value: 250 },
      ] as AmountOpt[],
    };
  },

  computed: {
    ibanGroups(): string[] {
      return groupIban(this.ibanRaw);
    },
    activeAmount(): number | null {
      return this.amount > 0 ? this.amount : null;
    },
    reference(): string {
      const title = this.option === 2 ? this.text[9]
        : this.option === 3 ? this.text[10]
        : this.text[8];
      if (title && typeof title === "string" && title.trim().length > 0) {
        return `Spende — ${title}`;
      }
      return "Spende Stiftung Tumaini";
    },
    detailRows(): Array<{ key: string; label: string; value: string; raw?: string; mono?: boolean }> {
      return [
        { key: "name", label: this.text[20] || "Empfänger", value: RECIPIENT },
        { key: "bank", label: this.text[21] || "Bank",      value: BANK },
        { key: "bic",  label: this.text[23] || "BIC",       value: BIC, mono: true },
      ];
    },
  },

  methods: {
    selectAmount(value: number) {
      this.amount = value;
      this.syncAmountToQuery();
    },
    syncAmountToQuery() {
      const q: Record<string, string> = { ...this.$route.query as Record<string, string> };
      if (this.amount > 0) {
        q.amount = String(this.amount);
      } else {
        delete q.amount;
      }
      this.$router.replace({ path: this.$route.path, query: q });
    },
    optionDefaultAmount(option: number): number {
      if (option === 2) return 25;
      if (option === 3) return 100;
      return 0;
    },
    applyAmountFromQuery() {
      const raw = this.$route.query.amount;
      const str = Array.isArray(raw) ? raw[0] : raw;
      if (!str) {
        this.amount = this.optionDefaultAmount(this.option);
        return;
      }
      const n = parseInt(str, 10);
      if (isNaN(n) || n <= 0) {
        this.amount = this.optionDefaultAmount(this.option);
        return;
      }
      this.amount = n;
    },
    async copy(key: string, value: string) {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      this.copied = key;
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => { this.copied = ""; }, 1800);
    },
    async renderQr() {
      const payload = buildEpcPayload(this.reference, this.activeAmount);
      this.qrSvg = await QRCode.toString(payload, {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 0,
        color: { dark: "#0C0D08", light: "#00000000" },
      });
    },
  },

  watch: {
    reference() { this.renderQr(); },
    activeAmount() { this.renderQr(); },
    '$route.query.amount'() { this.applyAmountFromQuery(); },
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
        await this.textObject.getContent('6a035adcf951d1f4c4d60732'),
        await this.textObject.getContent('6a035adcf951d1f4c4d60729'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072a'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072b'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072c'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072d'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072e'),
        await this.textObject.getContent('6a035adcf951d1f4c4d6072f'),
        await this.textObject.getContent('6a035adcf951d1f4c4d60730'),
        await this.textObject.getContent('6a035adcf951d1f4c4d60731'),
        await this.textObject.getContent('6a035f754049ea7b976f98ed'),
        await this.textObject.getContent('6a03612edf1ad8894b90f5c4'),
        await this.textObject.getContent('6a03612edf1ad8894b90f5c5'),
        await this.textObject.getContent('6a03612edf1ad8894b90f5c6'),
      ];

      if (isNaN(this.option)) this.option = 1;

      this.applyAmountFromQuery();
      await this.renderQr();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
});
</script>

<style lang="scss" scoped>
$serif: 'Instrument Serif', Georgia, serif;
$sans:  'DM Sans', system-ui, sans-serif;
$mono:  'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
$script:'Petemoss', 'Caveat', cursive;
$grain: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");

.spenden { overflow-x: clip; }

.spenden-hero {
  position: relative;
  padding: clamp(4rem, 9vw, 7rem) clamp(1.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem);

  &__grain {
    position: absolute; inset: 0; pointer-events: none;
    background-image: $grain;
    opacity: 0.35; mix-blend-mode: overlay;
  }

  &__glow {
    position: absolute;
    inset: -12% 30% auto -10%;
    height: 70%;
    background: radial-gradient(ellipse at left top,
      rgba(255, 164, 0, 0.22) 0%,
      rgba(200, 113, 46, 0.08) 32%,
      transparent 60%);
    filter: blur(8px);
    pointer-events: none;
    animation: heroGlowDrift 22s ease-in-out infinite;
  }

  &__shimmer {
    position: absolute;
    inset: -25%;
    pointer-events: none;
    background:
      radial-gradient(ellipse 55% 50% at 22% 18%, rgba(255, 200, 120, 0.16) 0%, transparent 62%),
      radial-gradient(ellipse 45% 40% at 72% 28%, rgba(255, 164, 0, 0.12) 0%, transparent 65%),
      radial-gradient(ellipse 50% 55% at 48% 70%, rgba(200, 113, 46, 0.10) 0%, transparent 70%),
      radial-gradient(ellipse 35% 30% at 85% 75%, rgba(255, 220, 160, 0.09) 0%, transparent 70%);
    filter: blur(36px) saturate(1.1);
    mix-blend-mode: screen;
    transform-origin: 45% 40%;
    animation: heroShimmer 34s ease-in-out infinite;
  }

  &__orb {
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
    filter: blur(56px);

    &--a {
      width: 340px; height: 340px;
      top: -90px; left: 10%;
      background: radial-gradient(circle, rgba(255, 164, 0, 0.40) 0%, rgba(255, 164, 0, 0.12) 38%, transparent 72%);
      opacity: 0.7;
      animation: orbFloatA 28s ease-in-out infinite;
    }
    &--b {
      width: 260px; height: 260px;
      top: 28%; left: 40%;
      background: radial-gradient(circle, rgba(200, 113, 46, 0.32) 0%, rgba(200, 113, 46, 0.1) 42%, transparent 72%);
      opacity: 0.55;
      animation: orbFloatB 36s ease-in-out infinite;
    }
  }

  &__inner { position: relative; max-width: 1200px; margin: 0 auto; }

  &__meta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-family: $sans;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    margin-bottom: clamp(1.25rem, 2vw, 1.75rem);
    opacity: 0; animation: fadeUp 0.6s ease-out 0.05s forwards;
  }
  &__dot {
    width: 6px; height: 6px; border-radius: 999px;
    background: var(--t-brand);
    box-shadow: 0 0 0 4px rgba(200, 113, 46, 0.18);
  }
  &__sep { color: rgba(255, 255, 255, 0.25); }
  &__meta-light { color: var(--t-text); letter-spacing: 0.18em; }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(3rem, 10vw, 8.5rem);
    line-height: 0.95;
    letter-spacing: -0.025em;
    color: var(--t-text);
    margin: 0 0 clamp(1.25rem, 2vw, 2rem);
    max-width: 14ch;
    background: linear-gradient(178deg,
      var(--t-text) 35%,
      rgba(255, 164, 0, 0.95) 90%,
      rgba(200, 113, 46, 0.7) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards;
  }

  &__lede {
    font-family: $sans;
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    line-height: 1.6;
    color: var(--t-text-secondary);
    max-width: 42ch;
    margin: 0 0 1rem;
    opacity: 0; animation: fadeUp 0.7s ease-out 0.3s forwards;
  }

  &__thanks {
    font-family: $serif;
    font-style: italic;
    font-size: clamp(1.1rem, 1.5vw, 1.25rem);
    color: var(--t-brand);
    margin: 0;
    opacity: 0; animation: fadeUp 0.7s ease-out 0.4s forwards;
  }
}

.spenden-iban {
  position: relative;
  padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 6vw, 5rem);
  max-width: 1400px; margin: 0 auto;

  &__label {
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    margin: 0 0 1rem;
  }

  &__poster {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: clamp(0.5rem, 1.6vw, 1.4rem);
    width: 100%;
    background: none; border: none; padding: 0;
    cursor: pointer;
    text-align: left;
    color: var(--t-text);
    transition: color 0.4s ease;

    &:hover {
      .spenden-iban__group { color: var(--t-text); }
      .spenden-iban__copy  { opacity: 1; transform: translateY(0); }
    }
  }

  &__group {
    font-family: $mono;
    font-weight: 500;
    font-size: clamp(1.6rem, 4.4vw, 3.4rem);
    line-height: 1;
    letter-spacing: -0.005em;
    color: rgba(255, 255, 255, 0.92);
    transition: color 0.4s ease;
    font-feature-settings: 'tnum' 1, 'ss01' 1;

    &:first-child { color: var(--t-brand); }
  }

  &__copy {
    position: relative;
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: $sans;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--t-border);
    margin-left: auto;
    align-self: center;
    opacity: 0;
    transform: translateY(2px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, color 0.3s ease;

    &-default, &-done { display: inline-flex; align-items: center; gap: 0.4rem; transition: opacity 0.2s ease; }
    &-done { position: absolute; inset: 0; justify-content: center; color: var(--t-brand); opacity: 0; }

    &.is-copied {
      color: var(--t-brand);
      background: rgba(255, 164, 0, 0.1);
      border-color: rgba(255, 164, 0, 0.4);
      opacity: 1; transform: translateY(0);

      .spenden-iban__copy-default { opacity: 0; }
      .spenden-iban__copy-done    { opacity: 1; }
    }
  }
}

.spenden-grid {
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vw, 7rem);

  &__inner {
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: clamp(2rem, 4vw, 4.5rem);
    align-items: start;

    @media (max-width: 920px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
}

.spenden-ticket {
  position: relative;
  background: linear-gradient(180deg, #fbf6ec 0%, #f4ecd9 100%);
  color: #2a2418;
  border-radius: 22px;
  padding: clamp(1.75rem, 3vw, 2.5rem) clamp(1.5rem, 2.5vw, 2.25rem);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 30px 70px -30px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  transform: rotate(-0.6deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0; animation: fadeUp 0.7s ease-out 0.45s forwards;

  &:hover { transform: rotate(0deg) translateY(-2px); }

  &__grain {
    position: absolute; inset: 0;
    background-image: $grain;
    opacity: 0.55; mix-blend-mode: multiply;
    pointer-events: none;
    border-radius: inherit;
  }

  &__perfs {
    position: absolute;
    top: 0; bottom: 0; left: -8px;
    width: 16px;
    background: radial-gradient(circle at center, var(--t-bg) 6px, transparent 6.5px);
    background-size: 16px 22px;
    background-repeat: repeat-y;
    pointer-events: none;
  }

  &__head {
    position: relative;
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px dashed rgba(42, 36, 24, 0.25);
  }

  &__eyebrow {
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(42, 36, 24, 0.65);
    margin: 0.5rem 0 0;
  }

  &__mark {
    margin: 0;
    text-align: right;
    line-height: 1.05;
    display: flex; flex-direction: column;
    flex-shrink: 0;
  }

  &__mark-italic {
    font-family: $serif;
    font-style: italic;
    font-size: 0.9rem;
    color: rgba(42, 36, 24, 0.55);
    letter-spacing: 0.01em;
  }

  &__mark-bold {
    font-family: $serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--t-brand);
    letter-spacing: -0.01em;
  }

  &__rows {
    position: relative;
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }

  &__row {
    border-bottom: 1px dashed rgba(42, 36, 24, 0.18);
    &:last-child { border-bottom: none; }
  }

  &__row-btn {
    position: relative;
    display: grid;
    grid-template-columns: 36px auto 1fr auto;
    align-items: center;
    gap: 0.85rem;
    padding: 0.95rem 0.5rem;
    width: 100%;
    background: transparent;
    border: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease, padding 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    font-family: inherit;

    &:hover {
      background: rgba(200, 113, 46, 0.07);
      .spenden-ticket__hint { opacity: 1; transform: translateX(0); }
    }

    &.is-copied {
      background: rgba(255, 164, 0, 0.16);
      .spenden-ticket__hint-default { opacity: 0; }
      .spenden-ticket__hint-done    { opacity: 1; }
    }
  }

  &__hint {
    position: relative;
    font-family: $sans;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(42, 36, 24, 0.45);
    min-width: 60px;
    text-align: right;
    opacity: 0;
    transform: translateX(4px);
    transition: opacity 0.25s ease, transform 0.25s ease;

    &-default, &-done {
      display: inline-block;
      transition: opacity 0.2s ease;
    }
    &-done {
      position: absolute;
      inset: 0;
      color: var(--t-brand);
      opacity: 0;
      text-align: right;
    }

    &--foot {
      position: absolute;
      top: 1.25rem; right: 0;
      opacity: 0;
    }
  }

  &__num {
    font-family: $mono;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(42, 36, 24, 0.4);
  }

  &__label {
    font-family: $sans;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(42, 36, 24, 0.55);
  }

  &__value {
    font-family: $serif;
    font-size: 1.25rem;
    line-height: 1.1;
    color: #2a2418;
    text-align: right;
    justify-self: end;
    max-width: 22ch;

    &--mono {
      font-family: $mono;
      font-size: 1rem;
      letter-spacing: 0.05em;
    }
  }

  &__foot {
    position: relative;
    margin-top: 1.5rem;
    padding: 1.25rem 0.5rem 0.5rem;
    border-top: 1px dashed rgba(42, 36, 24, 0.25);
    display: flex; flex-direction: column; gap: 0.35rem;
    background: transparent;
    border-radius: 0 0 8px 8px;
    border-left: none; border-right: none; border-bottom: none;
    text-align: left;
    width: 100%;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(200, 113, 46, 0.07);
      .spenden-ticket__hint--foot { opacity: 1; }
    }
    &.is-copied {
      background: rgba(255, 164, 0, 0.16);
      .spenden-ticket__hint-default { opacity: 0; }
      .spenden-ticket__hint-done    { opacity: 1; }
    }
  }

  &__foot-label {
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(42, 36, 24, 0.55);
  }

  &__foot-value {
    font-family: $serif;
    font-style: italic;
    font-size: 1.15rem;
    color: #2a2418;
  }
}

.spenden-qr {
  position: relative;
  display: flex; flex-direction: column;
  gap: clamp(1.25rem, 2vw, 1.75rem);
  opacity: 0; animation: fadeUp 0.7s ease-out 0.55s forwards;

  &__amounts {
    display: flex; flex-wrap: wrap; align-items: center;
    gap: 0.5rem 0.5rem;
  }

  &__amounts-label {
    font-family: $sans;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    margin-right: 0.4rem;
  }

  &__chip {
    font-family: $sans;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--t-text-secondary);
    padding: 0.5rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--t-border);
    background: transparent;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

    &:hover { color: var(--t-text); border-color: rgba(255, 164, 0, 0.4); }

    &.is-active {
      color: var(--t-bg);
      background: var(--t-brand);
      border-color: var(--t-brand);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px -8px rgba(255, 164, 0, 0.55);
    }
  }

  &__custom {
    font-family: $mono;
    font-size: 0.875rem;
    width: 100px;
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    border: 1px solid var(--t-brand);
    background: rgba(255, 164, 0, 0.08);
    color: var(--t-text);
    outline: none;

    &::placeholder { color: var(--t-text-secondary); }
    &:focus { border-color: var(--t-brand); box-shadow: 0 0 0 3px rgba(255, 164, 0, 0.2); }
  }

  &__frame {
    position: relative;
    align-self: flex-start;
    width: min(360px, 100%);
    aspect-ratio: 1;
    padding: 1.5rem;
    background: linear-gradient(180deg, #fefdf8 0%, #f6f0e0 100%);
    border-radius: 26px;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.7) inset,
      0 30px 70px -28px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(200, 113, 46, 0.18);
    transform: rotate(1.5deg);
    transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
    animation: float 8s ease-in-out infinite;

    &:hover { transform: rotate(0deg) translateY(-3px); }
  }

  &__svg {
    position: relative;
    width: 100%; height: 100%;
    :deep(svg) { width: 100%; height: 100%; display: block; }
  }

  &__corners {
    position: absolute;
    top: -10px; left: -10px; right: -10px; bottom: -10px;
    pointer-events: none;

    span {
      position: absolute;
      width: 22px; height: 22px;
      border: 2.5px solid var(--t-brand);

      &:nth-child(1) { top: 0; left: 0; border-right: none; border-bottom: none; border-top-left-radius: 6px; }
      &:nth-child(2) { top: 0; right: 0; border-left: none; border-bottom: none; border-top-right-radius: 6px; }
      &:nth-child(3) { bottom: 0; left: 0; border-right: none; border-top: none; border-bottom-left-radius: 6px; }
      &:nth-child(4) { bottom: 0; right: 0; border-left: none; border-top: none; border-bottom-right-radius: 6px; }
    }
  }

  &__badge {
    position: absolute;
    top: -10px; right: 18px;
    font-family: $sans;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--t-bg);
    background: var(--t-brand);
    padding: 0.3rem 0.55rem;
    border-radius: 4px;
    box-shadow: 0 6px 14px -6px rgba(255, 164, 0, 0.5);
  }

  &__hint {
    margin: 0;
    max-width: 18ch;
    align-self: flex-start;
  }

  &__hint-script {
    font-family: $script, $serif;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--t-text-secondary);
    line-height: 1.2;
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: rotate(1.5deg) translateY(0); }
  50%      { transform: rotate(1deg) translateY(-4px); }
}
@keyframes heroGlowDrift {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
  30%      { transform: translate(5%, 3%) scale(1.1); opacity: 0.82; }
  60%      { transform: translate(-4%, 4%) scale(0.94); opacity: 1; }
}
@keyframes heroShimmer {
  0%, 100% { transform: translate(0, 0)    scale(1)    rotate(0deg);  opacity: 1; }
  20%      { transform: translate(2%, -1%) scale(1.06) rotate(2deg);  opacity: 0.78; }
  45%      { transform: translate(-2%, 3%) scale(1.12) rotate(-1.5deg); opacity: 1; }
  70%      { transform: translate(3%, 1%)  scale(0.94) rotate(1deg);  opacity: 0.88; }
}
@keyframes orbFloatA {
  0%, 100% { transform: translate(0, 0)     scale(1);   opacity: 0.7; }
  33%      { transform: translate(30px, 22px) scale(1.05); opacity: 0.6; }
  66%      { transform: translate(-18px, 14px) scale(0.95); opacity: 0.75; }
}
@keyframes orbFloatB {
  0%, 100% { transform: translate(0, 0)        scale(1);   opacity: 0.55; }
  40%      { transform: translate(-26px, -18px) scale(1.12); opacity: 0.7; }
  80%      { transform: translate(14px, 22px)   scale(0.9);  opacity: 0.5; }
}
@media (prefers-reduced-motion: reduce) {
  .spenden-hero__glow, .spenden-hero__shimmer, .spenden-hero__orb, .spenden-qr__frame { animation: none !important; }
}

.spenden-partner {
  position: relative;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 5rem);
  overflow: hidden;

  &__grain {
    position: absolute; inset: 0;
    background-image: $grain;
    opacity: 0.18; mix-blend-mode: overlay;
    pointer-events: none;
  }

  &__inner {
    position: relative;
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: center;

    @media (max-width: 880px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__media {
    position: relative;
    display: inline-block;
    justify-self: start;
    transform: rotate(-1.2deg);
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(255, 164, 0, 0.25);
      border-radius: 18px;
      pointer-events: none;
    }

    &:hover { transform: rotate(0deg) translateY(-2px); }
  }

  &__image {
    display: block;
    width: 100%;
    max-width: 380px;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);
    filter: saturate(1.05) contrast(1.02);
  }

  &__caption {
    position: absolute;
    bottom: -14px; right: 10px;
    font-family: $script, $serif;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--t-brand);
    background: var(--t-bg);
    padding: 0.15rem 0.5rem;
    transform: rotate(2deg);
  }

  &__copy { max-width: 48ch; }

  &__eyebrow {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-family: $sans;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    margin: 0 0 1rem;
  }

  &__dot {
    width: 6px; height: 6px; border-radius: 999px;
    background: var(--t-brand);
    box-shadow: 0 0 0 4px rgba(200, 113, 46, 0.18);
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--t-text);
    margin: 0 0 clamp(1rem, 2vw, 1.5rem);
    background: linear-gradient(180deg, var(--t-text) 50%, rgba(255, 164, 0, 0.85) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__text {
    font-family: $sans;
    font-size: clamp(1rem, 1.4vw, 1.125rem);
    line-height: 1.65;
    color: var(--t-text-secondary);
    margin: 0;
  }
}

.spenden-projects {
  position: relative;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 5rem) clamp(5rem, 9vw, 8rem);
  max-width: 1400px;
  margin: 0 auto;

  &__head {
    max-width: 1200px;
    margin: 0 auto clamp(2.5rem, 4vw, 4rem);
    display: flex; flex-direction: column;
    align-items: flex-start;
  }

  &__eyebrow {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-family: $sans;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--t-text-secondary);
    margin: 0 0 1rem;
  }

  &__dot {
    width: 6px; height: 6px; border-radius: 999px;
    background: var(--t-brand);
    box-shadow: 0 0 0 4px rgba(200, 113, 46, 0.18);
  }

  &__title {
    font-family: $serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2.25rem, 5vw, 4rem);
    line-height: 1.02;
    letter-spacing: -0.02em;
    color: var(--t-text);
    margin: 0;
    max-width: 16ch;
    background: linear-gradient(180deg, var(--t-text) 50%, rgba(255, 164, 0, 0.85) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: clamp(1.5rem, 2.5vw, 2.25rem);
  }

  &__card {
    opacity: 0;
    animation: fadeUp 0.7s ease-out forwards;
    animation-delay: calc(var(--idx, 0) * 80ms + 100ms);
    transition: transform 0.4s var(--t-ease, ease), box-shadow 0.4s var(--t-ease, ease);

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.45);
    }
  }
}
</style>
