<template>
  <div>
    <div class="page-header">
      <h2>Files</h2>
    </div>

    <file-upload @reload="loadData"></file-upload>

    <div class="table-wrap" v-if="files.length">
      <DataTable :value="files" :paginator="true" :rows="10"
                 class="p-datatable-sm"
                 selectionMode="single" @rowSelect="onSelect">
        <Column header="Preview" style="width: 80px">
          <template #body="{ data }">
            <img class="preview-thumb" v-if="isImage(data.type)" :src="data.link" :alt="data.name">
            <i class="pi pi-volume-up icon-preview" v-else-if="isAudio(data.type)"></i>
            <i class="pi pi-file icon-preview" v-else></i>
          </template>
        </Column>
        <Column field="name" header="Name" sortable></Column>
        <Column header="Link">
          <template #body="{ data }">
            <a :href="data.link" target="_blank">{{ data.link }}</a>
          </template>
        </Column>
        <Column field="type" header="Type" sortable></Column>
        <Column header="" style="width: 80px">
          <template #body="{ data }">
            <Button icon="pi pi-trash" severity="danger" text rounded
                    @click.stop="deleteEntry(data.name)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="empty-state" v-else>
      Nothing here to show yet.
    </div>
  </div>
</template>
<script lang="ts">
import fileUpload from '@/components/FilesUpload.vue';
import { defineComponent } from "vue";
import { axiosDelete, axiosGet } from '@/utils/axiosWrapper';
import { FILES_LOCATION, MEDIA_LOCATION } from '@/config';
import { useNotify } from '@/composables/useNotify';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

interface FileItem {
  name: string;
  link: string;
  type?: string;
}

export default defineComponent({
  name: "Files",
  components: { fileUpload, DataTable, Column, Button },
  setup() {
    const notify = useNotify();
    return { notify };
  },
  data() {
    return {
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
            this.notify.error("An error occurred, please contact your web admin.\n" + error);
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
    onSelect: function (event: { data: FileItem }) {
      this.copyToClipboard(event.data.link).then(() => {
        this.notify.info("Copied link to clipboard.");
      }, (e) => {
        console.warn('Can not copy\n' + e)
      })
    },
    deleteEntry: async function (id: string) {
      const deleted = await axiosDelete(`/files/${id}`)
      this.files = this.files.filter(e => e.name !== id)
      console.log(deleted.data)
      this.notify.success("File deleted.");
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
  mounted() {
    this.loadData()
  }
})
</script>
<style scoped>
.table-wrap {
  margin-top: 1.25rem;
}
.preview-thumb {
  height: 50px;
  border-radius: 4px;
}
.icon-preview {
  font-size: 2rem;
}
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--t-text-muted);
}

@media (max-width: 768px) {
  .page-header { flex-wrap: wrap; gap: 0.5rem; }
}
</style>
