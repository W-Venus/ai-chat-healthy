<template>
  <div>
    <el-carousel height="350px">
      <el-carousel-item v-for="item in 3" :key="item">
        <img src="../../../assets/images/壁纸.jpg" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
img {
  width: 100%;
  height: 350px;
}
</style>