import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/impressum_datenschutz/:page',
    name: 'Impressum und Datenschutz',
    component: () => import('../views/Datenschutz_Impressum.vue')
  },

  // datenschutz
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
