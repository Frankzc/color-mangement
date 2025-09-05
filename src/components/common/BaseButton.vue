
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