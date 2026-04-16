<template>
  <div class="file">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="#"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
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

interface fileType {
  uid: string,
  name: string,
  size: number,
  type: string,
}
const file = ref<File | null>(null)
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const beforeUpload = (e: File) => {
  console.log('beforeUpload', e)
  file.value = e 
}

const handleSuccess = () => {
  console.log('handleSuccess')
}

function createChunk(file, chunkSize:number) {
	const result = []
	// 切片
	for (let i = 0; i < file.size; i += chunkSize) {
		result.push(file.slice(i, i + chunkSize))
	}
	return result
}




</script>

<style lang="scss" scoped>
  
</style>