<template>
  <div>
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