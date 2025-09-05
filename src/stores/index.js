// ===== src/stores/index.js =====
import { createPinia } from 'pinia'

const pinia = createPinia()

// 开发环境下添加调试功能
if (import.meta.env.DEV) {
  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      console.log(`🔄 Store "${store.$id}" changed:`, mutation.type, state)
    })
  })
}

export default pinia