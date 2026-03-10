<template>
  <div class="dash">
    <aside class="dash-sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-brand" @click="navigate('Home')">
        <div class="brand-mark">T</div>
        <span class="brand-label">Tumaini</span>
      </div>

      <nav class="sidebar-nav">
        <button v-for="item in navItems" :key="item.label"
                class="nav-item" :class="{ active: item.active }"
                @click="navigate(item.target)">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user" v-if="user.name">
          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
        </div>
        <button class="nav-item logout" @click="doLogout">
          <i class="pi pi-sign-out"></i>
          <span>Log out</span>
        </button>
      </div>
    </aside>

    <transition name="fade">
      <div class="dash-overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>
    </transition>

    <main class="dash-main">
      <header class="dash-topbar">
        <button class="mobile-toggle" @click="sidebarOpen = !sidebarOpen">
          <i class="pi pi-bars"></i>
        </button>
        <span class="topbar-title">{{ currentPageTitle }}</span>
      </header>
      <div class="dash-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <footer class="dash-footer">
        <router-link to="/legal">Legal / Impressum</router-link>
        <span>&copy; {{ new Date().getFullYear() }} Tumaini</span>
      </footer>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store';
import { axiosGet } from '@/utils/axiosWrapper';
import type { IUser } from '@/types/models';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      user: { name: '', email: '' } as IUser,
      sidebarOpen: false
    };
  },
  computed: {
    userId(): string | null {
      return useAuthStore().accessToken;
    },
    currentPageTitle(): string {
      const name = this.$route.name as string;
      if (name === 'Content') {
        const page = this.$route.params.page as string;
        return page ? page.charAt(0).toUpperCase() + page.slice(1).toLowerCase() : 'Content';
      }
      return name || 'Dashboard';
    },
    navItems() {
      const route = this.$route;
      return [
        { label: 'Home', icon: 'pi pi-home', target: 'Home', active: route.name === 'Home' },
        { label: 'Translate', icon: 'pi pi-language', target: 'Translate', active: route.name === 'Translate' },
        { label: 'Reports', icon: 'pi pi-file-edit', target: '/dashboard/cms/content/report', active: route.path === '/dashboard/cms/content/report' },
        { label: 'Projects', icon: 'pi pi-folder-open', target: '/dashboard/cms/content/project', active: route.path === '/dashboard/cms/content/project' },
        { label: 'Mail', icon: 'pi pi-envelope', target: 'Mail', active: route.name === 'Mail' },
        { label: 'Donors', icon: 'pi pi-heart', target: 'Donors', active: route.name === 'Donors' },
        { label: 'Files', icon: 'pi pi-images', target: 'Files', active: route.name === 'Files' },
      ];
    }
  },
  methods: {
    navigate(target: string) {
      this.sidebarOpen = false;
      if (target.startsWith('/')) this.$router.push(target);
      else this.$router.push({ name: target });
    },
    doLogout() {
      useAuthStore().logout();
    },
    async loadUser() {
      try {
        const res = await axiosGet('/users/' + this.userId);
        if (res.data?.data) this.user = res.data.data;
      } catch (e) {
        console.warn('Could not load user', e);
      }
    }
  },
  mounted() {
    this.loadUser();
  }
});
</script>

<style lang="scss" scoped>
$sidebar-w: 240px;
$topbar-h: 56px;

.dash {
  display: flex;
  min-height: 100vh;
}

/* ---- Sidebar ---- */
.dash-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: $sidebar-w;
  background: var(--t-sidebar-bg);
  color: var(--t-sidebar-text);
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow-y: auto;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 1.5rem;
  cursor: pointer;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--t-brand);
  color: #fff;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 20px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-label {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.35rem;
  font-style: italic;
  letter-spacing: -0.01em;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: none;
  color: var(--t-sidebar-muted);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
  width: 100%;

  i { font-size: 1.05rem; width: 1.25rem; text-align: center; }

  &:hover {
    background: var(--t-sidebar-hover);
    color: var(--t-sidebar-text);
  }

  &.active {
    background: var(--t-sidebar-active);
    color: #fff;
    font-weight: 500;

    i { color: var(--t-brand-light); }
  }

  &.logout {
    color: var(--t-sidebar-muted);
    &:hover { color: var(--t-terracotta); }
  }
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: auto;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.5rem 0.65rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--t-brand-dark);
  color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--t-sidebar-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.725rem;
  color: var(--t-sidebar-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- Main ---- */
.dash-main {
  margin-left: $sidebar-w;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dash-topbar {
  height: $topbar-h;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--t-surface-cream);
  background: var(--t-surface-warm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-title {
  display: none;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.25rem;
  color: var(--t-text);
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--t-text-label);
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.75rem;
}

.dash-content {
  flex: 1;
  padding: 1.5rem;
}

.dash-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  font-size: 0.8rem;
  color: var(--t-text-subtle);
  border-top: 1px solid var(--t-surface-cream);

  a {
    color: var(--t-text-subtle);
    text-decoration: none;
    &:hover { color: var(--t-brand); }
  }
}

.dash-overlay { display: none; }

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .dash-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    &.open { transform: translateX(0); }
  }

  .dash-main { margin-left: 0; }
  .mobile-toggle { display: block; }
  .topbar-title { display: block; }

  .dash-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 199;
  }

  .dash-content { padding: 1rem; }
}
</style>
