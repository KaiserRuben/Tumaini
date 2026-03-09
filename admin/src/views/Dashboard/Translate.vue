<template>
  <div>
    <div v-if="query" class="md-progress-bar indeterminate">
      <div class="md-progress-bar-fill"></div>
    </div>
    <span class="warnings" v-if="!allColumnsShown">Warning: Not all columns are selected. Change this in settings.<br/></span>
    <span class="warnings" v-if="onlyShowEmpty !== 'none'">Warning: Filter set, will be lost when data is updated.<br/></span>
    <span class="warnings" v-if="page">Warning: Only showing Objects belonging to {{ page }}.<br/></span>

    <div class="md-tabs">
      <div class="md-tabs-navigation">
        <button class="md-tab-button" :class="{ active: activeTab === 'data' }" @click="activeTab = 'data'">Data</button>
        <button class="md-tab-button" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">Settings</button>
      </div>

      <!-- Main Table -->
      <div class="md-tab-content" v-if="activeTab === 'data'">
        <div class="navigation" style="display: flex; align-items: center; justify-content: center;" v-if="filteredData && filteredData.length > elemProPage">
          <button class="md-button" @click="currentPage > 1 ? currentPage = currentPage - 1 : currentPage">
            <span class="md-icon">arrow_left</span>
          </button>
          <span v-if="filteredData" style="text-align: center">
            Page {{ currentPage }} of {{ Math.ceil(filteredData.length / elemProPage) }}
          </span>
          <button class="md-button" v-if="filteredData"
                  @click="currentPage < Math.ceil(filteredData.length / elemProPage) ? currentPage = currentPage + 1 : currentPage">
            <span class="md-icon">arrow_right</span>
          </button>
        </div>
        <table class="md-table">
          <thead>
            <tr class="md-table-toolbar" style="display: table-row;">
              <th colspan="5" style="text-align: left;">
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                  <h1 class="md-title">Text Data</h1>
                  <div>
                    <span v-if="uploading">Saving changes...</span>
                    <button class="md-button md-primary" @click="loadData">Update Data</button>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th v-if="show.page">Page</th>
              <th v-if="show.description">Description</th>
              <th v-if="show.EN">English</th>
              <th v-if="show.NL">Dutch</th>
              <th v-if="show.DE">German</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filterArrayForPage()" :key="item._id">
              <td v-if="show.page">{{ item.page }}</td>
              <td v-if="show.description">{{ item.description }}</td>
              <td v-if="show.EN">
                <div class="md-field" style="margin: 0">
                  <textarea v-model="item.EN" @change="change(item._id, 'EN', item.EN)" rows="2"></textarea>
                </div>
              </td>
              <td v-if="show.NL">
                <div class="md-field" style="margin: 0">
                  <textarea v-model="item.NL" @change="change(item._id, 'NL', item.NL)" rows="2"></textarea>
                </div>
              </td>
              <td v-if="show.DE">
                <div class="md-field" style="margin: 0">
                  <textarea v-model="item.DE" @change="change(item._id, 'DE', item.DE)" rows="2"></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Settings -->
      <div class="md-tab-content" v-if="activeTab === 'settings'">
        <div class="md-card" style="margin-bottom: 16px; padding: 16px;">
          <div class="md-title">Show columns</div>
          <label class="md-switch"><input type="checkbox" v-model="show.page"/> Page</label>
          <label class="md-switch"><input type="checkbox" v-model="show.description"/> Description</label>
          <label class="md-switch"><input type="checkbox" v-model="show.EN"/> English</label>
          <label class="md-switch"><input type="checkbox" v-model="show.DE"/> German</label>
          <label class="md-switch"><input type="checkbox" v-model="show.NL"/> Dutch</label>
        </div>

        <div class="md-card" style="margin-bottom: 16px; padding: 16px;">
          <div class="md-title">Show only empty</div>
          <div class="md-field">
            <label>Language:</label>
            <select v-model="onlyShowEmpty" class="md-select" @change="filterData(myData!)">
              <option value="none">None</option>
              <option value="DE">German</option>
              <option value="EN">English</option>
              <option value="NL">Dutch</option>
            </select>
          </div>
        </div>

        <div class="md-card" style="margin-bottom: 16px; padding: 16px;">
          <div class="md-title">Filter page</div>
          <div class="md-field">
            <label>Page:</label>
            <select v-model="page" class="md-select" @change="filterData(myData!)">
              <option value="">None</option>
              <option v-for="view in viewOptionsList" :value="view" :key="view">{{ view }}</option>
            </select>
          </div>
        </div>

        <div class="md-card" style="margin-bottom: 16px; padding: 16px;">
          <div class="md-title">Elements per Page</div>
          <p>Be careful, a number greater 100 might significantly decrease performance!</p>
          <div class="md-field">
            <input v-model.number="elemProPage" type="number"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosGet, axiosPatch } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';

export interface IText {
  _id?: string;
  page: string;
  EN?: string;
  DE?: string;
  NL?: string;
  description?: string;
  created?: Date;
}

export default defineComponent({
  name: 'Translate',
  data() {
    return {
      activeTab: 'data',
      query: false,
      uploading: false,

      onlyShowEmpty: "none" as 'none' | "EN" | "DE" | "NL",
      page: "",
      viewOptions: new Set<string>(),
      elemProPage: 20,
      currentPage: 1,

      filteredData: undefined as undefined | IText[],
      myData: undefined as undefined | IText[],
      show: {
        page: true,
        description: true,
        EN: true,
        NL: true,
        DE: true,
      }
    }
  },
  computed: {
    allColumnsShown(): boolean {
      return Object.values(this.show).every(v => v)
    },
    viewOptionsList(): string[] {
      return Array.from(this.viewOptions)
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
    change: async function (id: string | undefined, language: "EN" | "DE" | "NL", content: string | undefined) {
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
