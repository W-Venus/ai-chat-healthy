<template>
  <div class="bottom">
    <div class="content">
      <div class="left">备案0303030号  电话0000-00000000</div>
      <div class="right">
        <span>联系我们</span>
        <span>合作我们</span>
        <span>用户协议</span>
        <span>隐私协议</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
  .bottom {
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      width: 1200px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      .right {
        span {
          margin: 0 5px;
        }
      }
    }
  }
</style>