<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的用户名和密码</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
      </el-form>
      <div class="footer">
        <p>还没有账户？ 
          <router-link to="/auth/register">去注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import router from '@/router'

const ruleFormRef = ref()
// 表单数据
const formData = reactive({
  username: '',
  password: '',
})
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 登录
// 前台 ciacai2  123456
//后台 admin 123456
const submitForm = async (formEl: any) => {
  if(!formEl) return
  formEl.validate( async (valid: boolean, fields: any) => {
    if(valid) {
      try {
        const res = await login(formData)
        const { data } = res
        // console.log(data.data, '登录data')
        if(!data.data.token) {
          return console.error('登录失败')
        }
        // 登录成功，将token 和 用户信息存储到localStorage中
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.data.userInfo))
        // 根据用户角色决定跳转的路径
        if(data.data.userType == 2) {
          router.push('/back/dashboard')
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('登录失败', error)
      }
    }else {
      console.error('表单验证失败', fields)
    }
  })
}


</script>
<style scoped lang="scss">
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7289;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
