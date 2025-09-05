import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const messages = ref([])
  const isLoading = ref(false)
  
  const showMessage = (text, type = 'info', duration = 3000) => {
    const id = Date.now()
    const message = { id, text, type, timestamp: new Date() }
    
    messages.value.push(message)
    
    // 控制台输出消息
    const emoji = {
      success: '✅',
      error: '❌', 
      warning: '⚠️',
      info: 'ℹ️'
    }
    
    console.log(`${emoji[type] || 'ℹ️'} ${text}`)
    
    // 自动移除消息
    setTimeout(() => {
      const index = messages.value.findIndex(msg => msg.id === id)
      if (index > -1) {
        messages.value.splice(index, 1)
      }
    }, duration)
  }
  
  const clearMessages = () => {
    messages.value = []
  }
  
  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  return {
    messages,
    isLoading,
    showMessage,
    clearMessages,
    setLoading
  }
})