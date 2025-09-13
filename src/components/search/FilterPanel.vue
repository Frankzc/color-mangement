<!-- src/components/search/FilterPanel.vue -->
<template>
  <div class="filter-panel">
    <div class="filter-panel__header">
      <h3 class="filter-panel__title">
        <FilterIcon class="w-5 h-5" />
        <span>筛选条件</span>
      </h3>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters"
        class="filter-panel__clear"
      >
        <XIcon class="w-4 h-4" />
        <span>清除</span>
      </button>
    </div>
    
    <div class="filter-panel__content">
      <!-- 国风色彩筛选 -->
      <div class="filter-group">
        <h4 class="filter-group__title">特色筛选</h4>
        <div class="filter-options">
          <button
            @click="toggleGuofengFilter"
            :class="[
              'filter-option',
              { 'filter-option--active': colorStore.activeFilters.hasGuofeng }
            ]"
          >
            <span class="filter-option__icon">🎨</span>
            <span>国风色彩</span>
            <span class="filter-option__count">({{ guofengCount }})</span>
          </button>
        </div>
      </div>
      
      <!-- 分类筛选 -->
      <div class="filter-group" v-if="colorStore.categories.length > 0">
        <h4 class="filter-group__title">颜色分类</h4>
        <div class="filter-options">
          <button
            v-for="category in colorStore.categories"
            :key="category"
            @click="toggleCategoryFilter(category)"
            :class="[
              'filter-option',
              { 'filter-option--active': colorStore.activeFilters.category === category }
            ]"
          >
            <span class="filter-option__color" :style="{ backgroundColor: getCategoryColor(category) }"></span>
            <span>{{ category }}</span>
          </button>
        </div>
      </div>
      
      <!-- 标签筛选 -->
      <div class="filter-group" v-if="displayTags.length > 0">
        <h4 class="filter-group__title">
          <span>标签筛选</span>
          <button 
            v-if="colorStore.allTags.length > maxDisplayTags"
            @click="showAllTags = !showAllTags"
            class="filter-group__toggle"
          >
            {{ showAllTags ? '收起' : '展开' }}
          </button>
        </h4>
        <div class="filter-options">
          <button
            v-for="tag in displayTags"
            :key="tag"
            @click="toggleTagFilter(tag)"
            :class="[
              'filter-option filter-option--tag',
              { 'filter-option--active': colorStore.activeFilters.tags.includes(tag) }
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useColorStore } from '@/stores/colorStore'

// 内联图标组件
const FilterIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>`
}

const XIcon = {
  template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>`
}

const colorStore = useColorStore()

// 响应式数据
const showAllTags = ref(false)
const maxDisplayTags = 15

// 计算属性
const guofengCount = computed(() => {
  return colorStore.colors.filter(c => 
    c.guofeng && c.guofeng !== 'null' && c.guofeng !== null && c.guofeng.trim() !== ''
  ).length
})

const displayTags = computed(() => {
  const tags = colorStore.allTags
  return showAllTags.value ? tags : tags.slice(0, maxDisplayTags)
})

const hasActiveFilters = computed(() => {
  return colorStore.activeFilters.category ||
         colorStore.activeFilters.tags.length > 0 ||
         colorStore.activeFilters.hasGuofeng
})

// 方法
const toggleGuofengFilter = () => {
  console.log('切换国风筛选')
  colorStore.setFilter('hasGuofeng', !colorStore.activeFilters.hasGuofeng)
}

const toggleCategoryFilter = (category) => {
  console.log('切换分类筛选:', category)
  const currentCategory = colorStore.activeFilters.category
  colorStore.setFilter('category', currentCategory === category ? '' : category)
}

const toggleTagFilter = (tag) => {
  console.log('切换标签筛选:', tag)
  const currentTags = [...colorStore.activeFilters.tags]
  const index = currentTags.indexOf(tag)
  
  if (index > -1) {
    // 移除标签
    currentTags.splice(index, 1)
  } else {
    // 添加标签
    currentTags.push(tag)
  }
  
  colorStore.setFilter('tags', currentTags)
}

const clearAllFilters = () => {
  console.log('清除所有筛选条件')
  colorStore.clearFilters()
}

const getCategoryColor = (category) => {
  // 为不同分类提供颜色
  const categoryColors = {
    '橙色系': '#f97316',
    '灰色系': '#6b7280',
    '紫色系': '#a855f7',
    '红色系': '#ef4444',
    '绿色系': '#22c55e',
    '蓝色系': '#3b82f6',
    '黄色系': '#eab308',
    '黑白系': '#000000'
  }
  return categoryColors[category] || '#9ca3af'
}
</script>

<style lang="scss" scoped>
.filter-panel {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  
  &__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }
  
  &__clear {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.filter-group {
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.75rem 0;
  }
  
  &__toggle {
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 0.75rem;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #1d4ed8;
  }
  
  &--active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background: #2563eb;
      border-color: #2563eb;
    }
  }
  
  &--tag {
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
  }
  
  &__icon {
    font-size: 1rem;
  }
  
  &__color {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  
  &__count {
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 500;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .filter-panel {
    padding: 1rem;
    
    &__header {
      margin-bottom: 1rem;
    }
    
    &__title {
      font-size: 1rem;
    }
    
    &__content {
      gap: 1rem;
    }
  }
  
  .filter-options {
    gap: 0.375rem;
  }
  
  .filter-option {
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
    
    &--tag {
      font-size: 0.6875rem;
      padding: 0.25rem 0.5rem;
    }
  }
}

// 标签筛选特殊样式
.filter-option--tag {
  border-radius: 1rem;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &.filter-option--active {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
}
</style>