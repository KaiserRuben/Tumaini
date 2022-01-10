import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

import store from '@/store/index';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
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
        path: '*',
        meta: {
          levelRequired: 0
        },
        redirect: 'cms/translate',
      },
      {
        path: '',
        meta: {
          levelRequired: 0
        },
        redirect: 'cms/translate',
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
    path: '*',
    redirect: '/dashboard/cms/translate',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const protectedRoutes = /dashboard*/

router.beforeEach((to, from, next) => {
  store.dispatch('fetchAccessToken');
  if (!["Login", "Signup", "Legal"].includes(<string>to.name)) {
    console.log(`Accessing protected area: ${to.name}`)
    if (store.state.accessToken == null) {
      if (to.fullPath.match(protectedRoutes)) {
        console.warn("Tried to access protected area without being logged in. Routing to sign-in page.")
        next(`/login`);
      }
    }
  }
  next();
});

export default router
