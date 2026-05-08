<template>
  <div>
  <Header/>
  <main class="archive" ref="archiveRef">
    <!-- Hero Section with Page Title -->
    <section class="archive__hero reveal">
      <div class="archive__hero-content">
        <h1 class="archive__hero-title">{{ pageTitle }}</h1>
      </div>
    </section>

    <div class="archive__container">
      <!-- Category Tabs -->
      <nav class="archive__tabs reveal">
        <button
          :class="['archive__tab', { 'archive__tab--active': currentPage === 'berichte' }]"
          @click="switchCategory('berichte')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Berichte
          <span class="archive__tab-count">{{ reports.length }}</span>
        </button>
        <button
          :class="['archive__tab', { 'archive__tab--active': currentPage === 'projekte' }]"
          @click="switchCategory('projekte')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          Projekte
          <span class="archive__tab-count">{{ projects.length }}</span>
        </button>
      </nav>

      <!-- Search and Filter Bar -->
      <div class="archive__toolbar reveal">
        <div class="archive__search">
          <svg class="archive__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="currentPage === 'projekte' ? 'Projekte durchsuchen...' : 'Berichte durchsuchen...'"
            class="archive__search-input"
          />
          <button
            v-if="searchQuery"
            class="archive__search-clear"
            @click="searchQuery = ''"
            aria-label="Suche leeren"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="archive__sort">
          <select v-model="sortOption">
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Alteste zuerst</option>
            <option value="alphabetical">Alphabetisch</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="archive__loading">
        <div class="archive__spinner"></div>
        <p>Inhalte werden geladen...</p>
      </div>

      <!-- Content Section -->
      <section v-else class="archive__content">
        <!-- Featured Article (Latest) -->
        <article
          v-if="featuredItem && !searchQuery"
          class="archive__featured reveal"
          @click="navigateToItem(featuredItem)"
        >
          <div
            class="archive__featured-image"
            :style="cardImageStyle(featuredItem.image)"
          >
            <span class="archive__featured-badge">
              {{ currentPage === 'projekte' ? 'Aktuelles Projekt' : 'Neuester Bericht' }}
            </span>
          </div>
          <div class="archive__featured-content">
            <div class="archive__featured-meta">
              <time v-if="featuredItem.created">
                {{ formatDate(featuredItem.created) }}
              </time>
            </div>
            <h2 class="archive__featured-title">{{ localized(featuredItem.title, 'strict') }}</h2>
            <p class="archive__featured-subtitle" v-if="featuredItem.subheader">
              {{ localized(featuredItem.subheader, 'strict') }}
            </p>
            <ul class="archive__featured-points" v-if="featuredItem.mainPoints && featuredItem.mainPoints.length">
              <li v-for="(point, index) in featuredItem.mainPoints.slice(0, 3)" :key="index">
                {{ localized(point, 'strict') }}
              </li>
            </ul>
            <p class="archive__featured-excerpt" v-else-if="getExcerpt(featuredItem)">
              {{ getExcerpt(featuredItem) }}
            </p>
            <span class="archive__featured-cta">
              {{ currentPage === 'projekte' ? 'Projekt ansehen' : 'Bericht lesen' }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </div>
        </article>

        <!-- Results Count -->
        <div class="archive__results-info" v-if="searchQuery && currentItems.length > 0">
          <p>{{ currentItems.length }} {{ currentItems.length === 1 ? 'Ergebnis' : 'Ergebnisse' }} gefunden</p>
        </div>

        <!-- Grid of Articles -->
        <div
          v-if="displayItems.length"
          class="archive__grid"
          :class="{ 'archive__grid--full': searchQuery }"
        >
          <article
            v-for="(item, index) in displayItems"
            :key="String(item._id)"
            class="archive__card reveal-stagger"
            :data-index="index"
            @click="navigateToItem(item)"
          >
            <div
              class="archive__card-image"
              :style="cardImageStyle(item.image)"
            ></div>
            <div class="archive__card-content">
              <time class="archive__card-date" v-if="item.created">
                {{ formatDate(item.created) }}
              </time>
              <h3 class="archive__card-title">{{ localized(item.title, 'strict') }}</h3>
              <p class="archive__card-subtitle" v-if="item.subheader">
                {{ truncateText(localized(item.subheader, 'strict'), 80) }}
              </p>
              <p class="archive__card-excerpt" v-else-if="getExcerpt(item)">
                {{ truncateText(getExcerpt(item), 100) }}
              </p>
              <span class="archive__card-link">
                Weiterlesen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading" class="archive__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3>Keine Ergebnisse gefunden</h3>
          <p v-if="searchQuery">
            Fur "{{ searchQuery }}" wurden keine {{ currentPage === 'projekte' ? 'Projekte' : 'Berichte' }} gefunden.
          </p>
          <p v-else>
            Es sind noch keine {{ currentPage === 'projekte' ? 'Projekte' : 'Berichte' }} verfugbar.
          </p>
          <button v-if="searchQuery" class="archive__empty-btn" @click="searchQuery = ''">
            Suche zurucksetzen
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreItems" class="archive__load-more">
          <button @click="loadMore" class="archive__load-more-btn">
            Mehr laden
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  </main>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import Header from "@/components/Header.vue";
import {IArticle} from "../../api/models/article";
import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import {sortArticles} from "@/utils/dates";
import {useReveal} from "@/composables/useReveal";
import {getBackgroundPosition} from "@/utils/focalPoint";

interface State {
  currentPage: string;
  pageTitle: string;
  projects: IArticle[];
  reports: IArticle[];
  isLoading: boolean;
  searchQuery: string;
  sortOption: 'newest' | 'oldest' | 'alphabetical';
  pageTitles: {
    projects: string;
    reports: string;
  };
  itemsPerPage: number;
  displayCount: number;
  textObject: any;
}

export default defineComponent({
  name: "ArchivView",
  components: {Header},

  setup() {
    const archiveRef = ref<HTMLElement | null>(null);
    useReveal(archiveRef);
    return { archiveRef };
  },

  data(): State {
    return {
      currentPage: this.$router.currentRoute.value.params.page as string || 'berichte',
      pageTitle: '',
      projects: [] as IArticle[],
      reports: [] as IArticle[],
      isLoading: true,
      searchQuery: '',
      sortOption: 'newest',
      pageTitles: {
        projects: 'Projekte',
        reports: 'Berichte'
      },
      itemsPerPage: 6,
      displayCount: 6,
      textObject: this.textObject
    };
  },

  computed: {
    currentItems(): IArticle[] {
      // Vue Options-API `this` widens the IArticle Document type at access time;
      // re-narrow before passing to typed helpers.
      const items = (this.currentPage === 'projekte' ? this.projects : this.reports) as IArticle[];
      return this.filterAndSortItems(items);
    },

    featuredItem(): IArticle | null {
      if (this.currentItems.length === 0) return null;
      return this.currentItems[0];
    },

    displayItems(): IArticle[] {
      // Skip the first item (featured) unless searching
      const startIndex = this.searchQuery ? 0 : 1;
      return this.currentItems.slice(startIndex, startIndex + this.displayCount);
    },

    hasMoreItems(): boolean {
      const startIndex = this.searchQuery ? 0 : 1;
      return this.currentItems.length > startIndex + this.displayCount;
    }
  },

  watch: {
    searchQuery() {
      this.displayCount = this.itemsPerPage;
    },

    sortOption() {
      this.displayCount = this.itemsPerPage;
    },

    currentPage() {
      this.displayCount = this.itemsPerPage;
      this.searchQuery = '';
      this.updatePageTitle();
    },

    $route(to) {
      if (to.params && to.params.page) {
        this.currentPage = to.params.page as string;
      }
    }
  },

  methods: {
    cardImageStyle(image?: string): Record<string, string> {
      const url = image || 'https://files.tumaini.be/default_project_picture.webp';
      return {
        backgroundImage: `url(${url})`,
        backgroundPosition: getBackgroundPosition(url, 'safe'),
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      };
    },

    // Bilingual support methods (from Bericht.vue)
    looksGerman(text: string): boolean {
      const germanIndicators = /\b(und|der|die|das|ist|mit|fur|auf|ein|eine|einer|haben|wird|sind|nach|auch|oder|bei|nur|uber|noch|ihre?|unser|wir|zur?|vom|den|dem|des|wurde|hat|kann|sehr|neue?n?|erste?n?)\b|[aouAOU]/i;
      return germanIndicators.test(text);
    },

    looksEnglish(text: string): boolean {
      const englishIndicators = /\b(the|and|is|are|was|were|with|for|our|their|have|has|from|this|that|which|will|been|also|new|first|after|about|into|more|school|children|project)\b/i;
      return englishIndicators.test(text);
    },

    isBilingualSplit(left: string, right: string): boolean {
      const leftGerman = this.looksGerman(left);
      const rightEnglish = this.looksEnglish(right);
      return leftGerman && rightEnglish;
    },

    localized(text: string, mode: 'strict' | 'smart' = 'smart'): string {
      if (!text) return '';

      const lang = this.textObject?.language || 'DE';
      const isEnglish = lang === 'EN';

      const separator = ' - ';
      const dashCount = (text.match(/ - /g) || []).length;

      if (dashCount === 0) return text;

      const lastIndex = text.lastIndexOf(separator);
      const left = text.slice(0, lastIndex);
      const right = text.slice(lastIndex + separator.length);

      if (mode === 'smart') {
        if (left.length < 3 || right.length < 3) return text;
        const ratio = left.length / right.length;
        if (ratio > 3 || ratio < 0.33) return text;
        if (dashCount > 2) return text;
        if (!this.isBilingualSplit(left, right)) return text;
      }

      return isEnglish ? right : left;
    },

    async fetchData(): Promise<void> {
      this.isLoading = true;
      try {
        const [projectsResponse, reportsResponse] = await Promise.all([
          axiosGet('/content/article/material/PROJECT/published'),
          axiosGet('/content/article/material/REPORT/published')
        ]);

        this.projects = (projectsResponse.data as IArticle[]).sort(sortArticles);
        this.reports = (reportsResponse.data as IArticle[]).sort(sortArticles);

        await this.fetchPageTitles();
        this.updatePageTitle();
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPageTitles(): Promise<void> {
      try {
        this.pageTitles = {
          projects: await this.textObject.getContent('61d56537cc3bfb06f031f996'),
          reports: await this.textObject.getContent('61d56537cc3bfb06f031f997')
        };
      } catch (error) {
        console.error('Error fetching page titles:', error);
      }
    },

    updatePageTitle(): void {
      if (this.currentPage) {
        this.pageTitle = this.currentPage.toLowerCase() === 'projekte'
          ? this.pageTitles.projects
          : this.pageTitles.reports;
      } else {
        this.pageTitle = this.pageTitles.reports || 'Berichte';
      }
    },

    getExcerpt(item: IArticle): string {
      if (!item.content || !item.content[0] || !item.content[0].text) {
        return '';
      }
      const text = item.content[0].text;
      const words = text.split(' ');
      return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
    },

    truncateText(text: string, maxLength: number): string {
      if (!text || text.length <= maxLength) return text;
      return text.slice(0, maxLength).trim() + '...';
    },

    formatDate(dateString: string | Date): string {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },

    filterAndSortItems(items: IArticle[]): IArticle[] {
      let result = items;

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          (item.subheader && item.subheader.toLowerCase().includes(query)) ||
          (item.content && item.content.some(contentElem =>
            contentElem && contentElem.text &&
            contentElem.text.toLowerCase().includes(query)
          ))
        );
      }

      switch (this.sortOption) {
        case 'newest':
          return [...result].sort((a, b) => sortArticles(a, b));
        case 'oldest':
          return [...result].sort((a, b) => sortArticles(b, a));
        case 'alphabetical':
          return [...result].sort((a, b) => a.title.localeCompare(b.title));
        default:
          return result;
      }
    },

    navigateToItem(item: IArticle): void {
      const path = this.currentPage === 'projekte'
        ? `/project/${item._id}`
        : `/bericht/${item._id}`;
      this.$router.push(path);
    },

    switchCategory(category: string): void {
      this.currentPage = category;
      this.$router.push(`/archiv/${category}`);
    },

    loadMore(): void {
      this.displayCount += this.itemsPerPage;
    }
  },

  async mounted() {
    await this.fetchData();
  }
});
</script>

<style lang="scss">
.archive {
  min-height: 100vh;

  // Hero Section
  &__hero {
    padding: var(--t-spacing-2xl) var(--t-spacing-sm) var(--t-spacing-md);
    text-align: center;

    @media (min-width: 768px) {
      padding: 6rem var(--t-spacing-lg) var(--t-spacing-lg);
    }

    &-content {
      max-width: 800px;
      margin: 0 auto;
    }

    &-title {
      font-family: 'Instrument Serif', Georgia, serif;
      font-weight: 400;
      font-size: 1.75rem;
      color: var(--t-text);
      margin-bottom: var(--t-spacing-xs);
      text-transform: capitalize;

      @media (min-width: 768px) {
        font-size: 2.25rem;
      }
    }

  }

  // Container
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--t-spacing-md) var(--t-spacing-sm);

    @media (min-width: 768px) {
      padding: var(--t-spacing-lg) var(--t-spacing-md);
    }
  }

  // Category Tabs
  &__tabs {
    display: flex;
    gap: var(--t-spacing-xs);
    margin-bottom: var(--t-spacing-md);
    padding: 0.25rem;
    background: color-mix(in srgb, var(--t-bg-card) 50%, transparent);
    border-radius: var(--t-radius-lg);
    border: 1px solid color-mix(in srgb, var(--t-brand) 10%, transparent);

    @media (min-width: 768px) {
      display: inline-flex;
      margin-bottom: var(--t-spacing-lg);
    }
  }

  &__tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--t-spacing-xs);
    padding: 0.875rem var(--t-spacing-sm);
    border: none;
    background: transparent;
    color: var(--t-text-muted);
    font-size: 0.9375rem;
    font-weight: 500;
    border-radius: var(--t-radius-md);
    cursor: pointer;
    transition: all var(--t-duration-base) var(--t-ease);

    @media (min-width: 768px) {
      flex: none;
      padding: 0.875rem var(--t-spacing-md);
    }

    svg {
      opacity: 0.6;
      transition: opacity var(--t-duration-base) var(--t-ease);
    }

    &:hover:not(&--active) {
      color: var(--t-text-secondary);
      background: color-mix(in srgb, var(--t-brand) 5%, transparent);

      svg {
        opacity: 0.8;
      }
    }

    &--active {
      background: var(--t-brand);
      color: white;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--t-brand) 30%, transparent);

      svg {
        opacity: 1;
      }

      .archive__tab-count {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
    }

    &-count {
      font-size: 0.75rem;
      padding: 0.125rem var(--t-spacing-xs);
      background: color-mix(in srgb, var(--t-brand) 15%, transparent);
      color: var(--t-brand);
      border-radius: var(--t-radius-md);
      font-weight: 600;
    }
  }

  // Toolbar (Search + Sort)
  &__toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--t-spacing-sm);
    margin-bottom: var(--t-spacing-lg);

    @media (min-width: 640px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__search {
    position: relative;
    flex: 1;
    max-width: 100%;

    @media (min-width: 640px) {
      max-width: 400px;
    }

    &-icon {
      position: absolute;
      left: var(--t-spacing-sm);
      top: 50%;
      transform: translateY(-50%);
      color: var(--t-text-muted);
      pointer-events: none;
    }

    &-input {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem 3rem;
      background: var(--t-bg-card);
      border: 1.5px solid color-mix(in srgb, var(--t-brand) 20%, transparent);
      border-radius: var(--t-radius-md);
      color: var(--t-text);
      font-size: 0.9375rem;
      transition: border-color var(--t-duration-base) var(--t-ease), box-shadow var(--t-duration-base) var(--t-ease);

      &::placeholder {
        color: var(--t-text-muted);
      }

      &:focus {
        outline: none;
        border-color: var(--t-brand);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-brand) 15%, transparent);
      }
    }

    &-clear {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      background: color-mix(in srgb, var(--t-text) 10%, transparent);
      border: none;
      border-radius: 50%;
      color: var(--t-text-muted);
      cursor: pointer;
      transition: all var(--t-duration-base) var(--t-ease);

      &:hover {
        background: color-mix(in srgb, var(--t-text) 20%, transparent);
        color: var(--t-text);
      }
    }
  }

  &__sort {
    select {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem var(--t-spacing-sm);
      background: var(--t-bg-card);
      border: 1.5px solid color-mix(in srgb, var(--t-brand) 20%, transparent);
      border-radius: var(--t-radius-md);
      color: var(--t-text);
      font-size: 0.9375rem;
      cursor: pointer;
      transition: border-color var(--t-duration-base) var(--t-ease);
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c8712e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.875rem center;
      background-size: 1rem;

      @media (min-width: 640px) {
        width: auto;
        min-width: 180px;
      }

      &:focus {
        outline: none;
        border-color: var(--t-brand);
      }
    }
  }

  // Loading State
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--t-spacing-2xl) var(--t-spacing-lg);
    text-align: center;

    p {
      margin-top: var(--t-spacing-sm);
      color: var(--t-text-muted);
      font-size: 0.9375rem;
    }
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid color-mix(in srgb, var(--t-brand) 20%, transparent);
    border-radius: 50%;
    border-top-color: var(--t-brand);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  // Featured Article
  &__featured {
    display: grid;
    grid-template-columns: 1fr;
    background: var(--t-bg-card);
    border-radius: var(--t-radius-xl);
    overflow: hidden;
    margin-bottom: var(--t-spacing-lg);
    cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--t-brand) 10%, transparent);
    transition: transform var(--t-duration-medium) var(--t-ease-out), box-shadow var(--t-duration-medium) var(--t-ease-out), border-color var(--t-duration-medium) var(--t-ease-out);

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      margin-bottom: var(--t-spacing-xl);
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      border-color: color-mix(in srgb, var(--t-brand) 30%, transparent);

      .archive__featured-image {
        &::after {
          opacity: 0.2;
        }
      }

      .archive__featured-cta svg {
        transform: translateX(4px);
      }
    }

    &-image {
      position: relative;
      height: 220px;
      background-size: cover;
      background-position: center;

      @media (min-width: 768px) {
        height: 100%;
        min-height: 360px;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--t-brand);
        opacity: 0;
        transition: opacity var(--t-duration-medium) var(--t-ease-out);
      }
    }

    &-badge {
      position: absolute;
      top: var(--t-spacing-sm);
      left: var(--t-spacing-sm);
      padding: var(--t-spacing-xs) var(--t-spacing-sm);
      background: var(--t-brand);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: var(--t-radius-sm);
      z-index: 1;
    }

    &-content {
      padding: var(--t-spacing-md);
      display: flex;
      flex-direction: column;

      @media (min-width: 768px) {
        padding: var(--t-spacing-lg);
        justify-content: center;
      }
    }

    &-meta {
      margin-bottom: var(--t-spacing-sm);

      time {
        font-size: 0.8125rem;
        color: var(--t-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
    }

    &-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--t-text);
      margin: 0 0 var(--t-spacing-sm);
      line-height: 1.3;

      @media (min-width: 768px) {
        font-size: 1.75rem;
      }
    }

    &-subtitle {
      font-size: 1rem;
      color: var(--t-text-secondary);
      margin: 0 0 var(--t-spacing-sm);
      line-height: 1.5;
    }

    &-points {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--t-spacing-md);

      li {
        position: relative;
        padding-left: var(--t-spacing-sm);
        margin-bottom: var(--t-spacing-xs);
        font-size: 0.9375rem;
        color: var(--t-text-secondary);
        line-height: 1.5;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 6px;
          height: 6px;
          background: var(--t-brand);
          border-radius: 50%;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &-excerpt {
      font-size: 0.9375rem;
      color: var(--t-text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--t-spacing-md);
    }

    &-cta {
      display: inline-flex;
      align-items: center;
      gap: var(--t-spacing-xs);
      color: var(--t-brand);
      font-weight: 600;
      font-size: 0.9375rem;
      margin-top: auto;

      svg {
        transition: transform var(--t-duration-base) var(--t-ease);
      }
    }
  }

  // Results Info
  &__results-info {
    margin-bottom: var(--t-spacing-md);

    p {
      font-size: 0.9375rem;
      color: var(--t-text-muted);
      margin: 0;
    }
  }

  // Grid
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--t-spacing-md);

    @media (min-width: 540px) {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--t-spacing-md);
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--t-spacing-lg);
    }

    &--full {
      @media (min-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  // Card
  &__card {
    display: flex;
    flex-direction: column;
    background: var(--t-bg-card);
    border-radius: var(--t-radius-lg);
    overflow: hidden;
    cursor: pointer;
    border: 1px solid var(--t-border-light);
    transition: transform var(--t-duration-medium) var(--t-ease-out), box-shadow var(--t-duration-medium) var(--t-ease-out), border-color var(--t-duration-medium) var(--t-ease-out);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
      border-color: color-mix(in srgb, var(--t-brand) 20%, transparent);

      .archive__card-image {
        &::after {
          opacity: 0.15;
        }
      }

      .archive__card-link svg {
        transform: translateX(3px);
      }
    }

    &-image {
      position: relative;
      height: 160px;
      background-size: cover;
      background-position: center;

      @media (min-width: 768px) {
        height: 180px;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, var(--t-bg-card) 0%, transparent 50%);
        opacity: 0.8;
        transition: opacity var(--t-duration-medium) var(--t-ease-out);
      }
    }

    &-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: var(--t-spacing-md);

      @media (min-width: 768px) {
        padding: var(--t-spacing-md);
      }
    }

    &-date {
      display: block;
      font-size: 0.75rem;
      color: var(--t-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: var(--t-spacing-xs);
    }

    &-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--t-text);
      margin: 0 0 var(--t-spacing-xs);
      line-height: 1.35;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }
    }

    &-subtitle,
    &-excerpt {
      font-size: 0.875rem;
      color: var(--t-text-secondary);
      line-height: 1.55;
      margin: 0 0 var(--t-spacing-sm);
      flex: 1;
    }

    &-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--t-brand);
      font-weight: 600;
      font-size: 0.875rem;
      margin-top: auto;

      svg {
        transition: transform var(--t-duration-base) var(--t-ease);
      }
    }
  }

  // Empty State
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--t-spacing-2xl) var(--t-spacing-lg);
    background: color-mix(in srgb, var(--t-bg-card) 50%, transparent);
    border-radius: var(--t-radius-xl);
    border: 1px solid var(--t-border-light);

    svg {
      color: color-mix(in srgb, var(--t-brand) 40%, transparent);
      margin-bottom: var(--t-spacing-md);
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--t-text);
      margin: 0 0 var(--t-spacing-xs);
    }

    p {
      font-size: 0.9375rem;
      color: var(--t-text-muted);
      margin: 0 0 var(--t-spacing-md);
      max-width: 400px;
    }

    &-btn {
      padding: var(--t-spacing-sm) var(--t-spacing-md);
      background: var(--t-brand);
      color: white;
      border: none;
      border-radius: var(--t-radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color var(--t-duration-base) var(--t-ease), transform var(--t-duration-base) var(--t-ease);

      &:hover {
        filter: brightness(0.85);
        transform: translateY(-1px);
      }
    }
  }

  // Load More
  &__load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--t-spacing-xl);

    &-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--t-spacing-xs);
      padding: 0.875rem var(--t-spacing-lg);
      background: var(--t-brand);
      color: white;
      border: none;
      border-radius: var(--t-radius-md);
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all var(--t-duration-base) var(--t-ease);

      &:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px color-mix(in srgb, var(--t-brand) 30%, transparent);
      }
    }
  }
}
</style>
