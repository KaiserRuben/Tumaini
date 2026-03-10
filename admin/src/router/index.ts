import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { levelRequired: 0 },
        component: () => import('../views/Dashboard/Home.vue'),
      },
      {
        path: 'cms/translate',
        name: 'Translate',
        meta: {
          levelRequired: 1
        },
        component: () => import('../views/Dashboard/Translate.vue'),
      },
      {
        path: 'cms/content/:page',
        name: 'Content',
        meta: {
          levelRequired: 1
        },
        component: () => import('../views/Dashboard/Content.vue'),
      },
      {
        path: 'mail',
        name: 'Mail',
        meta: {
          levelRequired: 10
        },
        component: () => import('../views/Dashboard/Mail.vue'),
      },
      {
        path: 'files',
        name: 'Files',
        meta: {
          levelRequired: 10
        },
        component: () => import('../views/Dashboard/Files.vue'),
      },
      {
        path: 'donors',
        name: 'Donors',
        meta: {
          levelRequired: 10
        },
        component: () => import('../views/Dashboard/Donors.vue'),
      },
      {
        path: ':pathMatch(.*)*',
        meta: {
          levelRequired: 0
        },
        redirect: { name: 'Home' },
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/legal',
    name: 'Legal',
    component: () => import('../views/Legal.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const protectedRoutes = /dashboard*/

router.beforeEach((to, _from, next) => {
  const store = useAuthStore()
  store.fetchAccessToken()
  if (!["Login", "Signup", "Legal"].includes(to.name as string)) {
    console.log(`Accessing protected area: ${String(to.name)}`)
    if (store.accessToken == null) {
      if (to.fullPath.match(protectedRoutes)) {
        console.warn("Tried to access protected area without being logged in. Routing to sign-in page.")
        next('/login')
        return
      }
    }
  }
  next()
})

export default router
