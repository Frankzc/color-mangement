<template>
  <div class="sort-controls">
    <div class="sort-group">
      <label class="sort-label">排序方式:</label>
      <select 
        v-model="currentSort" 
        @change="handleSortChange"
        class="sort-select"
      >
        <option value="name_asc">名称 A-Z</option>
        <option value="name_desc">名称 Z-A</option>
        <option value="hue_asc">色相 0-360</option>
        <option value="hue_desc">色相 360-0</option>
        <option value="brightness_asc">亮度 暗-亮</option>
        <option value="brightness_desc">亮度 亮-暗</option>
        <option value="category_asc">分类 A-Z</option>
        <option value="category_desc">分类 Z-A</option>
        <option value="random">随机排序</option>
      </select>
    </div>
    
    <div class="view-controls">
      <button
        @click="toggleViewMode"
        class="view-toggle"
        :title="viewMode === 'grid' ? '切换到列表视图' : '切换到网格视图'"
      >
        <Squares2X2Icon v-if="viewMode === 'grid'" class="view-icon" />
        <ListBulletIcon v-else class="view-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/vue/24/outline'

const colorStore = useColorStore()
const uiStore = useUiStore()

const currentSort = ref('name_asc')
const viewMode = ref('grid')

// 从store中获取当前排序设置
const initializeSort = () => {
  currentSort.value = colorStore.currentSort || 'name_asc'
}

const handleSortChange = () => {
  const [field, direction] = currentSort.value.split('_')
  
  console.log('排序变更:', field, direction) // 调试信息
  
  try {
    colorStore.setSortOrder(field, direction)
    uiStore.showMessage(`已按${getSortLabel(currentSort.value)}排序`, 'info')
  } catch (error) {
    console.error('排序失败:', error)
    uiStore.showMessage('排序失败，请重试', 'error')
  }
}

const getSortLabel = (sortValue) => {
  const labels = {
    'name_asc': '名称正序',
    'name_desc': '名称倒序',
    'hue_asc': '色相正序',
    'hue_desc': '色相倒序',
    'brightness_asc': '亮度正序',
    'brightness_desc': '亮度倒序',
    'category_asc': '分类正序',
    'category_desc': '分类倒序',
    'random': '随机顺序'
  }
  return labels[sortValue] || '默认'
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  // 可以通过emit或store通知父组件视图模式变更
  // emit('view-mode-change', viewMode.value)
}

// 监听store中的排序变化
watch(() => colorStore.currentSort, (newSort) => {
  if (newSort && newSort !== currentSort.value) {
    currentSort.value = newSort
  }
})

// 初始化
initializeSort()
</script>

<style lang="scss" scoped>
.sort-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.sort-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &:hover {
    border-color: #d1d5db;
  }
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
}

.view-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}
</style>