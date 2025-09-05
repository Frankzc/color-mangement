// ===== src/components/color/ColorDetailModal.vue =====
<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="color-detail-modal">
        <!-- 关闭按钮 -->
        <button @click="$emit('close')" class="modal-close">
          <XMarkIcon class="w-6 h-6" />
        </button>

        <!-- 颜色预览区 -->
        <div class="color-preview" :style="{ backgroundColor: color.hex }">
          <div class="color-preview__content" :style="{ color: color.contrast }">
            <h1 class="color-preview__hex">{{ color.hex }}</h1>
            <div class="color-preview__names">
              <h2 class="chinese-name">{{ color.chinese }}</h2>
              <p class="english-name">{{ color.english }}</p>
            </div>
            <div v-if="color.guofeng" class="guofeng-badge">
              <span>国风：{{ color.guofeng }}</span>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="color-details">
          <div class="details-grid">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h3 class="section-title">基本信息</h3>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">分类:</span>
                  <span class="value category">{{ color.category }}</span>
                </div>
                <div class="info-item" v-if="color.pantone">
                  <span class="label">Pantone:</span>
                  <span class="value">{{ color.pantone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">亮度:</span>
                  <span class="value">{{ color.brightness || getBrightness(color.rgb) }}</span>
                </div>
              </div>
            </div>

            <!-- 色彩值 -->
            <div class="detail-section">
              <h3 class="section-title">色彩值</h3>
              <div class="color-values">
                <div class="value-item">
                  <span class="value-label">HEX</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.hex }}</span>
                    <button @click="copyValue(color.hex)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item">
                  <span class="value-label">RGB</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }}</span>
                    <button @click="copyValue(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item">
                  <span class="value-label">CMYK</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%</span>
                    <button @click="copyValue(`cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div class="value-item" v-if="color.hsl">
                  <span class="value-label">HSL</span>
                  <div class="value-content">
                    <span class="value-text">{{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%</span>
                    <button @click="copyValue(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)" class="copy-btn">
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="detail-section" v-if="color.tags && color.tags.length > 0">
            <h3 class="section-title">时尚标签</h3>
            <div class="tags-container">
              <span
                v-for="tag in color.tags"
                :key="tag"
                class="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="actions-section">
            <BaseButton
              @click="toggleFavorite"
              :variant="isFavorite ? 'danger' : 'primary'"
              class="action-btn"
            >
              <HeartIcon :class="['w-4 h-4 mr-2', { 'fill-current': isFavorite }]" />
              {{ isFavorite ? '取消收藏' : '添加收藏' }}
            </BaseButton>
            
            <BaseButton
              @click="generateScheme"
              variant="secondary"
              class="action-btn"
            >
              <ColorSwatchIcon class="w-4 h-4 mr-2" />
              生成配色
            </BaseButton>
            
            <BaseButton
              @click="findSimilar"
              variant="secondary"
              outline
              class="action-btn"
            >
              <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
              相似颜色
            </BaseButton>
          </div>

          <!-- 相似颜色 -->
          <div class="detail-section" v-if="similarColors.length > 0">
            <h3 class="section-title">相似颜色</h3>
            <div class="similar-colors">
              <div
                v-for="similarColor in similarColors"
                :key="similarColor.hex"
                class="similar-color"
                :style="{ backgroundColor: similarColor.hex }"
                @click="$emit('color-change', similarColor)"
                :title="`${similarColor.chinese} (${similarColor.hex})`"
              >
                <span :style="{ color: similarColor.contrast }">
                  {{ similarColor.hex }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import { getBrightness } from '@utils/colorUtils'
import {
  XMarkIcon,
  HeartIcon,
  DocumentDuplicateIcon,
  SwatchIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'color-change'])

const favoriteStore = useFavoriteStore()
const colorStore = useColorStore()
const uiStore = useUiStore()

const similarColors = ref([])

// 计算属性
const isFavorite = computed(() => favoriteStore.isFavorite(props.color.hex))

// 方法
const copyValue = async (value) => {
  try {
    await navigator.clipboard.writeText(value)
    uiStore.showToast('已复制到剪贴板', 'success', 2000)
  } catch (error) {
    console.error('复制失败:', error)
    uiStore.showToast('复制失败', 'error')
  }
}

const toggleFavorite = () => {
  favoriteStore.toggleFavorite(props.color)
  const message = isFavorite.value ? '已从收藏中移除' : '已添加到收藏'
  uiStore.showToast(message, 'success')
}

const generateScheme = () => {
  // TODO: 实现配色方案生成
  uiStore.showToast('配色方案功能开发中...', 'info')
}

const findSimilar = () => {
  similarColors.value = colorStore.getSimilarColors(props.color, 6)
  uiStore.showToast(`找到 ${similarColors.value.length} 个相似颜色`, 'success')
}

const getTagClass = (tag) => {
  if (tag.includes('时尚')) return 'tag--fashion'
  if (tag.includes('季')) return 'tag--season'
  if (tag.includes('风格')) return 'tag--style'
  return ''
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
  padding: 2rem;
}

.color-detail-modal {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.color-preview {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &__content {
    text-align: center;
  }
  
  &__hex {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 640px) {
      font-size: 2rem;
    }
  }
  
  &__names {
    margin-bottom: 1rem;
    
    .chinese-name {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      
      @media (max-width: 640px) {
        font-size: 1.5rem;
      }
    }
    
    .english-name {
      font-size: 1.25rem;
      opacity: 0.9;
      font-style: italic;
    }
  }
}

.guofeng-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: inline-block;
  
  span {
    font-weight: 500;
  }
}

.color-details {
  padding: 2rem;
}

.details-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section {
  &:not(.details-grid > &) {
    margin-bottom: 2rem;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .label {
    font-weight: 500;
    color: #6b7280;
  }
  
  .value {
    font-weight: 600;
    color: #1f2937;
    
    &.category {
      color: #3498db;
    }
  }
}

.color-values {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .value-label {
    font-weight: 600;
    color: #374151;
    min-width: 60px;
  }
  
  .value-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    justify-content: flex-end;
  }
  
  .value-text {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.875rem;
    color: #1f2937;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  .copy-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
    
    &:hover {
      background: #f3f4f6;
      color: #3498db;
    }
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  &--fashion {
    background: #fce7f3;
    color: #be185d;
  }
  
  &--season {
    background: #dcfce7;
    color: #166534;
  }
  
  &--style {
    background: #ede9fe;
    color: #7c3aed;
  }
}

.actions-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  
  .action-btn {
    flex: 1;
    min-width: 150px;
    
    @media (max-width: 640px) {
      flex: none;
      width: 100%;
    }
  }
}

.similar-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.similar-color {
  height: 80px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .color-details {
    padding: 1rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
  }
}
</style>