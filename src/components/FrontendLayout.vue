<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="logoUrl" style="width: 50px; height: 50px;" />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/font-consultation" class="nav-link" v-if="isLoginIn">AI咨询</router-link>
        <router-link to="/font-emotion" class="nav-link" v-if="isLoginIn">情绪日记</router-link>
        <router-link to="/font-knowledge" class="nav-link">知识库</router-link>
        <el-button v-if="isLoginIn" class="logout-btn" @click="loginOut">退出登录</el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-container">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>心理健康AI助手 &copy; 2026</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/admin'

const router = useRouter()

const logoUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
const isLoginIn = ref(false)

onMounted(() => {
    isLoginIn.value = localStorage.getItem('token') !== null
})

// 退出登录
const loginOut = () => {
    logout().then(() => {
      // 清除登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 跳转登录页
      router.push({ name: 'login' })
    })
}
</script>

<style scoped lang="scss">
.frontend-layout {
  background-color: #fff;
  .navbar-container {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .brand-section {
          display: flex;
          align-items: center;
          .brand-name {
              margin-left: 10px;
              font-size: 24px;
              font-weight: 600;
              color: #333;
          }
      }
      .nav-section {
          display: flex;
          align-items: center;
          gap: 40px;
          .nav-link {
              color: #4b5563;
              font-size: 16px;
              font-weight: 500;
              &:hover {
                  color: #4A90E2;
              }
          }
      }
  }
  .footer-container {
      background: #1f2937;
      color: white;
      padding: 15px 0;
      margin-top: auto;
      .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 10px;
          text-align: center;
      }
  }
}
</style>
