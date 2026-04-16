import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'


// 路由配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/pages/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultation',
        component: () => import('@/pages/consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/pages/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('@/pages/login.vue'),
        meta: {
          title: '登录',
          icon: 'Login'
        }
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
        meta: {
          title: '注册',
          icon: 'Register'
        }
      }
    ]
  }
]

// 前台路由配置
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/pages/home.vue'),
      },
      {
        path: 'test',
        component: () => import('@/pages/test.vue'),
      },
      {
        path: 'font-consultation',
        component: () => import('@/pages/fontConsultation.vue'),
      },
      {
        path: 'font-emotion',
        component: () => import('@/pages/fontEmotion.vue'),
      },
      {
        path: 'font-knowledge',
        component: () => import('@/pages/fontKnowledge.vue'),
      },
      {
        path: 'font-knowledge/detail/:id',
        component: () => import('@/pages/fontKnowledgeDetail.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
})

// 路由前置守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      // 如果是后台用户
      if(userInfo.userType == 2){
        // 如果访问的是后台页面
        if(to.path.startsWith('/back')) {
          next()
        }else{
          next('/back/dashboard')
        }
      }else if(userInfo.userType == 1){
        // 如果是前台用户端，只能访问前台路由
        if(to.path.startsWith('/back') || to.path.startsWith('/auth'))  {
          // 去首页
          next('/')
        }else{
          next()
        }

      }
    } else {
      next('/auth/login')
    }
  } else {
    // 如果访问的是后台页面，重定向到登录页
    if(to.path.startsWith('/back')){
      next('/auth/login')
    }else{
      next()
    }
  }
})


export default router
