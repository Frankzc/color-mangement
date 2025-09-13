// ===== src/views/FavoritesView.vue =====
<template>
  <div class="favorites-view">
    <!-- 页面头部 -->
    <div class="favorites-view__header">
      <h1 class="favorites-view__title">我的收藏</h1>
      <p class="favorites-view__subtitle">
        管理您收藏的颜色和配色方案
      </p>
      
      <!-- 统计信息 -->
      <div class="favorites-view__stats">
        <div class="stat-card">
          <div class="stat-card__number">{{ favoriteStore.favoriteCount }}</div>
          <div class="stat-card__label">收藏颜色</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__number">{{ favoriteStore.schemeCount }}</div>
          <div class="stat-card__label">配色方案</div>
        </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="favorites-view__toolbar" v-if="favoriteStore.favoriteCount > 0">
      <div class="toolbar-left">
        <BaseButton
          @click="showCreateScheme = true"
          variant="primary"
          :disabled="selectedColors.length === 0"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          创建配色方案
        </BaseButton>
        
        <BaseButton
          @click="exportFavorites"
          variant="secondary"
          outline
        >
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          导出收藏
        </BaseButton>
      </div>
      
      <div class="toolbar-right">
        <button
          @click="toggleSelectMode"
          :class="[
            'select-mode-toggle',
            { 'select-mode-toggle--active': selectMode }
          ]"
        >
          {{ selectMode ? '取消选择' : '批量选择' }}
        </button>
        
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
          >
            <Squares2X2Icon class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
          >
            <ListBulletIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="favorites-view__content">
      <!-- 空状态 -->
      <div v-if="favoriteStore.favoriteCount === 0" class="empty-state">
        <div class="empty-state__icon">
          <HeartIcon class="w-16 h-16 text-gray-300" />
        </div>
        <h3 class="empty-state__title">还没有收藏任何颜色</h3>
        <p class="empty-state__text">
          在颜色搜索页面点击心形图标来收藏您喜欢的颜色
        </p>
        <BaseButton @click="$router.push('/')" variant="primary">
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          去搜索颜色
        </BaseButton>
      </div>

      <!-- 收藏的颜色 -->
      <div v-else>
        <!-- 配色方案列表 -->
        <div v-if="favoriteStore.schemeCount > 0" class="schemes-section">
          <h2 class="section-title">我的配色方案</h2>
          <div class="schemes-grid">
            <ColorSchemeCard
              v-for="scheme in favoriteStore.colorSchemes"
              :key="scheme.id"
              :scheme="scheme"
              @edit="editScheme"
              @delete="deleteScheme"
              @view="viewScheme"
            />
          </div>
        </div>

        <!-- 收藏颜色列表 -->
        <div class="colors-section">
          <h2 class="section-title">
            收藏的颜色
            <span class="section-count">({{ favoriteStore.favoriteCount }})</span>
          </h2>
          
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="colors-grid">
            <FavoriteColorCard
              v-for="color in favoriteStore.favoriteColors"
              :key="color.hex"
              :color="color"
              :select-mode="selectMode"
              :selected="selectedColors.includes(color.hex)"
              @toggle-select="toggleColorSelect"
              @remove="removeFavorite"
              @view-details="viewColorDetails"
            />
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="colors-list">
            <FavoriteColorRow
              v-for="color in favoriteStore.favoriteColors"
              :key="color.hex"
              :color="color"
              :select-mode="selectMode"
              :selected="selectedColors.includes(color.hex)"
              @toggle-select="toggleColorSelect"
              @remove="removeFavorite"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 创建配色方案弹窗 -->
    <CreateSchemeModal
      v-if="showCreateScheme"
      :colors="selectedColorObjects"
      @close="showCreateScheme = false"
      @created="handleSchemeCreated"
    />

    <!-- 颜色详情弹窗 -->
    <ColorDetailModal
      v-if="selectedColor"
      :color="selectedColor"
      @close="selectedColor = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUIStore } from '@stores/uiStore'
import {
  HeartIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'

import BaseButton from '@components/common/BaseButton.vue'
import FavoriteColorCard from '@components/favorites/FavoriteColorCard.vue'
import FavoriteColorRow from '@components/favorites/FavoriteColorRow.vue'
import ColorSchemeCard from '@components/favorites/ColorSchemeCard.vue'
import CreateSchemeModal from '@components/favorites/CreateSchemeModal.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'

const favoriteStore = useFavoriteStore()
const uiStore = useUIStore()

// 响应式数据
const viewMode = ref('grid') // grid 或 list
const selectMode = ref(false)
const selectedColors = ref([])
const showCreateScheme = ref(false)
const selectedColor = ref(null)

// 计算属性
const selectedColorObjects = computed(() => {
  return favoriteStore.favoriteColors.filter(color => 
    selectedColors.value.includes(color.hex)
  )
})

// 方法
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value) {
    selectedColors.value = []
  }
}

const toggleColorSelect = (hex) => {
  const index = selectedColors.value.indexOf(hex)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(hex)
  }
}

const removeFavorite = (color) => {
  favoriteStore.removeFromFavorites(color.hex)
  uiStore.showToast(`已移除 ${color.chinese}`, 'success')
}

const viewColorDetails = (color) => {
  selectedColor.value = color
}

const editScheme = (scheme) => {
  // TODO: 实现编辑配色方案
  console.log('编辑方案:', scheme)
}

const deleteScheme = (scheme) => {
  favoriteStore.deleteScheme(scheme.id)
  uiStore.showToast(`已删除方案 ${scheme.name}`, 'success')
}

const viewScheme = (scheme) => {
  favoriteStore.setCurrentScheme(scheme)
  // TODO: 跳转到方案详情页
}

const handleSchemeCreated = (scheme) => {
  showCreateScheme.value = false
  selectedColors.value = []
  selectMode.value = false
  uiStore.showToast(`配色方案 ${scheme.name} 创建成功`, 'success')
}

const exportFavorites = () => {
  const data = favoriteStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  uiStore.showToast('收藏数据已导出', 'success')
}
</script>

<style lang="scss" scoped>
.favorites-view {
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
    margin-bottom: 2rem;
  }
  
  &__stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    
    @media (max-width: 640px) {
      gap: 1rem;
    }
  }
  
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
  
  &__content {
    min-height: 400px;
  }
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 120px;
  
  &__number {
    font-size: 2rem;
    font-weight: 700;
    color: #3498db;
    margin-bottom: 0.5rem;
  }
  
  &__label {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.select-mode-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
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

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  
  button {
    padding: 0.5rem;
    background: white;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
    
    &.active {
      background: #3498db;
      color: white;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  &__icon {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }
  
  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  &__text {
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

.schemes-section,
.colors-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.schemes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.colors-list {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>