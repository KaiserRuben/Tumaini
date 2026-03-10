<template>
  <div class="home">
    <div class="home-greeting">
      <div>
        <h2>{{ greeting }}</h2>
        <p class="greeting-date">{{ formattedDate }}</p>
      </div>
      <div class="greeting-actions">
        <Button icon="pi pi-refresh" severity="secondary" size="small" @click="loadAll" :loading="loading" />
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.label" @click="stat.action?.()">
        <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <span class="stat-sub" v-if="stat.sub">{{ stat.sub }}</span>
      </div>
    </div>

    <div class="home-grid">
      <section class="panel recent-panel">
        <div class="panel-header">
          <h3>Recent Content</h3>
          <Button label="New Report" icon="pi pi-plus" size="small"
                  @click="$router.push('/dashboard/cms/content/report')" />
        </div>
        <div v-if="recentArticles.length" class="recent-list">
          <div class="recent-item" v-for="article in recentArticles" :key="article._id"
               @click="$router.push(`/dashboard/cms/content/${article.material.toLowerCase()}`)">
            <div class="recent-thumb" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="recent-thumb recent-thumb-empty" v-else>
              <i class="pi pi-file-edit"></i>
            </div>
            <div class="recent-body">
              <span class="recent-title">{{ article.title }}</span>
              <span class="recent-meta">
                <Tag :value="article.material" :severity="article.material === 'REPORT' ? undefined : 'warn'" />
                <span :class="['recent-status', article.published ? 'published' : 'draft']">
                  {{ article.published ? 'Published' : 'Draft' }}
                </span>
              </span>
            </div>
            <span class="recent-date">{{ formatDate(article.created) }}</span>
          </div>
        </div>
        <div v-else class="panel-empty">
          <i class="pi pi-inbox"></i>
          <span>No content yet</span>
        </div>
      </section>

      <div class="right-col">
        <section class="panel donor-panel">
          <div class="panel-header">
            <h3>Donor Pipeline</h3>
            <Button label="View All" icon="pi pi-arrow-right" iconPos="right" text size="small"
                    @click="$router.push({ name: 'Donors' })" />
          </div>
          <div class="funnel" v-if="donorStages.length">
            <div class="funnel-stage" v-for="stage in donorStages" :key="stage.label">
              <div class="funnel-bar-track">
                <div class="funnel-bar" :style="{ width: stage.pct + '%', background: stage.color }"></div>
              </div>
              <div class="funnel-info">
                <span class="funnel-label">{{ stage.label }}</span>
                <span class="funnel-count">{{ stage.count }}</span>
              </div>
            </div>
          </div>
          <div v-else class="panel-empty panel-empty-sm">
            <span>No donors yet</span>
          </div>
        </section>

        <section class="panel actions-panel">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <button class="action-btn" @click="$router.push('/dashboard/cms/content/report')">
              <i class="pi pi-file-edit"></i><span>Reports</span>
            </button>
            <button class="action-btn" @click="$router.push('/dashboard/cms/content/project')">
              <i class="pi pi-folder-open"></i><span>Projects</span>
            </button>
            <button class="action-btn" @click="$router.push({ name: 'Mail' })">
              <i class="pi pi-envelope"></i><span>Send Mail</span>
            </button>
            <button class="action-btn" @click="$router.push({ name: 'Files' })">
              <i class="pi pi-images"></i><span>Files</span>
            </button>
            <button class="action-btn" @click="$router.push({ name: 'Translate' })">
              <i class="pi pi-language"></i><span>Translate</span>
            </button>
            <button class="action-btn" @click="$router.push({ name: 'Donors' })">
              <i class="pi pi-heart"></i><span>Donors</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { axiosGet } from '@/utils/axiosWrapper';
import { useAuthStore } from '@/store';
import type { IArticle, IDonor } from '@/types/models';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const DONOR_STAGES = [
  { key: 'CREATED', label: 'New', color: 'var(--t-brand-light)' },
  { key: 'PENDING DONATION', label: 'Pending Donation', color: 'var(--t-brand)' },
  { key: 'PENDING CONFIRMATION', label: 'Pending Confirm', color: 'var(--t-brand-dark)' },
  { key: 'DONE', label: 'Complete', color: '#2d7a3a' },
] as const;

export default defineComponent({
  name: 'Home',
  components: { Button, Tag },
  data() {
    return {
      loading: false,
      userName: '',
      reports: [] as IArticle[],
      projects: [] as IArticle[],
      donors: [] as IDonor[],
      fileCount: 0,
    };
  },
  computed: {
    greeting(): string {
      const h = new Date().getHours();
      const base = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      return this.userName ? `${base}, ${this.userName.split(' ')[0]}` : base;
    },
    formattedDate(): string {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    },
    stats() {
      const published = [...this.reports, ...this.projects].filter(a => a.published).length;
      const total = this.reports.length + this.projects.length;
      return [
        {
          label: 'Reports', value: this.reports.length, icon: 'pi pi-file-edit',
          bg: 'rgba(200,113,46,0.1)', color: 'var(--t-brand)',
          sub: `${this.reports.filter(r => r.published).length} published`,
          action: () => this.$router.push('/dashboard/cms/content/report'),
        },
        {
          label: 'Projects', value: this.projects.length, icon: 'pi pi-folder-open',
          bg: 'rgba(45,122,58,0.1)', color: '#2d7a3a',
          sub: `${this.projects.filter(p => p.published).length} published`,
          action: () => this.$router.push('/dashboard/cms/content/project'),
        },
        {
          label: 'Donors', value: this.donors.length, icon: 'pi pi-heart',
          bg: 'rgba(194,102,74,0.1)', color: 'var(--t-terracotta)',
          sub: `${this.donors.filter(d => d.status === 'DONE').length} complete`,
          action: () => this.$router.push({ name: 'Donors' }),
        },
        {
          label: 'Files', value: this.fileCount, icon: 'pi pi-images',
          bg: 'rgba(120,113,108,0.1)', color: 'var(--t-text-muted)',
          sub: undefined,
          action: () => this.$router.push({ name: 'Files' }),
        },
      ];
    },
    recentArticles(): IArticle[] {
      return [...this.reports, ...this.projects]
        .sort((a, b) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime())
        .slice(0, 6);
    },
    donorStages() {
      if (!this.donors.length) return [];
      const max = Math.max(...DONOR_STAGES.map(s => this.donors.filter(d => d.status === s.key).length), 1);
      return DONOR_STAGES.map(s => {
        const count = this.donors.filter(d => d.status === s.key).length;
        return { ...s, count, pct: (count / max) * 100 };
      });
    },
  },
  methods: {
    async loadAll() {
      this.loading = true;
      try {
        const userId = useAuthStore().accessToken;
        const [reports, projects, donors, files, user] = await Promise.all([
          axiosGet('/content/article/material/REPORT'),
          axiosGet('/content/article/material/PROJECT'),
          axiosGet('/donor/'),
          axiosGet('/files'),
          userId ? axiosGet('/users/' + userId) : Promise.resolve({ data: null }),
        ]);
        this.reports = reports.data || [];
        this.projects = projects.data || [];
        this.donors = donors.data || [];
        this.fileCount = (files.data || []).length;
        if (user.data?.data) this.userName = user.data.data.name || '';
        else if (user.data?.name) this.userName = user.data.name || '';
      } catch (e) {
        console.warn('Dashboard load error', e);
      }
      this.loading = false;
    },
    formatDate(d?: Date): string {
      if (!d) return '';
      const date = new Date(d);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / 86400000);
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
  },
  mounted() {
    this.loadAll();
  },
});
</script>

<style lang="scss" scoped>
.home-greeting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h2 { font-size: 1.65rem; }
  .greeting-date { color: var(--t-text-muted); font-size: 0.875rem; margin-top: 0.2rem; }
}

/* ---- Stat cards ---- */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.15rem;
  background: #fff;
  border: 1px solid var(--t-surface-cream);
  border-radius: 10px;
  cursor: pointer;
  transition: transform var(--t-duration-base) var(--t-ease), box-shadow var(--t-duration-base) var(--t-ease);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--t-text);
}

.stat-label {
  font-size: 0.775rem;
  font-weight: 500;
  color: var(--t-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-sub {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--t-text-subtle);
  white-space: nowrap;
}

/* ---- Grid ---- */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.25rem;
  align-items: start;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ---- Panels ---- */
.panel {
  background: #fff;
  border: 1px solid var(--t-surface-cream);
  border-radius: 10px;
  padding: 1.15rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h3 { font-size: 1.1rem; }
}

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: var(--t-text-subtle);
  font-size: 0.875rem;

  i { font-size: 1.5rem; }
}

.panel-empty-sm {
  padding: 1.5rem 1rem;
}

/* ---- Recent content ---- */
.recent-list {
  display: flex;
  flex-direction: column;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--t-duration-base) var(--t-ease);

  &:hover { background: var(--t-surface-cream); }
  & + & { border-top: 1px solid var(--t-surface-cream); }
  &:hover + &, & + &:hover { border-top-color: transparent; }
}

.recent-thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; }
}

.recent-thumb-empty {
  background: var(--t-surface-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t-text-subtle);
  font-size: 1rem;
}

.recent-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recent-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--t-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.recent-status {
  font-weight: 500;
  &.published { color: #2d7a3a; }
  &.draft { color: var(--t-text-subtle); }
}

.recent-date {
  font-size: 0.75rem;
  color: var(--t-text-subtle);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ---- Donor funnel ---- */
.funnel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.funnel-stage {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.funnel-bar-track {
  height: 6px;
  background: var(--t-surface-cream);
  border-radius: 3px;
  overflow: hidden;
}

.funnel-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s var(--t-ease-out);
}

.funnel-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.funnel-label {
  font-size: 0.8rem;
  color: var(--t-text-muted);
}

.funnel-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--t-text);
}

/* ---- Quick actions ---- */
.actions-panel h3 {
  font-size: 1.1rem;
  margin-bottom: 0.85rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.85rem 0.5rem;
  border: 1px solid var(--t-surface-cream);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  font: inherit;
  color: var(--t-text-muted);
  transition: background var(--t-duration-base) var(--t-ease), color var(--t-duration-base) var(--t-ease), border-color var(--t-duration-base) var(--t-ease);

  i { font-size: 1.15rem; }
  span { font-size: 0.725rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em; }

  &:hover {
    background: rgba(200, 113, 46, 0.06);
    color: var(--t-brand);
    border-color: var(--t-brand-light);
  }

  &:active {
    transform: scale(0.96);
    transition-duration: 80ms;
  }
}

/* ---- Responsive ---- */
@media (max-width: 1024px) {
  .home-grid { grid-template-columns: 1fr; }
  .stat-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stat-row { grid-template-columns: 1fr; }
  .stat-sub { display: none; }
  .actions-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
