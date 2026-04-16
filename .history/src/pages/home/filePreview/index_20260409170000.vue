<template>
  <div class="file">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const fileList = ref([])

const handlePreview = () => {
  console.log('handlePreview')
}
const handleRemove = () => {
  console.log('handleRemove')
}
const beforeRemove = () => {
  console.log('beforeRemove')
}

const handleExceed = () => {
  console.log('handleExceed')
}




</script>

<style lang="scss" scoped>
  
</style>