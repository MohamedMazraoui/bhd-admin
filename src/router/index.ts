
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { layout: "no-sidebar" },
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'reservations',
      component: () => import('@/components/Reservations.vue')
    }
  ]

})

export default router
