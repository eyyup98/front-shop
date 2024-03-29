import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/client/ClientPage.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../components/client/ProductPage.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../components/client/CartProduct.vue')
    },
    {
      path: '/auth',
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
    {
      path: '/admin/panel/products',
      name: 'products',
      component: () => import('../components/admin/products/Products.vue')
    },
    {
      path: '/admin/panel/orders',
      name: 'orders',
      component: () => import('../components/admin/orders/Orders.vue')
    },
  ]
})

export default router
