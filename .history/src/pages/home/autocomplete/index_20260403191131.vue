<template>
  <div class="search">
    <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearch"
        clearable
        class="w-50"
        placeholder="Please Input"
        @select="handleSelect"
      />
      <el-button type="primary">搜索</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'



</script>

<style scoped lang="scss">
.search { 
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}
</style>