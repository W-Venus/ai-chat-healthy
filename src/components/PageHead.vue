<template>
  <div class="page-head">
    <p class="page-title">{{props.title}}</p>
    <div class="action-btn">
      <slot name="buttons"  />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '页面标题'
  }
})



</script>
<style scoped lang="scss">
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .page-title {
    font-size: 24px;
    font-weight: bold;
    color: #212929;
  }
}
</style>
