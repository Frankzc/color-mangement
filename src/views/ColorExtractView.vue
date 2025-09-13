<template>
  <div class="extract-view">
    <MainNav />
    
    <div class="extract-container">
      <!-- 页面头部 -->
      <div class="extract-header">
        <h1 class="extract-title">图片取色工具</h1>
        <p class="extract-subtitle">
          上传图片，智能提取主要颜色，并匹配数据库中的相似颜色
        </p>
      </div>
      
      <!-- 工具主体 -->
      <div class="extract-content">
        <!-- 上传区域 -->
        <div class="upload-section">
          <div 
            class="upload-area"
            :class="{ 
              'upload-area--dragover': isDragOver,
              'upload-area--has-image': uploadedImage
            }"
            @drop="handleDrop"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="file-input"
            />
            
            <div v-if="!uploadedImage" class="upload-placeholder">
              <PhotoIcon class="upload-icon" />
              <h3 class="upload-title">点击上传或拖拽图片到此处</h3>
              <p class="upload-text">支持 JPG、PNG、GIF 格式，文件大小不超过 10MB</p>
              <button class="upload-button">选择图片</button>
            </div>
            
            <div v-else class="image-preview">
              <img
                ref="previewImage"
                :src="uploadedImage"
                alt="预览图片"
                class="preview-img"
                @load="handleImageLoad"
              />
              <div class="image-actions">
                <button @click="removeImage" class="remove-button">
                  <XMarkIcon class="btn-icon" />
                  移除图片
                </button>
                <button @click="extractColors" :disabled="isExtracting" class="extract-button">
                  <SwatchIcon v-if="!isExtracting" class="btn-icon" />
                  <ArrowPathIcon v-else class="btn-icon spinning" />
                  {{ isExtracting ? '提取中...' : '提取颜色' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 提取结果 -->
        <div v-if="extractedColors.length > 0" class="results-section">
          <div class="results-header">
            <h2 class="results-title">提取的颜色</h2>
            <div class="results-stats">
              找到 {{ extractedColors.length }} 个主要颜色
            </div>
          </div>
          
          <!-- 颜色调色板 -->
          <div class="color-palette">
            <div 
              v-for="(color, index) in extractedColors"
              :key="index"
              class="palette-item"
              :class="{ 'palette-item--selected': selectedExtractedColor === index }"
              @click="selectExtractedColor(index)"
            >
              <div 
                class="palette-color"
                :style="{ backgroundColor: color.hex }"
                :title="color.hex"
              ></div>
              <div class="palette-info">
                <div class="palette-hex">{{ color.hex }}</div>
                <div class="palette-percentage">{{ color.percentage }}%</div>
              </div>
            </div>
          </div>
          
          <!-- 相似颜色匹配 -->
          <div v-if="selectedExtractedColor !== null" class="matches-section">
            <div class="matches-header">
              <h3 class="matches-title">
                数据库中的相似颜色
                <span class="selected-color-indicator">
                  <span 
                    class="color-dot"
                    :style="{ backgroundColor: extractedColors[selectedExtractedColor].hex }"
                  ></span>
                  {{ extractedColors[selectedExtractedColor].hex }}
                </span>
              </h3>
              <div class="match-controls">
                <label class="similarity-label">
                  相似度阈值: {{ similarityThreshold }}%
                  <input
                    v-model="similarityThreshold"
                    type="range"
                    min="60"
                    max="95"
                    step="5"
                    class="similarity-slider"
                    @input="updateMatches"
                  />
                </label>
              </div>
            </div>
            
            <div v-if="isMatching" class="loading-matches">
              <ArrowPathIcon class="loading-icon" />
              正在匹配相似颜色...
            </div>
            
            <div v-else-if="matchedColors.length > 0" class="matches-grid">
              <div
                v-for="match in matchedColors"
                :key="match.hex"
                class="match-item"
                @click="viewColorDetail(match)"
              >
                <div class="match-color-preview">
                  <div 
                    class="match-color"
                    :style="{ backgroundColor: match.hex }"
                  ></div>
                  <div class="similarity-score">
                    {{ Math.round(match.similarity) }}% 相似
                  </div>
                </div>
                <div class="match-info">
                  <h4 class="match-name">{{ match.chinese }}</h4>
                  <p class="match-english">{{ match.english }}</p>
                  <div class="match-meta">
                    <span class="match-hex">{{ match.hex }}</span>
                    <span class="match-category">{{ match.category }}</span>
                  </div>
                  <div v-if="match.guofeng" class="match-guofeng">
                    国风: {{ match.guofeng }}
                  </div>
                </div>
                <div class="match-actions">
                  <button 
                    @click.stop="toggleFavorite(match)"
                    class="favorite-btn"
                    :class="{ 'is-favorite': favoriteStore.isFavorite(match.hex) }"
                  >
                    <HeartIcon class="heart-icon" />
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="no-matches">
              <EyeSlashIcon class="no-matches-icon" />
              <p>未找到相似度超过 {{ similarityThreshold }}% 的颜色</p>
              <button @click="similarityThreshold = 60; updateMatches()" class="adjust-threshold-btn">
                降低相似度阈值
              </button>
            </div>
          </div>
        </div>
        
        <!-- 使用说明 -->
        <div v-if="extractedColors.length === 0" class="usage-guide">
          <div class="guide-card">
            <h3 class="guide-title">使用说明</h3>
            <div class="guide-steps">
              <div class="guide-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>上传图片</h4>
                  <p>支持 JPG、PNG、GIF 格式，建议使用色彩丰富的图片</p>
                </div>
              </div>
              <div class="guide-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>提取颜色</h4>
                  <p>系统会自动分析图片并提取主要颜色</p>
                </div>
              </div>
              <div class="guide-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>匹配相似色</h4>
                  <p>点击提取的颜色，查看数据库中的相似颜色</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 示例图片 -->
          <div class="example-section">
            <h3 class="example-title">试试这些示例</h3>
            <div class="example-images">
              <div
                v-for="example in exampleImages"
                :key="example.name"
                class="example-item"
                @click="loadExample(example)"
              >
                <img :src="example.url" :alt="example.name" class="example-img" />
                <p class="example-name">{{ example.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 颜色详情弹窗 -->
    <ColorDetailModal
      v-if="selectedColorDetail"
      :color="selectedColorDetail"
      @close="selectedColorDetail = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUIStore } from '@stores/uiStore'
import MainNav from '@components/navigation/MainNav.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'
import {
  PhotoIcon, XMarkIcon, SwatchIcon, ArrowPathIcon, HeartIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUIStore()

// 响应式数据
const fileInput = ref(null)
const previewImage = ref(null)
const isDragOver = ref(false)
const uploadedImage = ref(null)
const isExtracting = ref(false)
const isMatching = ref(false)
const extractedColors = ref([])
const selectedExtractedColor = ref(null)
const matchedColors = ref([])
const similarityThreshold = ref(80)
const selectedColorDetail = ref(null)

// 示例图片
const exampleImages = ref([
  {
    name: '秋叶',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjY2MDAiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2ZmOGYwMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmYjkwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+'
  },
  {
    name: '海洋',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDc3YmUiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwYWNlZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzUwZGRmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI2IpIi8+PC9zdmc+'
  },
  {
    name: '花园',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjY5YjQiLz48c3RvcCBvZmZzZXQ9IjMzJSIgc3RvcC1jb2xvcj0iIzIyYzU1ZSIvPjxzdG9wIG9mZnNldD0iNjYlIiBzdG9wLWNvbG9yPSIjZmZkNzAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOTMzM2VhIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9InVybCgjYykiLz48L3N2Zz4='
  }
])

// 方法
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    uiStore.showMessage('请选择图片文件', 'error')
    return
  }
  
  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    uiStore.showMessage('文件大小不能超过 10MB', 'error')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    resetExtraction()
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  uploadedImage.value = null
  resetExtraction()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetExtraction = () => {
  extractedColors.value = []
  selectedExtractedColor.value = null
  matchedColors.value = []
}

const handleImageLoad = () => {
  // 图片加载完成后可以进行一些初始化操作
  console.log('图片加载完成')
}

const extractColors = async () => {
  if (!previewImage.value) return
  
  isExtracting.value = true
  
  try {
    // 模拟颜色提取过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟提取的颜色数据
    const mockColors = [
      { hex: '#2563eb', percentage: 35 },
      { hex: '#dc2626', percentage: 25 },
      { hex: '#059669', percentage: 20 },
      { hex: '#ca8a04', percentage: 15 },
      { hex: '#7c3aed', percentage: 5 }
    ]
    
    extractedColors.value = mockColors
    uiStore.showMessage(`成功提取了 ${mockColors.length} 个主要颜色`, 'success')
  } catch (error) {
    console.error('颜色提取失败:', error)
    uiStore.showMessage('颜色提取失败，请重试', 'error')
  } finally {
    isExtracting.value = false
  }
}

const selectExtractedColor = (index) => {
  selectedExtractedColor.value = index
  updateMatches()
}

const updateMatches = async () => {
  if (selectedExtractedColor.value === null) return
  
  isMatching.value = true
  
  try {
    const targetColor = extractedColors.value[selectedExtractedColor.value]
    
    // 模拟匹配过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用颜色存储的相似颜色查找功能
    const matches = colorStore.getSimilarColors(
      { hex: targetColor.hex },
      10,
      similarityThreshold.value / 100
    )
    
    matchedColors.value = matches
  } catch (error) {
    console.error('颜色匹配失败:', error)
    uiStore.showMessage('颜色匹配失败，请重试', 'error')
  } finally {
    isMatching.value = false
  }
}

const loadExample = (example) => {
  uploadedImage.value = example.url
  resetExtraction()
  uiStore.showMessage(`已加载示例图片: ${example.name}`, 'info')
}

const viewColorDetail = (color) => {
  selectedColorDetail.value = color
}

const toggleFavorite = (color) => {
  favoriteStore.toggleFavorite(color)
  const message = favoriteStore.isFavorite(color.hex) ? 
    `已收藏 ${color.chinese}` : 
    `已取消收藏 ${color.chinese}`
  uiStore.showMessage(message, 'success')
}

onMounted(() => {
  document.title = '图片取色 - Fashion Color 颜色管理系统'
})
</script>

<style lang="scss" scoped>
.extract-view {
  min-height: 100vh;
  background: #f8fafc;
}

.extract-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.extract-header {
  text-align: center;
  margin-bottom: 32px;
}

.extract-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.extract-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.extract-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

// 上传区域样式
.upload-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &--dragover {
    border-color: #3b82f6;
    background: #dbeafe;
  }
  
  &--has-image {
    border: none;
    background: transparent;
    min-height: auto;
    padding: 0;
  }
}

.file-input {
  display: none;
}

.upload-placeholder {
  text-align: center;
  padding: 40px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #9ca3af;
  margin: 0 auto 16px;
}

.upload-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.upload-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.upload-button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
}

.image-preview {
  width: 100%;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.image-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.remove-button, .extract-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  .btn-icon {
    width: 16px;
    height: 16px;
  }
}

.remove-button {
  background: #f3f4f6;
  color: #374151;
  
  &:hover {
    background: #e5e7eb;
  }
}

.extract-button {
  background: #059669;
  color: white;
  
  &:hover:not(:disabled) {
    background: #047857;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 结果区域样式
.results-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.results-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.results-stats {
  font-size: 14px;
  color: #6b7280;
}

// 调色板样式
.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.palette-item {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
  
  &--selected {
    border-color: #3b82f6;
    background: #dbeafe;
  }
}

.palette-color {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 12px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.palette-info {
  .palette-hex {
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }
  
  .palette-percentage {
    font-size: 11px;
    color: #6b7280;
  }
}

// 匹配结果样式
.matches-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 32px;
}

.matches-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

.matches-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.selected-color-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.match-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.similarity-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #374151;
}

.similarity-slider {
  width: 120px;
}

.loading-matches {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6b7280;
  
  .loading-icon {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
}

// 匹配网格样式
.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.match-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
}

.match-color-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.match-color {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.similarity-score {
  background: #059669;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.match-info {
  flex: 1;
  margin-bottom: 12px;
}

.match-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.match-english {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.match-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.match-hex {
  font-family: monospace;
  font-size: 12px;
  color: #374151;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.match-category {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
}

.match-guofeng {
  font-size: 11px;
  color: #dc2626;
  font-weight: 500;
}

.match-actions {
  display: flex;
  justify-content: flex-end;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &.is-favorite {
    .heart-icon {
      color: #ef4444;
      fill: currentColor;
    }
  }
}

.heart-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s;
}

// 无匹配结果样式
.no-matches {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.no-matches-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #d1d5db;
}

.adjust-threshold-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
}

// 使用指南样式
.usage-guide {
  display: grid;
  gap: 32px;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
}

.guide-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.guide-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-step {
  display: flex;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px 0;
  }
  
  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
}

// 示例图片样式
.example-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.example-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
}

.example-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.example-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.example-img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  margin-bottom: 8px;
  transition: border-color 0.2s;
  
  .example-item:hover & {
    border-color: #3b82f6;
  }
}

.example-name {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .extract-container {
    padding: 16px;
  }
  
  .upload-section,
  .results-section,
  .guide-card,
  .example-section {
    padding: 20px;
  }
  
  .matches-grid {
    grid-template-columns: 1fr;
  }
  
  .usage-guide {
    grid-template-columns: 1fr;
  }
}
</style>