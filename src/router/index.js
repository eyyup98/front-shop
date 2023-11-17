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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin/auth',
      name: 'auth',
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/admin/Auth.vue')
    },
    {
      path: '/admin/panel/catalogs',
      name: 'catalogs',
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/admin/Catalogs.vue')
    },
    {
      path: '/admin/panel/groups',
      name: 'groups',
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/admin/Groups.vue')
    },
  ]
})

export default router
