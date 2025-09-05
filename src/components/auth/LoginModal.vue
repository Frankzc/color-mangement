<!-- 需要创建的 LoginModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="login-modal">
      <div class="modal-header">
        <h2>用户登录</h2>
        <button @click="$emit('close')" class="close-btn">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <div class="login-content">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>用户名</label>
            <input 
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              v-model="password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="login-btn" :disabled="isLoading">
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
        
        <div class="demo-accounts">
          <p>演示账号：</p>
          <div class="demo-btns">
            <button @click="setDemoAccount('designer')" class="demo-btn">
              设计师 (designer/fashion123)
            </button>
            <button @click="setDemoAccount('admin')" class="demo-btn">
              管理员 (admin/admin123)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUiStore } from '@stores/uiStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'login'])

const uiStore = useUiStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const demoAccounts = {
  designer: { username: 'designer', password: 'fashion123' },
  admin: { username: 'admin', password: 'admin123' }
}

const setDemoAccount = (type) => {
  const account = demoAccounts[type]
  username.value = account.username
  password.value = account.password
}

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const validAccounts = Object.values(demoAccounts)
    const isValid = validAccounts.some(account => 
      account.username === username.value && account.password === password.value
    )
    
    if (isValid) {
      emit('login', { username: username.value })
    } else {
      uiStore.showMessage('用户名或密码错误', 'error')
    }
  } catch (error) {
    uiStore.showMessage('登录失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
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
  padding: 20px;
}

.login-modal {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
}

.login-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }
  
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  }
}

.form-actions {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.demo-accounts {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  
  p {
    margin: 0 0 8px 0;
    font-size: 12px;
    color: #6b7280;
  }
}

.demo-btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background: #e5e7eb;
  }
}
</style>