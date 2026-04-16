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
// 选择的文件
const selectedFile = ref<File | null>(null)
  // 是否自动分段
const autoChunk = ref<boolean>(false)
  // 切片内容数组
const chunkContents = ref<ChunkContent[]>([])
const error = ref<string>('')
  // 是否触发预览
const previewTriggered = ref<boolean>(false)
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const beforeUpload = (e: File) => {
  console.log('beforeUpload', e)
  selectedFile.value = e 
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