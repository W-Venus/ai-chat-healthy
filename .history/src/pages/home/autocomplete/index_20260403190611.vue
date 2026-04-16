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
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'



</script>

<style scoped lang="scss">
.search { 
  width: 100%;
  height: 50px;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>