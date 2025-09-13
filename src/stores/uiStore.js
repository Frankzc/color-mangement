// src/stores/uiStore.js - 最小化修复
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // 加载状态
  const isLoading = ref(false)
  const loadingText = ref('')
  
  // 消息提示状态
  const messages = ref([])
  const nextMessageId = ref(1)
  
  // 模态框状态
  const modals = reactive({
    colorDetail: {
      visible: false,
      color: null
    },
    createScheme: {
      visible: false,
      colors: []
    }
  })
  
  // 通用设置
  const theme = ref('light')
  const sidebarCollapsed = ref(false)
  
  // 加载控制
  const setLoading = (loading, text = '') => {
    isLoading.value = loading
    loadingText.value = text
  }
  
  const showLoading = (text = '加载中...') => {
    setLoading(true, text)
  }
  
  const hideLoading = () => {
    setLoading(false, '')
  }
  
  // 消息提示（Toast）
  const showMessage = (title, type = 'info', message = '', options = {}) => {
    const toast = {
      id: nextMessageId.value++,
      title,
      message,
      type,
      duration: options.duration ?? 4000,
      closable: options.closable ?? true,
      actions: options.actions ?? []
    }
    
    messages.value.push(toast)
    
    // 自动移除
    if (toast.duration > 0) {
      setTimeout(() => {
        removeMessage(toast.id)
      }, toast.duration)
    }
  }
  
  const showToast = (title, type = 'info') => {
    showMessage(title, type)
  }
  
  const showError = (title, message = '') => {
    showMessage(title, 'error', message, { duration: 6000 })
  }
  
  const showSuccess = (title, message = '') => {
    showMessage(title, 'success', message)
  }
  
  const removeMessage = (id) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }
  
  const clearMessages = () => {
    messages.value = []
  }
  
  // 模态框控制
  const showColorDetail = (color) => {
    modals.colorDetail.visible = true
    modals.colorDetail.color = color
  }
  
  const hideColorDetail = () => {
    modals.colorDetail.visible = false
    modals.colorDetail.color = null
  }
  
  const showCreateScheme = (colors = []) => {
    modals.createScheme.visible = true
    modals.createScheme.colors = colors
  }
  
  const hideCreateScheme = () => {
    modals.createScheme.visible = false
    modals.createScheme.colors = []
  }
  
  // 主题控制
  const setTheme = (newTheme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }
  
  // 侧边栏控制
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  // 初始化
  const initializeUI = () => {
    // 从本地存储恢复主题
    const savedTheme = localStorage.getItem('ui-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    // 从本地存储恢复侧边栏状态
    const savedSidebarState = localStorage.getItem('ui-sidebar-collapsed')
    if (savedSidebarState !== null) {
      sidebarCollapsed.value = JSON.parse(savedSidebarState)
    }
  }
  
  // 清理过期消息
  const cleanupMessages = () => {
    const now = Date.now()
    messages.value = messages.value.filter(msg => {
      if (msg.duration <= 0) return true
      return (now - msg.createdAt) < msg.duration
    })
  }
  
  // 确保完整的return语句 - 修复语法错误
  return {
    // 状态
    isLoading,
    loadingText,
    messages,
    modals,
    theme,
    sidebarCollapsed,
    
    // 加载控制
    setLoading,
    showLoading,
    hideLoading,
    
    // 消息控制
    showMessage,
    showToast,
    showError,
    showSuccess,
    removeMessage,
    clearMessages,
    
    // 模态框控制
    showColorDetail,
    hideColorDetail,
    showCreateScheme,
    hideCreateScheme,
    
    // 主题控制
    setTheme,
    toggleTheme,
    
    // 侧边栏控制
    toggleSidebar,
    setSidebarCollapsed,
    
    // 初始化
    initializeUI,
    
    // 清理
    cleanupMessages
  }
})