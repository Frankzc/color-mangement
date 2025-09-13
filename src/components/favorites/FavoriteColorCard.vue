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
import { useUIStore } from '@stores/uiStore'
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

const uiStore = useUIStore()

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