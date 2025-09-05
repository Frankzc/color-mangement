<!-- 修复后的 FilterPanel.vue -->
<template>
  <div class="fixed-filter-panel">
    <div class="fixed-filter-header">
      <h3 class="fixed-filter-title">筛选条件</h3>
      <button
        @click="clearAllFilters"
        class="fixed-filter-clear"
        v-if="hasActiveFilters"
      >
        清除筛选
      </button>
    </div>
    
    <div class="fixed-filter-content">
      <!-- 分类筛选 -->
      <div class="fixed-filter-section">
        <h4 class="fixed-section-title">颜色分类</h4>
        <div class="fixed-categories">
          <button
            v-for="category in colorStore.categories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'fixed-category-btn',
              { 'fixed-category-btn--active': activeFilters.category === category }
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- 国风颜色筛选 -->
      <div class="fixed-filter-section">
        <label class="fixed-checkbox">
          <input
            v-model="activeFilters.hasGuofeng"
            @change="updateGuofengFilter"
            type="checkbox"
          />
          <span class="fixed-checkbox-label">只显示国风传统色彩</span>
        </label>
      </div>
      
      <!-- 修复后的时尚标签 -->
      <div class="fixed-filter-section">
        <h4 class="fixed-section-title">
          时尚标签
          <span v-if="activeFilters.tags.length > 0" class="fixed-tag-count">
            ({{ activeFilters.tags.length }})
          </span>
        </h4>
        <div class="fixed-tags-grid">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'fixed-tag-btn',
              { 'fixed-tag-btn--active': activeFilters.tags.includes(tag) },
              getTagClass(tag)
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
import { computed } from 'vue'
import { useColorStore } from '@stores/colorStore'

const colorStore = useColorStore()

const activeFilters = computed(() => colorStore.activeFilters)

const hasActiveFilters = computed(() => {
  return activeFilters.value.category ||
         activeFilters.value.tags.length > 0 ||
         activeFilters.value.hasGuofeng
})

// 热门标签
const popularTags = computed(() => {
  const tagCounts = {}
  colorStore.colors.forEach(color => {
    color.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([tag]) => tag)
})

const toggleCategory = (category) => {
  const currentCategory = activeFilters.value.category
  colorStore.setFilter('category', currentCategory === category ? '' : category)
}

const toggleTag = (tag) => {
  colorStore.setFilter('tags', tag)
}

const updateGuofengFilter = () => {
  colorStore.setFilter('hasGuofeng', activeFilters.value.hasGuofeng)
}

const clearAllFilters = () => {
  colorStore.clearFilters()
}

const getTagClass = (tag) => {
  if (tag.includes('时尚')) return 'fixed-tag-btn--fashion'
  if (tag.includes('季')) return 'fixed-tag-btn--season'
  if (tag.includes('风格')) return 'fixed-tag-btn--style'
  return ''
}
</script>

<style lang="scss" scoped>
.fixed-filter-panel {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.fixed-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.fixed-filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.fixed-filter-clear {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 12px;
  transition: color 0.2s;
  
  &:hover {
    color: #2980b9;
  }
}

.fixed-filter-content {
  display: grid;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 3fr;
  }
}

.fixed-filter-section {
  &:last-child {
    @media (min-width: 768px) and (max-width: 1023px) {
      grid-column: 1 / -1;
    }
  }
}

.fixed-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.fixed-tag-count {
  color: #3498db;
  font-weight: 500;
}

.fixed-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fixed-category-btn {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
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

.fixed-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #3498db;
  }
}

.fixed-checkbox-label {
  font-size: 12px;
  color: #374151;
}

/* 修复时尚标签排版 */
.fixed-tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 6px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 4px;
  }
}

.fixed-tag-btn {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
  
  &--active {
    background: #3498db;
    border-color: #3498db;
    color: white;
  }
  
  &--fashion {
    border-color: #e91e63;
    color: #e91e63;
    
    &.fixed-tag-btn--active {
      background: #e91e63;
      color: white;
    }
  }
  
  &--season {
    border-color: #27ae60;
    color: #27ae60;
    
    &.fixed-tag-btn--active {
      background: #27ae60;
      color: white;
    }
  }
  
  &--style {
    border-color: #9b59b6;
    color: #9b59b6;
    
    &.fixed-tag-btn--active {
      background: #9b59b6;
      color: white;
    }
  }
}
</style>