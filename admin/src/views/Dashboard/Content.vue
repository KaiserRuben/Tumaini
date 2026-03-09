<template>
  <div>
    <div :class="status.startsWith('error') ? 'status error' : 'status ok'">
      {{ status }}
    </div>

    <!-- Options -->
    <div class="options">
      <div>
        <button class="md-button md-raised md-primary"
                @click="selectedSection = ''; selectedArticle = ''; addArticle = true;">
          add {{ currentMaterial.toLowerCase() }}
        </button>
        <button class="md-button md-raised" @click="addSection()" v-if="selectedArticle">
          add Section
        </button>
      </div>
      <div class="flexContent">
        <div class="md-field">
          <label for="article">Content</label>
          <select v-model="selectedArticle" name="article" id="article" class="md-select"
                  @change="addArticle = false; articleSelected();">
            <option value="" disabled>Select content</option>
            <option v-for="a in articles" :key="a._id" :value="a._id">
              {{ a.title }}
            </option>
          </select>
        </div>
        <div class="md-field">
          <label for="section">Section</label>
          <select v-model="selectedSection" name="section" id="section" class="md-select"
                  @change="addArticle = false; checkCreateSection();">
            <option value="" disabled>Select section</option>
            <option v-for="s in sectionOptions" :key="s._id" :value="s._id">
              {{ s._id === 'add' ? s.nr : `Section #${s.nr}` }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Add Article -->
    <transition name="fade">
      <div class="editSection" v-if="addArticle">
        <h2 class="md-title">Add {{ currentMaterial.charAt(0).toUpperCase() + currentMaterial.toLowerCase().slice(1) }}</h2>

        <div class="md-field">
          <label>Image</label>
          <input v-model="newArticle.image" list="filesList" />
          <datalist id="filesList">
            <option v-for="f in files" :key="f" :value="f" />
          </datalist>
        </div>
        <div class="md-field">
          <label>Title</label>
          <input v-model="newArticle.title"/>
        </div>
        <div class="md-field">
          <label>Subheader</label>
          <input v-model="newArticle.subheader"/>
        </div>
        <div class="md-field">
          <Multiselect
              v-model="value"
              :options="tags"
              :multiple="true"
              :close-on-select="false"
              placeholder="Tags"
          ></Multiselect>
          <input placeholder="New Tag" style="margin-left: 2%" v-model="newTag"/>
          <button class="md-button" @click="tags.push(newTag!); value.push(newTag!)" style="margin: 0 8px" v-if="newTag">
            Add
          </button>
        </div>
        <div class="md-field">
          <label>Main Points (One per line)</label>
          <textarea v-model="newArticleMainPoints"></textarea>
        </div>
        <div class="actions">
          <button class="md-button" @click="addArticle = false">Close</button>
          <button class="md-button md-primary" @click="saveArticle()">Save</button>
        </div>
      </div>
    </transition>

    <!-- Edit Section -->
    <transition name="fade">
      <div class="editSection" v-if="activeSection">
        <h2 class="md-title">Edit Section</h2>

        <div class="md-field">
          <label>Section Number</label>
          <input v-model="activeSection.nr" type="number"
                 @input="saveChanges(1, 'nr', activeSection!.nr)"/>
        </div>
        <div class="md-field">
          <label>Image</label>
          <input v-model="activeSection.image" list="filesListSection"
                 @input="saveChanges(1, 'image', activeSection!.image ?? '')"/>
          <datalist id="filesListSection">
            <option v-for="f in files" :key="f" :value="f" />
          </datalist>
        </div>
        <div class="md-field">
          <label>Image Reference</label>
          <input v-model="activeSection.imageDescription"
                 @input="saveChanges(1, 'imageDescription', activeSection!.imageDescription ?? '')"/>
        </div>
        <div class="md-field">
          <label>Title</label>
          <input v-model="activeSection.title"
                 @input="saveChanges(1, 'title', activeSection!.title ?? '')"/>
        </div>
        <div class="md-field">
          <label>Text (Supports Markdown)</label>
          <textarea v-model="activeSection.text"
                    @input="saveChanges(1, 'text', activeSection!.text)" rows="6"></textarea>
        </div>
        <div class="actions">
          <button class="md-button md-raised md-accent" @click="deleteSection()">Delete</button>
        </div>
      </div>
    </transition>

    <!-- Edit Article -->
    <transition name="fade">
      <div class="editSection" v-if="activeArticle && !activeSection">
        <h2 class="md-title">Edit {{ currentMaterial.charAt(0).toUpperCase() + currentMaterial.toLowerCase().slice(1) }}</h2>

        <div class="md-field">
          <label>Image</label>
          <input v-model="activeArticle.image" list="filesListArticle"
                 @input="saveChanges(0, 'image', activeArticle!.image ?? '')"/>
          <datalist id="filesListArticle">
            <option v-for="f in files" :key="f" :value="f" />
          </datalist>
        </div>
        <div class="md-field">
          <label>Title</label>
          <input v-model="activeArticle.title"
                 @change="saveChanges(0, 'title', activeArticle!.title)"/>
        </div>
        <div class="md-field">
          <label>Subheader</label>
          <input v-model="activeArticle.subheader"
                 @change="saveChanges(0, 'subheader', activeArticle!.subheader ?? '')"/>
        </div>
        <div class="actions">
          <label class="md-switch">
            <input type="checkbox" v-model="preview"/>
            Show Preview
          </label>
          <label class="md-switch">
            <input type="checkbox" v-model="activeArticle.published"
                   @change="publishArticle()"/>
            Published
          </label>
          <button class="md-button md-raised md-accent" @click="deleteArticle()">Delete</button>
        </div>

        <div class="editSection" v-if="preview">
          <div class="md-title">{{ activeArticle.title }}</div>
          <div class="md-subheading">{{ activeArticle.subheader }}</div>
          <img v-if="activeArticle.image" :src="activeArticle.image" :alt="activeArticle.title"
               style="max-width: 500px"/>
          <div class="md-subheading" v-if="activeArticle.tags && activeArticle.tags.length">
            Tags: {{ activeArticle.tags.join(", ") }}
          </div>
          Main Points:
          <ul v-if="activeArticle.mainPoints && activeArticle.mainPoints.length">
            <li v-for="p in activeArticle.mainPoints" :key="p">{{ p }}</li>
          </ul>
          <div v-for="s in activeArticle.content" :key="s._id" style="margin-top: 10px">
            <div class="md-body-2" v-if="s.title">{{ s.title }}</div>
            <div v-if="s.text" v-html="renderMarkdown(s.text)"></div>
            <img v-if="s.image" :src="s.image" :alt="s.title" style="max-width: 500px"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { FILES_LOCATION } from '@/config';
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import Multiselect from "vue-multiselect";
import MarkdownIt from 'markdown-it';
import type { IArticle, ISection } from '@/types/models';

const md = new MarkdownIt();

export default defineComponent({
  name: "Articles",
  data() {
    return {
      expertMode: false,
      preview: true,

      addArticle: false,
      articles: undefined as undefined | IArticle[],
      newArticle: {} as Record<string, unknown>,
      newArticleMainPoints: '' as string,
      tags: [] as Array<string>,

      selectedArticle: "",
      activeArticle: undefined as undefined | IArticle,
      selectedSection: "",
      activeSection: undefined as undefined | ISection,
      sectionOptions: [] as ISection[],

      files: [] as string[],

      status: "",
      addArticleError: "",
      value: [] as string[],
      options: [],
      newTag: null as string | null,

      currentMaterial: (this.$route.params.page as string).toUpperCase() as "PROJECT" | "REPORT"
    };
  },
  methods: {
    renderMarkdown(text: string): string {
      return md.render(text);
    },
    load: function () {
      this.status = "loading data...";
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
              this.status = "all set";
            } else
              throw Error('Articles is undefined.')
          })
          .catch((e) => {
            console.warn(e);
            this.status = `error: loading ${this.currentMaterial.toLowerCase()}...`;
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
      this.load();
      this.addArticleError = "";
      this.addArticle = false;
      this.sectionOptions = [];
      this.selectedSection = "";
      this.selectedArticle = "";
      this.activeArticle = undefined;
      this.activeSection = undefined;
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
      this.status = `loading ${this.currentMaterial.toLowerCase()}...`;
      this.loadArticles()
          .then((a: IArticle[]) => {
            this.articles = a.map((a: IArticle) => {
              a.content = a.content.sort((a, b) => a.nr - b.nr);
              return a;
            });
            this.extractSectionOptions();
            this.status = "all set";
          })
          .catch((e: Error) => {
            console.warn(e);
            this.status = `error: loading ${this.currentMaterial.toLowerCase()}`;
          });
    },
    deleteSection: function () {
      this.status = "deleting section...";
      axiosDelete("/content/section/" + this.selectedSection)
          .then(() => {
            this.status = "all set";
            this.resetSection();
          })
          .catch((e) => {
            console.warn(e.response.data.error);
            this.status = "error: creating section... try again";
          });
    },
    deleteArticle: function () {
      this.status = `deleting ${this.currentMaterial.toLowerCase()}...`;
      axiosDelete("/content/article/" + this.selectedArticle)
          .then(() => {
            this.status = "all set";
            this.resetSite();
          })
          .catch((e) => {
            console.warn(e.response.data.error);
            this.status = `error: deleting ${this.currentMaterial.toLowerCase()}... try again.`;
          });
    },
    saveArticle: async function () {
      this.addArticleError = "";
      this.status = "saving...";

      if (this.newArticle) {
        this.newArticle.material = this.currentMaterial
        if (this.newArticleMainPoints) {
          this.newArticle.mainPoints = this.newArticleMainPoints.split("\n");
        }

        axiosPost("/content/article/new", this.newArticle)
            .then(() => {
              this.resetSite();
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.addArticleError = "Error saving the article... Try later again.";
            })
            .finally(() => (this.status = "all set"));
      }
    },
    publishArticle: function () {
      this.status = "publishing...";
      if (this.activeArticle) {
        axiosPatch("/content/publish", {
          published: this.activeArticle.published,
          id: this.selectedArticle,
        })
            .then(() => (this.status = "all set"))
            .catch((e) => {
              console.warn(e);
              this.status = "error: publishing, reload site and try again";
            });
      }
    },
    addSection: function () {
      this.status = "creating new section";
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
              this.status = "all set";
            })
            .catch((e) => {
              console.warn(e.response.data.error);
              this.status = "error: creating section... try again";
            });
      }
    },
    saveChanges: function (kind: number, part: string, content: number | string) {
      this.status = "saving...";
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
            this.status = "all set";
          })
          .catch((e) => {
            console.warn(e);
            this.status = "error: saving changes - reload site";
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
  components: {
    Multiselect,
  },
  beforeMount: function () {
    this.load();
  },
  watch: {
    '$route'(to, from) {
      if (to !== from) {
        location.reload();
      }
    }
  }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss">
.status {
  text-align: right;
  opacity: 0.8;
}

.ok {
  color: #00695f;
}

.error {
  color: #ba000d;
}

.editSection {
  margin-top: 2em;
}

.actions {
  text-align: right;
}

.options {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.flexContent {
  width: 800px;
  display: flex;
  flex-direction: row;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
