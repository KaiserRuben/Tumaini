<template>
  <div class="md-card containe">
    <div class="md-card-header">
      <div class="md-subheading">Upload Files</div>
    </div>
    <div class="md-card-content">
      <input type="file" id="files" ref="filesInput" multiple @change="handleFilesUpload()" hidden/>
      <div class="fileList" v-for="(file, key) in files" :key="key"
           style="display: flex; align-items: center; gap: 8px;">
        <span>{{ file.name }}</span>
        <button class="md-button md-accent" @click="removeFile(key)">
          <span class="md-icon">delete_outline</span>
        </button>
      </div>
    </div>
    <div v-if="query" class="md-progress-bar indeterminate">
      <div class="md-progress-bar-fill"></div>
    </div>
    <div class="md-card-actions">
      <button class="md-button" @click="addFiles()">Add Files</button>
      <button class="md-button md-primary" @click="submitFiles()">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { axiosPost } from "@/utils/axiosWrapper";

export default defineComponent({
  emits: ['reload'],
  data() {
    return {
      files: [] as File[],
      query: false
    }
  },
  methods: {
    addFiles() {
      (this.$refs.filesInput as HTMLInputElement).click();
    },
    submitFiles() {
      this.query = true
      let formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append(this.files[i].name, file);
      }

      axiosPost('/files', formData)
        .then(() => {
          this.files = []
          this.query = false
          this.$emit('reload')
        })
        .catch(error => {
          alert("An Error occurred, please contact your web admin. \n" + error);
          this.query = false
        });
    },

    handleFilesUpload() {
      const uploadedFiles = (this.$refs.filesInput as HTMLInputElement).files;
      if (uploadedFiles) {
        for (let i = 0; i < uploadedFiles.length; i++) {
          this.files.push(uploadedFiles[i]);
        }
      }
    },
    removeFile(key: number) {
      this.files.splice(key, 1);
    }
  }
})
</script>
<style>
.fileList {
  max-width: 1000px;
}
</style>
