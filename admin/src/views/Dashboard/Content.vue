<template>
  <div>
    <div :class="status.startsWith('error') ? 'status error' : 'status ok'">
      {{ status }}
    </div>

    <!-- Options -->
    <div class="options">
      <div>
        <md-button
            class="md-raised md-primary"
            @click="
            selectedSection = '';
            selectedArticle = '';
            addArticle = true;
          "
        >
          add {{ currentMaterial.toLowerCase() }}
        </md-button>
        <md-button
            class="md-raised"
            @click="addSection()"
            v-if="selectedArticle"
        >
          add Section
        </md-button>
      </div>
      <div class="flexContent">
        <md-field>
          <label for="article">Content</label>
          <md-select
              v-model="selectedArticle"
              name="article"
              id="article"
              @md-selected="
              addArticle = false;
              articleSelected();
            "
          >
            <md-option v-for="a in articles" v-bind:key="a._id" :value="a._id">
              {{ a.title }}
            </md-option>
          </md-select>
        </md-field>
        <md-field>
          <label for="section">Section</label>
          <md-select
              v-model="selectedSection"
              name="section"
              id="section"
              @md-selected="
              addArticle = false;
              checkCreateSection();
            "
          >
            <md-option
                v-for="s in sectionOptions"
                v-bind:key="s._id"
                :value="s._id"
            >
              {{ s._id === "add" ? s.nr : `Section #${s.nr}` }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <!-- Add Article -->
    <transition name="fade">
      <div class="editSection" v-if="addArticle">
        <h2 class="md-title">Add Report</h2>
        <md-autocomplete v-model="newArticle.image" :md-options="files">
          <label>Image</label>
        </md-autocomplete>
        <md-field>
          <label>Title</label>
          <md-input v-model="newArticle.title"></md-input>
        </md-field>
        <md-field>
          <label>Subheader</label>
          <md-input v-model="newArticle.subheader"></md-input>
        </md-field>
        <md-field>
          <multiselect
              v-model="value"
              :options="tags"
              :multiple="true"
              :close-on-select="false"
              placeholder="Tags"
          ></multiselect>
          <md-input
              placeholder="New Tag"
              style="margin-left: 2%"
              v-model="newTag"
          ></md-input
          >
          <md-button
              @click="tags.push(newTag); value.push(newTag)"
              style="margin: 0 8px"
              v-if="newTag"
          >Add
          </md-button
          >
        </md-field>
        <md-field>
          <label>Main Points (One per line)</label>
          <md-textarea
              v-model="newArticle.mainPoints"
              md-autogrow
          ></md-textarea>
        </md-field>
        <div class="actions">
          <md-button class="" @click="addArticle = false">Close</md-button>
          <md-button class="md-primary" @click="saveArticle()">Save</md-button>
        </div>
      </div>
    </transition>

    <!-- Edit Section -->
    <transition name="fade">
      <div class="editSection" v-if="activeSection">
        <h2 class="md-title">Edit Section</h2>

        <md-field>
          <label>Section Number</label>
          <md-input
              v-model="activeSection.nr"
              type="number"
              @input="saveChanges(1, 'nr', activeSection.nr)"
          >
          </md-input>
        </md-field>
        <md-autocomplete
            v-model="activeSection.image"
            :md-options="files"
            @input="saveChanges(1, 'image', activeSection.image)"
        >
          <label>Image</label>
        </md-autocomplete>
        <md-field>
          <label>Image Reference</label>
          <md-input
              v-model="activeSection.imageDescription"
              @input="
              saveChanges(1, 'imageDescription', activeSection.imageDescription)
            "
          >
          </md-input>
        </md-field>
        <md-field>
          <label>Title</label>
          <md-input
              v-model="activeSection.title"
              @input="saveChanges(1, 'title', activeSection.title)"
          >
          </md-input>
        </md-field>
        <md-field>
          <label>Text (Supports Markdown)</label>
          <md-textarea
              v-model="activeSection.text"
              @input="saveChanges(1, 'text', activeSection.text)"
              md-autogrow
          >
          </md-textarea>
        </md-field>
        <div class="actions">
          <md-button class="md-raised md-accent" @click="deleteSection()"
          >Delete
          </md-button
          >
        </div>
      </div>
    </transition>

    <!-- Edit Article -->
    <transition name="fade">
      <div class="editSection" v-if="activeArticle && !activeSection">
        <h2 class="md-title">Edit Article</h2>

        <md-autocomplete
            v-model="activeArticle.image"
            :md-options="files"
            @input="saveChanges(0, 'image', activeArticle.image)"
        >
          <label>Image</label>
        </md-autocomplete>
        <md-field>
          <label>Title</label>
          <md-input
              v-model="activeArticle.title"
              @change="saveChanges(0, 'title', activeArticle.title)"
          >
          </md-input>
        </md-field>
        <md-field>
          <label>Subheader</label>
          <md-input
              v-model="activeArticle.subheader"
              @change="saveChanges(0, 'subheader', activeArticle.subheader)"
          >
          </md-input>
        </md-field>
        <div class="actions">
          <md-switch v-model="preview" class="md-primary"
          >Show Preview
          </md-switch
          >
          <md-switch
              class="md-raised md-primary"
              v-model="activeArticle.published"
              @change="publishArticle()"
          >
            Published
          </md-switch>
          <md-button class="md-raised md-accent" @click="deleteArticle()"
          >Delete
          </md-button
          >
        </div>

        <div class="editSection" v-if="preview">
          <div class="md-title">{{ activeArticle.title }}</div>
          <div class="md-subheading">{{ activeArticle.subheader }}</div>
          <img
              v-if="activeArticle.image"
              :src="activeArticle.image"
              :alt="activeArticle.title"
              style="max-width: 500px"
          />
          <div class="md-subheading" v-if="activeArticle.tags.length">
            Tags: {{ activeArticle.tags.join(", ") }}
          </div>
          Main Points:
          <ul v-if="activeArticle.mainPoints.length">
            <li v-for="p in activeArticle.mainPoints" v-bind:key="p">
              {{ p }}
            </li>
          </ul>
          <div
              v-for="s in activeArticle.content"
              v-bind:key="s._id"
              style="margin-top: 10px"
          >
            <div class="md-body-2" v-if="s.title">{{ s.title }}</div>
            <div v-if="s.text">
              <vue-markdown>{{ s.text }}</vue-markdown>
            </div>
            <img
                v-if="s.image"
                :src="s.image"
                :alt="s.title"
                style="max-width: 500px"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {FILES_LOCATION} from '@/config';
import {axiosDelete, axiosGet, axiosPatch, axiosPost} from '@/utils/axiosWrapper';
import Vue from 'vue';
import Multiselect from "vue-multiselect";
import VueMarkdown from "@adapttive/vue-markdown";
import {IArticle} from "../../../../api/models/article";
import {ISection} from '../../../../api/models/section';

export default Vue.extend({
  name: "Articles",
  data() {
    return {
      expertMode: false,
      preview: true,

      addArticle: false,
      articles: undefined as undefined | IArticle[],
      newArticle: {} as Record<string, unknown> | IArticle,
      tags: [] as Array<string>,

      selectedArticle: "",
      activeArticle: undefined as undefined | IArticle,
      selectedSection: "",
      activeSection: undefined as undefined | ISection,
      sectionOptions: [] as [] | ISection[],

      files: [],

      status: "",
      addArticleError: "",
      value: [],
      options: [],
      newTag: null,

      currentMaterial: this.$route.params.page.toUpperCase() as "PROJECT" | "REPORT"
    };
  },
  methods: {
    load: function () {
      // Loading Articles
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
              throw Error('Articles is not undefined.')
          })
          .catch((e) => {
            console.warn(e);
            this.status = "error: loading articles";
          });
      // Loading Files
      this.loadFiles()
          .then((a) => {
            // console.log("Files:", a)
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
    }, resetSection: function () {
      this.activeSection = undefined;
      this.selectedSection = "";
      this.status = "loading articles...";
      this.loadArticles()
          .then((a) => {
            this.articles = a.map((a: IArticle) => {
              a.content = a.content.sort((a, b) => a.nr - b.nr);
              return a;
            });
            this.extractSectionOptions();
            this.status = "all set";
          })
          .catch((e) => {
            console.warn(e);
            this.status = "error: loading articles";
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
      this.status = "deleting knowledge...";
      axiosDelete("/content/article/" + this.selectedArticle)
          .then(() => {
            this.status = "all set";
            this.resetSite();
          })
          .catch((e) => {
            console.warn(e.response.data.error);
            this.status = "error: creating section... try again";
          });
    },
    saveArticle: async function () {
      this.addArticleError = "";
      this.status = "saving...";

      if (this.newArticle) {
        this.newArticle.material = this.currentMaterial
        if (this.newArticle.mainPoints) {
          this.newArticle.mainPoints = String(this.newArticle.mainPoints).split("\n");
        }

        axiosPost(
            "/content/article/new",
            this.newArticle
        )
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
        axiosPatch("/content/content/publish", {
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
          nr:
              tempSelectedArticle.content
                  .length + 1,
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
          api = `content/section/${this.selectedSection}/${part}`;
          break;
      }
      axiosPatch(api, {toChange: content})
          .then(() => {
            this.status = "all set";
          })
          .catch((e) => {
            console.warn(e.response);
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
    VueMarkdown,
    Multiselect,
  },
  beforeMount: function () {
    this.load();
  },
  watch: {
    $route(to, from) { // react to route changes...
      if (to !== from) {
        location.reload();
      }
    }
  }
});
</script>
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

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>