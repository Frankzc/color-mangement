<template>
  <div class="login-view">
    <div class="login-container">
      <!-- 背景装饰 -->
      <div class="login-background">
        <div class="color-circles">
          <div class="circle circle-1" style="background: #ff6b6b;"></div>
          <div class="circle circle-2" style="background: #4ecdc4;"></div>
          <div class="circle circle-3" style="background: #45b7d1;"></div>
          <div class="circle circle-4" style="background: #96ceb4;"></div>
          <div class="circle circle-5" style="background: #ffeaa7;"></div>
        </div>
      </div>
      
      <!-- 登录表单 -->
      <div class="login-card">
        <!-- Logo 和标题 -->
        <div class="login-header">
          <div class="login-logo">
            <ColorSwatchIcon class="logo-icon" />
          </div>
          <h1 class="login-title">Fashion Color</h1>
          <p class="login-subtitle">时装设计师颜色管理系统</p>
        </div>
        
        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-wrapper">
              <UserIcon class="input-icon" />
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
                :class="{ 'form-input--error': errors.username }"
                required
              />
            </div>
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <LockClosedIcon class="input-icon" />
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="form-input"
                :class="{ 'form-input--error': errors.password }"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <EyeIcon v-if="showPassword" class="toggle-icon" />
                <EyeSlashIcon v-else class="toggle-icon" />
              </button>
            </div>
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          
          <!-- 记住我和忘记密码 -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input
                v-model="credentials.rememberMe"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-label">记住我</span>
            </label>
            
            <button type="button" class="forgot-password" @click="showForgotPassword = true">
              忘记密码？
            </button>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="loginError" class="login-error">
            <ExclamationCircleIcon class="error-icon" />
            {{ loginError }}
          </div>
          
          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="isLoading"
            class="login-button"
            :class="{ 'login-button--loading': isLoading }"
          >
            <ArrowPathIcon v-if="isLoading" class="loading-icon" />
            <span>{{ isLoading ? '登录中...' : '登录' }}</span>
          </button>
        </form>
        
        <!-- 快速登录提示 -->
        <div class="quick-login">
          <p class="quick-login-title">快速体验</p>
          <div class="demo-accounts">
            <button @click="fillDemoAccount('designer')" class="demo-account">
              <UserIcon class="demo-icon" />
              设计师账号
            </button>
            <button @click="fillDemoAccount('admin')" class="demo-account">
              <CogIcon class="demo-icon" />
              管理员账号
            </button>
          </div>
        </div>
        
        <!-- 版本信息 -->
        <div class="login-footer">
          <p>© 2024 Fashion Color Management System v1.0.0</p>
        </div>
      </div>
    </div>
    
    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="forgot-modal" @click.stop>
        <div class="modal-header">
          <h3>重置密码</h3>
          <button @click="showForgotPassword = false" class="modal-close">
            <XMarkIcon class="close-icon" />
          </button>
        </div>
        <div class="modal-content">
          <p>请联系系统管理员重置密码，或使用以下演示账号：</p>
          <div class="demo-info">
            <div class="demo-item">
              <strong>设计师账号:</strong> designer / fashion123
            </div>
            <div class="demo-item">
              <strong>管理员账号:</strong> admin / admin123
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showForgotPassword = false" class="modal-button">
            我知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@stores/userStore'
import { useUIStore } from '@stores/uiStore'
import {
  ColorSwatchIcon, UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon,
  ExclamationCircleIcon, ArrowPathIcon, CogIcon, XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()
const uiStore = useUIStore()

const credentials = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const showForgotPassword = ref(false)

const validateForm = () => {
  errors.username = ''
  errors.password = ''
  loginError.value = ''
  
  if (!credentials.username.trim()) {
    errors.username = '请输入用户名'
    return false
  }
  
  if (!credentials.password.trim()) {
    errors.password = '请输入密码'
    return false
  }
  
  if (credentials.password.length < 6) {
    errors.password = '密码至少需要6位字符'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  loginError.value = ''
  
  try {
    const result = await userStore.login(credentials)
    
    if (result.success) {
      uiStore.showMessage(`欢迎回来，${result.user.name}！`, 'success')
      
      // 登录成功后跳转
      const redirectTo = router.currentRoute.value.query.redirect || '/'
      router.push(redirectTo)
    } else {
      loginError.value = result.error
      // 清空密码
      credentials.password = ''
    }
  } catch (error) {
    loginError.value = '登录时发生错误，请重试'
    console.error('登录错误:', error)
  } finally {
    isLoading.value = false
  }
}

const fillDemoAccount = (type) => {
  if (type === 'designer') {
    credentials.username = 'designer'
    credentials.password = 'fashion123'
  } else if (type === 'admin') {
    credentials.username = 'admin'
    credentials.password = 'admin123'
  }
  credentials.rememberMe = true
}

onMounted(() => {
  document.title = '登录 - Fashion Color 颜色管理系统'
  
  // 如果已经登录，直接跳转
  if (userStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 20px;
  z-index: 0;
}

.color-circles {
  position: relative;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
  
  &.circle-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.circle-2 {
    width: 60px;
    height: 60px;
    top: 20%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &.circle-3 {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 5%;
    animation-delay: 2s;
  }
  
  &.circle-4 {
    width: 70px;
    height: 70px;
    bottom: 30%;
    right: 10%;
    animation-delay: 3s;
  }
  
  &.circle-5 {
    width: 90px;
    height: 90px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.login-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: #667eea;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.login-form {
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .input-icon {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    color: #9ca3af;
    z-index: 1;
  }
  
  .form-input {
    width: 100%;
    padding: 12px 12px 12px 44px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &--error {
      border-color: #ef4444;
      
      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }
  
  .password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
    
    &:hover {
      background: #f3f4f6;
    }
  }
  
  .toggle-icon {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.forgot-password {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #5a67d8;
  }
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  color: #dc2626;
  font-size: 14px;
  
  .error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.login-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &--loading {
    cursor: not-allowed;
  }
}

.loading-icon {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.quick-login {
  text-align: center;
  margin-bottom: 24px;
  
  &-title {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 12px;
  }
}

.demo-accounts {
  display: flex;
  gap: 8px;
}

.demo-account {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
  
  .demo-icon {
    width: 14px;
    height: 14px;
  }
}

.login-footer {
  text-align: center;
  
  p {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
}

// 忘记密码弹窗
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.forgot-modal {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
  }
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.modal-content {
  padding: 24px;
  
  p {
    margin: 0 0 16px 0;
    color: #374151;
    line-height: 1.6;
  }
}

.demo-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
}

.demo-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #475569;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal-button {
  width: 100%;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #5a67d8;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .demo-accounts {
    flex-direction: column;
  }
}
</style>