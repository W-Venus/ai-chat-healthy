import service from '@/utils/request'

// 注册
export const register = (data: any) => { 
  return service.post('/user/add', data)
}

// 分页查询会话列表
export const getSessionList = (params: any) => { 
  return service.get('/psychological-chat/sessions', { params })
}

// 查询会话消息列表
export const getMessages = (sessionId: string) => { 
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 新建会话
export const startSession = (data: any) => { 
  return service.post('/psychological-chat/session/start', data)
}


// 获取会话情绪分析结果
export const getEmotion = (sessionId: string) => { 
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 删除会话
export const deleteSession = (sessionId: string) => { 
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 创建或更新情绪日记
export const createEmotionDiary = (data: any) => { 
  return service.post(`/emotion-diary`, data)
}

// 查询知识文章列表
export const getKnowledgeArticleList = (params: any) => { 
  return service.get(`/knowledge/article/page`, { params })
}

// 获取知识文章详情
export const getKnowledgeArticleDetail = (id: string) => { 
  return service.get(`/knowledge/article/${id}`)
}

