<template>
  <Header/>
  <main class="archive">
    <!-- Hero Section with Page Title -->
    <section class="archive__hero">
      <div class="archive__hero-content">
        <h1 class="archive__hero-title">{{ pageTitle }}</h1>
      </div>
    </section>

    <div class="archive__container">
      <!-- Category Tabs -->
      <nav class="archive__tabs">
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
      <div class="archive__toolbar">
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
          class="archive__featured"
          @click="navigateToItem(featuredItem)"
        >
          <div
            class="archive__featured-image"
            :style="{ backgroundImage: `url(${featuredItem.image || 'https://files.tumaini.be/default_project_picture.webp'})` }"
          >
            <span class="archive__featured-badge">
              {{ currentPage === 'projekte' ? 'Aktuelles Projekt' : 'Neuester Bericht' }}
            </span>
          </div>
          <div class="archive__featured-content">
            <div class="archive__featured-meta">
              <time v-if="featuredItem.createdAt || featuredItem.created">
                {{ formatDate(featuredItem.createdAt || featuredItem.created) }}
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
            v-for="item in displayItems"
            :key="item._id"
            class="archive__card"
            @click="navigateToItem(item)"
          >
            <div
              class="archive__card-image"
              :style="{ backgroundImage: `url(${item.image || 'https://files.tumaini.be/default_project_picture.webp'})` }"
            ></div>
            <div class="archive__card-content">
              <time class="archive__card-date" v-if="item.createdAt || item.created">
                {{ formatDate(item.createdAt || item.created) }}
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
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import {IArticle} from "../../api/models/article";
import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import {sortArticles} from "@/utils/dates";

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
      const items = this.currentPage === 'projekte' ? this.projects : this.reports;
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

        this.projects = projectsResponse.data.sort((a: IArticle, b: IArticle) =>
          sortArticles(a, b)
        );

        this.reports = reportsResponse.data.sort((a: IArticle, b: IArticle) =>
          sortArticles(a, b)
        );

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

    formatDate(dateString: string): string {
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
// Design System Variables
$primary: #5F9AAE;
$accent: #FFA400;
$dark-bg: #0C0D08;
$card-bg: #151919;
$light-text: #EDF0F3;

.archive {
  min-height: 100vh;

  // Hero Section
  &__hero {
    padding: 5rem 1rem 1.5rem;
    text-align: center;

    @media (min-width: 768px) {
      padding: 6rem 2rem 2rem;
    }

    &-content {
      max-width: 800px;
      margin: 0 auto;
    }

    &-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: $light-text;
      margin-bottom: 0.5rem;
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
    padding: 1.5rem 1rem;

    @media (min-width: 768px) {
      padding: 2rem 1.5rem;
    }
  }

  // Category Tabs
  &__tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.25rem;
    background: rgba($card-bg, 0.5);
    border-radius: 12px;
    border: 1px solid rgba($primary, 0.1);

    @media (min-width: 768px) {
      display: inline-flex;
      margin-bottom: 2rem;
    }
  }

  &__tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    border: none;
    background: transparent;
    color: rgba($light-text, 0.6);
    font-size: 0.9375rem;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
      flex: none;
      padding: 0.875rem 1.5rem;
    }

    svg {
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    &:hover:not(&--active) {
      color: rgba($light-text, 0.8);
      background: rgba($primary, 0.05);

      svg {
        opacity: 0.8;
      }
    }

    &--active {
      background: $primary;
      color: white;
      box-shadow: 0 2px 8px rgba($primary, 0.3);

      svg {
        opacity: 1;
      }

      .archive__tab-count {
        background: rgba(white, 0.2);
        color: white;
      }
    }

    &-count {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      background: rgba($primary, 0.15);
      color: $primary;
      border-radius: 10px;
      font-weight: 600;
    }
  }

  // Toolbar (Search + Sort)
  &__toolbar {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;

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
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba($light-text, 0.4);
      pointer-events: none;
    }

    &-input {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem 3rem;
      background: $card-bg;
      border: 1.5px solid rgba($primary, 0.2);
      border-radius: 10px;
      color: $light-text;
      font-size: 0.9375rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &::placeholder {
        color: rgba($light-text, 0.4);
      }

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.15);
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
      background: rgba($light-text, 0.1);
      border: none;
      border-radius: 50%;
      color: rgba($light-text, 0.6);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba($light-text, 0.2);
        color: $light-text;
      }
    }
  }

  &__sort {
    select {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem 1rem;
      background: $card-bg;
      border: 1.5px solid rgba($primary, 0.2);
      border-radius: 10px;
      color: $light-text;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: border-color 0.2s ease;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235F9AAE' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.875rem center;
      background-size: 1rem;

      @media (min-width: 640px) {
        width: auto;
        min-width: 180px;
      }

      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
  }

  // Loading State
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;

    p {
      margin-top: 1rem;
      color: rgba($light-text, 0.6);
      font-size: 0.9375rem;
    }
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba($primary, 0.2);
    border-radius: 50%;
    border-top-color: $primary;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  // Featured Article
  &__featured {
    display: grid;
    grid-template-columns: 1fr;
    background: $card-bg;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 2rem;
    cursor: pointer;
    border: 1px solid rgba($primary, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      margin-bottom: 3rem;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba($primary, 0.3);

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
        background: $primary;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    &-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.5rem 1rem;
      background: $accent;
      color: $dark-bg;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 6px;
      z-index: 1;
    }

    &-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;

      @media (min-width: 768px) {
        padding: 2rem;
        justify-content: center;
      }
    }

    &-meta {
      margin-bottom: 0.75rem;

      time {
        font-size: 0.8125rem;
        color: rgba($light-text, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
    }

    &-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: $light-text;
      margin: 0 0 0.75rem;
      line-height: 1.3;

      @media (min-width: 768px) {
        font-size: 1.75rem;
      }
    }

    &-subtitle {
      font-size: 1rem;
      color: rgba($light-text, 0.7);
      margin: 0 0 1rem;
      line-height: 1.5;
    }

    &-points {
      list-style: none;
      padding: 0;
      margin: 0 0 1.25rem;

      li {
        position: relative;
        padding-left: 1.25rem;
        margin-bottom: 0.5rem;
        font-size: 0.9375rem;
        color: rgba($light-text, 0.8);
        line-height: 1.5;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 6px;
          height: 6px;
          background: $primary;
          border-radius: 50%;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    &-excerpt {
      font-size: 0.9375rem;
      color: rgba($light-text, 0.7);
      line-height: 1.6;
      margin: 0 0 1.25rem;
    }

    &-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: $primary;
      font-weight: 600;
      font-size: 0.9375rem;
      margin-top: auto;

      svg {
        transition: transform 0.2s ease;
      }
    }
  }

  // Results Info
  &__results-info {
    margin-bottom: 1.5rem;

    p {
      font-size: 0.9375rem;
      color: rgba($light-text, 0.6);
      margin: 0;
    }
  }

  // Grid
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @media (min-width: 540px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
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
    background: $card-bg;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(white, 0.04);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
      border-color: rgba($primary, 0.2);

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
        background: linear-gradient(to top, $card-bg 0%, transparent 50%);
        opacity: 0.8;
        transition: opacity 0.25s ease;
      }
    }

    &-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.25rem;

      @media (min-width: 768px) {
        padding: 1.5rem;
      }
    }

    &-date {
      display: block;
      font-size: 0.75rem;
      color: rgba($light-text, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 0.5rem;
    }

    &-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: $light-text;
      margin: 0 0 0.5rem;
      line-height: 1.35;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }
    }

    &-subtitle,
    &-excerpt {
      font-size: 0.875rem;
      color: rgba($light-text, 0.65);
      line-height: 1.55;
      margin: 0 0 1rem;
      flex: 1;
    }

    &-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: $primary;
      font-weight: 600;
      font-size: 0.875rem;
      margin-top: auto;

      svg {
        transition: transform 0.2s ease;
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
    padding: 4rem 2rem;
    background: rgba($card-bg, 0.5);
    border-radius: 16px;
    border: 1px solid rgba(white, 0.04);

    svg {
      color: rgba($primary, 0.4);
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: $light-text;
      margin: 0 0 0.5rem;
    }

    p {
      font-size: 0.9375rem;
      color: rgba($light-text, 0.6);
      margin: 0 0 1.5rem;
      max-width: 400px;
    }

    &-btn {
      padding: 0.75rem 1.5rem;
      background: $primary;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;

      &:hover {
        background: darken($primary, 8%);
        transform: translateY(-1px);
      }
    }
  }

  // Load More
  &__load-more {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;

    &-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      background: transparent;
      color: $primary;
      border: 2px solid $primary;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $primary;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba($primary, 0.3);
      }
    }
  }
}
</style>
