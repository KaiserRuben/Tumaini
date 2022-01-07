<template>
  <md-card class="containe">
    <md-card-header>
      <div class="md-subheading">Upload Files</div>
    </md-card-header>
    <md-card-content>
      <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()" hidden/>
      <div class="fileList md-layout md-alignment-center-left" v-for="(file, key) in files" v-bind:key="key">
        <span class="md-layout-item">{{ file.name }}</span>
        <span class="md-layout-item"><md-button class="md-right md-accent" v-on:click="removeFile( key )"><md-icon>delete_outline</md-icon></md-button></span>
      </div>
    </md-card-content>
    <md-progress-bar v-if="query" md-mode="indeterminate"></md-progress-bar>
    <md-card-actions>
      <md-button class="md-active" v-on:click="addFiles()">Add Files</md-button>
      <md-button class="md-primary" v-on:click="submitFiles()">Submit</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import Vue from "vue";
import {axiosPost} from "@/utils/axiosWrapper";

export default Vue.extend({
  data() {
    return {
      files: [],
      query: false
    }
  },
  methods: {
    addFiles() {
      this.$refs.files.click();
    },
    submitFiles() {
      this.query = true
      // Initialize the form data
      let formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];

        formData.append(this.files[i].name, file);
      }

      /*
        Make the request to the POST /select-files URL
      */
      axiosPost('/files',
          formData,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Headers': '*',
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(() => {
            this.files = []
            this.query = false
            this.$emit('reload')
          }
      ).catch(error => {
            alert("An Error occurred, please contact your web admin. \n" + error);
            this.query = false
          }
      );
    },

    handleFilesUpload() {
      let uploadedFiles = this.$refs.files.files;
      for (let i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
      }
    },
    removeFile(key) {
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
