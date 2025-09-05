<!-- 修复后的 ColorDetailModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="color-detail-modal">
      <button @click="$emit('close')" class="modal-close">
        <XMarkIcon class="w-6 h-6" />
      </button>
      
      <div class="color-preview" :style="{ backgroundColor: color.hex }">
        <div class="color-info" :style="{ color: color.contrast }">
          <h2 class="color-title">{{ color.chinese }}</h2>
          <p class="color-subtitle">{{ color.english }}</p>
          <p class="color-hex">{{ color.hex }}</p>
        </div>
      </div>
      
      <div class="modal-content">
        <div class="color-details">
          <div class="detail-group">
            <h3>颜色信息</h3>
            <div class="detail-item">
              <span class="label">分类:</span>
              <span class="value">{{ color.category }}</span>
            </div>
            <div class="detail-item">
              <span class="label">RGB:</span>
              <span class="value">{{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }}</span>
            </div>
            <div class="detail-item">
              <span class="label">CMYK:</span>
              <span class="value">{{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%</span>
            </div>
            <div v-if="color.pantone" class="detail-item">
              <span class="label">Pantone:</span>
              <span class="value">{{ color.pantone }}</span>
            </div>
            <div v-if="color.guofeng && color.guofeng !== 'null'" class="detail-item">
              <span class="label">国风名称:</span>
              <span class="value guofeng">{{ color.guofeng }}</span>
            </div>
          </div>
          
          <div v-if="color.tags && color.tags.length > 0" class="detail-group">
            <h3>时尚标签</h3>
            <div class="tags">
              <span v-for="tag in color.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="actions">
            <button @click="toggleFavorite" class="action-btn favorite-btn">
              <HeartIcon :class="['icon', { 'is-favorite': isFavorite }]" />
              {{ isFavorite ? '取消收藏' : '添加收藏' }}
            </button>
            
            <button @click="generateScheme" class="action-btn scheme-btn">
              <SwatchIcon class="icon" />
              生成配色方案
            </button>
            
            <button @click="findSimilar" class="action-btn similar-btn">
              <MagnifyingGlassIcon class="icon" />
              查找相似颜色
            </button>
          </div>
          
          <!-- 配色方案结果 -->
          <div v-if="colorScheme.length > 0" class="scheme-result">
            <h3>配色方案</h3>
            <div class="scheme-colors">
              <div 
                v-for="(schemeColor, index) in colorScheme" 
                :key="index"
                class="scheme-color"
                :style="{ backgroundColor: schemeColor.hex }"
                :title="schemeColor.hex"
              >
                <span class="scheme-hex">{{ schemeColor.hex }}</span>
              </div>
            </div>
          </div>
          
          <!-- 相似颜色结果 -->
          <div v-if="similarColors.length > 0" class="similar-result">
            <h3>相似颜色</h3>
            <div class="similar-colors">
              <div 
                v-for="similarColor in similarColors" 
                :key="similarColor.hex"
                class="similar-color"
                :style="{ backgroundColor: similarColor.hex }"
                @click="viewSimilarColor(similarColor)"
              >
                <div class="similar-info">
                  <span class="similar-name">{{ similarColor.chinese }}</span>
                  <span class="similar-hex">{{ similarColor.hex }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import { XMarkIcon, HeartIcon, SwatchIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'view-color'])

const favoriteStore = useFavoriteStore()
const colorStore = useColorStore()
const uiStore = useUiStore()

const colorScheme = ref([])
const similarColors = ref([])

const isFavorite = computed(() => favoriteStore.isFavorite(props.color.hex))

const toggleFavorite = () => {
  favoriteStore.toggleFavorite(props.color)
  const message = isFavorite.value ? 
    `已收藏 ${props.color.chinese}` : 
    `已取消收藏 ${props.color.chinese}`
  uiStore.showMessage(message, 'success')
}

const generateScheme = () => {
  try {
    colorScheme.value = colorStore.generateColorScheme(props.color, 'complementary')
    if (colorScheme.value.length > 0) {
      uiStore.showMessage('配色方案生成成功', 'success')
    } else {
      uiStore.showMessage('配色方案生成失败', 'error')
    }
  } catch (error) {
    console.error('配色方案生成错误:', error)
    uiStore.showMessage('配色方案生成失败', 'error')
  }
}

const findSimilar = () => {
  try {
    similarColors.value = colorStore.getSimilarColors(props.color, 6)
    if (similarColors.value.length > 0) {
      uiStore.showMessage(`找到 ${similarColors.value.length} 个相似颜色`, 'success')
    } else {
      uiStore.showMessage('未找到相似颜色', 'info')
    }
  } catch (error) {
    console.error('相似颜色查找错误:', error)
    uiStore.showMessage('相似颜色查找失败', 'error')
  }
}

const viewSimilarColor = (similarColor) => {
  emit('view-color', similarColor)
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.color-detail-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.color-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.color-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.color-subtitle {
  font-size: 16px;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.color-hex {
  font-family: monospace;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.detail-group {
  margin-bottom: 24px;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
  
  .label {
    font-weight: 500;
    color: #6b7280;
  }
  
  .value {
    font-family: monospace;
    color: #111827;
    
    &.guofeng {
      color: #dc2626;
      font-weight: 600;
    }
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  
  .icon {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
  
  &.favorite-btn {
    &:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
    
    .is-favorite {
      color: #ef4444;
      fill: currentColor;
    }
  }
}

.scheme-result, .similar-result {
  margin-top: 20px;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.scheme-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.scheme-color {
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 8px;
  
  .scheme-hex {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-family: monospace;
  }
}

.similar-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.similar-color {
  height: 80px;
  border-radius: 6px;
  display: flex;
  align-items: end;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.similar-info {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px;
  border-radius: 0 0 6px 6px;
  width: 100%;
  
  .similar-name {
    display: block;
    font-size: 11px;
    font-weight: 500;
  }
  
  .similar-hex {
    display: block;
    font-size: 10px;
    font-family: monospace;
    opacity: 0.9;
  }
}
</style>