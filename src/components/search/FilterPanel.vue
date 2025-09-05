// ===== src/components/search/FilterPanel.vue =====
<template>
  <div class="filter-panel">
    <div class="filter-panel__header">
      <h3 class="filter-panel__title">筛选条件</h3>
      <button
        @click="clearAllFilters"
        class="filter-panel__clear"
        v-if="hasActiveFilters"
      >
        清除筛选
      </button>
    </div>
    
    <div class="filter-panel__content">
      <!-- 分类筛选 -->
      <div class="filter-panel__section">
        <h4 class="filter-panel__section-title">颜色分类</h4>
        <div class="filter-panel__categories">
          <button
            v-for="category in colorStore.categories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'filter-panel__category',
              { 'filter-panel__category--active': activeFilters.category === category }
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- 国风颜色筛选 -->
      <div class="filter-panel__section">
        <label class="filter-panel__checkbox">
          <input
            v-model="activeFilters.hasGuofeng"
            @change="updateGuofengFilter"
            type="checkbox"
          />
          <span class="filter-panel__checkbox-label">只显示国风传统色彩</span>
        </label>
      </div>
      
      <!-- 标签筛选 -->
      <div class="filter-panel__section">
        <h4 class="filter-panel__section-title">
          时尚标签
          <span v-if="activeFilters.tags.length > 0" class="filter-panel__tag-count">
            ({{ activeFilters.tags.length }})
          </span>
        </h4>
        <div class="filter-panel__tags">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'filter-panel__tag',
              { 'filter-panel__tag--active': activeFilters.tags.includes(tag) },
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
    .slice(0, 20)
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
  if (tag.includes('时尚')) return 'filter-panel__tag--fashion'
  if (tag.includes('季')) return 'filter-panel__tag--season'
  if (tag.includes('风格')) return 'filter-panel__tag--style'
  return ''
}
</script>

<style lang="scss" scoped>
.filter-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  &__clear {
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 0.875rem;
    transition: color 0.2s;
    
    &:hover {
      color: #2980b9;
    }
  }
  
  &__content {
    display: grid;
    gap: 1.5rem;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr 3fr;
    }
  }
  
  &__section {
    &:last-child {
      @media (min-width: 768px) and (max-width: 1023px) {
        grid-column: 1 / -1;
      }
    }
  }
  
  &__section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
  }
  
  &__tag-count {
    color: #3498db;
    font-weight: 500;
  }
  
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  &__category {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    color: #374151;
    font-size: 0.875rem;
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
  
  &__checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    
    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      accent-color: #3498db;
    }
  }
  
  &__checkbox-label {
    font-size: 0.875rem;
    color: #374151;
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  
  &__tag {
    @extend .tag !optional;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    
    &--fashion {
      border-color: #e91e63;
      color: #e91e63;
      
      &.filter-panel__tag--active {
        background: #e91e63;
        color: white;
      }
    }
    
    &--season {
      border-color: #27ae60;
      color: #27ae60;
      
      &.filter-panel__tag--active {
        background: #27ae60;
        color: white;
      }
    }
    
    &--style {
      border-color: #9b59b6;
      color: #9b59b6;
      
      &.filter-panel__tag--active {
        background: #9b59b6;
        color: white;
      }
    }
  }
}
</style>