<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="20">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- 动态组件 -->
            <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value=""></el-option>
                <el-option 
                  v-for="opt in item.options" 
                  :key="opt.value" 
                  :label="opt.label" 
                  :value="opt.value"
                ></el-option>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button  @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 类型定义
interface FormItem {
  comp: string;
  label: string;
  prop: string;
  placeholder: string;
  options?: { label: string; value: string }[];
  col?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const props = defineProps({
  formItem: {
    type: Array as () => FormItem[],
    default: () => [],
  },
})

const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6}
  })
  return formItem
})


const ruleFormRef = ref<any>()
// 表单数据
const formData = reactive<Record<string, any>>({})
const isComp = (comp: string) => {
  return {
    input: 'el-input',
    select: 'el-select',
  }[comp]
}

const handleSearch = () => {
  // console.log(formData)
  emit('search', formData)
}

const handleReset = (formEl: any) => {
  // 先重置表单，再触发查询
  if(!formEl) return
  formEl.resetFields()
  emit('search', formData)
 }

</script>

<style scoped lang="scss">

</style>
