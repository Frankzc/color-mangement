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

// ===== src/components/favorites/FavoriteColorCard.vue =====
<template>
  <div class="favorite-color-card" :class="{ 'favorite-color-card--selected': selected }">
    <!-- 选择框 -->
    <div v-if="selectMode" class="selection-checkbox">
      <input
        type="checkbox"
        :checked="selected"
        @change="$emit('toggle-select', color.hex)"
      />
    </div>

    <!-- 颜色预览 -->
    <div 
      class="color-preview"
      :style="{ backgroundColor: color.hex }"
      @click="handleCardClick"
    >
      <!-- 移除按钮 -->
      <button
        @click.stop="$emit('remove', color)"
        class="remove-btn"
        title="移除收藏"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
      
      <!-- HEX值 -->
      <div class="hex-value" :style="{ color: color.contrast }">
        {{ color.hex }}
      </div>
      
      <!-- 收藏时间 -->
      <div class="favorite-date" :style="{ color: color.contrast }">
        {{ formatDate(color.addedAt) }}
      </div>
    </div>

    <!-- 颜色信息 -->
    <div class="color-info">
      <h3 class="color-name">{{ color.chinese }}</h3>
      <p class="color-english">{{ color.english }}</p>
      
      <div class="color-details">
        <span class="category">{{ color.category }}</span>
        <span v-if="color.guofeng" class="guofeng">{{ color.guofeng }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="color-actions">
        <button
          @click="$emit('view-details', color)"
          class="action-btn action-btn--primary"
        >
          查看详情
        </button>
        <button
          @click="copyHex"
          class="action-btn action-btn--secondary"
        >
          复制 HEX
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@stores/uiStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  color: {
    type: Object,
    required: true
  },
  selectMode: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-select', 'remove', 'view-details'])

const uiStore = useUiStore()

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleCardClick = () => {
  if (props.selectMode) {
    emit('toggle-select', props.color.hex)
  }
}

const copyHex = async () => {
  try {
    await navigator.clipboard.writeText(props.color.hex)
    uiStore.showToast('HEX值已复制', 'success', 2000)
  } catch (error) {
    uiStore.showToast('复制失败', 'error')
  }
}
</script>

<style lang="scss" scoped>
.favorite-color-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }
  
  &--selected {
    ring: 2px solid #3498db;
    transform: translateY(-2px);
  }
}

.selection-checkbox {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 10;
  
  input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #3498db;
  }
}

.color-preview {
  height: 120px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(239, 68, 68, 0.8);
    transform: scale(1.1);
  }
}

.hex-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  align-self: center;
}

.favorite-date {
  font-size: 0.75rem;
  text-align: center;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  padding: 0.125rem 0.25rem;
  border-radius: 0.125rem;
  align-self: center;
}

.color-info {
  padding: 1rem;
}

.color-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.color-english {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin-bottom: 0.75rem;
}

.color-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .category {
    font-size: 0.75rem;
    background: #dbeafe;
    color: #1e40af;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  }
  
  .guofeng {
    font-size: 0.75rem;
    background: #fef2f2;
    color: #dc2626;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  }
}

.color-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &--primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &--secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}
</style>

// ===== src/components/favorites/ColorSchemeCard.vue =====
<template>
  <div class="color-scheme-card">
    <!-- 配色预览 -->
    <div class="scheme-preview">
      <div
        v-for="color in scheme.colors.slice(0, 5)"
        :key="color.hex || color"
        class="scheme-color"
        :style="{ backgroundColor: color.hex || color }"
        :title="color.chinese || color"
      ></div>
      <div v-if="scheme.colors.length > 5" class="scheme-more">
        +{{ scheme.colors.length - 5 }}
      </div>
    </div>

    <!-- 方案信息 -->
    <div class="scheme-info">
      <h3 class="scheme-name">{{ scheme.name }}</h3>
      <p v-if="scheme.description" class="scheme-description">
        {{ scheme.description }}
      </p>
      
      <div class="scheme-meta">
        <span class="color-count">{{ scheme.colors.length }} 个颜色</span>
        <span class="created-date">{{ formatDate(scheme.createdAt) }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="scheme-actions">
        <button @click="$emit('view', scheme)" class="action-btn action-btn--primary">
          查看
        </button>
        <button @click="$emit('edit', scheme)" class="action-btn action-btn--secondary">
          编辑
        </button>
        <button @click="handleDelete" class="action-btn action-btn--danger">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scheme: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleDelete = () => {
  if (confirm(`确定要删除配色方案"${props.scheme.name}"吗？`)) {
    emit('delete', props.scheme)
  }
}
</script>

<style lang="scss" scoped>
.color-scheme-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }
}

.scheme-preview {
  height: 80px;
  display: flex;
  
  .scheme-color {
    flex: 1;
    min-width: 0;
  }
  
  .scheme-more {
    width: 60px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
  }
}

.scheme-info {
  padding: 1rem;
}

.scheme-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.scheme-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scheme-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.scheme-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &--primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &--secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &--danger {
    background: #fef2f2;
    color: #dc2626;
    
    &:hover {
      background: #fee2e2;
    }
  }
}
</style>

// ===== src/styles/mixins.scss =====
// 按钮混合器
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  border-radius: $rounded-lg;
  padding: $spacing-sm $spacing-md;
  font-weight: 500;
  transition: all $transition-base;
  cursor: pointer;
  
  &:hover {
    background-color: darken($bg-color, 10%);
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}

// 卡片混合器
@mixin card-style {
  background: white;
  border-radius: $rounded-xl;
  box-shadow: $shadow;
  overflow: hidden;
  transition: all $transition-base;
  
  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }
}

// 输入框混合器
@mixin input-style {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border: 2px solid $gray-300;
  border-radius: $rounded-lg;
  transition: all $transition-base;
  
  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px rgba($primary-blue, 0.1);
  }
  
  &:disabled {
    background: $gray-100;
    cursor: not-allowed;
  }
  
  &.error {
    border-color: $primary-coral;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($primary-coral, 0.1);
    }
  }
}

// 响应式混合器
@mixin respond-to($breakpoint) {
  @if $breakpoint == xs {
    @media (max-width: #{$breakpoint-sm - 1px}) { @content; }
  }
  @if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @if $breakpoint == md {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) { @content; }
  }
  @if $breakpoint == 2xl {
    @media (min-width: $breakpoint-2xl) { @content; }
  }
}

// 文本截断混合器
@mixin text-truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 居中混合器
@mixin center($direction: both) {
  position: absolute;
  
  @if $direction == both {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  } @else if $direction == vertical {
    top: 50%;
    transform: translateY(-50%);
  } @else if $direction == horizontal {
    left: 50%;
    transform: translateX(-50%);
  }
}

// 清除浮动混合器
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

// 渐变背景混合器
@mixin gradient-bg($color1, $color2, $direction: 45deg) {
  background: linear-gradient($direction, $color1 0%, $color2 100%);
}

// 阴影混合器
@mixin box-shadow($level: 1) {
  @if $level == 1 {
    box-shadow: $shadow-sm;
  } @else if $level == 2 {
    box-shadow: $shadow;
  } @else if $level == 3 {
    box-shadow: $shadow-md;
  } @else if $level == 4 {
    box-shadow: $shadow-lg;
  } @else if $level == 5 {
    box-shadow: $shadow-xl;
  }
}



// ===== src/views/FavoritesView.vue =====
<template>
  <div class="favorites-view">
    <!-- 页面头部 -->
    <div class="favorites-view__header">
      <h1 class="favorites-view__title">我的收藏</h1>
      <p class="favorites-view__subtitle">
        管理您收藏的颜色和配色方案
      </p>
      
      <!-- 统计信息 -->
      <div class="favorites-view__stats">
        <div class="stat-card">
          <div class="stat-card__number">{{ favoriteStore.favoriteCount }}</div>
          <div class="stat-card__label">收藏颜色</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__number">{{ favoriteStore.schemeCount }}</div>
          <div class="stat-card__label">配色方案</div>
        </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="favorites-view__toolbar" v-if="favoriteStore.favoriteCount > 0">
      <div class="toolbar-left">
        <BaseButton
          @click="showCreateScheme = true"
          variant="primary"
          :disabled="selectedColors.length === 0"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          创建配色方案
        </BaseButton>
        
        <BaseButton
          @click="exportFavorites"
          variant="secondary"
          outline
        >
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          导出收藏
        </BaseButton>
      </div>
      
      <div class="toolbar-right">
        <button
          @click="toggleSelectMode"
          :class="[
            'select-mode-toggle',
            { 'select-mode-toggle--active': selectMode }
          ]"
        >
          {{ selectMode ? '取消选择' : '批量选择' }}
        </button>
        
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
          >
            <Squares2X2Icon class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
          >
            <ListBulletIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="favorites-view__content">
      <!-- 空状态 -->
      <div v-if="favoriteStore.favoriteCount === 0" class="empty-state">
        <div class="empty-state__icon">
          <HeartIcon class="w-16 h-16 text-gray-300" />
        </div>
        <h3 class="empty-state__title">还没有收藏任何颜色</h3>
        <p class="empty-state__text">
          在颜色搜索页面点击心形图标来收藏您喜欢的颜色
        </p>
        <BaseButton @click="$router.push('/')" variant="primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          去搜索颜色
        </BaseButton>
      </div>

      <!-- 收藏的颜色 -->
      <div v-else>
        <!-- 配色方案列表 -->
        <div v-if="favoriteStore.schemeCount > 0" class="schemes-section">
          <h2 class="section-title">我的配色方案</h2>
          <div class="schemes-grid">
            <ColorSchemeCard
              v-for="scheme in favoriteStore.colorSchemes"
              :key="scheme.id"
              :scheme="scheme"
              @edit="editScheme"
              @delete="deleteScheme"
              @view="viewScheme"
            />
          </div>
        </div>

        <!-- 收藏颜色列表 -->
        <div class="colors-section">
          <h2 class="section-title">
            收藏的颜色
            <span class="section-count">({{ favoriteStore.favoriteCount }})</span>
          </h2>
          
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="colors-grid">
            <FavoriteColorCard
              v-for="color in favoriteStore.favoriteColors"
              :key="color.hex"
              :color="color"
              :select-mode="selectMode"
              :selected="selectedColors.includes(color.hex)"
              @toggle-select="toggleColorSelect"
              @remove="removeFavorite"
              @view-details="viewColorDetails"
            />
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="colors-list">
            <FavoriteColorRow
              v-for="color in favoriteStore.favoriteColors"
              :key="color.hex"
              :color="color"
              :select-mode="selectMode"
              :selected="selectedColors.includes(color.hex)"
              @toggle-select="toggleColorSelect"
              @remove="removeFavorite"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 创建配色方案弹窗 -->
    <CreateSchemeModal
      v-if="showCreateScheme"
      :colors="selectedColorObjects"
      @close="showCreateScheme = false"
      @created="handleSchemeCreated"
    />

    <!-- 颜色详情弹窗 -->
    <ColorDetailModal
      v-if="selectedColor"
      :color="selectedColor"
      @close="selectedColor = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUiStore } from '@stores/uiStore'
import {
  HeartIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'

import BaseButton from '@components/common/BaseButton.vue'
import FavoriteColorCard from '@components/favorites/FavoriteColorCard.vue'
import FavoriteColorRow from '@components/favorites/FavoriteColorRow.vue'
import ColorSchemeCard from '@components/favorites/ColorSchemeCard.vue'
import CreateSchemeModal from '@components/favorites/CreateSchemeModal.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'

const favoriteStore = useFavoriteStore()
const uiStore = useUiStore()

// 响应式数据
const viewMode = ref('grid') // grid 或 list
const selectMode = ref(false)
const selectedColors = ref([])
const showCreateScheme = ref(false)
const selectedColor = ref(null)

// 计算属性
const selectedColorObjects = computed(() => {
  return favoriteStore.favoriteColors.filter(color => 
    selectedColors.value.includes(color.hex)
  )
})

// 方法
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value) {
    selectedColors.value = []
  }
}

const toggleColorSelect = (hex) => {
  const index = selectedColors.value.indexOf(hex)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(hex)
  }
}

const removeFavorite = (color) => {
  favoriteStore.removeFromFavorites(color.hex)
  uiStore.showToast(`已移除 ${color.chinese}`, 'success')
}

const viewColorDetails = (color) => {
  selectedColor.value = color
}

const editScheme = (scheme) => {
  // TODO: 实现编辑配色方案
  console.log('编辑方案:', scheme)
}

const deleteScheme = (scheme) => {
  favoriteStore.deleteScheme(scheme.id)
  uiStore.showToast(`已删除方案 ${scheme.name}`, 'success')
}

const viewScheme = (scheme) => {
  favoriteStore.setCurrentScheme(scheme)
  // TODO: 跳转到方案详情页
}

const handleSchemeCreated = (scheme) => {
  showCreateScheme.value = false
  selectedColors.value = []
  selectMode.value = false
  uiStore.showToast(`配色方案 ${scheme.name} 创建成功`, 'success')
}

const exportFavorites = () => {
  const data = favoriteStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  uiStore.showToast('收藏数据已导出', 'success')
}
</script>

<style lang="scss" scoped>
.favorites-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  &__header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
    
    @media (max-width: 640px) {
      font-size: 2rem;
    }
  }
  
  &__subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }
  
  &__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    
    @media (max-width: 640px) {
      gap: 1rem;
    }
  }
  
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
  
  &__content {
    min-height: 400px;
  }
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 120px;
  
  &__number {
    font-size: 2rem;
    font-weight: 700;
    color: #3498db;
    margin-bottom: 0.5rem;
  }
  
  &__label {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.select-mode-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
  
  &--active {
    background: #3498db;
    border-color: #3498db;
    color: white;
  }
}

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  
  button {
    padding: 0.5rem;
    background: white;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
    
    &.active {
      background: #3498db;
      color: white;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  &__icon {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }
  
  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  &__text {
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

.schemes-section,
.colors-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.schemes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.colors-list {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>

// ===== src/components/color/ColorDetailModal.vue =====
<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="color-detail-modal">
        <!-- 关闭按钮 -->
        <button @click="$emit('close')" class="modal-close">
          <XMarkIcon class="w-6 h-6" />
        </button>

        <!-- 颜色预览区 -->
        <div class="color-preview" :style="{ backgroundColor: color.hex }">
          <div class="color-preview__content" :style="{ color: color.contrast }">
            <h1 class="color-preview__hex">{{ color.hex }}</h1>
            <div class="color-preview__names">
              <h2 class="chinese-name">{{ color.chinese }}</h2>
              <p class="english-name">{{ color.english }}</p>
            </div>
            <div v-if="color.guofeng" class="guofeng-badge">
              <span>国风：{{ color.guofeng }}</span>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="color-details">
          <div class="details-grid">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h3 class="section-title">基本信息</h3>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">分类:</span>
                  <span class="value category">{{ color.category }}</span>
                </div>
                <div class="info-item" v-if="color.pantone">
                  <span class="label">Pantone:</span>
                  <span class="value">{{ color.pantone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">亮度:</span>
                  <span class="value">{{ color.brightness || getBrightness(color.rgb) }}</span>
                </div>
              </div>
            </div>

            <!-- 色彩值 -->
            <div class="detail-section">
              <h3 class="section-title">色彩值</h3>
              <div class="color-values">
                <div class="value-item">
                  <span class="value-label">HEX</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.hex }}</span>
                    <button @click="copyValue(color.hex)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item">
                  <span class="value-label">RGB</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }}</span>
                    <button @click="copyValue(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item">
                  <span class="value-label">CMYK</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%</span>
                    <button @click="copyValue(`cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item" v-if="color.hsl">
                  <span class="value-label">HSL</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%</span>
                    <button @click="copyValue(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="detail-section" v-if="color.tags && color.tags.length > 0">
            <h3 class="section-title">时尚标签</h3>
            <div class="tags-container">
              <span
                v-for="tag in color.tags"
                :key="tag"
                class="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="actions-section">
            <BaseButton
              @click="toggleFavorite"
              :variant="isFavorite ? 'danger' : 'primary'"
              class="action-btn"
            >
              <HeartIcon :class="['w-4 h-4 mr-2', { 'fill-current': isFavorite }]" />
              {{ isFavorite ? '取消收藏' : '添加收藏' }}
            </BaseButton>
            
            <BaseButton
              @click="generateScheme"
              variant="secondary"
              class="action-btn"
            >
              <ColorSwatchIcon class="w-4 h-4 mr-2" />
              生成配色
            </BaseButton>
            
            <BaseButton
              @click="findSimilar"
              variant="secondary"
              outline
              class="action-btn"
            >
              <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
              相似颜色
            </BaseButton>
          </div>

          <!-- 相似颜色 -->
          <div class="detail-section" v-if="similarColors.length > 0">
            <h3 class="section-title">相似颜色</h3>
            <div class="similar-colors">
              <div
                v-for="similarColor in similarColors"
                :key="similarColor.hex"
                class="similar-color"
                :style="{ backgroundColor: similarColor.hex }"
                @click="$emit('color-change', similarColor)"
                :title="`${similarColor.chinese} (${similarColor.hex})`"
              >
                <span :style="{ color: similarColor.contrast }">
                  {{ similarColor.hex }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import { getBrightness } from '@utils/colorUtils'
import {
  XMarkIcon,
  HeartIcon,
  DocumentDuplicateIcon,
  ColorSwatchIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'color-change'])

const favoriteStore = useFavoriteStore()
const colorStore = useColorStore()
const uiStore = useUiStore()

const similarColors = ref([])

// 计算属性
const isFavorite = computed(() => favoriteStore.isFavorite(props.color.hex))

// 方法
const copyValue = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
    uiStore.showToast('已复制到剪贴板', 'success', 2000)
  } catch (error) {
    console.error('复制失败:', error)
    uiStore.showToast('复制失败', 'error')
  }
}

const toggleFavorite = () => {
  favoriteStore.toggleFavorite(props.color)
  const message = isFavorite.value ? '已从收藏中移除' : '已添加到收藏'
  uiStore.showToast(message, 'success')
}

const generateScheme = () => {
  // TODO: 实现配色方案生成
  uiStore.showToast('配色方案功能开发中...', 'info')
}

const findSimilar = () => {
  similarColors.value = colorStore.getSimilarColors(props.color, 6)
  uiStore.showToast(`找到 ${similarColors.value.length} 个相似颜色`, 'success')
}

const getTagClass = (tag) => {
  if (tag.includes('时尚')) return 'tag--fashion'
  if (tag.includes('季')) return 'tag--season'
  if (tag.includes('风格')) return 'tag--style'
  return ''
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.color-detail-modal {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.color-preview {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &__content {
    text-align: center;
  }
  
  &__hex {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 640px) {
      font-size: 2rem;
    }
  }
  
  &__names {
    margin-bottom: 1rem;
    
    .chinese-name {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      
      @media (max-width: 640px) {
        font-size: 1.5rem;
      }
    }
    
    .english-name {
      font-size: 1.25rem;
      opacity: 0.9;
      font-style: italic;
    }
  }
}

.guofeng-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: inline-block;
  
  span {
    font-weight: 500;
  }
}

.color-details {
  padding: 2rem;
}

.details-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section {
  &:not(.details-grid > &) {
    margin-bottom: 2rem;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .label {
    font-weight: 500;
    color: #6b7280;
  }
  
  .value {
    font-weight: 600;
    color: #1f2937;
    
    &.category {
      color: #3498db;
    }
  }
}

.color-values {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .value-label {
    font-weight: 600;
    color: #374151;
    min-width: 60px;
  }
  
  .value-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    justify-content: flex-end;
  }
  
  .value-text {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.875rem;
    color: #1f2937;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .copy-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
    
    &:hover {
      background: #f3f4f6;
      color: #3498db;
    }
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  &--fashion {
    background: #fce7f3;
    color: #be185d;
  }
  
  &--season {
    background: #dcfce7;
    color: #166534;
  }
  
  &--style {
    background: #ede9fe;
    color: #7c3aed;
  }
}

.actions-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  
  .action-btn {
    flex: 1;
    min-width: 150px;
    
    @media (max-width: 640px) {
      flex: none;
      width: 100%;
    }
  }
}

.similar-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.similar-color {
  height: 80px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .color-details {
    padding: 1rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
  }
}
</style>

// ===== src/views/ProfileView.vue =====
<template>
  <div class="profile-view">
    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="avatar">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
          <div v-else class="avatar-placeholder">
            <UserCircleIcon class="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <div class="user-details">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <p class="login-time">
            登录时间: {{ formatDate(user.loginTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <HeartIcon class="w-8 h-8 text-red-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ favoriteStore.favoriteCount }}</div>
          <div class="stat-label">收藏颜色</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <ColorSwatchIcon class="w-8 h-8 text-blue-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ favoriteStore.schemeCount }}</div>
          <div class="stat-label">配色方案</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <MagnifyingGlassIcon class="w-8 h-8 text-green-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ searchHistory.length }}</div>
          <div class="stat-label">搜索记录</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <ClockIcon class="w-8 h-8 text-purple-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ daysActive }}</div>
          <div class="stat-label">活跃天数</div>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-section">
      <h2 class="section-title">个人偏好设置</h2>
      
      <div class="settings-grid">
        <!-- 显示偏好 -->
        <div class="setting-card">
          <h3 class="setting-title">显示偏好</h3>
          <div class="setting-content">
            <div class="setting-item">
              <label class="setting-label">默认视图模式</label>
              <select 
                v-model="preferences.defaultView"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="grid">网格视图</option>
                <option value="list">列表视图</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">默认排序方式</label>
              <select 
                v-model="preferences.sortBy"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="name">按名称排序</option>
                <option value="hue">按色相排序</option>
                <option value="brightness">按亮度排序</option>
                <option value="saturation">按饱和度排序</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">每页显示数量</label>
              <select 
                v-model="preferences.pageSize"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="12">12个</option>
                <option value="24">24个</option>
                <option value="48">48个</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 收藏偏好 -->
        <div class="setting-card">
          <h3 class="setting-title">收藏偏好</h3>
          <div class="setting-content">
            <div class="setting-item">
              <label class="setting-label">偏爱的颜色分类</label>
              <div class="checkbox-group">
                <label 
                  v-for="category in colorStore.categories"
                  :key="category"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :value="category"
                    v-model="preferences.favoriteCategories"
                    @change="updatePreferences"
                  />
                  <span>{{ category }}</span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="preferences.showGuofengFirst"
                  @change="updatePreferences"
                />
                <span>优先显示国风颜色</span>
              </label>
            </div>
            
            <div class="setting-item">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="preferences.autoSaveSchemes"
                  @change="updatePreferences"
                />
                <span>自动保存配色方案</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="data-section">
      <h2 class="section-title">数据管理</h2>
      
      <div class="data-actions">
        <div class="action-card">
          <div class="action-info">
            <h3>导出数据</h3>
            <p>导出您的收藏颜色和配色方案</p>
          </div>
          <BaseButton @click="exportData" variant="primary">
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            导出
          </BaseButton>
        </div>
        
        <div class="action-card">
          <div class="action-info">
            <h3>导入数据</h3>
            <p>从备份文件恢复数据</p>
          </div>
          <div class="import-actions">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleFileImport"
              style="display: none"
            />
            <BaseButton @click="$refs.fileInput.click()" variant="secondary">
              <ArrowUpTrayIcon class="w-4 h-4 mr-2" />
              导入
            </BaseButton>
          </div>
        </div>
        
        <div class="action-card danger">
          <div class="action-info">
            <h3>清除数据</h3>
            <p>清除所有收藏和偏好设置</p>
          </div>
          <BaseButton @click="clearAllData" variant="danger">
            <TrashIcon class="w-4 h-4 mr-2" />
            清除
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <h2 class="section-title">最近活动</h2>
      
      <div class="activity-list">
        <div 
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">
            <component :is="activity.icon" class="w-5 h-5" />
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ formatDate(activity.time) }}</span>
          </div>
        </div>
        
        <div v-if="recentActivity.length === 0" class="empty-activity">
          <p>暂无活动记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@stores/userStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import {
  UserCircleIcon,
  HeartIcon,
  ColorSwatchIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const colorStore = useColorStore()
const uiStore = useUiStore()

// 响应式数据
const searchHistory = ref([])
const recentActivity = ref([])
const preferences = ref({
  defaultView: 'grid',
  sortBy: 'name',
  pageSize: 24,
  favoriteCategories: [],
  showGuofengFirst: false,
  autoSaveSchemes: true
})

// 计算属性
const user = computed(() => userStore.user)
const daysActive = computed(() => {
  if (!user.value?.loginTime) return 0
  const loginDate = new Date(user.value.loginTime)
  const now = new Date()
  const diffTime = Math.abs(now - loginDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// 方法
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const updatePreferences = () => {
  userStore.updatePreferences(preferences.value)
  uiStore.showToast('偏好设置已保存', 'success')
}

const exportData = () => {
  const data = {
    user: user.value,
    favorites: favoriteStore.exportData(),
    preferences: preferences.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `profile-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  uiStore.showToast('数据导出成功', 'success')
}

const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (data.favorites) {
      favoriteStore.importData(data.favorites)
    }
    
    if (data.preferences) {
      preferences.value = { ...preferences.value, ...data.preferences }
      updatePreferences()
    }
    
    uiStore.showToast('数据导入成功', 'success')
  } catch (error) {
    console.error('导入失败:', error)
    uiStore.showToast('导入失败，请检查文件格式', 'error')
  }
}

const clearAllData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    favoriteStore.clearFavorites()
    preferences.value = {
      defaultView: 'grid',
      sortBy: 'name',
      pageSize: 24,
      favoriteCategories: [],
      showGuofengFirst: false,
      autoSaveSchemes: true
    }
    updatePreferences()
    
    uiStore.showToast('所有数据已清除', 'success')
  }
}

const loadRecentActivity = () => {
  // 模拟最近活动数据
  recentActivity.value = [
    {
      id: 1,
      icon: HeartIcon,
      text: '收藏了颜色：航空蓝',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 2,
      icon: MagnifyingGlassIcon,
      text: '搜索了"红色"',
      time: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 3,
      icon: ColorSwatchIcon,
      text: '创建了配色方案：春日暖阳',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ]
}

onMounted(() => {
  // 加载用户偏好
  const userPrefs = userStore.getPreference('all', {})
  preferences.value = { ...preferences.value, ...userPrefs }
  
  // 加载活动记录
  loadRecentActivity()
})
</script>

<style lang="scss" scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    @media (max-width: 640px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .user-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .user-email {
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .login-time {
    font-size: 0.875rem;
    color: #9ca3af;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .stat-icon {
    flex-shrink: 0;
  }
  
  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 3rem;
}

.settings-grid {
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.setting-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  .setting-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .setting-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .setting-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .setting-select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }
  }
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  input[type="checkbox"] {
    accent-color: #3498db;
  }
}

.data-section {
  margin-bottom: 3rem;
}

.data-actions {
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  
  &.danger {
    border: 1px solid #fecaca;
    background: #fef2f2;
  }
  
  .action-info {
    flex: 1;
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.875rem;
      color: #6b7280;
    }
  }
  
  .import-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.activity-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  .activity-icon {
    width: 2rem;
    height: 2rem;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-text {
      font-size: 0.875rem;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .activity-time {
      font-size: 0.75rem;
      color: #9ca3af;
    }
  }
}

.empty-activity {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .settings-grid,
  .data-actions {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
}

// ===== src/components/common/BaseToast.vue =====
<template>
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="uiStore.toast.show"
        :class="[
          'toast',
          `toast--${uiStore.toast.type}`
        ]"
      >
        <div class="toast__content">
          <div class="toast__icon">
            <component :is="iconComponent" class="w-5 h-5" />
          </div>
          <p class="toast__message">{{ uiStore.toast.message }}</p>
          <button @click="uiStore.hideToast" class="toast__close">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const uiStore = useUiStore()

const iconComponent = computed(() => {
  const iconMap = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  }
  return iconMap[uiStore.toast.type] || InformationCircleIcon
})
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  min-width: 320px;
  max-width: 480px;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1100;
  
  &__content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  &__icon {
    flex-shrink: 0;
  }
  
  &__message {
    flex: 1;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  &__close {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
  
  &--info {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #93c5fd;
  }
  
  &--success {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  }
  
  &--warning {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
  }
  
  &--error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 640px) {
  .toast {
    right: 1rem;
    left: 1rem;
    min-width: auto;
  }
}
</style>

// ===== src/components/common/BaseButton.vue =====
<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--loading': loading,
        'btn--outline': outline,
        'btn--block': block,
        'btn--disabled': disabled || loading
      }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <div v-if="loading" class="btn__spinner"></div>
    <slot v-else />
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  outline: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  // 尺寸
  &--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-height: 2rem;
  }
  
  &--md {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    min-height: 2.5rem;
  }
  
  &--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 3rem;
  }
  
  // 变体
  &--primary {
    background: #3498db;
    color: white;
    
    &:hover:not(.btn--disabled) {
      background: #2980b9;
      transform: translateY(-1px);
    }
  }
  
  &--secondary {
    background: #6c757d;
    color: white;
    
    &:hover:not(.btn--disabled) {
      background: #5a6268;
      transform: translateY(-1px);
    }
  }
  
  &--success {
    background: #27ae60;
    color: white;
    
    &:hover:not(.btn--disabled) {
      background: #229954;
      transform: translateY(-1px);
    }
  }
  
  &--warning {
    background: #f39c12;
    color: white;
    
    &:hover:not(.btn--disabled) {
      background: #e67e22;
      transform: translateY(-1px);
    }
  }
  
  &--danger {
    background: #e74c3c;
    color: white;
    
    &:hover:not(.btn--disabled) {
      background: #c0392b;
      transform: translateY(-1px);
    }
  }
  
  // 轮廓样式
  &--outline {
    background: transparent;
    border-color: currentColor;
    
    &.btn--primary {
      color: #3498db;
      &:hover:not(.btn--disabled) {
        background: #3498db;
        color: white;
      }
    }
    
    &.btn--secondary {
      color: #6c757d;
      &:hover:not(.btn--disabled) {
        background: #6c757d;
        color: white;
      }
    }
    
    &.btn--success {
      color: #27ae60;
      &:hover:not(.btn--disabled) {
        background: #27ae60;
        color: white;
      }
    }
    
    &.btn--warning {
      color: #f39c12;
      &:hover:not(.btn--disabled) {
        background: #f39c12;
        color: white;
      }
    }
    
    &.btn--danger {
      color: #e74c3c;
      &:hover:not(.btn--disabled) {
        background: #e74c3c;
        color: white;
      }
    }
  }
  
  // 块级
  &--block {
    width: 100%;
  }
  
  // 加载状态
  &--loading {
    pointer-events: none;
  }
  
  &__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  .btn {
    min-height: 44px; // iOS推荐的最小触摸目标
    
    &:active:not(.btn--disabled) {
      transform: scale(0.95);
    }
  }
}
</style>

// ===== src/components/navigation/MainNav.vue =====
<template>
  <nav class="main-nav">
    <div class="main-nav__container">
      <!-- Logo -->
      <div class="main-nav__logo">
        <router-link to="/" class="main-nav__brand">
          <div class="main-nav__icon">
            <ColorSwatchIcon class="w-8 h-8" />
          </div>
          <div class="main-nav__text">
            <h1 class="main-nav__title">Fashion Color</h1>
            <p class="main-nav__subtitle">时装设计师颜色管理系统</p>
          </div>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <div class="main-nav__menu" :class="{ 'main-nav__menu--open': mobileMenuOpen }">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="main-nav__item"
          :class="{ 'main-nav__item--active': $route.path === item.path }"
          @click="closeMobileMenu"
        >
          <component :is="item.icon" class="main-nav__icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
      
      <!-- 用户操作 -->
      <div class="main-nav__actions">
        <!-- 收藏计数 -->
        <div class="main-nav__favorites" v-if="favoriteStore.favoriteCount > 0">
          <router-link to="/favorites" class="main-nav__favorites-link">
            <HeartIcon class="w-5 h-5" />
            <span class="main-nav__favorites-count">{{ favoriteStore.favoriteCount }}</span>
          </router-link>
        </div>
        
        <!-- 用户菜单 -->
        <div class="main-nav__user" v-if="userStore.isAuthenticated">
          <button @click="toggleUserMenu" class="main-nav__user-button">
            <UserCircleIcon class="w-6 h-6" />
          </button>
          
          <!-- 用户下拉菜单 -->
          <div v-if="userMenuOpen" class="main-nav__user-menu">
            <router-link to="/profile" class="main-nav__user-item" @click="userMenuOpen = false">
              个人中心
            </router-link>
            <button @click="handleLogout" class="main-nav__user-item">
              退出登录
            </button>
          </div>
        </div>
        
        <!-- 登录按钮 -->
        <router-link v-else to="/login" class="main-nav__login">
          登录
        </router-link>
        
        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="main-nav__mobile-toggle"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useUserStore } from '@/stores/userStore'
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  ColorSwatchIcon,
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const navItems = [
  {
    name: 'search',
    path: '/',
    label: '颜色搜索',
    icon: MagnifyingGlassIcon
  },
  {
    name: 'extract',
    path: '/extract',
    label: '图片取色',
    icon: PhotoIcon
  },
  {
    name: 'wheel',
    path: '/wheel',
    label: '色环选色',
    icon: ColorSwatchIcon
  },
  {
    name: 'favorites',
    path: '/favorites',
    label: '我的收藏',
    icon: HeartIcon
  }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  userStore.logout()
  userMenuOpen.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.main-nav__user')) {
    userMenuOpen.value = false
  }
  if (!event.target.closest('.main-nav__menu') && !event.target.closest('.main-nav__mobile-toggle')) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.main-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  
  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    
    @media (min-width: 1024px) {
      padding: 0 2rem;
    }
  }
  
  &__logo {
    flex-shrink: 0;
  }
  
  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
  }
  
  &__icon {
    color: #3498db;
  }
  
  &__text {
    @media (max-width: 640px) {
      display: none;
    }
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.2;
  }
  
  &__subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    line-height: 1;
  }
  
  &__menu {
    display: none;
    gap: 1rem;
    
    @media (min-width: 768px) {
      display: flex;
      gap: 2rem;
    }
    
    // 移动端菜单
    @media (max-width: 767px) {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      flex-direction: column;
      padding: 1rem;
      gap: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      
      &--open {
        display: flex;
      }
    }
  }
  
  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #6b7280;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s;
    
    &:hover {
      color: #3498db;
      background: #f1f5f9;
    }
    
    &--active {
      color: #3498db;
      background: #dbeafe;
    }
    
    @media (max-width: 767px) {
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
      border-radius: 0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__favorites {
    position: relative;
  }
  
  &__favorites-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    text-decoration: none;
    color: #e74c3c;
    border-radius: 0.5rem;
    transition: all 0.2s;
    
    &:hover {
      background: #fef2f2;
    }
  }
  
  &__favorites-count {
    background: #e74c3c;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1.25rem;
    text-align: center;
  }
  
  &__user {
    position: relative;
  }
  
  &__user-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    color: #6b7280;
    transition: all 0.2s;
    
    &:hover {
      color: #3498db;
      background: #f1f5f9;
    }
  }
  
  &__user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    min-width: 8rem;
    z-index: 50;
  }