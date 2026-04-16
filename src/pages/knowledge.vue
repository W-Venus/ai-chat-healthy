<template>
  <div class="knowledge">
    <PageHead title="知识文章" >
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" fixed="left" width="450">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><Timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200" >
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><Timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="authorName" width="150" ></el-table-column>
      <el-table-column label="阅读量" prop="readCount" width="150" ></el-table-column>
      <el-table-column label="发布时间" prop="updatedAt" width="150" ></el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
          <el-button @click="handleDown(scope.row)" v-if="scope.row.status === 1" text type="waring">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      style="margin-top: 25px"
      layout="prev, pager, next" 
      :total="pagination.total" 
      :page-size="pagination.size" 
      @change="handleChange"
    />
    <ArticleDialog 
      v-model:modelValue="dialogVisible" 
      :currentArticle="currentArticle"
      :categories="categories" 
      @success="handleSuccess" 
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree, articlePage, getArticleDetail, updateStatus, deleteArticle } from '@/api/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessage } from 'element-plus'



interface FormItem {
  comp: string
  label: string
  prop: string
  placeholder: string
  options?: { label: string, value: string }[]
}

interface Article {
  id: string
  title: string
  content: string
  coverImage: string
  categoryId: string
  summary: string
  tags: string
  authorName?: string
  readCount?: number
  updatedAt?: string
  status?: number
}

interface Category {
  id: number
  categoryName: string
}

interface Pagination {
  currentPage: number
  size: number
  total: number
}

const formItem:FormItem[] = [
  { comp: 'input', label: '文章标题', prop: 'title', placeholder: '请输入文章标题' },
  { comp: 'select', label: '分类', prop: 'categoryId', placeholder: '请选择分类'  },
  { comp: 'select', label: '状态', prop: 'status', placeholder: '请选择状态', options: [
    { label: '草稿', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已下线', value: '2' },
  ]},
]

// 分页参数
const pagination = reactive<Pagination>({
  currentPage: 1,
  size: 10,
  total: 0
})
// 列表数据
const tableData = ref<any[]>([])

// 查询事件
const handleSearch = async (formData: Record<string, any> = {}) => {
  const params = {
    ...pagination,
    ...formData
  }
  const { data: { data: { records, total } } } = await articlePage(params)
  // console.log(records,'文章列表')
  tableData.value = records
  pagination.total = total
}

const handleChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}



// 分类映射
const categoryMap = reactive<Record<number, string>>({})
// 分类列表
const categories = ref<{ label: string, value: string }[]>([])
onMounted(async () => {
  const { data } = await categoryTree()
  // console.log(data, '分类列表')
  categories.value = data.data.map( (item: Category) => {
    // 分类映射表，用于查询文章时，根据分类id获取分类名称，不需要再遍历分类列表
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id.toString()
    }
  })
  formItem[1].options = categories.value


  // 初始化获取文章列表
  handleSearch()
})


// 新增和编辑
const dialogVisible = ref(false)

// 新增和编辑成功后，刷新列表
const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}

// 编辑
const currentArticle = ref<Article | null | undefined>(null)
const handleEdit = async (row: any) => {
  // 编辑时，row.id不为空，会继续执行
  // 新增时，row.id为空，不会继续执行
  if(!('id' in row) || !row.id) {
    dialogVisible.value = true
    currentArticle.value = null
    return
   }
  const { data } = await getArticleDetail(Number(row.id))
  // console.log(data, '文章详情')
  if(data.code === '200') {
    dialogVisible.value = true
    currentArticle.value = data.data
  }else {
    ElMessage.error(data.msg)
  }
}


// 发布 状态（1 发布 2下线）
const handlePublish = async (row: any) => {
  const { data } = await updateStatus(Number(row.id), { status: 1 })
  if(data.code === '200') {
    ElMessage.success('发布成功')
    handleSearch()
  }else {
    ElMessage.error(data.msg)
  }
}
// 下线 状态（1 发布 2下线）
const handleDown = async (row: any) => {
  const { data } = await updateStatus(Number(row.id), { status: 2 })
  if(data.code === '200') {
    ElMessage.success('下线成功')
    handleSearch()
  }else {
    ElMessage.error(data.msg)
  }
}


// 删除
const handleDelete = async (row: any) => {
  const { data } = await deleteArticle(Number(row.id))
  if(data.code === '200') {
    ElMessage.success('删除成功')
    handleSearch()
  }else {
    ElMessage.error(data.msg)
  }
}
</script>
<style scoped lang="scss">
.knowledge {
  height: 100%;
}
</style>
