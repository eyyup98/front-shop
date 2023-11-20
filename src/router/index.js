import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin/auth',
      name: 'auth',
      component: () => import('../components/admin/Auth.vue')
    },
    {
      path: '/admin/panel/catalogs',
      name: 'catalogs',
      component: () => import('../components/admin/catalogs/Catalogs.vue')
    },
    {
      path: '/admin/panel/groups',
      name: 'groups',
      component: () => import('../components/admin/groups/Groups.vue')
    },
    {
      path: '/admin/panel/params',
      name: 'params',
      component: () => import('../components/admin/params/Params.vue')
    },
  ]
})

export default router
