// ===== src/views/SearchView.vue =====
<template>
  <div class="search-view">
    <!-- 页面标题 -->
    <div class="search-view__header">
      <h1 class="search-view__title">颜色搜索与发现</h1>
      <p class="search-view__subtitle">
        智能搜索 {{ colorStore.colorCount.total }} 个专业颜色，
        包含 {{ colorStore.colorCount.withGuofeng }} 个国风传统色彩
      </p>
    </div>
    
    <!-- 搜索区域 -->
    <div class="search-view__search">
      <SearchBar />
      <FilterPanel />
    </div>
    
    <!-- 结果统计 -->
    <div class="search-view__stats" v-if="colorStore.filteredColors.length > 0">
      <div class="search-view__count">
        找到 <strong>{{ colorStore.filteredColors.length }}</strong> 个颜色
      </div>
      
      <div class="search-view__sort">
        <SortControls />
      </div>
    </div>
    
    <!-- 颜色网格 -->
    <div class="search-view__content">
      <div v-if="colorStore.isLoading" class="search-view__loading">
        <BaseLoading text="正在加载颜色数据..." />
      </div>
      
      <div v-else-if="colorStore.filteredColors.length === 0" class="search-view__empty">
        <div class="search-view__empty-icon">
          <MagnifyingGlassIcon class="w-16 h-16 text-gray-400" />
        </div>
        <h3 class="search-view__empty-title">未找到匹配的颜色</h3>
        <p class="search-view__empty-text">
          尝试调整搜索条件或清除筛选器
        </p>
        <BaseButton @click="colorStore.clearFilters" variant="primary">
          清除所有筛选
        </BaseButton>
      </div>
      
      <ColorGrid
        v-else
        :colors="displayColors"
        @color-click="handleColorClick"
        @color-details="handleColorDetails"
      />
    </div>
    
    <!-- 加载更多 -->
    <div class="search-view__pagination" v-if="hasMore">
      <BaseButton
        @click="loadMore"
        :loading="loadingMore"
        variant="secondary"
        size="lg"
        block
      >
        加载更多颜色
      </BaseButton>
    </div>
    
    <!-- 颜色详情弹窗 -->
    <ColorDetailModal
      v-if="selectedColor"
      :color="selectedColor"
      @close="selectedColor = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import BaseLoading from '@components/common/BaseLoading.vue'
import BaseButton from '@components/common/BaseButton.vue'
import SearchBar from '@components/search/SearchBar.vue'
import FilterPanel from '@components/search/FilterPanel.vue'
import SortControls from '@components/search/SortControls.vue'
import ColorGrid from '@components/color/ColorGrid.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'

const colorStore = useColorStore()
const uiStore = useUiStore()

// 分页相关
const pageSize = 24
const currentPage = ref(1)
const loadingMore = ref(false)
const selectedColor = ref(null)

// 计算属性
const displayColors = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize
  return colorStore.filteredColors.slice(start, end)
})

const hasMore = computed(() => {
  return displayColors.value.length < colorStore.filteredColors.length
})

// 方法
const loadMore = async () => {
  loadingMore.value = true
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentPage.value++
  loadingMore.value = false
}

const handleColorClick = (color) => {
  // 可以在这里处理颜色点击事件
  console.log('颜色被点击:', color)
}

const handleColorDetails = (color) => {
  selectedColor.value = color
}

// 监听筛选变化，重置分页
watch(
  () => colorStore.filteredColors.length,
  () => {
    currentPage.value = 1
  }
)

// 页面元数据
onMounted(() => {
  document.title = '颜色搜索 - 时装设计师颜色管理系统'
})
</script>

<style lang="scss" scoped>
.search-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  &__header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
    
    @media (max-width: 640px) {
      font-size: 2rem;
    }
  }
  
  &__subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }
  
  &__search {
    margin-bottom: 2rem;
  }
  
  &__stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    
    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
  
  &__count {
    font-size: 1rem;
    color: #374151;
    
    strong {
      color: #3498db;
      font-weight: 600;
    }
  }
  
  &__content {
    margin-bottom: 3rem;
  }
  
  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
  
  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  &__empty-icon {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }
  
  &__empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  &__empty-text {
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  &__pagination {
    margin-top: 3rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>