<template>
  <div class="files">
    <div class="content">
      <file-upload @reload="loadData"></file-upload>
      <table class="md-table" v-if="files.length">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>Link</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in files" :key="index" @click="onSelect(item)" style="cursor: pointer;">
            <td>
              <img style="height: 50px;" v-if="isImage(item.type)" :src="item.link" :alt="item.name">
              <span class="md-icon" style="height: 50px" v-else-if="isAudio(item.type)">audiotrack</span>
              <span class="md-icon" style="height: 50px" v-else>description</span>
            </td>
            <td>{{ item.name }}</td>
            <td><a :href="item.link" target="_blank">{{ item.link }}</a></td>
            <td>{{ item.type }}</td>
            <td>
              <button class="md-button" @click.stop="deleteEntry(item.name)">
                <span class="md-icon md-accent">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 2em" v-else>
        Nothing here to show :)
      </div>
    </div>
    <div v-if="showSnackbar" class="md-snackbar">
      <span>Copied link to clipboard.</span>
      <button class="md-button md-primary" @click="showSnackbar = false">Ok</button>
    </div>
  </div>
</template>
<script lang="ts">
import fileUpload from '@/components/FilesUpload.vue';
import { defineComponent } from "vue";
import { axiosDelete, axiosGet } from '@/utils/axiosWrapper';
import { FILES_LOCATION, MEDIA_LOCATION } from '@/config';

interface FileItem {
  name: string;
  link: string;
  type?: string;
}

export default defineComponent({
  name: "Files",
  data() {
    return {
      showSnackbar: false,
      sending: false,
      files: [] as FileItem[]
    }
  },
  methods: {
    loadData: function () {
      this.files = []
      axiosGet('/files')
          .then((response) => {
            response.data.forEach((elem: string) => {
              this.files.push({
                name: elem,
                link: this.isImage(elem.split('.').pop()) ? (MEDIA_LOCATION + elem) : ((FILES_LOCATION + elem)),
                type: elem.split('.').pop()
              })
            })
          })
          .catch((error) => {
            alert("An Error occurred, please contact your web admin. \n" + error);
          });
    },
    testFileEnding: function (allowedFormats: string[], file?: string) {
      return Boolean((file && allowedFormats.includes(file)))
    },
    isImage: function (file?: string): boolean {
      let allowedFormats = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG", "webp"]
      return this.testFileEnding(allowedFormats, file);
    },
    isAudio: function (file?: string): boolean {
      let allowedFormats = ["mp3", "MP3", "ogg", "OGG"]
      return this.testFileEnding(allowedFormats, file);
    },
    onSelect: function (item: Record<string, string>) {
      this.copyToClipboard(item.link).then(() => {
        this.showSnackbar = true;
      }, (e) => {
        console.warn('Can not copy\n' + e)
      })
    },
    deleteEntry: async function (id: string) {
      const deleted = await axiosDelete(`/files/${id}`)
      this.files = this.files.filter(e => e.name !== id)
      console.log(deleted.data)
    },
    copyToClipboard(link: string): Promise<void> {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(link)
      } else {
        let textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
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
