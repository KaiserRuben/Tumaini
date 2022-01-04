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
    path: '/archiv/:page',
    name: 'Archiv',
    component: () => import('../views/Archiv.vue')
  },
  {
    path: '/spenden/:option',
    name: 'Spenden',
    component: () => import('../views/Spenden.vue')
  },

]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {left: 0, top: 0}
  }

})

export default router
