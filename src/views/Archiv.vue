<template>
  <Header/>
  <main class="archive">
    <div class="archive__container">
      <!-- Projects View -->
      <section v-if="currentPage === 'projekte'" class="archive__content">
        <h1 class="archive__title">{{ pageTitle }}</h1>

        <div class="archive__filter-controls">
          <div class="archive__search">
            <input type="text" v-model="searchQuery" placeholder="Suchen..."/>
          </div>
          <div class="archive__sort">
            <select v-model="sortOption">
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="alphabetical">Alphabetisch</option>
            </select>
          </div>
        </div>

        <div v-if="filteredProjects.length" class="archive__grid">
          <TeaserCard
            v-for="project in filteredProjects"
            :key="project._id"
            :img="project.image"
            :header="project.title"
            :text="getExcerpt(project)"
            :click="`/project/${project._id}`"
            class="archive__card"
          />
        </div>
        <div v-else class="archive__empty">
          <p>Keine Projekte gefunden. Bitte versuchen Sie eine andere Suche.</p>
        </div>
      </section>

      <!-- Reports View -->
      <section v-else class="archive__content">
        <h1 class="archive__title">{{ pageTitle }}</h1>

        <div class="archive__filter-controls">
          <div class="archive__search">
            <input type="text" v-model="searchQuery" placeholder="Suchen..."/>
          </div>
          <div class="archive__sort">
            <select v-model="sortOption">
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="alphabetical">Alphabetisch</option>
            </select>
          </div>
        </div>

        <div v-if="filteredReports.length" class="archive__list">
          <article
            v-for="report in filteredReports"
            :key="report._id"
            class="archive__report"
            @click="navigateToReport(report._id)"
          >
            <h3 class="archive__report-title">{{ extractTitles(report)[0] }} </h3>
            <h3 class="archive__report-title small">{{ extractTitles(report)[1] }} </h3>

            <div class="archive__report-meta">
              <span v-if="report.createdAt">{{ formatDate(report.createdAt) }}</span>
            </div>
            <Markdown
              v-if="getExcerpt(report)"
              :source="getExcerpt(report)"
              :breaks="true"
              :html="true"
              class="archive__report-excerpt"
            />
            <div class="archive__report-action">
              <span class="archive__read-more">Weiterlesen</span>
            </div>
          </article>
        </div>
        <div v-else class="archive__empty">
          <p>Keine Berichte gefunden. Bitte versuchen Sie eine andere Suche.</p>
        </div>
      </section>

      <div v-if="isLoading" class="archive__loading">
        <div class="archive__spinner"></div>
        <p>Inhalte werden geladen...</p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import TeaserCard from "@/components/TeaserCard.vue";
import {IArticle} from "../../api/models/article";
import {axiosGet} from "../../admin/src/utils/axiosWrapper";
import Markdown from 'vue3-markdown-it';
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
  textObject: any; // Add proper type based on your implementation
}

export default defineComponent({
  name: "ArchivView",
  components: {Header, TeaserCard, Markdown},

  data(): State {
    return {
      currentPage: this.$router.currentRoute.value.params.page as string,
      pageTitle: '',
      projects: [] as IArticle[],
      reports: [] as IArticle[],
      isLoading: true,
      searchQuery: '',
      sortOption: 'newest',
      pageTitles: {
        projects: '',
        reports: ''
      },
      textObject: this.textObject // Assuming this is provided through a mixin or plugin
    };
  },

  computed: {
    filteredProjects(): IArticle[] {
      return this.filterAndSortItems(this.projects);
    },

    filteredReports(): IArticle[] {
      return this.filterAndSortItems(this.reports);
    }
  },

  watch: {
    searchQuery() {
      // Force recomputation of filtered items when search changes
      this.$forceUpdate();
    },

    sortOption() {
      // Force recomputation when sort option changes
      this.$forceUpdate();
    },
    $route(to, from) {
      // Only update currentPage and call updatePageTitle if the page param exists
      if (to.params && to.params.page) {
        this.currentPage = to.params.page as string;
        this.updatePageTitle();
      }
      // No else clause to avoid overwriting currentPage if we're navigating elsewhere
    }
  },

  methods: {
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
      // Safe check before calling toLowerCase()
      if (this.currentPage) {
        this.pageTitle = this.currentPage.toLowerCase() === 'projekte'
          ? this.pageTitles.projects
          : this.pageTitles.reports;
      } else {
        // Default to reports or another sensible default if currentPage is not available
        this.pageTitle = this.pageTitles.reports || '';
      }
    },
    getExcerpt(item: IArticle): string {
      if (!item.content || !item.content[0] || !item.content[0].text) {
        return '';
      }

      const words = item.content[0].text.split(' ');
      return words.slice(0, 50).join(' ') + '...';
    },

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },

    filterAndSortItems(items: IArticle[]): IArticle[] {
      // First filter by search query
      let result = items;

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          (item.content && item.content.some(contentElem =>
            contentElem && contentElem.text &&
            contentElem.text.toLowerCase().includes(query)
          ))
        );
      }

      // Then sort
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

    navigateToReport(id: string): void {
      this.$router.push(`/bericht/${id}`);
    },

    extractTitles(my_report: IArticle): [string, string] {
      console.log(my_report);
      if (!my_report || ![my_report.title])
        return ["", ""]
      if (my_report.title.includes("-")) {
        const sides = my_report.title.split("-")
        if (sides[0].includes("-") || sides[1].includes("-")) {
          return [my_report.title, ""]
        }
        return [sides[0], sides[1]]
      }
      return [my_report.title, ""]
    }
  },

  async mounted() {
    await this.fetchData();
  }
});
</script>

<style lang="scss">
.archive {
  min-height: 92vh;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }

  &__container {
    width: 100%;
    max-width: 1200px;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #f5ffff;

    @media (max-width: 768px) {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }
  }

  &__filter-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__search {
    flex: 1;
    max-width: 400px;

    input {
      width: 95%;
      padding: 0.75rem 1rem;
      border-radius: 30px;
      border: 2px solid #5F9AAE;
      background-color: rgba(21, 25, 25, 0.8);
      color: #f5ffff;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #FFA400;
      }
    }

    @media (max-width: 640px) {
      max-width: 95%;
    }
  }

  &__sort {
    position: relative;

    &::after {
      content: '▼';
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      pointer-events: none;
      color: #5F9AAE;
      font-size: 0.8rem;
    }

    select {
      appearance: none;
      padding: 0.75rem 1rem;
      padding-right: 2.5rem;
      border-radius: 8px;
      border: 2px solid #5F9AAE;
      background-color: rgba(21, 25, 25, 0.95);
      color: #f5ffff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #FFA400;
        box-shadow: 0 0 0 2px rgba(255, 164, 0, 0.2);
      }

      &:hover {
        background-color: rgba(95, 154, 174, 0.1);
      }
    }

    @media (max-width: 768px) {
      width: 100%;

      select {
        width: 100%;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__report {
    background-color: #151919;
    border-radius: 30px;
    padding: 2rem;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: #5F9AAE;
      border-radius: 10px;

      .archive__report-title,
      .archive__report-excerpt,
      .archive__report-meta,
      .archive__read-more {
        color: #F5FFFF;
      }
    }

    @media (max-width: 640px) {
      padding: 1.5rem;
    }
  }

  &__report-title {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #f5ffff;

    &.small {
      font-size: 0.85rem;
      font-weight: normal;
      font-style: italic;
      color: #aaa;
      margin-top: -0.5rem;
      margin-bottom: 1.25rem;
    }
  }

  &__report-meta {
    display: flex;
    font-size: 0.9rem;
    color: #aaa;
    margin-bottom: 1rem;
  }

  &__report-excerpt {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  &__report-action {
    text-align: right;
  }

  &__read-more {
    display: inline-block;
    color: #5F9AAE;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  &__empty {
    text-align: center;
    padding: 3rem;
    background-color: #151919;
    border-radius: 10px;

    p {
      color: #aaa;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;

    p {
      margin-top: 1rem;
      color: #aaa;
    }
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(95, 154, 174, 0.3);
    border-radius: 50%;
    border-top-color: #5F9AAE;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>