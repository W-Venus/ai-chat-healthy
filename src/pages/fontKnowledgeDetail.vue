<template>
  <div class="articleDetail-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="bookUrl" style="width: 60px; height: 60px;" />
        <h1>知识库详情</h1>
      </div>
    </div>
    <div class="content">
      <div class="diary-card">
        <div class="title">文章信息</div>
        <div class="sub-title">
          <el-tag size="large" class="category-tag">{{ articleDetail.categoryName }}</el-tag>
          <div class="flex-box">
            <el-icon><List /></el-icon>
            <span>{{ dayjs(articleDetail.updatedAt).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <div class="article-title">{{ articleDetail.title }}</div>
        <div class="summary-content" v-if="articleDetail.summary">
          <p>{{ articleDetail.summary }}</p>
        </div>
        <div class="flex-box" style="margin-top: 20px;">
          <div class="item flex-box">
            <el-icon><Avatar /></el-icon>
            <span>{{ articleDetail.authorName }}</span>
          </div>
          <div class="item flex-box">
            <el-icon><Platform /></el-icon>
            <span>{{ articleDetail.readCount }} 次阅读</span>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <div class="title">正文内容</div>
        <div class="content-wrapper" v-html="formatContent(articleDetail.content)"></div>
        <div class="tags-content" v-if="articleDetail.tagArray && articleDetail.tagArray.length">
          <h4 class="tags-title">相关标签</h4>
          <div class="tags-list">
            <el-tag v-for="item in articleDetail.tagArray" :key="item" type="info" effect="light" class="tag-item">{{ item }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeArticleDetail } from '@/api/frontend'
import { dayjs } from 'element-plus'

const route = useRoute()

const bookUrl = new URL('@/assets/images/book.png', import.meta.url).href

// 类型定义
interface ArticleDetail {
  categoryName: string;
  updatedAt: string;
  title: string;
  summary: string;
  authorName: string;
  readCount: number;
  content: string;
  tagArray: string[];
}

const articleDetail = ref<ArticleDetail>({
  categoryName: '',
  updatedAt: '',
  title: '',
  summary: '',
  authorName: '',
  readCount: 0,
  content: '',
  tagArray: []
})

onMounted(() => {
  getKnowledgeArticleDetail(route.params.id as string).then( ({ data }) => {
    console.log(data, '详情数据')
    articleDetail.value = data.data
  })
})

// 格式化
const formatContent = (content: string): string => {
  if (!content) return ''
  // 基本的HTML清理和格式化
  let formatted = content
      .replace(/\n/g, '&lt;br&gt;')
      .replace(/\*\*(.*?)\*\*/g, '&lt;strong&gt;$1&lt;/strong&gt;')
      .replace(/\*(.*?)\*/g, '&lt;em&gt;$1&lt;/em&gt;')
  
  return formatted
}

</script>
<style scoped lang="scss">
.articleDetail-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        .item {
            margin-right: 20px;
            span {
                margin-left: 5px;
            }
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
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 15px;
                font-size: 20px;
                font-weight: 600;
                color: #374151;
            }
            .sub-title {
                margin-top: 20px;
                display: flex;
                align-items: center;
                .category-tag {
                    margin-right: 20px;
                }
            }
            .article-title {
                font-size: 28px;
                font-weight: bold;
                color: #111827;
                margin-top: 30px;
                margin-bottom: 10px;
            }
            .summary-content {
                background: rgba(126, 211, 33, 0.1);
                border-left: 4px solid #7ED321;
                padding: 10px 15px;
                border-radius: 0 8px 8px 0;
                position: relative;
            }
            .content-wrapper {
                font-size: 15px;
                color: #374151;
                :deep(p) {
                    margin-bottom: 10px;
                }
                :deep(h1),
                :deep(h2),
                :deep(h3),
                :deep(h4),
                :deep(h5),
                :deep(h6) {
                    margin: 15px 0 10px;
                    color: #111827;
                    font-weight: 600;
                }
                :deep(h2) {
                    font-size: 15px;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 5px;
                }
                :deep(h3) {
                    font-size: 13px;
                }
                :deep(ul),
                :deep(ol) {
                    padding-left: 15px;
                    margin-bottom: 10px;
                }
                :deep(li) {
                    margin-bottom: 5px;
                }
            }
            .tags-content {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e5e7eb;
                .tags-title {
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                .tags-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
            }
        }
    }
}
</style>
