import { createApp } from 'vue'
import '@/style/reset.scss'
import App from '@/App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// import HospitalTop from '@/components/hospital_top/index.vue'
// import HospitalBottom from '@/components/hospital_bottom/index.vue'

const app = createApp(App)

const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// app.component('HospitalTop', HospitalTop)
// app.component('HospitalBottom', HospitalBottom)
app.use(ElementPlus)
app.use(router)
app.use(pinia)

app.mount('#app')
