<template>
  <div class="container">
    <div class="title">
        <div class="title-text">
            <h2>创建您的账户</h2>
            <p>请填写注册信息</p>
        </div>
    </div>
    <div class="form-container">
        <el-form :model="formData" :rules="rules" ref="formDataRef" label-position="top" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" placeholder="请输入用户名" size="large"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"/>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large"/>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" size="large"/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" size="large"/>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" size="large" @click="submitForm(formDataRef)">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/frontend'
import { ElMessage } from 'element-plus'

const router = useRouter()


const formData = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    gender: 0,
    userType: 1, //1前台用户
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请二次确认密码', trigger: 'blur' }
    ],
})


const formDataRef = ref(null)
const submitForm = async (formEl: any) => {
    if(!formEl) return
    formEl.validate(async (_valid: boolean) => {
      const { data } = await register(formData.value)
    //   console.log(data, '注册')
      if(data.code === '200') {
        ElMessage.success('注册成功')
        router.push({ name: 'login' })
      } else {
        ElMessage.error(data.msg)
      }
    })
}
</script>

<style scoped lang="scss">
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
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