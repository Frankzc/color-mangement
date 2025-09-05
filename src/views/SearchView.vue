<!-- 修复后的 SearchView.vue -->
<template>
  <div class="search-view">
    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-content">
        <h1 class="nav-title">时装设计师颜色管理系统</h1>
        <div class="nav-actions">
          <!-- 收藏计数 -->
          <button @click="showFavorites" class="favorites-btn">
            <HeartIcon class="heart-icon" :class="{ 'has-favorites': favoriteStore.favorites.length > 0 }" />
            <span v-if="favoriteStore.favorites.length > 0" class="favorites-count">
              {{ favoriteStore.favorites.length }}
            </span>
          </button>
          <!-- 登录按钮 -->
          <button @click="handleLogin" class="login-btn">
            登录
          </button>
        </div>
      </div>
    </nav>

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
    
    <!-- 结果统计和排序 -->
    <div class="search-view__controls" v-if="!colorStore.isLoading">
      <div class="search-view__stats">
        找到 <strong>{{ colorStore.filteredColors.length }}</strong> 个颜色
      </div>
      
      <div class="search-view__sort">
        <SortControls />
      </div>
    </div>
    
    <!-- 修复后的颜色网格 - 支持分页加载 -->
    <div v-if="!colorStore.isLoading" class="fixed-color-grid">
      <div 
        v-for="color in displayColors" 
        :key="color.hex"
        class="fixed-color-card"
        @click="showColorDetail(color)"
      >
        <!-- 色块 -->
        <div 
          class="fixed-color-block"
          :style="{ backgroundColor: color.hex }"
          :title="`点击查看 ${color.chinese} 详细信息`"
        >
          <!-- 修复后的收藏按钮 - 始终显示，有收藏时变红色 -->
          <button
            @click.stop="toggleFavorite(color)"
            class="fixed-favorite-btn"
            :class="{ 'is-favorite': favoriteStore.isFavorite(color.hex) }"
          >
            <HeartIcon class="heart-icon" />
          </button>
        </div>
        
        <!-- 简化信息 -->
        <div class="fixed-color-info">
          <h3 class="fixed-color-name">{{ color.chinese }}</h3>
          <p class="fixed-color-english">{{ color.english }}</p>
          
          <!-- 国风标识 -->
          <div v-if="color.guofeng && color.guofeng !== 'null'" class="fixed-guofeng-badge">
            国风
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多按钮 -->
    <div v-if="!colorStore.isLoading && hasMore" class="load-more-section">
      <button 
        @click="loadMore"
        :disabled="loadingMore"
        class="load-more-btn"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="colorStore.isLoading" class="fixed-loading-state">
      <div class="fixed-loading-spinner"></div>
      <p>正在加载颜色数据...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!colorStore.isLoading && colorStore.filteredColors.length === 0" class="fixed-empty-state">
      <div class="fixed-empty-icon">🎨</div>
      <h3>没有找到匹配的颜色</h3>
      <p>尝试调整搜索条件或筛选选项</p>
      <button @click="clearAllFilters" class="fixed-reset-btn">
        重置筛选
      </button>
    </div>
    
    <!-- 颜色详情弹窗 -->
    <ColorDetailModal 
      v-if="selectedColor"
      :color="selectedColor"
      @close="selectedColor = null"
    />

    <!-- 收藏页面弹窗 -->
    <FavoritesModal 
      v-if="showFavoritesModal"
      @close="showFavoritesModal = false"
    />

    <!-- 登录弹窗 -->
    <LoginModal 
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUiStore } from '@stores/uiStore'
import { HeartIcon } from '@heroicons/vue/24/outline'

// 组件导入
import SearchBar from '@components/search/SearchBar.vue'
import FilterPanel from '@components/search/FilterPanel.vue'
import SortControls from '@components/search/SortControls.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'
import FavoritesModal from '@components/favorites/FavoritesModal.vue'
import LoginModal from '@components/auth/LoginModal.vue'

// Store
const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUiStore()

// 响应式数据
const selectedColor = ref(null)
const showFavoritesModal = ref(false)
const showLoginModal = ref(false)

// 分页相关 - 修复重复显示问题
const pageSize = 48
const currentPage = ref(1)
const loadingMore = ref(false)
const shuffledColors = ref([])

// 计算显示的颜色 - 防止重复
const displayColors = computed(() => {
  // 当筛选条件改变时，重新洗牌
  if (shuffledColors.value.length !== colorStore.filteredColors.length) {
    shuffledColors.value = [...colorStore.filteredColors].sort(() => Math.random() - 0.5)
  }
  
  const start = 0
  const end = currentPage.value * pageSize
  return shuffledColors.value.slice(start, end)
})

const hasMore = computed(() => {
  return displayColors.value.length < colorStore.filteredColors.length
})

// 显示颜色详情
const showColorDetail = (color) => {
  selectedColor.value = color
}

// 修复后的收藏功能
const toggleFavorite = (color) => {
  favoriteStore.toggleFavorite(color)
  
  const isFav = favoriteStore.isFavorite(color.hex)
  uiStore.showMessage(
    isFav ? `已收藏 ${color.chinese}` : `已取消收藏 ${color.chinese}`,
    isFav ? 'success' : 'info'
  )
}

// 显示收藏页面
const showFavorites = () => {
  if (favoriteStore.favorites.length === 0) {
    uiStore.showMessage('您还没有收藏任何颜色', 'info')
    return
  }
  showFavoritesModal.value = true
}

// 处理登录
const handleLogin = () => {
  showLoginModal.value = true
}

const handleLoginSuccess = (userInfo) => {
  uiStore.showMessage(`欢迎回来，${userInfo.username}！`, 'success')
  showLoginModal.value = false
}

// 加载更多
const loadMore = async () => {
  loadingMore.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentPage.value++
  loadingMore.value = false
}

// 清空所有筛选
const clearAllFilters = () => {
  colorStore.clearFilters()
  currentPage.value = 1
  uiStore.showMessage('已重置所有筛选条件', 'info')
}

// 监听筛选变化，重置分页
watch(
  () => colorStore.filteredColors.length,
  () => {
    currentPage.value = 1
    shuffledColors.value = []
  }
)

// 页面初始化
onMounted(() => {
  document.title = '颜色搜索 - 时装设计师颜色管理系统'
})
</script>

<style lang="scss" scoped>
/* 顶部导航栏 */
.top-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 0;
  margin-bottom: 20px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.favorites-btn {
  position: relative;
  background: none;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    border-color: #3b82f6;
  }
}

.heart-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
  
  &.has-favorites {
    color: #ef4444;
    fill: currentColor;
  }
}

.favorites-count {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.login-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
}

/* 原有样式保持不变 */
.search-view {
  min-height: 100vh;
  background: #f8fafc;
  padding: 0 20px 20px;

  @media (max-width: 768px) {
    padding: 0 16px 16px;
  }

  &__header {
    text-align: center;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  &__subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }

  &__search {
    max-width: 800px;
    margin: 0 auto 20px auto;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 4px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
  }

  &__stats {
    font-size: 13px;
    color: #6b7280;

    strong {
      color: #111827;
      font-weight: 600;
    }
  }
}

/* 颜色网格 */
.fixed-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
}

.fixed-color-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.fixed-color-block {
  height: 70px;
  position: relative;
  
  @media (max-width: 480px) {
    height: 60px;
  }
}

/* 修复后的收藏按钮 - 始终显示 */
.fixed-favorite-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1; /* 始终显示 */
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  &.is-favorite {
    background: rgba(239, 68, 68, 0.1);
    
    .heart-icon {
      color: #ef4444;
      fill: currentColor;
    }
  }
  
  .heart-icon {
    width: 12px;
    height: 12px;
    color: #6b7280;
    transition: all 0.2s ease;
  }
}

.fixed-color-info {
  padding: 8px;
}

.fixed-color-name {
  font-size: 11px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fixed-color-english {
  font-size: 9px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fixed-guofeng-badge {
  display: inline-block;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  font-size: 8px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  margin-top: 4px;
}

/* 加载更多 */
.load-more-section {
  text-align: center;
  margin: 40px 0;
}

.load-more-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

/* 加载状态 */
.fixed-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  p {
    margin: 12px 0 0 0;
    color: #6b7280;
    font-size: 13px;
  }
}

.fixed-loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.fixed-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.fixed-empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.fixed-empty-state h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
}

.fixed-empty-state p {
  margin: 0 0 20px 0;
  color: #6b7280;
  font-size: 13px;
}

.fixed-reset-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
}
</style>