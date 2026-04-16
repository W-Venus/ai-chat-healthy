<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create width="100%" >
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div>
          <el-upload
            class="avatar-upload"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            :show-file-list="false"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="formData.coverImage" class="cover-remove">
            <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
          v-model="formData.content" 
          placeholder="请输入文章内容.........."
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '取消预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, reactive,computed, watch, nextTick } from 'vue'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 类型定义
interface Category {
  value: string;
  label: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  categoryId: string | null;
  summary: string;
  tags: string;
  tagArray?: string[];
}

interface EditorData {
  html: string;
  text: string;
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array as () => Category[],
    default: () => [],
  },
  currentArticle: {
    type: Object as () => Article | null,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// ! 一个代表取反  !! 两个代表转布尔值
const isEdit = computed(() => !!props.currentArticle?.id )

// 编辑逻辑，监听currentArticle变化，更新formData
watch(() => props.currentArticle, (newVal) => {
  if(newVal) {
    nextTick(() => {
      // formData = newVal   整体赋值会导致formData丢失响应式
      Object.assign(formData, newVal)
      // 使用现有id
      businessId.value = newVal.id
      // 更新封面图片url
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })
  }
})


// props是单向数据流，不能直接修改props.modelValue
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  // 重置表单
  formRef.value?.resetFields()
  // 重置ID
  businessId.value = ''
  // 重置封面图片
  handleRemove()
  // 清空标签数组
  formData.tagArray = []
  // 关闭弹窗
  emit('update:modelValue', false)
}

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  coverImage: '',
  categoryId: null as string | null,
  summary: '',
  tags: '',
  tagArray: [] as string[],
  id: '',
})
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
  ],
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', 
  '压力', '睡眠', '冥想', 
  '正念', '放松', '心理健康', 
  '自我成长', '人际关系', 
  '工作压力', '学习方法', '生活技巧'
]

const imgUrl = ref('')
// 上传前校验
const beforeUpload = (file: File) => {
  // console.log(file)
  // file.type.startsWith('image/') 检查文件类型是否为图片
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if(!isImage) {
    ElMessage.error('请上传图片文件')
    return false
  }
  if(!isLt5M) {
    ElMessage.error('上传封面图片, 图片大小不能超过5MB')
    return false
  }
  return true
}
const businessId = ref('')
// 上传请求
const handleUploadRequest = async ({file}: {file: File}) => {
  // uuid生成业务id
  // crypto  = JS 原生加密工具 用于：随机数、哈希、加密、唯一 ID
  businessId.value = crypto.randomUUID()
  const { data: { data: { filePath } } } = await uploadFile(file, {
    businessId: businessId.value,
  })
  // console.log(filePath, '---fileRes')
  // 上传成功后，将完整的图片路径赋值给imgUrl
  imgUrl.value = fileBaseUrl + filePath
  // 获取到的相对路径给后端
  formData.coverImage = filePath
}
// 移除封面
const handleRemove = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}

// 富文本内容改变时触发
const handleContentChange = (data: EditorData) => {
  // console.log(data, '富文本内容改变') //{html: '<p>ddddd</p>', text: 'ddddd'}
  formData.content = data.html
}
// 创建完成后要做得事情
const editorContent = ref<any>(null)
const handleEditorCreated = (editor: any) => {
  // console.log(editor, '创建完成返回的实例')
  editorContent.value = editor
  // 编辑
  if(formData.content && editor) {
    // 因为富文本创建是异步的，所以需要等创建完成后再设置内容
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}

const btnPreview = ref(false)
const loading = ref(false)
// 提交表单
const formRef = ref<any>()
const handleSubmit = (formEl: any) => {
  // 校验表单
  formEl.validate(async(valid: boolean, _fields: any) => {
    if(!valid) {
      ElMessage.error('请填写完整信息')
      return
    }
    loading.value = true

    const submitData = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage,
        categoryId: formData.categoryId,
        summary: formData.summary,
        tags: formData.tagArray.join(','),
        id: formData.id
      }

    if(isEdit.value && props.currentArticle) {
      // 编辑文章
      const { data } = await updateArticle(Number(props.currentArticle.id), submitData)
      loading.value = false
      if(data.code === '200') {
        emit('success')
        ElMessage.success(data.msg)
      }else {
        ElMessage.error(data.msg)
      }
    }else {
      // 创建文章
      submitData.id = businessId.value
      const { data } = await createArticle(submitData)
      loading.value = false
      if(data.code === '200') {
        emit('success')
        ElMessage.success(data.msg)
      }else {
        ElMessage.error(data.msg)
      }
    }
  })
  
}

</script>
<style scoped lang="scss">
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
