import { createRouter, createWebHistory } from 'vue-router'
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
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
  // 滚动行为：控制滚动条的位置,切换路由时保持滚动条位置在最上面
  scrollBehavior() {
    return { 
      top: 0,
      left: 0
    }
  }
})