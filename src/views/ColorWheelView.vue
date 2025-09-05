<template>
  <div class="wheel-view">
    <MainNav />
    
    <div class="wheel-container">
      <!-- 页面头部 -->
      <div class="wheel-header">
        <h1 class="wheel-title">色环选色工具</h1>
        <p class="wheel-subtitle">
          基于色彩理论的专业选色工具，支持 12/24 色环和多种配色方案生成
        </p>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="wheel-content">
        <!-- 左侧控制面板 -->
        <div class="wheel-controls">
          <!-- 色环配置 -->
          <div class="control-section">
            <h3 class="section-title">色环配置</h3>
            
            <div class="control-group">
              <label class="control-label">色环类型</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="wheelType"
                    type="radio"
                    value="12"
                    @change="updateWheel"
                  />
                  <span>12色环</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="wheelType"
                    type="radio"
                    value="24"
                    @change="updateWheel"
                  />
                  <span>24色环</span>
                </label>
              </div>
            </div>
            
            <div class="control-group">
              <label class="control-label">饱和度</label>
              <div class="slider-container">
                <input
                  v-model="saturation"
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  class="slider"
                  @input="updateWheel"
                />
                <span class="slider-value">{{ saturation }}%</span>
              </div>
            </div>
            
            <div class="control-group">
              <label class="control-label">明度</label>
              <div class="slider-container">
                <input
                  v-model="lightness"
                  type="range"
                  min="20"
                  max="80"
                  step="1"
                  class="slider"
                  @input="updateWheel"
                />
                <span class="slider-value">{{ lightness }}%</span>
              </div>
            </div>
          </div>
          
          <!-- 配色方案 -->
          <div class="control-section">
            <h3 class="section-title">配色方案</h3>
            
            <div class="scheme-buttons">
              <button
                v-for="scheme in colorSchemes"
                :key="scheme.type"
                @click="selectScheme(scheme.type)"
                :class="['scheme-btn', { 'scheme-btn--active': selectedScheme === scheme.type }]"
              >
                {{ scheme.name }}
              </button>
            </div>
            
            <div v-if="selectedScheme" class="scheme-description">
              <p>{{ getSchemeDescription(selectedScheme) }}</p>
            </div>
          </div>
          
          <!-- 当前选色 -->
          <div class="control-section">
            <h3 class="section-title">当前选择</h3>
            
            <div v-if="selectedColor" class="selected-color-info">
              <div class="color-preview-large">
                <div 
                  class="color-block"
                  :style="{ backgroundColor: selectedColor.hex }"
                ></div>
                <div class="color-details">
                  <div class="color-hex">{{ selectedColor.hex }}</div>
                  <div class="color-hsl">
                    HSL({{ Math.round(selectedColor.hue) }}, {{ saturation }}%, {{ lightness }}%)
                  </div>
                  <div class="color-rgb">
                    RGB({{ selectedColor.rgb.r }}, {{ selectedColor.rgb.g }}, {{ selectedColor.rgb.b }})
                  </div>
                </div>
              </div>
              
              <div class="color-actions">
                <button @click="addToFavorites" class="action-btn favorite-btn">
                  <HeartIcon class="btn-icon" />
                  收藏颜色
                </button>
                <button @click="copyColor" class="action-btn copy-btn">
                  <ClipboardIcon class="btn-icon" />
                  复制HEX
                </button>
                <button @click="findSimilar" class="action-btn similar-btn">
                  <MagnifyingGlassIcon class="btn-icon" />
                  查找相似
                </button>
              </div>
            </div>
            
            <div v-else class="no-selection">
              <PaletteIcon class="placeholder-icon" />
              <p>点击色环选择颜色</p>
            </div>
          </div>
        </div>
        
        <!-- 中间色环区域 -->
        <div class="wheel-area">
          <div class="wheel-wrapper" ref="wheelWrapper">
            <!-- 色环SVG -->
            <svg
              :width="wheelSize"
              :height="wheelSize"
              class="color-wheel-svg"
              @click="handleWheelClick"
              @mousemove="handleWheelHover"
            >
              <!-- 色环扇形 -->
              <g v-for="(segment, index) in wheelSegments" :key="index">
                <path
                  :d="segment.path"
                  :fill="segment.color"
                  :stroke="segment.isSelected ? '#fff' : 'none'"
                  :stroke-width="segment.isSelected ? '3' : '0'"
                  class="wheel-segment"
                  :data-hue="segment.hue"
                />
              </g>
              
              <!-- 中心圆 -->
              <circle
                :cx="wheelSize / 2"
                :cy="wheelSize / 2"
                :r="wheelSize * 0.15"
                fill="white"
                stroke="#e5e7eb"
                stroke-width="2"
                class="center-circle"
              />
              
              <!-- 选中指示器 -->
              <circle
                v-if="selectedColor"
                :cx="selectedColor.x"
                :cy="selectedColor.y"
                r="8"
                fill="white"
                stroke="#111827"
                stroke-width="2"
                class="selection-indicator"
              />
            </svg>
            
            <!-- 色环标签 -->
            <div class="wheel-labels">
              <div
                v-for="label in wheelLabels"
                :key="label.hue"
                class="wheel-label"
                :style="{
                  left: label.x + 'px',
                  top: label.y + 'px',
                  transform: 'translate(-50%, -50%)'
                }"
              >
                {{ label.text }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧结果面板 -->
        <div class="results-panel">
          <!-- 配色方案预览 -->
          <div v-if="generatedScheme.length > 0" class="scheme-preview">
            <h3 class="section-title">配色方案预览</h3>
            
            <div class="scheme-colors">
              <div
                v-for="(color, index) in generatedScheme"
                :key="index"
                class="scheme-color-item"
                @click="selectGeneratedColor(color)"
              >
                <div 
                  class="scheme-color"
                  :style="{ backgroundColor: color.hex }"
                  :title="color.hex"
                ></div>
                <div class="scheme-color-info">
                  <div class="scheme-color-hex">{{ color.hex }}</div>
                  <div class="scheme-color-role">{{ color.role }}</div>
                </div>
              </div>
            </div>
            
            <div class="scheme-actions">
              <button @click="saveScheme" class="save-scheme-btn">
                <BookmarkIcon class="btn-icon" />
                保存方案
              </button>
              <button @click="exportScheme" class="export-scheme-btn">
                <ArrowDownTrayIcon class="btn-icon" />
                导出方案
              </button>
            </div>
          </div>
          
          <!-- 颜色历史 -->
          <div v-if="colorHistory.length > 0" class="color-history">
            <h3 class="section-title">选色历史</h3>
            
            <div class="history-grid">
              <div
                v-for="(color, index) in colorHistory.slice(-12)"
                :key="index"
                class="history-item"
                @click="selectHistoryColor(color)"
                :title="color.hex"
              >
                <div 
                  class="history-color"
                  :style="{ backgroundColor: color.hex }"
                ></div>
              </div>
            </div>
            
            <button @click="clearHistory" class="clear-history-btn">
              清空历史
            </button>
          </div>
          
          <!-- 相似颜色 -->
          <div v-if="similarColors.length > 0" class="similar-colors">
            <h3 class="section-title">数据库中的相似颜色</h3>
            
            <div class="similar-grid">
              <div
                v-for="color in similarColors"
                :key="color.hex"
                class="similar-item"
                @click="viewColorDetail(color)"
              >
                <div 
                  class="similar-color"
                  :style="{ backgroundColor: color.hex }"
                ></div>
                <div class="similar-info">
                  <div class="similar-name">{{ color.chinese }}</div>
                  <div class="similar-hex">{{ color.hex }}</div>
                  <div class="similarity-score">{{ Math.round(color.similarity) }}%</div>
                </div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUiStore } from '@stores/uiStore'
import MainNav from '@components/navigation/MainNav.vue'
import ColorDetailModal from '@components/color/ColorDetailModal.vue'
import {
  HeartIcon, ClipboardIcon, MagnifyingGlassIcon, PaletteIcon,
  BookmarkIcon, ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUiStore()

// 响应式数据
const wheelWrapper = ref(null)
const wheelSize = ref(320)
const wheelType = ref('12')
const saturation = ref(70)
const lightness = ref(50)
const selectedScheme = ref('complementary')
const selectedColor = ref(null)
const selectedColorDetail = ref(null)
const generatedScheme = ref([])
const colorHistory = ref([])
const similarColors = ref([])

// 配色方案配置
const colorSchemes = ref([
  { type: 'complementary', name: '互补色' },
  { type: 'triadic', name: '三角色' },
  { type: 'analogous', name: '类似色' },
  { type: 'monochromatic', name: '单色系' },
  { type: 'tetradic', name: '四色组' },
  { type: 'splitComplementary', name: '分离互补' }
])

// 计算属性
const wheelSegments = computed(() => {
  const segments = []
  const segmentCount = parseInt(wheelType.value)
  const angleStep = 360 / segmentCount
  const centerX = wheelSize.value / 2
  const centerY = wheelSize.value / 2
  const outerRadius = wheelSize.value * 0.4
  const innerRadius = wheelSize.value * 0.15
  
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = (i * angleStep - 90) * Math.PI / 180
    const endAngle = ((i + 1) * angleStep - 90) * Math.PI / 180
    const hue = i * angleStep
    
    const x1 = centerX + Math.cos(startAngle) * innerRadius
    const y1 = centerY + Math.sin(startAngle) * innerRadius
    const x2 = centerX + Math.cos(startAngle) * outerRadius
    const y2 = centerY + Math.sin(startAngle) * outerRadius
    const x3 = centerX + Math.cos(endAngle) * outerRadius
    const y3 = centerY + Math.sin(endAngle) * outerRadius
    const x4 = centerX + Math.cos(endAngle) * innerRadius
    const y4 = centerY + Math.sin(endAngle) * innerRadius
    
    const largeArcFlag = angleStep > 180 ? 1 : 0
    
    const path = [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
      'Z'
    ].join(' ')
    
    const color = hslToHex(hue, saturation.value, lightness.value)
    const isSelected = selectedColor.value && Math.abs(selectedColor.value.hue - hue) < angleStep / 2
    
    segments.push({
      path,
      color,
      hue,
      isSelected,
      centerAngle: (startAngle + endAngle) / 2,
      centerRadius: (innerRadius + outerRadius) / 2
    })
  }
  
  return segments
})

const wheelLabels = computed(() => {
  const labels = []
  const labelHues = wheelType.value === '12' ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] : []
  const centerX = wheelSize.value / 2
  const centerY = wheelSize.value / 2
  const labelRadius = wheelSize.value * 0.45
  
  const hueNames = {
    0: '红', 30: '橙红', 60: '黄', 90: '黄绿', 120: '绿',
    150: '青绿', 180: '青', 210: '蓝', 240: '蓝紫',
    270: '紫', 300: '红紫', 330: '红'
  }
  
  labelHues.forEach(hue => {
    const angle = (hue - 90) * Math.PI / 180
    const x = centerX + Math.cos(angle) * labelRadius
    const y = centerY + Math.sin(angle) * labelRadius
    
    labels.push({
      hue,
      x,
      y,
      text: hueNames[hue] || hue.toString()
    })
  })
  
  return labels
})

// 方法
const hslToHex = (h, s, l) => {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2