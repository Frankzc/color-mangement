<!-- src/components/search/SortControls.vue -->
<template>
  <div class="sort-controls">
    <div class="sort-controls__label">
      <SortIcon class="w-4 h-4" />
      <span>排序</span>
    </div>
    
    <div class="sort-controls__options">
      <!-- 排序字段选择 -->
      <select 
        :value="colorStore.sortBy" 
        @change="handleSortFieldChange"
        class="sort-controls__select"
      >
        <option value="name">按名称 (中文)</option>
        <option value="english">按名称 (英文)</option>
        <option value="hue">按色相</option>
        <option value="brightness">按明度</option>
        <option value="saturation">按饱和度</option>
        <option value="lightness">按亮度</option>
        <option value="grayscale">按灰度</option>
        <option value="category">按分类</option>
      </select>
      
      <!-- 排序方向切换按钮 - 修复图标显示 -->
      <button
        @click="toggleSortDirection"
        class="sort-controls__direction"
        :title="sortDirectionLabel"
      >
        <!-- 升序箭头 -->
        <svg 
          v-if="colorStore.sortOrder === 'asc'" 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
        
        <!-- 降序箭头 -->
        <svg 
          v-else 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <!-- 排序状态指示器 -->
    <div class="sort-controls__status">
      <span class="sort-field">{{ getSortFieldLabel(colorStore.sortBy) }}</span>
      <span class="sort-direction">{{ colorStore.sortOrder === 'asc' ? '↑' : '↓' }}</span>
    </div>
    
    <!-- 调试信息 (仅开发环境) -->
    <div v-if="showDebug" class="sort-debug">
      字段: {{ colorStore.sortBy }} | 方向: {{ colorStore.sortOrder }} | 
      结果: {{ colorStore.filteredColors.length }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColorStore } from '@/stores/colorStore'

// 内联图标组件
const SortIcon = {
  template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
  </svg>`
}

const colorStore = useColorStore()

// 开发环境显示调试信息
const showDebug = computed(() => {
  return import.meta.env?.DEV || process.env.NODE_ENV === 'development'
})

// 排序方向标签
const sortDirectionLabel = computed(() => {
  return colorStore.sortOrder === 'asc' ? '升序排列 (A→Z, 小→大)' : '降序排列 (Z→A, 大→小)'
})

// 获取排序字段的中文标签
const getSortFieldLabel = (field) => {
  const labels = {
    'name': '中文名称',
    'english': '英文名称',
    'hue': '色相',
    'brightness': '明度',
    'saturation': '饱和度',
    'lightness': '亮度',
    'grayscale': '灰度',
    'category': '分类'
  }
  return labels[field] || field
}

// 方法
const handleSortFieldChange = (event) => {
  const newField = event.target.value
  console.log('排序字段改变:', newField)
  
  // 调用 store 方法更新排序
  colorStore.setSorting(newField, colorStore.sortOrder)
}

const toggleSortDirection = () => {
  console.log('切换排序方向, 当前:', colorStore.sortOrder)
  
  // 调用 store 方法切换排序方向
  colorStore.toggleSortOrder()
  
  console.log('切换后:', colorStore.sortOrder)
}
</script>

<style lang="scss" scoped>
.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
  }
  
  &__label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
    
    @media (max-width: 480px) {
      font-size: 0.8125rem;
    }
  }
  
  &__options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    
    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  &__select {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 140px;
    flex: 1;
    
    // 美化选择框外观
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    appearance: none;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:hover {
      border-color: #9ca3af;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8125rem;
      padding: 0.375rem 2rem 0.375rem 0.5rem;
      min-width: 120px;
    }
  }
  
  &__direction {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      background: #f8fafc;
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    @media (max-width: 480px) {
      width: 2.25rem;
      height: 2.25rem;
    }
  }
  
  &__status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    
    @media (max-width: 640px) {
      display: none;
    }
    
    .sort-field {
      font-weight: 500;
    }
    
    .sort-direction {
      font-weight: 600;
      color: #3b82f6;
    }
  }
}

.sort-debug {
  width: 100%;
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.375rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
  margin-top: 0.5rem;
  border: 1px solid #e5e7eb;
  
  @media (min-width: 769px) {
    width: auto;
    margin-top: 0;
    margin-left: 0.5rem;
  }
}

// 响应式优化
@media (max-width: 768px) {
  .sort-controls {
    flex-direction: column;
    align-items: stretch;
    
    &__label {
      justify-content: center;
      margin-bottom: 0.25rem;
    }
    
    &__options {
      justify-content: space-between;
    }
    
    &__select {
      min-width: auto;
      max-width: calc(100% - 3rem);
    }
  }
}

// 排序状态动画
.sort-controls__direction {
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
}

// 选择器焦点状态
.sort-controls__select:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
</style>