<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconLike" style="width: 60px; height: 60px;" />
        <h1>知识库</h1>
      </div>
    </div>
    <div class="content">
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div class="recommend-item" v-for="item in recommendList" :key="item.id" @click="goToDetail(item.id)">
            <h4>{{ item.title }}</h4>
            <div class="read-count">
              <el-icon>
                <Histogram />
              </el-icon>
              阅读量 {{ item.readCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="article-list">
        <div class="article-item" v-for="item in articleList" :key="item.id" @click="goToDetail(item.id)">
          <el-image :src="getImage(item.coverImage)" style="width: 240px; height: 150px;" />
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag Plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div style="margin-top: 10px">
              <div class="flex-box">
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon>
                  <List />
                </el-icon>
                <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
            <div style="margin-top: 20px">
              <div class="flex-box">
                <el-icon>
                  <Platform />
                </el-icon>
                <span>观看人数：{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-pagination 
        style="margin-top: 25px"
        layout="prev, pager, next" 
        :total="pagination.total" 
        :page-size="pagination.size" 
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { getKnowledgeArticleList } from '@/api/frontend'
import { dayjs } from 'element-plus'
import { Platform } from '@element-plus/icons-vue'

const iconLike = new URL('@/assets/images/book.png', import.meta.url).href

// 类型定义
interface Article {
  id: number;
  title: string;
  coverImage: string;
  categoryName: string;
  authorName: string;
  updatedAt: string;
  readCount: number;
}

interface Pagination {
  currentPage: number;
  size: number;
  total: number;
}

// 推荐阅读列表
const recommendList = ref<Article[]>([])
// 分页参数
const pagination = reactive<Pagination>({
  currentPage: 1,
  size: 10,
  total: 0
})

const articleList = ref<Article[]>([])

onMounted(() => {
  // 获取推荐阅读列表
  const params = {
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: 1,
    size: 10
  }
  getKnowledgeArticleList(params).then( ({ data }) => {
      recommendList.value = data.data.records
  })
  getArticleList()
})

// 获取列表数据
const getArticleList = () => {

  const params = {
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination
  }
  getKnowledgeArticleList(params).then( ({ data }) => {
    // console.log(data, '列表数据')
    articleList.value = data.data.records
    pagination.total = data.data.total
  })
}

// 获取封面图
const getImage = (url: string): string => {
  return  url ? `http://159.75.169.224:1235${url}` : 'https://file.itndedu.com/psychology_ai.png'
}


const handleChange = (val: number) => {
  pagination.currentPage = val
  getArticleList()
}



const goToDetail = (id: number) => {
  // console.log(id, '点击文章')
  router.push(`/font-knowledge/detail/${id}`)
}

</script>

<style scoped lang="scss">
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            flex-shrink: 0;
            min-height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>
