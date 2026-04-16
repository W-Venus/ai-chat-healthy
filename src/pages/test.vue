<template>
  <div class="test-container">
    <div class="left">
      测试内容1
    </div>
    <div class="middle">
      测试内容2
    </div>
    <div class="right">
      测试内容3
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
<style scoped lang="scss">
.test-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .left, .right {
    width: 200px;
    height: 200px;
    background-color: pink;
  }
  .middle {
    flex: 1;
  }
}
</style>
