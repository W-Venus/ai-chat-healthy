<template>
  <div>
    <Carousel />
    <Search />
    <el-row :gutter="20">
      <el-col :span="20">123</el-col>
      <el-col :span="4">456</el-col>
  </el-row>
  </div>
</template>
<script setup lang="ts">
import Carousel from './carousel/index.vue'
import Search from './search/index.vue'




</script>
<style scoped lang="scss">

</style>