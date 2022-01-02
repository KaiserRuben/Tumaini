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
  {
    path: '/bericht',
    name: 'Bericht',
    component: () => import('../views/Bericht.vue')
  },
  {
    path: '/berichte',
    name: 'Berichte',
    component: () => import('../views/Berichte.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
