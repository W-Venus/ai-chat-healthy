<template>
  <div>
    <Carousel />
    <Search />

    <el-row :gutter="20">
      <el-col :span="20">
        <Level />
      </el-col>
      <el-col :span="4">右侧</el-col>
  </el-row>
  </div>
</template>
<script setup lang="ts">
import Carousel from './carousel/index.vue'
import Search from './search/index.vue'
import Level from './level/index.vue'




</script>
<style scoped lang="scss">

</style>