<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="iconUrl1" style="width: 40px; height: 40px;" alt="用户头像" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ overviewData.systemOverview?.totalUsers }}</p>
              <p class="subtitle-title">活跃用户: {{ overviewData.systemOverview?.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="iconUrl2" style="width: 40px; height: 40px;" alt="用户头像" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ overviewData.systemOverview?.totalDiaries }}</p>
              <p class="subtitle-title">今日新增: {{ overviewData.systemOverview?.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="iconUrl3" style="width: 40px; height: 40px;" alt="用户头像" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ overviewData.systemOverview?.totalSessions }}</p>
              <p class="subtitle-title">今日新增: {{ overviewData.systemOverview?.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="iconUrl4" style="width: 40px; height: 40px;" alt="用户头像" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ overviewData.systemOverview?.avgMoodScore }} / 10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">
              <div class="title">情绪趋势分析</div>
              <div class="chart-content">
                <div ref="emotionChartRef" style="width: 100%; height: 300px;"></div>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="title">咨询会话统计</div>
              <div class="chart-content">
                <div v-if="overviewData.consultationStats" class="consultation-stats">
                  <div class="stat-item">
                    <div class="stat-label">总会话数</div>
                    <div class="stat-value">{{ overviewData.consultationStats?.totalSessions }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">平均时长</div>
                    <div class="stat-value">{{ overviewData.consultationStats?.avgDurationMinutes }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">活跃用户</div>
                    <div class="stat-value">{{ overviewData.systemOverview?.activeUsers }}</div>
                  </div>
                </div>
                <div ref="consultationChartRef" style="width: 100%; height: 300px;"></div>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col >
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="title">用户活跃度趋势</div>
              <div class="chart-content">
                <div ref="activeChartRef" style="width: 100%; height: 300px;"></div>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getOverview } from '@/api/admin'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 类型定义
interface SystemOverview {
  totalUsers: number;
  activeUsers: number;
  totalDiaries: number;
  todayNewDiaries: number;
  totalSessions: number;
  todayNewSessions: number;
  avgMoodScore: number;
}

interface EmotionTrendItem {
  date: string;
  avgMoodScore: number;
  recordCount: number;
}

interface ConsultationStats {
  totalSessions: number;
  avgDurationMinutes: number;
  dailyTrend: {
    date: string;
    sessionCount: number;
    userCount: number;
  }[];
}

interface UserActivityItem {
  date: string;
  activeUsers: number;
  newUsers: number;
  diaryUsers: number;
  consultationUsers: number;
}

interface OverviewData {
  systemOverview: SystemOverview;
  emotionTrend: EmotionTrendItem[];
  consultationStats: ConsultationStats;
  userActivity: UserActivityItem[];
}

// 图片引入
const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const overviewData = ref<OverviewData>({
  systemOverview: {
    totalUsers: 0,
    activeUsers: 0,
    totalDiaries: 0,
    todayNewDiaries: 0,
    totalSessions: 0,
    todayNewSessions: 0,
    avgMoodScore: 0
  },
  emotionTrend: [],
  consultationStats: {
    totalSessions: 0,
    avgDurationMinutes: 0,
    dailyTrend: []
  },
  userActivity: []
})

onMounted(() => {
  getOverview().then(res => {
    // console.log(res.data.data,'获取总览成功')
    overviewData.value = res.data.data
    initCharts()
  })
})



// 初始化图表
const initCharts = () => {
  initEmotionChart()
  initConsultationChart()
  initActiveChart()
}

// 情绪趋势分析图表
let emotionChart: echarts.ECharts | null = null
const emotionChartRef = ref<HTMLElement | null>(null)
const initEmotionChart = () => {
  if(!emotionChartRef.value) return
  // 销毁现有图表
  if(emotionChart) emotionChart.dispose()
  // 创建echarts实例
  emotionChart = echarts.init(emotionChartRef.value)
  const TrendData = overviewData.value?.emotionTrend
  if (!TrendData) return
  // 配置图表
  emotionChart.setOption({
    title: {
      text: '情绪趋势分析',
      textStyle: { //标题样式
        color: '#2d3436',
        fontSize: 16,
        fontWeight: 600,
      },
      left: 'center',
      top: 10,
    },
    tooltip: {
      trigger: 'axis', //触发类型
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: { //字体样式
        color: '#2d3436',
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40,
    },
    grid: { //控制容器样式
      top: 80,
      bottom: '3%',
      left: '3%',
      right: '4%',
    },
    xAxis: {
      type: 'category',
      data: TrendData.map((item: EmotionTrendItem) => item.date),
      axisLine: {
        color: '#2d3436'
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLine: {
          color: '#faebaf'
        },
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLine: {
          color: '#2d3436'
        },
      }
    ],
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: TrendData.map((item: EmotionTrendItem) => item.avgMoodScore),
        smooth: true, //使用平滑曲线
        lineStyle: {
          color: '#faebaf',
          width: 3,
        },
        itemStyle: {
          color: '#faebaf',
        }
      },
      {
        name: '记录数量',
        type: 'line',
        data: TrendData.map((item: EmotionTrendItem) => item.recordCount),
        smooth: true, //使用平滑曲线
        lineStyle: {
          color: '#eeb5a3',
          width: 3,
        },
        itemStyle: {
          color: '#eeb5a3',
        }
      }
    ]
  })
}

// 咨询会话统计图表
let consultationChart: echarts.ECharts | null = null
const consultationChartRef = ref<HTMLElement | null>(null)
const initConsultationChart = () => {
  if(!consultationChartRef.value) return
  // 销毁现有图表
  if(consultationChart) consultationChart.dispose()
  // 创建echarts实例
  consultationChart = echarts.init(consultationChartRef.value)
  const dailyTrend = overviewData.value?.consultationStats.dailyTrend
  if (!dailyTrend) return
  // 配置图表
  const option = {
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dailyTrend.map((item: { date: string; sessionCount: number; userCount: number }) => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: dailyTrend.map((item: { date: string; sessionCount: number; userCount: number }) => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: dailyTrend.map((item: { date: string; sessionCount: number; userCount: number }) => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  }
  consultationChart.setOption(option)
}

// 用户活跃度图表
let activeChart: echarts.ECharts | null = null
const activeChartRef = ref<HTMLElement | null>(null)
const initActiveChart = () => {
  if(!activeChartRef.value) return
  // 销毁现有图表
  if(activeChart) activeChart.dispose()
  // 创建echarts实例
  activeChart = echarts.init(activeChartRef.value)
  const activityData = overviewData.value?.userActivity
  if (!activityData) return
  const option = {
    title: {
      text: '用户活跃度趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: activityData.map((item: UserActivityItem) => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: activityData.map((item: UserActivityItem) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#a29bfe'
        },
        itemStyle: {
          color: '#a29bfe'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
              { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
            ]
          }
        }
      },
      {
        name: '新增用户',
        type: 'line',
        data: activityData.map((item: UserActivityItem) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fdcb6e'
        },
        itemStyle: {
          color: '#fdcb6e'
        }
      },
      {
        name: '日记用户',
        type: 'line',
        data: activityData.map((item: UserActivityItem) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#00b894'
        },
        itemStyle: {
          color: '#00b894'
        }
      },
      {
        name: '咨询用户',
        type: 'line',
        data: activityData.map((item: UserActivityItem) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fab1a0'
        },
        itemStyle: {
          color: '#fab1a0'
        }
      }
    ]
  }
  activeChart.setOption(option)
}


</script>

<style scoped lang="scss">
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }
</style>
