// ===== src/main.js =====
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 样式文件
import './styles/main.scss'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)

// 全局属性
app.config.globalProperties.$env = import.meta.env

// 挂载应用
app.mount('#app')