<template>
  <div class="files-upload">
    <h3 class="upload-title">Upload Files</h3>
    <FileUpload mode="advanced" :multiple="true" :customUpload="true"
                @uploader="submitFiles" :auto="false"
                chooseLabel="Add Files" uploadLabel="Submit" cancelLabel="Clear">
      <template #empty>
        <p class="upload-empty">Drag and drop files here to upload.</p>
      </template>
    </FileUpload>
    <ProgressBar v-if="query" mode="indeterminate" style="height: 6px; margin-top: 1em" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { axiosPost } from "@/utils/axiosWrapper";
import { useNotify } from "@/composables/useNotify";
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';

export default defineComponent({
  emits: ['reload'],
  components: { FileUpload, ProgressBar },
  setup() {
    const notify = useNotify();
    return { notify };
  },
  data() {
    return {
      query: false
    }
  },
  methods: {
    submitFiles(event: any) {
      this.query = true;
      const files: File[] = Array.isArray(event.files) ? event.files : [event.files];
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append(files[i].name, file);
      }

      axiosPost('/files', formData)
        .then(() => {
          this.query = false;
          this.notify.success("Files uploaded successfully.");
          this.$emit('reload');
        })
        .catch(error => {
          this.notify.error("An error occurred during upload. Please contact your web admin.\n" + error);
          this.query = false;
        });
    }
  }
})
</script>

<style scoped>
.upload-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--t-text);
  margin: 0 0 0.75rem;
}

.upload-empty {
  color: var(--t-text-muted);
  font-size: 0.875rem;
}
</style>
