<template>
  <div>
    <div class="page-header">
      <h2>{{ currentMaterial === 'REPORT' ? 'Reports' : 'Projects' }}</h2>
      <div class="page-actions">
        <Button :label="'New ' + currentMaterial.toLowerCase()" icon="pi pi-plus" size="small"
                @click="selectedSection = ''; selectedArticle = ''; addArticle = true;" />
      </div>
    </div>

    <div class="content-layout">
      <!-- Left: Article & section navigation -->
      <aside class="content-nav">
        <div class="field">
          <label for="article">Select {{ currentMaterial.toLowerCase() }}</label>
          <Select id="article" v-model="selectedArticle" :options="articleOptions"
                  optionLabel="label" optionValue="value" :placeholder="'Choose ' + currentMaterial.toLowerCase()"
                  class="w-full" @change="addArticle = false; articleSelected();" />
        </div>

        <!-- Section list -->
        <template v-if="activeArticle">
          <div class="sections-header">
            <span class="sections-label">Sections</span>
            <Button icon="pi pi-plus" size="small" text rounded
                    @click="addSection()" v-tooltip.top="'Add section'" />
          </div>
          <ul class="section-list" v-if="sectionOptions.length">
            <li v-for="s in sectionOptions" :key="s._id"
                class="section-item" :class="{ active: selectedSection === s._id }"
                @click="selectedSection = s._id!; addArticle = false; checkCreateSection();">
              <span class="section-nr">#{{ s.nr }}</span>
              <span class="section-name">{{ s.title || 'Untitled section' }}</span>
            </li>
          </ul>
          <p v-else class="empty-hint">No sections yet. Click + to add one.</p>

          <!-- Article meta controls -->
          <div class="article-controls">
            <div class="control-row">
              <ToggleSwitch v-model="activeArticle.published" @change="publishArticle()" />
              <span>{{ activeArticle.published ? 'Published' : 'Draft' }}</span>
            </div>
            <div class="control-row">
              <ToggleSwitch v-model="preview" />
              <span>Preview</span>
            </div>
            <Button label="Delete" severity="danger" icon="pi pi-trash" size="small" outlined
                    @click="deleteArticle()" />
          </div>
        </template>
      </aside>

      <!-- Right: Editor panel -->
      <div class="content-editor">
        <!-- Add new article -->
        <transition name="fade">
          <div class="edit-panel" v-if="addArticle">
            <h3 class="panel-title">New {{ currentMaterial.charAt(0).toUpperCase() + currentMaterial.toLowerCase().slice(1) }}</h3>
            <div class="form-grid">
              <div class="field span-full">
                <label>Title</label>
                <InputText v-model="newArticle.title" class="w-full" />
              </div>
              <div class="field span-full">
                <label>Subheader</label>
                <InputText v-model="newArticle.subheader" class="w-full" />
              </div>
              <div class="field span-full">
                <label>Image</label>
                <AutoComplete v-model="newArticle.image" :suggestions="filteredFiles"
                              @complete="searchFiles($event)" dropdown class="w-full" />
              </div>
              <div class="field span-full">
                <label>Tags</label>
                <div class="flex gap-2 align-items-center">
                  <MultiSelect v-model="value" :options="tags" placeholder="Tags" display="chip" class="flex-1" />
                  <InputText placeholder="New tag" v-model="newTag" style="max-width: 120px" />
                  <Button icon="pi pi-plus" size="small" severity="secondary" rounded
                          @click="tags.push(newTag!); value.push(newTag!)" v-if="newTag" />
                </div>
              </div>
              <div class="field span-full">
                <label>Main Points (one per line)</label>
                <Textarea v-model="newArticleMainPoints" rows="3" class="w-full" />
              </div>
              <div class="form-actions span-full">
                <Button label="Cancel" severity="secondary" size="small" @click="addArticle = false" />
                <Button label="Create" icon="pi pi-check" size="small" @click="saveArticle()" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Edit article metadata -->
        <transition name="fade">
          <div class="edit-panel" v-if="activeArticle && !activeSection && !addArticle">
            <h3 class="panel-title">Edit {{ currentMaterial.charAt(0).toUpperCase() + currentMaterial.toLowerCase().slice(1) }}</h3>
            <div class="form-grid">
              <div class="field span-full">
                <label>Title</label>
                <InputText v-model="activeArticle.title" class="w-full"
                           @change="saveChanges(0, 'title', activeArticle!.title)" />
              </div>
              <div class="field span-full">
                <label>Subheader</label>
                <InputText v-model="activeArticle.subheader" class="w-full"
                           @change="saveChanges(0, 'subheader', activeArticle!.subheader ?? '')" />
              </div>
              <div class="field span-full">
                <label>Cover Image</label>
                <AutoComplete v-model="activeArticle.image" :suggestions="filteredFiles"
                              @complete="searchFiles($event)" dropdown class="w-full"
                              @item-select="debouncedSave(0, 'image', activeArticle!.image ?? '')"
                              @change="debouncedSave(0, 'image', activeArticle!.image ?? '')" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Edit section -->
        <transition name="fade">
          <div class="edit-panel" v-if="activeSection">
            <div class="panel-header">
              <h3 class="panel-title">Section #{{ activeSection.nr }}</h3>
              <Button icon="pi pi-trash" severity="danger" size="small" text rounded
                      @click="deleteSection()" v-tooltip.top="'Delete section'" />
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Order</label>
                <InputText :modelValue="String(activeSection.nr)" @update:modelValue="activeSection!.nr = Number($event)" type="number"
                           @input="debouncedSave(1, 'nr', activeSection!.nr)" class="w-full" />
              </div>
              <div class="field">
                <label>Title</label>
                <InputText v-model="activeSection.title" class="w-full"
                           @input="debouncedSave(1, 'title', activeSection!.title ?? '')" />
              </div>
              <div class="field span-full">
                <label>Image</label>
                <AutoComplete v-model="activeSection.image" :suggestions="filteredFiles"
                              @complete="searchFiles($event)" dropdown class="w-full"
                              @item-select="debouncedSave(1, 'image', activeSection!.image ?? '')"
                              @change="debouncedSave(1, 'image', activeSection!.image ?? '')" />
              </div>
              <div class="field span-full">
                <label>Image Credit</label>
                <InputText v-model="activeSection.imageDescription" class="w-full"
                           @input="debouncedSave(1, 'imageDescription', activeSection!.imageDescription ?? '')" />
              </div>
              <div class="field span-full">
                <label>Text <span class="hint">(Markdown supported)</span></label>
                <Textarea v-model="activeSection.text" class="w-full"
                          @input="debouncedSave(1, 'text', activeSection!.text)" rows="8" />
              </div>
            </div>
          </div>
        </transition>

        <!-- Preview -->
        <transition name="fade">
          <div class="preview-panel" v-if="preview && activeArticle && !addArticle">
            <h3 class="panel-title">Preview</h3>
            <article class="preview-content">
              <h2 class="preview-title">{{ activeArticle.title }}</h2>
              <p v-if="activeArticle.subheader" class="preview-sub">{{ activeArticle.subheader }}</p>
              <img v-if="activeArticle.image" :src="activeArticle.image" :alt="activeArticle.title" class="preview-img" />
              <div v-if="activeArticle.tags && activeArticle.tags.length" class="preview-tags">
                <span v-for="tag in activeArticle.tags" :key="tag" class="preview-tag">{{ tag }}</span>
              </div>
              <ul v-if="activeArticle.mainPoints && activeArticle.mainPoints.length" class="preview-points">
                <li v-for="p in activeArticle.mainPoints" :key="p">{{ p }}</li>
              </ul>
              <div v-for="s in activeArticle.content" :key="s._id" class="preview-section">
                <h4 v-if="s.title">{{ s.title }}</h4>
                <div v-if="s.text" v-html="renderMarkdown(s.text)"></div>
                <img v-if="s.image" :src="s.image" :alt="s.title" class="preview-img" />
              </div>
            </article>
          </div>
        </transition>

        <!-- Empty state -->
        <div v-if="!activeArticle && !addArticle" class="empty-editor">
          <i class="pi pi-file-edit"></i>
          <p>Select a {{ currentMaterial.toLowerCase() }} to start editing</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { FILES_LOCATION } from '@/config';
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import { useNotify } from '@/composables/useNotify';
import { useConfirmAction } from '@/composables/useConfirmAction';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import AutoComplete from 'primevue/autocomplete';
import MarkdownIt from 'markdown-it';
import type { IArticle, ISection } from '@/types/models';

const md = new MarkdownIt();

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export default defineComponent({
  name: "Articles",
  components: { MultiSelect, InputText, Textarea, Select, Button, ToggleSwitch, AutoComplete },
  setup() {
    const notify = useNotify();
    const { confirmDelete } = useConfirmAction();
    return { notify, confirmDelete };
  },
  data() {
    return {
      preview: false,

      addArticle: false,
      articles: undefined as undefined | IArticle[],
      newArticle: {} as Record<string, any>,
      newArticleMainPoints: '' as string,
      tags: [] as Array<string>,

      selectedArticle: "" as string | null,
      activeArticle: undefined as undefined | IArticle,
      selectedSection: "" as string | null,
      activeSection: undefined as undefined | ISection,
      sectionOptions: [] as ISection[],

      files: [] as string[],
      filteredFiles: [] as string[],

      addArticleError: "",
      value: [] as string[],
      options: [],
      newTag: null as string | null,

      currentMaterial: (this.$route.params.page as string).toUpperCase() as "PROJECT" | "REPORT"
    };
  },
  computed: {
    articleOptions(): { label: string; value: string }[] {
      if (!this.articles) return [];
      return this.articles.map(a => ({ label: a.title, value: a._id! }));
    },
    sectionSelectOptions(): { label: string; value: string }[] {
      return this.sectionOptions.map(s => ({
        label: s._id === 'add' ? String(s.nr) : `Section #${s.nr}`,
        value: s._id!
      }));
    }
  },
  methods: {
    renderMarkdown(text: string): string {
      return md.render(text);
    },
    searchFiles(event: { query: string }) {
      const query = event.query.toLowerCase();
      this.filteredFiles = this.files.filter(f => f.toLowerCase().includes(query));
    },
    load: function () {
      this.loadArticles()
          .then((a) => {
            this.articles = a;
            if (this.articles) {
              this.tags = [
                ...new Set(
                    this.articles
                        .map((article) => article.tags ? article.tags : [])
                        .reduce((a: Array<string>, b: Array<string>) => a.concat(b), [])
                        .sort()
                ),
              ];
              this.articles = this.articles.map((a) => {
                a.content = a.content.sort((a, b) => a.nr - b.nr);
                return a;
              });
              this.notify.success("Data loaded successfully.");
            } else
              throw Error('Articles is undefined.')
          })
          .catch((e) => {
            console.warn(e);
            this.notify.error(`Failed to load ${this.currentMaterial.toLowerCase()}.`);
          });
      this.loadFiles()
          .then((a) => {
            this.files = a;
          })
          .catch((e) => {
            console.warn(e);
          });
    },
    loadArticles: async function () {
      return (
          await axiosGet("/content/article/material/" + this.currentMaterial)
      ).data;
    },
    loadFiles: async function () {
      return (await axiosGet("/files")).data.map(
          (e: string) => FILES_LOCATION + e
      );
    },
    resetSite: function () {
      this.addArticleError = "";
      this.addArticle = false;
      this.sectionOptions = [];
      this.selectedSection = "";
      this.selectedArticle = "";
      this.activeArticle = undefined;
      this.activeSection = undefined;
      this.currentMaterial = (this.$route.params.page as string).toUpperCase() as "PROJECT" | "REPORT";
      this.load();
    },
    extractSectionOptions: function () {
      if (this.articles) {
        const tempSectionOptionsArticle = this.articles.find(
            (a) => a._id === this.selectedArticle
        )
        if (tempSectionOptionsArticle)
          this.sectionOptions = tempSectionOptionsArticle.content;
      }
    },
    resetSection: function () {
      this.activeSection = undefined;
      this.selectedSection = "";
      this.loadArticles()
          .then((a: IArticle[]) => {
            this.articles = a.map((a: IArticle) => {
              a.content = a.content.sort((a, b) => a.nr - b.nr);
              return a;
            });
            this.extractSectionOptions();
            this.notify.success("Section updated.");
          })
          .catch((e: Error) => {
            console.warn(e);
            this.notify.error(`Failed to load ${this.currentMaterial.toLowerCase()}.`);
          });
    },
    deleteSection: function () {
      this.confirmDelete(`Are you sure you want to delete this section?`, () => {
        axiosDelete("/content/section/" + this.selectedSection)
            .then(() => {
              this.notify.success("Section deleted.");
              this.resetSection();
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.notify.error("Failed to delete section. Try again.");
            });
      });
    },
    deleteArticle: function () {
      this.confirmDelete(`Are you sure you want to delete this ${this.currentMaterial.toLowerCase()}?`, () => {
        axiosDelete("/content/article/" + this.selectedArticle)
            .then(() => {
              this.notify.success(`${this.currentMaterial.toLowerCase()} deleted.`);
              this.resetSite();
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.notify.error(`Failed to delete ${this.currentMaterial.toLowerCase()}. Try again.`);
            });
      });
    },
    saveArticle: async function () {
      this.addArticleError = "";

      if (this.newArticle) {
        this.newArticle.material = this.currentMaterial
        if (this.newArticleMainPoints) {
          this.newArticle.mainPoints = this.newArticleMainPoints.split("\n");
        }

        axiosPost("/content/article/new", this.newArticle)
            .then(() => {
              this.notify.success("Article saved.");
              this.resetSite();
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.addArticleError = "Error saving the article... Try later again.";
              this.notify.error("Error saving the article. Try later again.");
            });
      }
    },
    publishArticle: function () {
      if (this.activeArticle) {
        axiosPatch("/content/publish", {
          published: this.activeArticle.published,
          id: this.selectedArticle,
        })
            .then(() => this.notify.success("Publish status updated."))
            .catch((e) => {
              console.warn(e);
              this.notify.error("Failed to update publish status. Reload and try again.");
            });
      }
    },
    addSection: function () {
      const tempSelectedArticle = this.articles?.find((a) => a._id === this.selectedArticle)
      if (tempSelectedArticle) {
        const section = {
          nr: tempSelectedArticle.content.length + 1,
        };
        axiosPost("/content/section/new", {
          article: this.selectedArticle,
          section: section,
        })
            .then(() => {
              this.resetSection();
              this.notify.success("Section created.");
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.notify.error("Failed to create section. Try again.");
            });
      }
    },
    debouncedSave: function (kind: number, part: string, content: number | string) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        this.saveChanges(kind, part, content);
      }, 500);
    },
    saveChanges: function (kind: number, part: string, content: number | string) {
      let api = "";
      switch (kind) {
        case 0:
          api = `/content/article/${this.selectedArticle}/${part}`;
          break;
        case 1:
          api = `/content/section/${this.selectedSection}/${part}`;
          break;
      }
      axiosPatch(api, { toChange: content })
          .then(() => {
            this.notify.info("Changes saved.");
          })
          .catch((e) => {
            console.warn(e);
            this.notify.error("Failed to save changes. Reload and try again.");
          });
    },
    articleSelected: function () {
      this.selectedSection = "";
      this.activeSection = undefined;
      this.extractSectionOptions()
      this.activeArticle = this.articles?.find(
          (a) => a._id === this.selectedArticle
      );
    },
    checkCreateSection: function () {
      this.activeSection = this.articles
          ?.find((a) => a._id === this.selectedArticle)
          ?.content.find((s) => s._id === this.selectedSection);
    },
  },
  beforeMount: function () {
    this.load();
  },
  watch: {
    '$route'(to, from) {
      if (to !== from) {
        this.resetSite();
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.content-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* ---- Left nav ---- */
.content-nav {
  position: sticky;
  top: calc(56px + 1.5rem); /* topbar + padding */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sections-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.sections-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--t-text-muted);
}

.section-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 0.85rem;

  &:hover { background: var(--t-surface-cream); }

  &.active {
    background: var(--t-surface-cream);
    font-weight: 500;
  }
}

.section-nr {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--t-text-subtle);
  min-width: 1.5rem;
}

.section-name {
  color: var(--t-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-hint {
  font-size: 0.825rem;
  color: var(--t-text-muted);
  margin: 0;
}

.article-controls {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--t-surface-cream);
  margin-top: 0.5rem;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--t-text-label);
}

/* ---- Editor ---- */
.edit-panel {
  padding: 1.25rem;
  border: 1px solid var(--t-surface-cream);
  border-radius: 8px;
  background: var(--t-surface-warm);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.panel-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--t-text);
  margin: 0 0 1rem;

  .panel-header & { margin-bottom: 0; }
}

.hint {
  font-weight: 400;
  color: var(--t-text-subtle);
  font-size: 0.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.span-full { grid-column: 1 / -1; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* ---- Preview ---- */
.preview-panel {
  margin-top: 1.25rem;
  padding: 1.25rem;
  border: 1px solid var(--t-surface-cream);
  border-radius: 8px;
  background: var(--t-surface-warm);
}

.preview-content {
  font-size: 0.925rem;
  line-height: 1.65;
  color: var(--t-text-label);
}

.preview-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--t-text);
  margin: 0 0 0.25rem;
}

.preview-sub {
  color: var(--t-text-muted);
  margin: 0 0 1rem;
}

.preview-img {
  max-width: min(500px, 100%);
  border-radius: 6px;
  margin: 0.75rem 0;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.preview-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--t-surface-cream);
  color: var(--t-text-label);
}

.preview-points {
  margin: 0.75rem 0;
  padding-left: 1.25rem;

  li { margin-bottom: 0.35rem; }
}

.preview-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--t-surface-cream);

  h4 {
    font-family: 'Instrument Serif', Georgia, serif;
    font-weight: 400;
    font-size: 1.1rem;
    color: var(--t-text);
    margin: 0 0 0.5rem;
  }
}

/* ---- Empty state ---- */
.empty-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--t-text-subtle);
  text-align: center;

  i { font-size: 2.5rem; margin-bottom: 0.75rem; }
  p { margin: 0; font-size: 0.925rem; }
}

/* ---- Transitions ---- */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .content-nav {
    position: static;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
