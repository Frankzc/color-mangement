// ===== src/stores/userStore.js =====
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  // 使用本地存储持久化用户数据
  const user = useLocalStorage('fashion_color_user', null)
  const isAuthenticated = computed(() => !!user.value)
  
  // 预设的用户账号（手动创建）
  const predefinedUsers = [
    {
      id: '1',
      username: 'designer',
      password: 'fashion123',
      name: '时装设计师',
      email: 'designer@example.com',
      avatar: '/avatar-designer.jpg',
      preferences: {
        favoriteCategories: ['红色系', '蓝色系'],
        defaultView: 'grid',
        sortBy: 'name'
      }
    },
    {
      id: '2', 
      username: 'admin',
      password: 'admin123',
      name: '管理员',
      email: 'admin@example.com',
      avatar: '/avatar-admin.jpg',
      preferences: {
        favoriteCategories: [],
        defaultView: 'list',
        sortBy: 'hue'
      }
    }
  ]
  
  // 登录
  const login = (username, password) => {
    const foundUser = predefinedUsers.find(
      u => u.username === username && u.password === password
    )
    
    if (foundUser) {
      user.value = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        preferences: foundUser.preferences,
        loginTime: new Date().toISOString()
      }
      return { success: true, user: user.value }
    }
    
    return { success: false, message: '用户名或密码错误' }
  }
  
  // 登出
  const logout = () => {
    user.value = null
  }
  
  // 更新用户偏好
  const updatePreferences = (newPreferences) => {
    if (user.value) {
      user.value.preferences = {
        ...user.value.preferences,
        ...newPreferences
      }
    }
  }
  
  // 获取用户偏好
  const getPreference = (key, defaultValue = null) => {
    return user.value?.preferences?.[key] ?? defaultValue
  }
  
  return {
    // 状态
    user: readonly(user),
    isAuthenticated,
    
    // 动作
    login,
    logout,
    updatePreferences,
    getPreference
  }
})










