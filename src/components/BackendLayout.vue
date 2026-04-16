<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Slidebar />
      <el-container>
        <el-header>
          <Navbar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Slidebar from '@/components/Slidebar.vue'
import Navbar from '@/components/Navbar.vue'

</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .el-header {
      height: 74px !important;
  }
  .main-container {
    height: 100%;
    .content-container {
      padding: 20px;
      min-height: calc(100% - 74px);
      background-color: #fff;
    }
  }
  .main-content {
    flex: 1;
    .content-container {
        padding: 20px;
        background-color: #fff;
        min-height: calc(100% - 74px);
    }
  }
}
</style>
