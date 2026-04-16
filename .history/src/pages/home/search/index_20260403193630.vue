<template>
  <div class="search">
    <el-autocomplete
        class="form-autocomplete"
        clearable
        placeholder="请输入医院名称"
    />
    <el-button :icon="Search">搜索</el-button>
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'



</script>

<style scoped lang="scss">
.search { 
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  ::v-deep(.el-input__wrapper) {
    width: 600px;
    margin-right: 10px;
  }
}
</style>