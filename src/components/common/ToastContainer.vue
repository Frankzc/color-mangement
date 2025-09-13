<!-- src/components/common/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list" tag="div">
        <div
          v-for="message in uiStore.messages"
          :key="message.id"
          :class="['toast', `toast--${message.type}`]"
        >
          <div class="toast-icon">
            <CheckIcon v-if="message.type === 'success'" class="w-5 h-5" />
            <XCircleIcon v-else-if="message.type === 'error'" class="w-5 h-5" />
            <ExclamationTriangleIcon v-else-if="message.type === 'warning'" class="w-5 h-5" />
            <InformationCircleIcon v-else class="w-5 h-5" />
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ message.title }}</div>
            <div v-if="message.message" class="toast-message">{{ message.message }}</div>
          </div>
          <button 
            v-if="message.closable"
            @click="uiStore.removeMessage(message.id)" 
            class="toast-close"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUIStore } from '@/stores/uiStore'

// 内联 SVG 图标
const CheckIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>`
}

const XCircleIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
}

const ExclamationTriangleIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>`
}

const InformationCircleIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
}

const XMarkIcon = {
  template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>`
}

const uiStore = useUIStore()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
  
  @media (max-width: 640px) {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  pointer-events: auto;
  
  &--success {
    border-left-color: #10b981;
    
    .toast-icon {
      color: #10b981;
    }
  }
  
  &--error {
    border-left-color: #ef4444;
    
    .toast-icon {
      color: #ef4444;
    }
  }
  
  &--warning {
    border-left-color: #f59e0b;
    
    .toast-icon {
      color: #f59e0b;
    }
  }
  
  &--info {
    border-left-color: #3b82f6;
    
    .toast-icon {
      color: #3b82f6;
    }
  }
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.25rem;
  padding: 0.125rem;
  
  &:hover {
    color: #6b7280;
    background: #f3f4f6;
  }
}

// 动画
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>