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
import { useUIStore } from '@stores/uiStore'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const uiStore = useUIStore()

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

