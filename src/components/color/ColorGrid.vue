<!-- ColorGrid.vue - 修复版本 -->
<template>
  <div class="color-grid">
    <!-- 加载状态 -->
    <div v-if="colorStore.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载颜色数据...</p>
    </div>
    
    <!-- 颜色网格 -->
    <div 
      v-else
      class="color-grid__container"
    >
      <div 
        v-for="color in displayColors" 
        :key="color.hex"
        class="color-item"
        @click="showColorDetail(color)"
      >
        <!-- 色块区域 - 点击显示详细信息 -->
        <div 
          class="color-block"
          :style="{ backgroundColor: color.hex }"
          :title="`点击查看 ${color.chinese} 详细信息`"
        >
          <!-- 收藏按钮 -->
          <button
            @click.stop="toggleFavorite(color)"
            class="favorite-btn"
            :class="{ 'favorite-btn--active': favoriteStore.isFavorite(color.hex) }"
          >
            <HeartIcon class="heart-icon" />
          </button>
        </div>
        
        <!-- 简化的颜色信息 -->
        <div class="color-info">
          <h3 class="color-name">{{ color.chinese }}</h3>
          <p class="color-english">{{ color.english }}</p>
          <p class="color-hex">{{ color.hex }}</p>
          
          <!-- 国风标识 -->
          <div v-if="color.guofeng" class="guofeng-badge">
            国风
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!colorStore.isLoading && displayColors.length === 0" class="empty-state">
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
import { ref, computed } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUiStore } from '@stores/uiStore'
import { HeartIcon } from '@heroicons/vue/24/outline'
import ColorDetailModal from './ColorDetailModal.vue'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 48
  }
})

const emit = defineEmits(['color-click', 'load-more'])

const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUiStore()

const selectedColor = ref(null)

// 计算显示的颜色
const displayColors = computed(() => {
  return props.colors.length > 0 ? props.colors : colorStore.filteredColors
})

// 显示颜色详情
const showColorDetail = (color) => {
  selectedColor.value = color
  emit('color-click', color)
}

// 切换收藏状态
const toggleFavorite = (color) => {
  favoriteStore.toggleFavorite(color)
  
  // 显示反馈消息
  const isFav = favoriteStore.isFavorite(color.hex)
  uiStore.showMessage(
    isFav ? `已收藏 ${color.chinese}` : `已取消收藏 ${color.chinese}`,
    isFav ? 'success' : 'info'
  )
}

// 清空所有筛选
const clearAllFilters = () => {
  colorStore.clearFilters()
  uiStore.showMessage('已重置所有筛选条件', 'info')
}
</script>

<style lang="scss" scoped>
.color-grid {
  width: 100%;
  
  &__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
    padding: 16px 0;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
    }
    
    @media (max-width: 480px) {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }
  }
}

.color-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    
    .favorite-btn {
      opacity: 1;
    }
  }
}

.color-block {
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 480px) {
    height: 70px;
  }
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  &--active {
    opacity: 1;
    background: rgba(239, 68, 68, 0.1);
    
    .heart-icon {
      color: #ef4444;
      fill: currentColor;
    }
  }
}

.heart-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.color-info {
  padding: 12px;
  
  @media (max-width: 480px) {
    padding: 10px;
  }
}

.color-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
}

.color-english {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 6px 0;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
}

.color-hex {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
}

.guofeng-badge {
  display: inline-block;
  background: linear-gradient(45deg, #dc2626, #b91c1c);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 6px;
  letter-spacing: 0.5px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 24px 0;
  color: #6b7280;
}

.reset-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
}
</style>