<template>
  <div class="wheel-view">
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
                  min="0"
                  max="100"
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
                  min="0"
                  max="100"
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
                :key="scheme.value"
                :class="['scheme-btn', { 'active': currentScheme === scheme.value }]"
                @click="setColorScheme(scheme.value)"
              >
                {{ scheme.label }}
              </button>
            </div>
          </div>
          
          <!-- 选中颜色信息 -->
          <div class="control-section">
            <h3 class="section-title">选中颜色</h3>
            
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
                  收藏颜色
                </button>
                <button @click="copyColor" class="action-btn copy-btn">
                  复制HEX
                </button>
                <button @click="findSimilar" class="action-btn similar-btn">
                  查找相似
                </button>
              </div>
            </div>
            
            <div v-else class="no-selection">
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
                class="scheme-color"
                :style="{ backgroundColor: color.hex }"
                @click="selectSchemeColor(color)"
              >
                <div class="scheme-color-info">
                  <div class="color-hex">{{ color.hex }}</div>
                  <div class="color-name">{{ color.name }}</div>
                </div>
              </div>
            </div>
            
            <div class="scheme-actions">
              <button @click="saveScheme" class="action-btn save-btn">
                保存方案
              </button>
              <button @click="exportScheme" class="action-btn export-btn">
                导出方案
              </button>
            </div>
          </div>
          
          <!-- 使用指南 -->
          <div class="usage-guide">
            <h3 class="section-title">使用指南</h3>
            
            <div class="guide-content">
              <div class="guide-item">
                <div class="guide-icon">1</div>
                <div class="guide-text">
                  <h4>选择色环类型</h4>
                  <p>12色环适合基础配色，24色环提供更精细的控制</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">2</div>
                <div class="guide-text">
                  <h4>调整参数</h4>
                  <p>通过滑块调整饱和度和明度，获得理想的颜色效果</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">3</div>
                <div class="guide-text">
                  <h4>选择配色方案</h4>
                  <p>点击配色方案按钮，自动生成和谐的颜色组合</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">4</div>
                <div class="guide-text">
                  <h4>点击色环</h4>
                  <p>在色环上点击选择主色，系统自动生成配色方案</p>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUIStore } from '@stores/uiStore'

// 商店实例
const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()
const uiStore = useUIStore()

// 响应式数据
const wheelType = ref('12')
const saturation = ref(80)
const lightness = ref(50)
const currentScheme = ref('complementary')
const selectedColor = ref(null)
const wheelSize = ref(300)
const wheelWrapper = ref(null)

// 配色方案选项
const colorSchemes = [
  { value: 'complementary', label: '互补色' },
  { value: 'triadic', label: '三角色' },
  { value: 'analogous', label: '类似色' },
  { value: 'split-complementary', label: '分割互补' },
  { value: 'tetradic', label: '正方形色' },
  { value: 'monochromatic', label: '单色系' }
]

// 计算属性
const wheelSegments = computed(() => {
  const segments = []
  const segmentCount = parseInt(wheelType.value)
  const anglePerSegment = 360 / segmentCount
  const centerX = wheelSize.value / 2
  const centerY = wheelSize.value / 2
  const outerRadius = wheelSize.value * 0.4
  const innerRadius = wheelSize.value * 0.2

  for (let i = 0; i < segmentCount; i++) {
    const startAngle = (i * anglePerSegment - 90) * Math.PI / 180
    const endAngle = ((i + 1) * anglePerSegment - 90) * Math.PI / 180
    const hue = i * anglePerSegment
    
    const x1 = centerX + Math.cos(startAngle) * innerRadius
    const y1 = centerY + Math.sin(startAngle) * innerRadius
    const x2 = centerX + Math.cos(startAngle) * outerRadius
    const y2 = centerY + Math.sin(startAngle) * outerRadius
    const x3 = centerX + Math.cos(endAngle) * outerRadius
    const y3 = centerY + Math.sin(endAngle) * outerRadius
    const x4 = centerX + Math.cos(endAngle) * innerRadius
    const y4 = centerY + Math.sin(endAngle) * innerRadius

    const largeArcFlag = anglePerSegment > 180 ? 1 : 0
    
    const pathData = [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
      'Z'
    ].join(' ')

    segments.push({
      path: pathData,
      color: `hsl(${hue}, ${saturation.value}%, ${lightness.value}%)`,
      hue: hue,
      isSelected: selectedColor.value && Math.abs(selectedColor.value.hue - hue) < anglePerSegment / 2
    })
  }

  return segments
})

const wheelLabels = computed(() => {
  const labels = []
  const segmentCount = parseInt(wheelType.value)
  const anglePerSegment = 360 / segmentCount
  const centerX = wheelSize.value / 2
  const centerY = wheelSize.value / 2
  const labelRadius = wheelSize.value * 0.45

  for (let i = 0; i < segmentCount; i++) {
    const angle = (i * anglePerSegment - 90) * Math.PI / 180
    const x = centerX + Math.cos(angle) * labelRadius
    const y = centerY + Math.sin(angle) * labelRadius
    const hue = i * anglePerSegment

    labels.push({
      x: x,
      y: y,
      hue: hue,
      text: `${Math.round(hue)}°`
    })
  }

  return labels
})

const generatedScheme = computed(() => {
  if (!selectedColor.value) return []
  
  const baseHue = selectedColor.value.hue
  const colors = []
  
  switch (currentScheme.value) {
    case 'complementary':
      colors.push(
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex((baseHue + 180) % 360, saturation.value, lightness.value), name: '互补色' }
      )
      break
    case 'triadic':
      colors.push(
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex((baseHue + 120) % 360, saturation.value, lightness.value), name: '三角色1' },
        { hex: hslToHex((baseHue + 240) % 360, saturation.value, lightness.value), name: '三角色2' }
      )
      break
    case 'analogous':
      colors.push(
        { hex: hslToHex((baseHue - 30 + 360) % 360, saturation.value, lightness.value), name: '类似色1' },
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex((baseHue + 30) % 360, saturation.value, lightness.value), name: '类似色2' }
      )
      break
    case 'split-complementary':
      colors.push(
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex((baseHue + 150) % 360, saturation.value, lightness.value), name: '分割互补1' },
        { hex: hslToHex((baseHue + 210) % 360, saturation.value, lightness.value), name: '分割互补2' }
      )
      break
    case 'tetradic':
      colors.push(
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex((baseHue + 90) % 360, saturation.value, lightness.value), name: '正方形1' },
        { hex: hslToHex((baseHue + 180) % 360, saturation.value, lightness.value), name: '正方形2' },
        { hex: hslToHex((baseHue + 270) % 360, saturation.value, lightness.value), name: '正方形3' }
      )
      break
    case 'monochromatic':
      colors.push(
        { hex: hslToHex(baseHue, saturation.value, Math.max(20, lightness.value - 20)), name: '深色' },
        { hex: selectedColor.value.hex, name: '主色' },
        { hex: hslToHex(baseHue, saturation.value, Math.min(80, lightness.value + 20)), name: '浅色' }
      )
      break
  }
  
  return colors
})

// 方法
const updateWheel = () => {
  // 更新色环显示
}

const setColorScheme = (scheme) => {
  currentScheme.value = scheme
}

const handleWheelClick = (event) => {
  const rect = event.target.getBoundingClientRect()
  const centerX = wheelSize.value / 2
  const centerY = wheelSize.value / 2
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const dx = x - centerX
  const dy = y - centerY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // 检查是否在色环范围内
  if (distance >= wheelSize.value * 0.2 && distance <= wheelSize.value * 0.4) {
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
    if (angle < 0) angle += 360
    
    const hue = Math.round(angle)
    const hex = hslToHex(hue, saturation.value, lightness.value)
    const rgb = hexToRgb(hex)
    
    selectedColor.value = {
      hex: hex,
      hue: hue,
      rgb: rgb,
      x: x,
      y: y
    }
  }
}

const handleWheelHover = (event) => {
  // 处理悬停效果
}

const selectSchemeColor = (color) => {
  const rgb = hexToRgb(color.hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  selectedColor.value = {
    hex: color.hex,
    hue: hsl.h,
    rgb: rgb,
    x: 0,
    y: 0
  }
}

const addToFavorites = () => {
  if (selectedColor.value) {
    const colorData = {
      hex: selectedColor.value.hex,
      chinese: `自定义颜色 ${selectedColor.value.hex}`,
      english: `Custom Color ${selectedColor.value.hex}`,
      rgb: selectedColor.value.rgb,
      category: '自定义'
    }
    
    favoriteStore.addToFavorites(colorData)
    uiStore.showToast('已添加到收藏', 'success')
  }
}

const copyColor = () => {
  if (selectedColor.value) {
    navigator.clipboard.writeText(selectedColor.value.hex)
    uiStore.showToast('颜色代码已复制', 'success')
  }
}

const findSimilar = () => {
  if (selectedColor.value) {
    // 跳转到搜索页面，搜索相似颜色
    uiStore.showToast('查找相似颜色功能待开发', 'info')
  }
}

const saveScheme = () => {
  if (generatedScheme.value.length > 0) {
    const scheme = {
      name: `配色方案 ${new Date().toLocaleString()}`,
      colors: generatedScheme.value,
      type: currentScheme.value,
      createdAt: new Date().toISOString()
    }
    
    favoriteStore.addScheme(scheme)
    uiStore.showToast('配色方案已保存', 'success')
  }
}

const exportScheme = () => {
  if (generatedScheme.value.length > 0) {
    const data = {
      scheme: generatedScheme.value,
      type: currentScheme.value,
      parameters: {
        wheelType: wheelType.value,
        saturation: saturation.value,
        lightness: lightness.value
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `color-scheme-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    uiStore.showToast('配色方案已导出', 'success')
  }
}

// 工具函数
const hslToHex = (h, s, l) => {
  const hDecimal = h / 360
  const sDecimal = s / 100
  const lDecimal = l / 100
  
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal
  const x = c * (1 - Math.abs((hDecimal * 6) % 2 - 1))
  const m = lDecimal - c / 2
  
  let r, g, b
  
  if (hDecimal < 1/6) {
    r = c; g = x; b = 0
  } else if (hDecimal < 2/6) {
    r = x; g = c; b = 0
  } else if (hDecimal < 3/6) {
    r = 0; g = c; b = x
  } else if (hDecimal < 4/6) {
    r = 0; g = x; b = c
  } else if (hDecimal < 5/6) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

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

// 生命周期
onMounted(() => {
  document.title = '色环选色 - 时装设计师颜色管理系统'
  
  nextTick(() => {
    if (wheelWrapper.value) {
      // 初始化色环
      updateWheel()
    }
  })
})
</script>

<style lang="scss" scoped>
.wheel-view {
  min-height: 100vh;
  background: #f8f9fa;
}

.wheel-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.wheel-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .wheel-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .wheel-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }
}

.wheel-content {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.wheel-controls,
.results-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-section {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="radio"] {
    accent-color: #3498db;
  }
  
  span {
    font-size: 0.875rem;
    color: #374151;
  }
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
}

.slider-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 40px;
}

.scheme-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.scheme-btn {
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
  
  &.active {
    background: #3498db;
    border-color: #3498db;
    color: white;
  }
}

.wheel-area {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.wheel-wrapper {
  position: relative;
}

.color-wheel-svg {
  cursor: pointer;
}

.wheel-segment {
  transition: all 0.2s;
  
  &:hover {
    stroke: #fff;
    stroke-width: 2;
  }
}

.wheel-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.wheel-label {
  position: absolute;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.selected-color-info {
  .color-preview-large {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .color-block {
      width: 60px;
      height: 60px;
      border-radius: 0.5rem;
      border: 2px solid #e5e7eb;
    }
    
    .color-details {
      flex: 1;
      
      .color-hex {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }
      
      .color-hsl,
      .color-rgb {
        font-size: 0.75rem;
        color: #6b7280;
        font-family: 'Monaco', 'Menlo', monospace;
      }
    }
  }
}

.color-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
  
  &.favorite-btn:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }
  
  &.copy-btn:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
  }
  
  &.similar-btn:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
  }
}

.no-selection {
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
  
  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

.scheme-preview {
  margin-bottom: 2rem;
}

.scheme-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.scheme-color {
  aspect-ratio: 1;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #3498db;
    transform: scale(1.05);
  }
  
  .scheme-color-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem;
    font-size: 0.625rem;
    text-align: center;
    
    .color-hex {
      font-weight: 600;
      margin-bottom: 0.125rem;
    }
    
    .color-name {
      font-size: 0.5rem;
      opacity: 0.8;
    }
  }
}

.scheme-actions {
  display: flex;
  gap: 0.5rem;
  
  .action-btn {
    flex: 1;
  }
  
  .save-btn:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
  }
  
  .export-btn:hover {
    background: #fefbf2;
    border-color: #fde68a;
    color: #d97706;
  }
}

.usage-guide {
  .guide-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .guide-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    
    .guide-icon {
      width: 24px;
      height: 24px;
      background: #3498db;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .guide-text {
      flex: 1;
      
      h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
      }
      
      p {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.4;
      }
    }
  }
}

@media (max-width: 1200px) {
  .wheel-content {
    .wheel-controls,
    .results-panel {
      padding: 1rem;
    }
    
    .wheel-area {
      padding: 1rem;
    }
  }
  
  .scheme-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .wheel-container {
    padding: 1rem;
  }
  
  .wheel-header {
    .wheel-title {
      font-size: 1.5rem;
    }
    
    .wheel-subtitle {
      font-size: 1rem;
    }
  }
  
  .control-section {
    margin-bottom: 1.5rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .scheme-colors {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .scheme-actions {
    flex-direction: column;
  }
  
  .color-actions {
    .action-btn {
      text-align: center;
    }
  }
}
</style>