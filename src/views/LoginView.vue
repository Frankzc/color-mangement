// ===== src/views/LoginView.vue =====
<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Logo区域 -->
      <div class="login-header">
        <div class="logo">
          <ColorSwatchIcon class="w-12 h-12 text-blue-500" />
          <h1>Fashion Color</h1>
        </div>
        <p class="subtitle">时装设计师颜色管理系统</p>
      </div>

      <!-- 登录表单 -->
      <div class="login-form">
        <h2 class="form-title">登录您的账户</h2>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input"
              :class="{ 'form-input--error': errors.username }"
              placeholder="请输入用户名"
              required
            />
            <div v-if="errors.username" class="form-error">
              {{ errors.username }}
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': errors.password }"
                placeholder="请输入密码"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <div v-if="errors.password" class="form-error">
              {{ errors.password }}
            </div>
          </div>

          <div v-if="errors.general" class="form-error form-error--general">
            {{ errors.general }}
          </div>

          <BaseButton
            type="submit"
            :loading="isLoading"
            variant="primary"
            size="lg"
            block
          >
            登录
          </BaseButton>
        </form>

        <!-- 预设账号提示 -->
        <div class="preset-accounts">
          <p class="preset-title">预设账号信息：</p>
          <div class="account-list">
            <div class="account-item">
              <div class="account-info">
                <strong>设计师账号</strong>
                <span>用户名: designer</span>
                <span>密码: fashion123</span>
              </div>
              <BaseButton
                @click="quickLogin('designer', 'fashion123')"
                variant="secondary"
                size="sm"
                outline
              >
                快速登录
              </BaseButton>
            </div>
            
            <div class="account-item">
              <div class="account-info">
                <strong>管理员账号</strong>
                <span>用户名: admin</span>
                <span>密码: admin123</span>
              </div>
              <BaseButton
                @click="quickLogin('admin', 'admin123')"
                variant="secondary"
                size="sm"
                outline
              >
                快速登录
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能特色 -->
      <div class="features">
        <h3 class="features-title">系统特色</h3>
        <div class="features-list">
          <div class="feature-item">
            <MagnifyingGlassIcon class="w-6 h-6 text-blue-500" />
            <span>智能颜色搜索</span>
          </div>
          <div class="feature-item">
            <PhotoIcon class="w-6 h-6 text-green-500" />
            <span>图片取色功能</span>
          </div>
          <div class="feature-item">
            <HeartIcon class="w-6 h-6 text-red-500" />
            <span>收藏管理</span>
          </div>
          <div class="feature-item">
            <DevicePhoneMobileIcon class="w-6 h-6 text-purple-500" />
            <span>响应式设计</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@stores/userStore'
import { useUiStore } from '@stores/uiStore'
import {
  ColorSwatchIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  HeartIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const router = useRouter()
const userStore = useUserStore()
const uiStore = useUiStore()

// 响应式数据
const isLoading = ref(false)
const showPassword = ref(false)
const form = reactive({
  username: '',
  password: ''
})
const errors = reactive({
  username: '',
  password: '',
  general: ''
})

// 方法
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearErrors = () => {
  errors.username = ''
  errors.password = ''
  errors.general = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能少于6位'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  clearErrors()

  try {
    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = userStore.login(form.username, form.password)
    
    if (result.success) {
      uiStore.showToast(`欢迎回来，${result.user.name}！`, 'success')
      router.push('/')
    } else {
      errors.general = result.message
    }
  } catch (error) {
    console.error('登录失败:', error)
    errors.general = '登录失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const quickLogin = (username, password) => {
  form.username = username
  form.password = password
  handleLogin()
}
</script>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-container {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}

.login-header {
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  color: white;
  text-align: center;
  padding: 3rem 2rem 2rem;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .subtitle {
    opacity: 0.9;
    font-size: 0.875rem;
  }
}

.login-form {
  padding: 2rem;
  
  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &--error {
    border-color: #ef4444;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}

.password-input {
  position: relative;
  
  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    
    &:hover {
      color: #374151;
    }
  }
}

.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  &--general {
    margin-top: 0;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    text-align: center;
  }
}

.preset-accounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  
  .preset-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .account-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.75rem;
      text-align: center;
    }
  }
  
  .account-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    strong {
      color: #1f2937;
      font-size: 0.875rem;
    }
    
    span {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: 'Monaco', 'Menlo', monospace;
    }
  }
}

.features {
  background: #f9fafb;
  padding: 2rem;
  
  .features-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .features-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }
}
</style>