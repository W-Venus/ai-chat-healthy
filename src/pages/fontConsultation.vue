<template>
  <div class="consultation-container">
    <div class="sidebar">
        <!-- AI助手信息 -->
        <div class="ai-assistant-info">
            <div class="breathing-circle">
                <el-image :src="iconUrl" style="width: 25px; height: 25px;" />
            </div>
            <div class="assistant-name">{{ userInfo?.username || '心理健康AI助手' }}</div>
            <div class="online-status">
                <i class="status-dot"></i> {{ userInfo?.status == 1 ? '在线' : '离线' }}
            </div>
        </div>
        <!-- 情感花园 -->
        <div class="emotion-garden">
            <div class="garden-header">
                <span class="garden-title">情绪花园</span>
            </div>
            <div class="emotion-info">
                <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
                <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
            </div>
            <div class="warm-tips">
                <div class="emotion-status-text">
                    <div class="status-label">今天感觉</div>
                    <div class="status-emotion">{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</div>
                </div>
                <div class="emotion-intensity">
                    <span class="intensity-dots">
                        <span class="dot" :class="{'active': getIntensityClass(currentEmotion.emotionScore) >= dot}"  v-for="(dot) in 3" :key="dot"></span>
                    </span>
                    <div class="intensity-text">{{ getRiskText(currentEmotion.riskLevel) }}</div>
                </div>
                <div class="warm-suggestion" v-if="currentEmotion.suggestion">
                    <div class="suggestion-icon">💝</div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">给你的小建议</div>
                        <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
                    </div>
                </div>
                <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
                    <div class="actions-title">治愈小行动</div>
                    <div class="actions-list">
                        <div class="action-item" v-for="item in currentEmotion.improvementSuggestions" :key="item">
                            <div class="action-icon">✨</div>
                            <div class="action-text">{{ item }}</div>
                        </div>
                    </div>
                </div>
                <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
                    <div class="notice-icon">🤗</div>
                    <div class="notice-content">
                        <div class="notice-title">温馨提示</div>
                        <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 会话列表 -->
        <div class="session-history">
            <div class="section-title">会话列表</div>
            <div class="session-list">
                <div class="session-item" v-for="item in sessionList" :key="item.id" @click="handleSessionClick(item)">
                    <div class="session-info">
                        <div class="session-title">
                            <span>{{ item.sessionTitle }}</span>
                            <div class="session-meta">
                                <span class="session-time">{{ item.startedAt }}</span>
                            </div>
                            <div class="session-preview">{{ item.lastMessageContent }}</div>
                            <div class="session-stats">
                                <span>
                                    <el-icon>
                                        <ChatRound />
                                    </el-icon>
                                    {{ item.messageCount || 0 }}
                                </span>
                                <span>
                                    <el-icon>
                                        <Clock />
                                    </el-icon>
                                    {{ item.durationMinutes || 0 }} 分钟
                                </span>
                            </div>
                        </div>
                        <div class="session-actions">
                            <el-button text type="danger" size="mini" @click="handleDelSession(item.id)">
                                <el-icon>
                                    <DeleteFilled />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    </div>
    <div class="chat-main">
        <div class="chat-header">
            <div class="header-left">
                <div class="chat-avatar">
                    <el-image :src="icon1" style="width: 30px; height: 30px;" />
                </div>
                <div class="chat-info">
                    <h2>AI助手</h2>
                    <p>您贴心的心理健康助手</p>
                </div>
            </div>
            <el-button circle @click="createNewMsg">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-button>
        </div>
        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="chatMessagesRef">
            <!-- 欢迎语 -->
            <div class="message-item ai-message" v-if="messages.length === 0">
                <div class="message-avatar">
                    <el-image :src="iconUrl" style="width: 18px; height: 18px;" />
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>您好！我是小杜，您的AI心理健康助手，很高兴陪伴您，您可以向我咨询任何问题，我会尽力回答您。</p>
                    </div>
                    <div class="message-time">刚刚</div>
                </div>
            </div>
            <!-- 会话消息列表 -->
             <div class="message-item" :class="msg.senderType === 1 ? 'user-message': 'ai-message'" v-for="msg in messages" :key="msg.id">
                <div class="message-avatar">
                    <el-image :src="msg.senderType === 1 ? userIcon: iconUrl" style="width: 18px; height: 18px;" />
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <!-- AI助手思考中 -->
                        <div v-if="msg.senderType === 2 && isAiThinking && !msg.content" class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                        <!-- AI错误提示 -->
                         <div v-else-if="msg.isError" class="error-message">
                            {{ msg.content }}
                         </div>
                         <!-- 正常消息 -->
                        <MarkdownRenderer  v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content" :isAiMessage="msg.senderType === 2" />
                         <p v-else-if=" msg.content" v-html="formatMessageContent(msg.content)"></p>
                    </div>
                    <div class="message-time">{{ msg.senderType === 2 && isAiThinking ? '思考中...' : msg.createdAt }}</div>
                </div>
             </div>
        </div>
        <!-- 输入区域 -->
        <div class="chat-input">
            <div class="input-container">
                <el-input 
                    v-model="userMessage" 
                    placeholder="请输入您想要分享的内容..." 
                    clearable
                    type="textarea"
                    rows="7"
                    maxlength="500"
                    resize="none"
                    :disabled="isAiThinking"
                    @keydown="handleKeyDown"
                    class="message-input"
                />
                <div class="input-footer">
                    <span>按Enter发送，Shift+Enter换行</span>
                    <span>{{ userMessage.length }} / 500</span>
                </div>
            </div>
            <el-button class="send-btn" type="primary" :disabled="!userMessage.trim() || userMessage.length > 500"  @click="sendMessage">
                <el-icon size="20">
                    <Top />
                </el-icon>
            </el-button>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// @ts-ignore - 暂时忽略类型声明问题
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { startSession, getSessionList, deleteSession, getMessages, getEmotion } from '@/api/frontend'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const icon1 = new URL('@/assets/images/like.png', import.meta.url).href
const userIcon = new URL('@/assets/images/users.png', import.meta.url).href

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

// 类型定义
interface Emotion {
    primaryEmotion: string;
    emotionScore: number;
    isNegative: boolean;
    riskLevel: number;
    suggestion: string;
    improvementSuggestions: string[];
    riskDescription: string;
}

interface Message {
    id: number | string;
    senderType: number;
    content: string;
    createdAt: string;
    isError?: boolean;
}

interface Session {
    sessionId: string;
    status: string;
    sessionTitle: string;
}

interface SessionParams {
    initialMessage: string;
    sessionTitle?: string;
}

interface SessionItem {
    id: number;
    sessionTitle: string;
    startedAt: string;
    lastMessageContent: string;
    messageCount?: number;
    durationMinutes?: number;
}

// 情绪花园
const currentEmotion = ref<Emotion>({
    primaryEmotion: '中性',
    emotionScore: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: '情绪状态平稳',
    improvementSuggestions: [],
    riskDescription: ''
})

const getIntensityClass = (score: number): number => {
    if(score >= 61) {
        return 3
    }
    if(score >= 31) {
        return 2
    }
    return 1
}

const getRiskText = (level: number): string => {
    switch(level) {
        case 0:
            return '正常'
        case 1:
            return '关注'
        case 2:
            return '预警'
        case 3:
            return '危机'
        default:
            return '正常'
    }
}
// 会话项里的会话消息列表
const messages = ref<Message[]>([])
// 输入框内容
const userMessage = ref('')
// 定义一个当前会话对象
const currentSession = ref<Session | null>(null)
// 聊天消息容器引用
const chatMessagesRef = ref<HTMLElement | null>(null)

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

// 新建会话
const createNewMsg = () => {
    // 创建一个新的会话对象
    const newSession: Session = {
        sessionId: `temp_${Date.now()}`, //唯一标识
        status: 'TEMP', //TEMP：临时会话  END：已结束
        sessionTitle: '新对话', //会话标题
    }
    currentSession.value = newSession
}


// 用户点击发送按钮
const sendMessage = () => {
    // 判断用户是否输入
    if (!userMessage.value.trim()) return

    if(isAiThinking.value) {
        ElMessage.error('AI助手正在思考中，请稍后再发送')
        return
    }
    // 清空输入框(代码有问题)
    const message = userMessage.value.trim()
    userMessage.value = ''

    // 如果没有会话或者是临时会话，需要创建一个新对话
    if(currentSession.value == null || currentSession.value.status === 'TEMP') {
        startNewSession(message)
    }else {
        // 继续现有对话
        messages.value.push({
            id: Date.now(),
            senderType: 1,
            content: message,
            createdAt: new Date().toISOString(), // 日期格式 2025-12-17T08:30:45.123Z
        })
        // 自动滚动到底部
        scrollToBottom()
        // 开始流式对话
        startAiResponse(currentSession.value.sessionId, message)
    }
}

const startNewSession = (message: string) => {
    // 构建一个会话参数
    const sessionParams: SessionParams = {
        initialMessage: message
    }
    // 初始会话的标题
    if(currentSession.value && currentSession.value.sessionTitle === '新对话') {
        sessionParams.sessionTitle = `AI助手 - ${new Date().toLocaleString()}`
    }else if (currentSession.value) {
        // 历史会话标题
        sessionParams.sessionTitle = currentSession.value.sessionTitle
    }

    // 调用后端创建对话接口
    startSession(sessionParams).then( ({data}) => {
        // console.log(data, '----dd')
        if(data.code === '200') {
            // 将后端返回的数据转为前端会话格式
            const sessionData: Session = {
                sessionId: data.data.sessionId, //唯一标识
                status: data.data.status, //TEMP：临时会话  END：已结束
                sessionTitle: sessionParams.sessionTitle || '新对话', //会话标题
            }
            // 如果当前是临时会话，更新为正式会话
            if(currentSession.value && currentSession.value.status === 'TEMP') {
                Object.assign(currentSession.value, sessionData)
            }else {
                // 新会话，直接赋值
                currentSession.value = sessionData
            }
            // 刷新会话列表
            getSessionPage()
            // 添加初始用户消息
            messages.value.push({
                id: Date.now(),
                senderType: 1,
                content: message,
                createdAt: new Date().toISOString(), // 日期格式 2025-12-17T08:30:45.123Z
            })
            // 自动滚动到底部
            scrollToBottom()
            // 开始流式对话
            startAiResponse(currentSession.value!.sessionId, message)
        }
    })
}

//流式对话
const startAiResponse = (sessionId: string, userMessage: string) => {
    // 防止重复发送
    if(isAiThinking.value) {
        ElMessage.error('AI助手正在思考中，请稍后再发送')
        return
    }
    // 修改AI状态
    isAiThinking.value = true

    // ai回复时显示的默认状态
    const defaultAiMsg: Message = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
        senderType: 2,
        content: '',
        createdAt: new Date().toISOString(), // 日期格式 2025-12-17T08:30:45.123Z
    }
    // 插入默认状态消息
    messages.value.push(defaultAiMsg)
    // 调用流式接口
    const ctrl = new AbortController() // 专门用来终止fetch请求
    fetchEventSource('/api/psychological-chat/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': localStorage.getItem('token') || '',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({  //需要传递JSON字符串格式，使用JSON.stringify() 将对象转换为JSON字符串
            sessionId,
            userMessage,
        }),
        signal: ctrl.signal,
        onopen: async (response) => {
            // console.log(response)
            if(response.headers.get('Content-Type') !== 'text/event-stream') {
                ElMessage.error('后端返回的不是流/event-stream格式')
            }
        },
        onmessage: (event) => {
            // console.log(event) 
            /*
            {   data: "{\"code\":\"200\",\"msg\":\"操作成功\",\"data\":{\"content\":\"随时\",\"type\":\"normal\"}}"
                event: "message"   输出完成是 done
                id: ""
                retry: undefined 
            }
            */
            // console.log(event.data)
            const raw = event.data.trim()
            if(!raw) return
            const eventName = event.event
            // 获取当前会话的AI消息
            const aiMsg = messages.value[messages.value.length - 1]
            if (eventName === 'done') {
                isAiThinking.value = false
                // 终止请求
                ctrl.abort()
                // 开始情绪分析
                if (currentSession.value) {
                    getEmotionResult(currentSession.value.sessionId)
                }
                return
           }

           const payload = JSON.parse(raw)
           const ok = String(payload.code === '200')
           if(ok && payload.data && payload.data.content) {
               aiMsg.content += payload.data.content
               // 自动滚动到底部
               scrollToBottom()
           }else if (!ok) {
            // 错误回复的显示
            handleError(payload.message || 'AI回复失败')
            // 自动滚动到底部
            scrollToBottom()
           }
        },
        onerror: (error: any) => {
            handleError(error || 'AI回复失败')
            throw error
        },
        onclose: () => { //连接关闭后要做的事
            // 开始情绪分析
            if (currentSession.value) {
                getEmotionResult(currentSession.value.sessionId)
            }
        },
    })


}

// 错误处理函数
const handleError = (error: any) => {
    // 获取当前会话的AI消息
    const aiMsg = messages.value[messages.value.length - 1]
    if(aiMsg) {
        aiMsg.content = 'AI回复失败，请重试'
        // 自动滚动到底部
        scrollToBottom()
    }
    isAiThinking.value = false
    ElMessage.error(error || 'AI回复失败，请重试')
}







// AI助手是否正在请求大模型
const isAiThinking = ref(false)

// 回车
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        sendMessage()
    }
}

onMounted(() => {
    // 初始化时创建一个新会话
    createNewMsg()
    getSessionPage()
})

// 查询会话列表
const sessionList = ref<SessionItem[]>([])
const getSessionPage = async () => {
    const { data: {data: {records}}} = await getSessionList({
        pageNum: 1,
        pageSize: 10,
    })
    sessionList.value = records
}


// 点击会话列表项
const handleSessionClick = (item: SessionItem) => {
    // console.log(item, '----当前会话对象')
    getMessages(item.id.toString()).then( ({data}) => {
        if(data.code === '200') {
            messages.value = data.data
        }    
        getEmotionResult(item.id)
        // 更新当前会话对象数据
        const sessionData: Session = {
            sessionId: `session_${item.id}`,
            status: 'ACTIVE',
            sessionTitle: item.sessionTitle,
        }
        // 更新当前会话对象
        currentSession.value = sessionData
    })
}

// 删除会话
const handleDelSession = async (id: number) => {
    const {data} = await deleteSession(id.toString())
    if(data.code === '200') {
        ElMessage.success('删除成功')
        getSessionPage()
    }
}

// 格式化消息内容，将换行符替换为HTML标签
const formatMessageContent = (content: string): string => {
    return content.replace(/\n/g, '<br>')
}

// 获取情绪分析结果
const getEmotionResult = async (sessionId: string | number) => {
    // 检查sessionId 格式
    const id = sessionId.toString().startsWith('session_') ? sessionId.toString() : `session_${sessionId}`
    const {data} = await getEmotion(id)
    // console.log(data, '----情绪分析结果')
    if(data.code === '200') {
        currentEmotion.value = data.data
    }
}



</script>

<style scoped lang="scss">
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }
                &.user-message {
                    flex-direction: row-reverse;
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            // position: fixed;
            // bottom: 0;
            // left: 0;
            // right: 0;
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 40px;
                width: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>
