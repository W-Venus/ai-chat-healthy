<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{route.meta.title}}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <p class="user-name">用户</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu >
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu />
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { logout } from '@/api/admin'
import { useAdminStore } from '@/stores/admin'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const adminStore = useAdminStore()

const handleCommand = (command: string) => {
  // console.log(command, '----')
  // 退出登录
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logout().then(() => {
        // 清除登录状态
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 跳转登录页
        router.push({ name: 'login' })
      })
      .catch(() => {
        ElMessage.error('退出登录失败')
      })
    })
  }
}

const handleCollapse = () => {
  adminStore.toggleCollapse()
}

</script>

<style scoped lang="scss">
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  border-bottom: 1px solid #f5f7fa;
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
      .page-title {
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;
        color: #212929;
      }
  }

}

</style>
