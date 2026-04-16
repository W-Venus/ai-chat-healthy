import service from '@/utils/request'

// 类型定义
interface BusinessInfo {
  businessId: string;
}

// 登录
export function login(data: any) {
  return service.post('/user/login', data)
}
// 退出登录
export function logout() {
  return service.post('/user/logout')
}

export function categoryTree() {
  return service.get('/knowledge/category/tree')
} 

export function articlePage(params: any) {
  return service.get('/knowledge/article/page', { params })
}

// 图片上传
export function uploadFile(file: File, businessInfo: BusinessInfo) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('fileTypebusinessField', 'cover')
  return service.post(`/file/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 创建文章
export function createArticle(data: any) {
  return service.post('/knowledge/article', data)
}
// 获取文章详情
export function getArticleDetail(id: number) {
  return service.get(`/knowledge/article/${id}`)
}
// 编辑文章
export function updateArticle(id: number, data: any) {
  return service.put(`/knowledge/article/${id}`, data)
}
// 发布/下线 
export function updateStatus(id: number, data: any) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

// 删除文章
export function deleteArticle(id: number) {
  return service.delete(`/knowledge/article/${id}`)
}

// 分页查询咨询会话
export function getConsultationPage(params: any) {
  return service.get('/psychological-chat/sessions', { params })
}

// 获取会话消息列表
export function getSessionDetail(sessionId: number) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}


// 分页查询情绪日志
export function getEmotionPage(params: any) {
  return service.get('/emotion-diary/admin/page', { params })
}

// 删除情绪日志
export function deleteEmotion(id: number) {
  return service.delete(`/emotion-diary/admin/${id}`)
}

// 获取数据总览
export function getOverview() {
  return service.get('/data-analytics/overview')
}