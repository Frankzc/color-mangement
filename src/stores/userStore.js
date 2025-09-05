// src/stores/userStore.js - 增强的用户认证系统
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const preferences = ref({})
  const loginHistory = ref([])
  const rememberMe = ref(false)
  
  const user = computed(() => currentUser.value)
  
  const login = async (credentials) => {
    try {
      // 模拟登录验证
      const validUsers = {
        'designer': { 
          password: 'fashion123', 
          name: '时装设计师', 
          role: 'designer',
          avatar: null,
          permissions: ['read', 'create', 'update']
        },
        'admin': { 
          password: 'admin123', 
          name: '系统管理员', 
          role: 'admin',
          avatar: null,
          permissions: ['read', 'create', 'update', 'delete', 'admin']
        }
      }
      
      const userInfo = validUsers[credentials.username]
      if (userInfo && userInfo.password === credentials.password) {
        const loginTime = new Date().toISOString()
        
        currentUser.value = {
          id: credentials.username,
          username: credentials.username,
          name: userInfo.name,
          role: userInfo.role,
          avatar: userInfo.avatar,
          permissions: userInfo.permissions,
          email: `${credentials.username}@fashioncolor.com`,
          loginTime,
          lastActive: loginTime
        }
        
        isAuthenticated.value = true
        rememberMe.value = credentials.rememberMe || false
        
        // 记录登录历史
        loginHistory.value.unshift({
          timestamp: loginTime,
          ip: '192.168.1.1', // 模拟IP
          device: navigator.userAgent,
          success: true
        })
        
        // 保存到本地存储 - 根据记住我选项决定存储时长
        saveUserSession()
        
        // 加载用户偏好设置
        loadUserPreferences()
        
        return { success: true, user: currentUser.value }
      } else {
        // 记录失败登录
        loginHistory.value.unshift({
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          device: navigator.userAgent,
          success: false,
          username: credentials.username
        })
        throw new Error('用户名或密码错误')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    rememberMe.value = false
    preferences.value = {}
    
    // 清除所有存储的会话数据
    localStorage.removeItem('fashion-color-user-session')
    sessionStorage.removeItem('fashion-color-user-session')
  }
  
  const saveUserSession = () => {
    const sessionData = {
      user: currentUser.value,
      isAuthenticated: isAuthenticated.value,
      preferences: preferences.value,
      timestamp: new Date().toISOString()
    }
    
    const storage = rememberMe.value ? localStorage : sessionStorage
    storage.setItem('fashion-color-user-session', JSON.stringify(sessionData))
  }
  
  const restoreUserSession = () => {
    try {
      // 优先检查 localStorage，然后检查 sessionStorage
      let stored = localStorage.getItem('fashion-color-user-session')
      let isFromLocalStorage = true
      
      if (!stored) {
        stored = sessionStorage.getItem('fashion-color-user-session')
        isFromLocalStorage = false
      }
      
      if (stored) {
        const sessionData = JSON.parse(stored)
        
        // 检查会话是否过期
        const sessionAge = Date.now() - new Date(sessionData.timestamp).getTime()
        const maxAge = isFromLocalStorage ? 
          30 * 24 * 60 * 60 * 1000 : // localStorage: 30天
          24 * 60 * 60 * 1000 // sessionStorage: 24小时
        
        if (sessionAge < maxAge && sessionData.user) {
          currentUser.value = sessionData.user
          isAuthenticated.value = sessionData.isAuthenticated
          preferences.value = sessionData.preferences || {}
          rememberMe.value = isFromLocalStorage
          
          // 更新最后活跃时间
          if (currentUser.value) {
            currentUser.value.lastActive = new Date().toISOString()
            saveUserSession()
          }
          
          return true
        } else {
          // 会话过期，清除数据
          localStorage.removeItem('fashion-color-user-session')
          sessionStorage.removeItem('fashion-color-user-session')
        }
      }
    } catch (error) {
      console.error('恢复用户会话失败:', error)
      localStorage.removeItem('fashion-color-user-session')
      sessionStorage.removeItem('fashion-color-user-session')
    }
    return false
  }
  
  const updateProfile = (updates) => {
    if (currentUser.value) {
      currentUser.value = { 
        ...currentUser.value, 
        ...updates,
        lastActive: new Date().toISOString()
      }
      saveUserSession()
    }
  }
  
  const setPreference = (key, value) => {
    preferences.value[key] = value
    saveUserSession()
    
    // 同时保存到单独的偏好设置存储中
    const prefKey = 'fashion-color-preferences'
    const storage = rememberMe.value ? localStorage : sessionStorage
    storage.setItem(prefKey, JSON.stringify(preferences.value))
  }
  
  const getPreference = (key, defaultValue = null) => {
    return preferences.value[key] ?? defaultValue
  }
  
  const loadUserPreferences = () => {
    try {
      const prefKey = 'fashion-color-preferences'
      let stored = localStorage.getItem(prefKey)
      if (!stored) {
        stored = sessionStorage.getItem(prefKey)
      }
      
      if (stored) {
        preferences.value = { ...preferences.value, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('加载用户偏好失败:', error)
    }
  }
  
  const hasPermission = (permission) => {
    return currentUser.value?.permissions?.includes(permission) || false
  }
  
  const updateLastActive = () => {
    if (currentUser.value) {
      currentUser.value.lastActive = new Date().toISOString()
      saveUserSession()
    }
  }
  
  // 自动更新活跃时间
  setInterval(() => {
    if (isAuthenticated.value) {
      updateLastActive()
    }
  }, 5 * 60 * 1000) // 每5分钟更新一次
  
  return {
    currentUser,
    isAuthenticated,
    user,
    preferences,
    loginHistory,
    rememberMe,
    login,
    logout,
    saveUserSession,
    restoreUserSession,
    updateProfile,
    setPreference,
    getPreference,
    loadUserPreferences,
    hasPermission,
    updateLastActive
  }
})