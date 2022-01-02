<template>
  <div class="home">
    <md-progress-bar v-if="query" md-mode="query"></md-progress-bar>
    <span class="warnings" v-if="!Object.values(show).reduce((x, y) => x && y)">Warning: Not all columns are selected. Change this in settings.<br/></span>
    <span class="warnings" v-if="onlyShowEmpty">Warning: Filter set, will be lost when data is updated.<br/></span>
    <span class="warnings" v-if="page">Warning: Only showing Objects belonging to {{ page }}.<br/></span>
    <md-tabs md-alignment="fixed">

      <!--      Main Table-->
      <md-tab id="data" md-label="Data">
        <div class="navigation md-layout" v-if="filteredData && filteredData.length>elemProPage">
          <md-button @click="currentPage > 1?currentPage = currentPage - 1:currentPage">
            <md-icon class="md-layout-item">arrow_left</md-icon>
          </md-button>
          <span class="md-layout-item"
                v-if="filteredData"
                style="text-align:center">Page {{ currentPage }} of {{
              Math.ceil(filteredData.length / elemProPage)
            }}</span>
          <md-button
              v-if="filteredData"
              @click="currentPage < Math.ceil(filteredData.length/elemProPage)?currentPage = currentPage + 1:currentPage">
            <md-icon class="md-layout-item">arrow_right</md-icon>
          </md-button>
        </div>
        <md-table md-height="100%" class="myTable" md-card>
          <md-table-toolbar>
            <div class="md-toolbar-section-start">
              <h1 class="md-title">Text Data</h1>
            </div>
            <span v-if="uploading">Saving changes...</span>
            <md-button class="md-primary" @click="loadData">Update Data</md-button>
          </md-table-toolbar>

          <md-table-row>
            <md-table-head md-numeric v-if="show.textID">Text ID</md-table-head>
            <md-table-head v-if="show.page">Page</md-table-head>
            <md-table-head v-if="show.description">Description</md-table-head>
            <md-table-head v-if="show.EN">English</md-table-head>
            <md-table-head v-if="show.NL">Dutch</md-table-head>
            <md-table-head v-if="show.DE">German</md-table-head>
          </md-table-row>

          <md-table-row v-for="item in filterArrayForPage" v-bind:key="item._id">
            <md-table-cell v-if="show._id">
              {{ item._id }}
            </md-table-cell>
            <md-table-cell v-if="show.page">
              {{ item.view }}
            </md-table-cell>
            <md-table-cell v-if="show.description">
              <!--              <md-field md-inline>-->
              <!--                <label>Your description</label>-->
              <!--                <md-textarea v-model="item.Description" @change="change(item._id, 'description', item.description)" md-autogrow></md-textarea>-->
              <!--              </md-field>-->
              {{ item.description }}
            </md-table-cell>
            <md-table-cell v-if="show.EN">
              <md-field md-inline>
                <label>Your english text</label>
                <md-textarea v-model="item.EN" @change="change(item._id, 'EN', item.EN)" md-autogrow></md-textarea>
              </md-field>
            </md-table-cell>
            <md-table-cell v-if="show.NL">
              <md-field md-inline>
                <label>Your dutch text</label>
                <md-textarea v-model="item.NL" @change="change(item._id, 'NL', item.NL)" md-autogrow></md-textarea>
              </md-field>
            </md-table-cell>
            <md-table-cell v-if="show.DE">
              <md-field md-inline>
                <label>Your german text</label>
                <md-textarea v-model="item.DE" @change="change(item._id, 'DE', item.DE)" md-autogrow></md-textarea>
              </md-field>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-tab>
      <md-tab id="settings" md-label="Settings">
        <md-card md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Show columns</div>
            </md-card-header>

            <md-card-content>
              <md-switch v-model="show.textID" class="md-primary">ID</md-switch>
              <md-switch v-model="show.page" class="md-primary">Page</md-switch>
              <md-switch v-model="show.description" class="md-primary">Description</md-switch>
              <md-switch v-model="show.EN" class="md-primary">English</md-switch>
              <md-switch v-model="show.DE">German</md-switch>
              <md-switch v-model="show.NL">Dutch</md-switch>
            </md-card-content>
          </md-ripple>
        </md-card>

        <md-card md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Show only empty</div>

            </md-card-header>

            <md-card-content>
              Language:
              <md-field>
                <md-select v-model="onlyShowEmpty" name="onlyShowEmpty" id="onlyShowEmpty" @md-selected="filterData">
                  <md-option value="none">None</md-option>
                  <md-option value="DE">German</md-option>
                  <md-option value="EN">English</md-option>
                  <md-option value="NL">Dutch</md-option>
                </md-select>
              </md-field>
            </md-card-content>
          </md-ripple>
        </md-card>
        <md-card md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Filter page</div>

            </md-card-header>

            <md-card-content>
              Page:
              <md-field>
                <md-select v-model="page" name="view" id="view" @md-selected="filterData">
                  <md-option value="">None</md-option>
                  <md-option v-for="view in viewOptions" :value="view" v-bind:key="view">{{ view }}</md-option>
                </md-select>
              </md-field>
            </md-card-content>
          </md-ripple>
        </md-card>
        <md-card md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Elements per Page</div>

            </md-card-header>

            <md-card-content>
              Be careful, a number greater 100 might significantly decrease performance!
              <md-field>
                <md-input v-model="elemProPage" type="number">
                </md-input>
              </md-field>
            </md-card-content>
          </md-ripple>
        </md-card>
      </md-tab>
    </md-tabs>

  </div>
</template>

<script lang="ts">
import {axiosGet, axiosPatch} from '@/utils/axiosWrapper';
import Vue from 'vue';

export interface IText extends Document {
  page: string;
  EN?: string;
  DE?: string;
  NL?: string;
  description?: string;
  created: Date;
}

export default Vue.extend({
  name: 'Translate',
  data() {
    return {
      query: false,
      uploading: false,

      onlyShowEmpty: "none" as 'none' | "EN" | "DE" | "NL",
      page: "",
      viewOptions: {},
      elemProPage: 20,
      currentPage: 1,

      filteredData: undefined as undefined | IText[],
      myData: undefined as undefined | IText[],
      show: {
        textID: false,
        page: true,
        description: true,
        EN: true,
        NL: true,
        DE: true,
      }
    }
  },
  methods: {
    loadData: async function () {
      this.query = true
      this.myData = (await axiosGet('/text')).data
      if (this.myData) {
        this.viewOptions = new Set(this.myData.map(item => item.page))

        this.filterData(this.myData)
      } else {
        console.warn("Could not load any text... This is a problem.")
      }
      this.query = false

    },
    filterData: function (data: IText[]) {
      this.filteredData = data
      this.filteredData = this.filteredData.filter((d) => {
        if (this.onlyShowEmpty !== 'none')
          return !d[this.onlyShowEmpty]
        else
          return d
      })
      if (this.page)
        this.filteredData = this.filteredData.filter((d) => d.page == this.page)
    },
    change: async function (id: string, language: "EN" | "DE" | "NL", content: string) {
      this.uploading = true
      await axiosPatch('/text', {
        "_id": id,
        "language": language,
        "text": content
      })
          .then((res) => {
            console.log("Updated text with status: " + res.status)
            this.loadData()
          })
          .catch((error) => {
            alert('Your data could not be saved.\nReloading all data to prevent data loss.\n\n' + error)
            this.loadData()
          });
      this.uploading = false
    },
    filterArrayForPage: function () {
      if (this.filteredData) {
        let minIndex = (this.currentPage - 1) * this.elemProPage
        let maxIndex = (this.currentPage) * this.elemProPage
        return this.filteredData.slice(minIndex, maxIndex)
      } else {
        return []
      }
    },
  },
  mounted() {
    this.loadData()
  }
});
</script>
<style lang="scss">
.headline {
  padding-left: 20px;
  margin-bottom: 0;
}

.subheader {
  margin-top: 0;
  margin-left: 40px;
}

.warnings {
  margin-left: 20px;
  padding-bottom: 30px;
  color: #e53935;
}

.info {
  padding-left: 20px;
  padding-bottom: 30px;
  color: #1976d2;
}
</style>