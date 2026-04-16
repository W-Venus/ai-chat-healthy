import { createRouter, createWebHistory } from 'vue-router'
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home/index.vue'),
    },
    {
      path: '/hospital',
      component: () => import('@/pages/hospital/index.vue'),
    },
    {
      path: '/',
      redirect: '/home',
    }
  ],
})