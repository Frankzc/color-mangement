// ===== src/stores/uiStore.js =====
import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  // 状态
  const isLoading = ref(false)
  const toast = ref({
    show: false,
    message: '',
    type: 'info', // info, success, warning, error
    duration: 3000
  })
  const modal = ref({
    show: false,
    component: null,
    props: {}
  })
  const sidebar = ref({
    show: false,
    component: null
  })
  
  // 动作
  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  const showToast = (message, type = 'info', duration = 3000) => {
    toast.value = {
      show: true,
      message,
      type,
      duration
    }
    
    setTimeout(() => {
      hideToast()
    }, duration)
  }
  
  const hideToast = () => {
    toast.value.show = false
  }
  
  const showModal = (component, props = {}) => {
    modal.value = {
      show: true,
      component,
      props
    }
  }
  
  const hideModal = () => {
    modal.value.show = false
    modal.value.component = null
    modal.value.props = {}
  }
  
  const showSidebar = (component) => {
    sidebar.value = {
      show: true,
      component
    }
  }
  
  const hideSidebar = () => {
    sidebar.value.show = false
    sidebar.value.component = null
  }
  
  return {
    // 状态
    isLoading: readonly(isLoading),
    toast: readonly(toast),
    modal: readonly(modal),
    sidebar: readonly(sidebar),
    
    // 动作
    setLoading,
    showToast,
    hideToast,
    showModal,
    hideModal,
    showSidebar,
    hideSidebar
  }
})