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

interface ChunkContent {
  size: number
  text: string
  isTruncated: boolean
}
// 选择的文件
const selectedFile = ref<File | null>(null)
  // 是否自动分段
const autoChunk = ref<boolean>(false)
  // 切片内容数组
const chunkContents = ref<ChunkContent[]>([])
const error = ref<string>('')
  // 是否触发预览
const previewTriggered = ref<boolean>(false)
  // 切片大小
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
const chunkSizeMB = 5
const MAX_TEXT_PREVIEW_SIZE = 10 * 1024 // 最多预览前 10KB 文本，避免卡顿

const beforeUpload = (e: File) => {
  console.log('beforeUpload', e)
  selectedFile.value = e 
  chunkContents.value = []
  error.value = ''
  previewTriggered.value = false
}



function readBlobAsText(blob: Blob): Promise<{ text: string; isTruncated: boolean }>  {
  const maxSize = MAX_TEXT_PREVIEW_SIZE
  if(blob.size <= maxSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          text: reader.result as string,
          isTruncated: false,
        })
      }
      reader.onerror = () => reject(new Error('读取失败'))
      reader.readAsText(blob)
    })
  }
}

















const handleSuccess = () => {
  console.log('handleSuccess')
}





</script>

<style lang="scss" scoped>
  
</style>