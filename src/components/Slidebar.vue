<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu
        default-active="2"
        class="menu-style"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <div class="brand">
          <el-image style="width: 50px; height: 50px;" :src="iconUrl" alt="logo" />
          <div v-show="!isCollapse" class="info-card">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </div>
        <el-menu-item v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path" @click="selectMenu(item.path)">
          <el-icon>
            <component :is="item.meta?.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'  
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'

const adminStore = useAdminStore()
const isCollapse = computed(() => {
  return adminStore.isCollapse
})


const router = useRouter()
const iconUrl = new URL('@/assets/images/jerry.jpg', import.meta.url).href

const selectMenu = (path: string) => {
  router.push(path)
}



</script>
<style scoped lang="scss">
.menu-style{
  height: 100%;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    .info-card {
      margin-left: 10px;
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 5px;
      }
      .brand-subtitle {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}


</style>
