<template>
  <footer class="app-footer">
    <router-link to="/legal" class="footer-link">Legal / Impressum</router-link>
    <span>&copy; {{ year }} Tumaini</span>
    <span>v{{ version }}</span>
  </footer>
</template>

<script lang="ts">
import { getVersion } from '@/utils/version';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  data() {
    return {
      version: getVersion(),
      year: new Date().getFullYear()
    };
  }
});
</script>

<style scoped>
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.8rem;
  color: var(--t-text-subtle);
  border-top: 1px solid var(--t-surface-cream);
}

.footer-link {
  color: var(--t-text-subtle);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--t-brand);
}
</style>
