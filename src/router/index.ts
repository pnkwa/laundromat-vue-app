import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/laundromat',
      name: 'laundromat',
      component: () => import('../views/LaundromatView.vue'),
    },
    {
      path: '/top-up',
      name: 'top-up',
      component: () => import('../views/TopUpView.vue'),
    },
  ],
})

export default router
