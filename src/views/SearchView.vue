<!-- src/views/SearchView.vue - 修复响应性问题 -->
<template>
  <div class="search-view">
    <!-- 页面标题区域 -->
    <div class="search-view__header">
      <h1 class="search-view__title">颜色搜索与发现</h1>
      <p class="search-view__subtitle">
        智能搜索 {{ colorStore.colors.length }}+ 专业颜色，
        包含 {{ guofengCount }} 个国风传统色彩
      </p>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div class="search-view__search-container">
      <div class="search-view__search-bar">
        <SearchBar />
      </div>
      
      <div class="search-view__filter-panel">
        <FilterPanel />
      </div>
    </div>
    
    <!-- 结果统计和排序控制 -->
    <div class="search-view__controls" v-if="!colorStore.isLoading">
      <div class="search-view__stats">
        找到 <strong>{{ filteredColorsCount }}</strong> 个颜色
        <span class="search-view__sort-info">
          - 按{{ getSortFieldLabel(colorStore.sortBy) }}{{ colorStore.sortOrder === 'asc' ? '升序' : '降序' }}排列
        </span>
      </div>
      
      <div class="search-view__sort">
        <SortControls />
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="colorStore.isLoading" class="search-view__loading">
      <div class="loading-spinner"></div>
      <p>正在加载颜色数据...</p>
    </div>
    
    <!-- 颜色网格 - 确保响应性更新 -->
    <div v-else-if="displayColors.length > 0" class="search-view__color-grid" :key="sortKey">
      <div 
        v-for="(color, index) in displayColors" 
        :key="`${color.hex}-${index}-${sortKey}`"
        class="color-card"
        @click="showColorDetail(color)"
        @mouseenter="hoveredCard = color.hex"
        @mouseleave="hoveredCard = null"
      >
        <!-- 色块 -->
        <div 
          class="color-block"
          :style="{ backgroundColor: color.hex }"
          :title="`点击查看 ${color.chinese} 详细信息`"
        >
          <!-- 收藏按钮 -->
          <button
            @click.stop="toggleFavorite(color)"
            class="favorite-btn"
            :class="{
              'is-favorite': favoriteStore.isFavorite(color.hex),
              'is-hovered': hoveredCard === color.hex && !favoriteStore.isFavorite(color.hex)
            }"
          >
            <HeartIcon class="heart-icon" />
          </button>
        </div>
        
        <!-- 颜色信息 -->
        <div class="color-info">
          <h3 class="color-name">{{ color.chinese }}</h3>
          <p class="color-english">{{ color.english }}</p>
          <p class="color-hex">{{ color.hex }}</p>
          
          <!-- 排序值显示 (调试用) -->
          <p v-if="showDebugInfo" class="color-sort-value">
            {{ getSortValueLabel(color) }}
          </p>
          
          <!-- 国风标识 -->
          <div v-if="color.guofeng && color.guofeng !== 'null'" class="guofeng-badge">
            国风
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多按钮 -->
    <div v-if="!colorStore.isLoading && hasMore" class="search-view__load-more">
      <button 
        @click="loadMore"
        :disabled="loadingMore"
        class="load-more-btn"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!colorStore.isLoading && filteredColorsCount === 0" class="search-view__empty">
      <div class="empty-icon">🎨</div>
      <h3>没有找到匹配的颜色</h3>
      <p>尝试调整搜索条件或筛选选项</p>
      <button @click="clearAllFilters" class="reset-btn">
        重置筛选
      </button>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useColorStore } from '@/stores/colorStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useUIStore } from '@/stores/uiStore'

// 组件导入
import SearchBar from '@/components/search/SearchBar.vue'
import FilterPanel from '@/components/search/FilterPanel.vue'
import SortControls from '@/components/search/SortControls.vue'
import ColorDetailModal from '@/components/color/ColorDetailModal.vue'

// 内联心形图标
const HeartIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>`
}

// Store
const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUIStore()

// 响应式数据
const selectedColor = ref(null)
const hoveredCard = ref(null)
const loadingMore = ref(false)

// 分页相关
const pageSize = 48
const currentPage = ref(1)

// 调试开关
const showDebugInfo = ref(import.meta.env?.DEV || false)

// 排序键 - 用于强制重新渲染
const sortKey = computed(() => {
  return `${colorStore.sortBy}-${colorStore.sortOrder}-${Date.now()}`
})

// 计算属性
const guofengCount = computed(() => {
  return colorStore.colors.filter(c => 
    c.guofeng && c.guofeng !== 'null' && c.guofeng !== null && c.guofeng.trim() !== ''
  ).length
})

// 确保响应性的筛选颜色计数
const filteredColorsCount = computed(() => {
  return colorStore.filteredColors.length
})

// 显示的颜色 - 移除洗牌逻辑，直接使用筛选后的结果
const displayColors = computed(() => {
  const filtered = colorStore.filteredColors
  const end = currentPage.value * pageSize
  const result = filtered.slice(0, end)
  
  console.log('显示颜色更新:', {
    总数: filtered.length,
    显示: result.length,
    排序: `${colorStore.sortBy} ${colorStore.sortOrder}`,
    第一个: result[0]?.chinese,
    最后一个: result[result.length - 1]?.chinese
  })
  
  return result
})

const hasMore = computed(() => {
  return displayColors.value.length < colorStore.filteredColors.length
})

// 获取排序字段标签
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

// 获取颜色的排序值标签 (调试用)
const getSortValueLabel = (color) => {
  if (!showDebugInfo.value) return ''
  
  const field = colorStore.sortBy
  const { r, g, b } = color.rgb
  
  switch (field) {
    case 'brightness':
      return `明度: ${Math.round((r * 299 + g * 587 + b * 114) / 1000)}`
    case 'hue':
      const hsl = rgbToHsl(r, g, b)
      return `色相: ${hsl.h}°`
    case 'saturation':
      const hsl_s = rgbToHsl(r, g, b)
      return `饱和度: ${hsl_s.s}%`
    case 'lightness':
      const hsl_l = rgbToHsl(r, g, b)
      return `亮度: ${hsl_l.l}%`
    case 'grayscale':
      return `灰度: ${Math.round(0.299 * r + 0.587 * g + 0.114 * b)}`
    default:
      return ''
  }
}

// RGB转HSL (与store中保持一致)
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// 方法
const showColorDetail = (color) => {
  selectedColor.value = color
}

const toggleFavorite = (color) => {
  favoriteStore.toggleFavorite(color)
  
  const isFav = favoriteStore.isFavorite(color.hex)
  uiStore.showMessage(
    isFav ? `已收藏 ${color.chinese}` : `已取消收藏 ${color.chinese}`,
    isFav ? 'success' : 'info'
  )
}

const loadMore = async () => {
  loadingMore.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentPage.value++
  loadingMore.value = false
}

const clearAllFilters = () => {
  colorStore.clearFilters()
  currentPage.value = 1
  uiStore.showMessage('已重置所有筛选条件', 'info')
}

// 监听排序变化，重置分页
watch(
  () => [colorStore.sortBy, colorStore.sortOrder],
  async () => {
    console.log('排序发生变化，重置分页')
    currentPage.value = 1
    
    // 强制等待下一次DOM更新
    await nextTick()
  },
  { deep: true }
)

// 监听筛选变化，重置分页
watch(
  () => colorStore.filteredColors.length,
  (newLength, oldLength) => {
    console.log('筛选结果变化:', oldLength, '->', newLength)
    currentPage.value = 1
  }
)

// 页面初始化
onMounted(async () => {
  document.title = '颜色搜索 - 时装设计师颜色管理系统'
  await colorStore.loadColors()
  
  // 初始化完成后等待一帧
  await nextTick()
  console.log('页面初始化完成，当前显示颜色数量:', displayColors.value.length)
})
</script>

<style lang="scss" scoped>
.search-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  // 页面标题
  &__header {
    text-align: center;
    margin-bottom: 3rem;
    
    .search-view__title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    .search-view__subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
      
      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
  }
  
  // 搜索和筛选容器
  &__search-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
    
    display: grid;
    gap: 1.5rem;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        "search"
        "filter";
    }
    
    @media (max-width: 767px) {
      padding: 1.5rem;
      grid-template-columns: 1fr;
      grid-template-areas:
        "search"
        "filter";
    }
  }
  
  &__search-bar {
    grid-area: search;
  }
  
  &__filter-panel {
    grid-area: filter;
  }
  
  // 控制区域
  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }
  
  &__stats {
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  &__sort-info {
    color: #6b7280;
    font-size: 0.8125rem;
    margin-left: 0.5rem;
  }
  
  // 加载状态
  &__loading {
    text-align: center;
    padding: 4rem 2rem;
    
    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
    
    p {
      color: #6b7280;
      font-size: 1rem;
    }
  }
  
  // 颜色网格
  &__color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    @media (max-width: 640px) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
    }
  }
  
  // 加载更多
  &__load-more {
    text-align: center;
    padding: 2rem 0;
  }
  
  // 空状态
  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
  }
}

// 颜色卡片
.color-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
}

.color-block {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  opacity: 0;
  
  &:hover {
    background: white;
    color: #ef4444;
    transform: scale(1.1);
  }
  
  &.is-favorite {
    opacity: 1;
    background: #ef4444;
    color: white;
    
    .heart-icon {
      fill: currentColor;
    }
  }
  
  &.is-hovered {
    opacity: 1;
  }
}

.color-card:hover .favorite-btn {
  opacity: 1;
}

.color-info {
  padding: 1rem;
  
  .color-name {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }
  
  .color-english {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }
  
  .color-hex {
    font-size: 0.75rem;
    font-family: monospace;
    color: #9ca3af;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.5px;
  }
  
  .color-sort-value {
    font-size: 0.6875rem;
    color: #3b82f6;
    background: #eff6ff;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    margin: 0.25rem 0;
    font-family: monospace;
  }
}

.guofeng-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  line-height: 1;
}

.load-more-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.reset-btn {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4b5563;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>