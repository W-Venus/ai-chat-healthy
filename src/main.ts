import { createApp } from 'vue'
import '@/style/reset.scss'
import App from '@/App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// import '@kangc/v-md-editor/lib/style/base-editor.css'
// import VMdEditor from '@kangc/v-md-editor'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css'
import Prism from 'prismjs'

VMdPreview.use(githubTheme, {
  Prism,
})

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
app.use(VMdPreview)


app.mount('#app')
