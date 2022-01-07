<template>
  <div class="files">
    <div class="content">
      <file-upload v-on:reload="loadData"></file-upload>
      <md-table v-if="files.length">
        <md-table-row>
          <md-table-head>Preview</md-table-head>
          <md-table-head>Name</md-table-head>
          <md-table-head>Link</md-table-head>
          <md-table-head>Type</md-table-head>
          <md-table-head></md-table-head>
        </md-table-row>

        <md-table-row v-for="(item, index) in files" v-bind:key="index" @click="onSelect(item)" md-selectable="single">
          <md-table-cell>
            <img style="height: 50px; " v-if="isImage(item.type)" :src="item.link"
                 :alt="item.name">
            <md-icon style="height: 50px" v-else-if="isAudio(item.type)">audiotrack</md-icon>
            <md-icon style="height: 50px" v-else>description</md-icon>
          </md-table-cell>
          <md-table-cell>
            {{ item.name }}
          </md-table-cell>
          <md-table-cell>
            <a :href="item.link" target="_blank"> {{ item.link }}</a>
          </md-table-cell>
          <md-table-cell>
            {{ item.type }}
          </md-table-cell>
          <md-table-cell>
            <md-button @click.prevent="deleteEntry(item.name)">
              <md-icon class="md-accent">delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <div style="margin-top: 2em" v-else>
        Nothing here to show :)
      </div>
    </div>
    <md-snackbar md-position="center" :md-active="showSnackbar" md-persistent>
      <span>Copied link to clipboard.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Ok</md-button>
    </md-snackbar>
  </div>
</template>
<script lang="ts">
import fileUpload from '@/components/FilesUpload.vue';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import Vue from "vue";
import {axiosDelete, axiosGet} from '@/utils/axiosWrapper';
import {FILES_LOCATION, MEDIA_LOCATION} from '@/config';

interface Files {
  name: string;
  link: string;
  type?: string;
}

export default Vue.extend({
  name: "Files",
  data() {
    return {
      showSnackbar: false,
      sending: false,
      files: [] as Files[]
    }
  },
  methods: {
    loadData: function () {
      const me = this
      axiosGet('/files')
          .then(function (response) {
            response.data.forEach(function (elem: string) {
              me.files.push({
                name: elem,
                link: me.isImage(elem.split('.').pop()) ? (MEDIA_LOCATION + elem) : ((FILES_LOCATION + elem)),
                type: elem.split('.').pop()
              })
            })
          })
          .catch(function (error) {
            alert("An Error occurred, please contact your web admin. \n" + error);
          });
    },
    testFileEnding: function (file: string | undefined, allowedFormats: string[]) {
      return <boolean>(file && allowedFormats.includes(file));
    }, isImage: function (file?: string): boolean {
      let allowedFormats = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG", "webp"]
      return this.testFileEnding(file, allowedFormats);
    },
    isAudio: function (file?: string): boolean {
      let allowedFormats = ["mp3", "MP3", "ogg", "OGG"]
      return this.testFileEnding(file, allowedFormats);
    },
    onSelect: function (item: Record<string, string>) {
      const me = this
      this.copyToClipboard(item.link).then(function () {
        me.showSnackbar = true;
      }, function (e) {
        console.warn('Can not copy\n' + e)
      })
    },
    deleteEntry: async function (id: string) {
      const deleted = await axiosDelete(`/files/${id}`)
      this.files = this.files.filter(e => e.name !== id)
      console.log(deleted.data)
    },
    copyToClipboard(link: string): Promise<void> {
      /***
       * Alternative Clipboard Copy function to be able to use in development area.
       * Source: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
       */
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(link)
      } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = link;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        })
      }
    },
  },
  components: {
    fileUpload
  },
  mounted() {
    this.loadData()
  }
})
</script>
<style scoped>
.content {
  margin: 2% 5% 0 5%;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

td {
  padding: 1%;
  width: 50%;
}
</style>
