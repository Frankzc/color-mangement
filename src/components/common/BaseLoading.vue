<!-- src/components/common/BaseLoading.vue -->
<template>
  <div :class="loadingClasses">
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const loadingClasses = computed(() => {
  const classes = ['base-loading']
  
  if (props.overlay) classes.push('base-loading--overlay')
  if (props.center) classes.push('base-loading--center')
  classes.push(`base-loading--${props.size}`)
  
  return classes
})
</script>

<style lang="scss" scoped>
.base-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &--center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  
  &--sm .spinner {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &--md .spinner {
    width: 2rem;
    height: 2rem;
  }
  
  &--lg .spinner {
    width: 3rem;
    height: 3rem;
  }
}

.loading-spinner {
  color: #3498db;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

@keyframes spin {
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}
</style>